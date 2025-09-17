import { NextRequest, NextResponse } from 'next/server';
import { DefaultApi as OrderCreationApi, Configuration as OrderCreationConfig } from '@/api-clients/ordercreation';
import { DefaultApi as TrackAndTraceApi, Configuration as TrackAndTraceConfig } from '@/api-clients/trackandtrace';
import { OrderRequest, OrderRequestStatusActionEnum } from '@/api-clients/ordercreation/models';
import { getAccessToken } from '@/lib/oidc';

interface OrderRequestRecord {
  id: string;
  customerId: string;
  createdAt: string;
  orderRequest: OrderRequest;
  orderDetail: any;
  locations: any[];
  lastUpdated: string;
}

interface DashboardData {
  orderRequests: OrderRequestRecord[];
  summary: {
    totalOrders: number;
    pendingOrders: number;
    acceptedOrders: number;
    inTransitOrders: number;
  };
  lastUpdated: string;
}

// In-memory storage for demo purposes
// In production, this would be a database
let orderRequestsStore: Map<string, OrderRequestRecord> = new Map();

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard GET request received');
    const accessToken = await getAccessToken(request);
    
    if (!accessToken) {
      console.log('No access token found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    console.log('Access token found, proceeding with dashboard data fetch');
    console.log('Current orderRequestsStore size:', orderRequestsStore.size);

    // Configure API clients
    const orderCreationConfig = new OrderCreationConfig({
      basePath: 'https://api.mcleodsoftware.com/ordercreation-sandbox'
    });
    const trackAndTraceConfig = new TrackAndTraceConfig({
      basePath: 'https://api.mcleodsoftware.com/trackandtrace-sandbox'
    });
    
    const orderCreationApi = new OrderCreationApi(orderCreationConfig);
    const trackAndTraceApi = new TrackAndTraceApi(trackAndTraceConfig);

    // Update data for all order requests
    const updatedRecords = new Map<string, OrderRequestRecord>();
    
    for (const [id, record] of orderRequestsStore.entries()) {
      const updatedRecord = { ...record };
      
      try {
        // Always fetch the latest order request status from Order Creation API
        const orderRequestDetail = await orderCreationApi.getOrderDetail({
          orderRequestId: record.orderRequest.requestId!,
          customerId: record.customerId,
          xMcldTenant: process.env.MCLD_TENANT || '2',
          xApiKey: process.env.API_KEY!,
          authorization: `Bearer ${accessToken}`
        });
        
        // Update the order request data
        updatedRecord.orderRequest = orderRequestDetail;
        
      } catch (orderRequestError) {
        console.log(`Failed to fetch order request status for ${record.orderRequest.requestId}:`, orderRequestError);
        // Keep existing order request data if fetch fails
      }
      
      // If this order request now has an order ID, also fetch tracking data
      if (updatedRecord.orderRequest.status?.orderId) {
        try {
          // Fetch order detail from Track and Trace
          updatedRecord.orderDetail = await trackAndTraceApi.getOrderDetail({
            id: updatedRecord.orderRequest.status?.orderId!,
            xMcldTenant: process.env.MCLD_TENANT || '2',
            xAPIKey: process.env.API_KEY!,
            authorization: `Bearer ${accessToken}`
          });
          
          // Extract locations from order detail (stops and progress updates)
          updatedRecord.locations = [];
          if (updatedRecord.orderDetail?.stops) {
            updatedRecord.locations = updatedRecord.orderDetail.stops.map((stop: any) => ({
              type: 'stop',
              ...stop
            }));
          }
          if (updatedRecord.orderDetail?.progressUpdates) {
            const progressLocations = updatedRecord.orderDetail.progressUpdates
              .map((update: any) => ({
                type: update.event,
                timestamp: update.timestamp,
                position: update.position,
                milesToConsignee: update.milesToConsignee,
              }));
            updatedRecord.locations = [...updatedRecord.locations, ...progressLocations];
          }
          
          
          console.log(`Updated order ${updatedRecord.orderRequest.status.orderId} with ${updatedRecord.locations.length} locations`);
        } catch (trackingError) {
          console.log(`Failed to fetch tracking data for order ${updatedRecord.orderRequest.status.orderId}:`, trackingError);
          // Keep existing tracking data if fetch fails
          updatedRecord.locations = updatedRecord.locations || [];
        }
      }
      
      updatedRecords.set(id, updatedRecord);
    }
    
    // Update the store
    orderRequestsStore = updatedRecords;
    
    // Convert to array and sort by creation date (newest first)
    const orderRequests = Array.from(orderRequestsStore.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate summary statistics
    console.log('=== DEBUGGING SUMMARY CALCULATION ===');
    orderRequests.forEach((r, index) => {
      console.log(`Order ${index + 1}:`, {
        orderId: r.orderRequest.status?.orderId,
        orderRequestAction: r.orderRequest.status?.action,
        hasOrderDetail: !!r.orderDetail,
        orderDetailKeys: r.orderDetail ? Object.keys(r.orderDetail) : null,
        orderStatus: r.orderDetail?.orderStatus,
        status: r.orderDetail?.status,
        rawOrderDetail: r.orderDetail
      });
    });
    
    const summary = {
      totalOrders: orderRequests.length,
      pendingOrders: orderRequests.filter(r => r.orderRequest.status?.action === OrderRequestStatusActionEnum.PendingInput).length,
      acceptedOrders: orderRequests.filter(r => r.orderRequest.status?.action === OrderRequestStatusActionEnum.Accepted).length,
      inTransitOrders: orderRequests.filter(r => {
        const isInTransit = r.orderDetail?.status === 'InProgress';
        console.log(`Order ${r.orderRequest.status?.orderId} - isInTransit: ${isInTransit}, orderStatus: ${r.orderDetail?.orderStatus}, status: ${r.orderDetail?.status}`);
        return isInTransit;
      }).length,
    };
    
    console.log('Final summary:', summary);
    console.log('=== END DEBUGGING ===');

    const dashboardData: DashboardData = {
      orderRequests,
      summary,
      lastUpdated: new Date().toISOString()
    };

    console.log('Returning dashboard data:', {
      orderRequestsCount: orderRequests.length,
      summary,
      lastUpdated: dashboardData.lastUpdated
    });

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error: any) {
    console.error('Dashboard API error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard data',
        message: error.message || 'Unknown error'
      },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();
    
    const accessToken = await getAccessToken(request);
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (action === 'createOrder') {
      const { orderRequest, customerId } = data;
      
      if (!orderRequest) {
        return NextResponse.json(
          { error: 'Order request data is required' },
          { status: 400 }
        );
      }

      // Configure Order Creation API client
      const config = new OrderCreationConfig({
        basePath: 'https://api.mcleodsoftware.com/ordercreation-sandbox'
      });
      const orderCreationApi = new OrderCreationApi(config);

      // Create the order request
      const result = await orderCreationApi.createOrderRequest({
        customerId: customerId || process.env.CUSTOMER_ID || '1CHC',
        xMcldTenant: process.env.MCLD_TENANT || '2',
        xApiKey: process.env.API_KEY!,
        authorization: `Bearer ${accessToken}`,
        orderRequest: orderRequest as OrderRequest
      });

      // Create a record for tracking
      const recordId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Extract the proper order ID - check multiple possible locations
      let orderId = null;
      const resultAny = result as any; // Cast to explore the actual response structure
      
      if (result.status?.orderId) {
        orderId = result.status.orderId;
      } else if (resultAny.order) {
        orderId = resultAny.order;
      } else if (resultAny.id) {
        orderId = resultAny.id;
      } else if (result.requestId) {
        orderId = result.requestId;
      }
      
      console.log('Order creation result:', JSON.stringify(result, null, 2));
      console.log('Extracted orderId:', orderId);
      
      const orderRecord: OrderRequestRecord = {
        id: recordId,
        customerId: customerId || process.env.CUSTOMER_ID || '1CHC',
        createdAt: new Date().toISOString(),
        orderRequest: result,
        orderDetail: null,
        locations: [],
        lastUpdated: ""
      };

      // Store the record
      orderRequestsStore.set(recordId, orderRecord);

      return NextResponse.json({
        success: true,
        data: {
          orderRecord,
          apiResponse: result
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Dashboard POST error:', error);
    
    return NextResponse.json(
      {
        error: 'Operation failed',
        message: error.message || 'Unknown error'
      },
      { status: error.status || 500 }
    );
  }
}
