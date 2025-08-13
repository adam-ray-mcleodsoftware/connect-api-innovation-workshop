import { NextRequest, NextResponse } from 'next/server';
import { DefaultApi as OrderCreationApi, Configuration } from '@/api-clients/ordercreation';
import { OrderRequest } from '@/api-clients/ordercreation/models';
import { getAccessToken } from '@/lib/oidc';

export async function POST(request: NextRequest) {
  try {
    const { orderRequest, customerId } = await request.json();
    
    if (!orderRequest) {
      return NextResponse.json(
        { error: 'Order request data is required' },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken(request);
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Configure the Order Creation API client
    const config = new Configuration({
      basePath: 'https://api.mcleodsoftware.com/ordercreation-sandbox'
    });
    const orderCreationApi = new OrderCreationApi(config);

    // Make the API call with server-side credentials
    const result = await orderCreationApi.createOrderRequest({
      customerId: customerId || process.env.CUSTOMER_ID || '1CHC',
      xMcldTenant: process.env.MCLD_TENANT || '2',
      xApiKey: process.env.API_KEY!,
      authorization: `Bearer ${accessToken}`,
      orderRequest: orderRequest as OrderRequest
    });

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Order Creation API error:', error);
    
    return NextResponse.json(
      {
        error: 'API call failed',
        message: error.message || 'Unknown error',
        details: {
          name: error.name,
          status: error.status,
          statusText: error.statusText
        }
      },
      { status: error.status || 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderRequestId = searchParams.get('orderRequestId');
    const customerId = searchParams.get('customerId') || process.env.CUSTOMER_ID || '1CHC';
    
    if (!orderRequestId) {
      return NextResponse.json(
        { error: 'Order Request ID is required' },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken(request);
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const config = new Configuration({
      basePath: 'https://api.mcleodsoftware.com/ordercreation-sandbox'
    });
    const orderCreationApi = new OrderCreationApi(config);

    const orderDetail = await orderCreationApi.getOrderDetail({
      orderRequestId,
      customerId,
      xMcldTenant: process.env.MCLD_TENANT || '2',
      xApiKey: process.env.API_KEY!,
      authorization: `Bearer ${accessToken}`
    });

    return NextResponse.json({
      success: true,
      data: orderDetail,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Order Creation order detail error:', error);
    
    return NextResponse.json(
      {
        error: 'API call failed',
        message: error.message || 'Unknown error',
        details: {
          name: error.name,
          status: error.status,
          statusText: error.statusText
        }
      },
      { status: error.status || 500 }
    );
  }
}
