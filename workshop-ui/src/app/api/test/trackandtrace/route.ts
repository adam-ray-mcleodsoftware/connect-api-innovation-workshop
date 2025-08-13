import { NextRequest, NextResponse } from 'next/server';
import { DefaultApi as TrackAndTraceApi, Configuration } from '@/api-clients/trackandtrace';
import { getAccessToken } from '@/lib/oidc';

export async function GET(request: NextRequest) {
  try {
    // Get the current user's access token from the session
    const accessToken = await getAccessToken(request);
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Configure the Track and Trace API client
    const config = new Configuration({
      basePath: 'https://api.mcleodsoftware.com/trackandtrace-sandbox'
    });
    const trackAndTraceApi = new TrackAndTraceApi(config);

    // Make the API call with server-side credentials
    const orders = await trackAndTraceApi.getOrders({
      xMcldTenant: process.env.MCLD_TENANT || '2',
      xApiKey: process.env.API_KEY!,
      authorization: `Bearer ${accessToken}`
    });

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Track and Trace API error:', error);
    
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

// GET specific order details
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
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
      basePath: 'https://api.mcleodsoftware.com/trackandtrace-sandbox'
    });
    const trackAndTraceApi = new TrackAndTraceApi(config);

    const orderDetail = await trackAndTraceApi.getOrderDetail({
      id: orderId,
      xMcldTenant: process.env.MCLD_TENANT || '2',
      xAPIKey: process.env.API_KEY!,
      authorization: `Bearer ${accessToken}`
    });

    return NextResponse.json({
      success: true,
      data: orderDetail,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Track and Trace order detail error:', error);
    
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
