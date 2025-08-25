'use client';

import { useState, useEffect, useCallback } from 'react';

interface OrderRequestRecord {
  id: string;
  customerId: string;
  createdAt: string;
  orderRequest: any;
  status: {
    action?: string;
    message?: string;
    orderId?: string;
  };
  orderDetail: any;
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

interface OrderRequest {
  orderType: string;
  orderReferenceNumbers: {
    bol: string;
    consigneeRefno: string;
  };
  customer: {
    name: string;
  };
  rating: {
    collectionMethod: string;
  };
  stops: Array<{
    stopType: string;
    locationName: string;
    address: string;
    cityName: string;
    state: string;
    zipCode: string;
    scheduledArrivalEarly: string;
  }>;
}

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [customerId, setCustomerId] = useState('1CHC');

  // Sample order request template
  const createSampleOrderRequest = (): OrderRequest => ({
    orderType: 'LOAD',
    orderReferenceNumbers: {
      bol: `BOL-${Date.now()}`,
      consigneeRefno: `CONS-${Date.now()}`
    },
    customer: {
      name: 'Workshop Demo Customer'
    },
    rating: {
      collectionMethod: 'PrePaid'
    },
    stops: [
      {
        stopType: 'Pickup',
        locationName: 'Demo Shipper',
        address: '123 Workshop Street',
        cityName: 'Atlanta',
        state: 'GA',
        zipCode: '30309',
        scheduledArrivalEarly: new Date(new Date(Date.now() + 24 * 60 * 60 * 1000).setMilliseconds(0)).toISOString().replace(".000", "")
      },
      {
        stopType: 'Delivery',
        locationName: 'Demo Consignee',
        address: '456 Innovation Avenue',
        cityName: 'Birmingham',
        state: 'AL',
        zipCode: '35242',
        scheduledArrivalEarly: new Date(new Date(Date.now() + 48 * 60 * 60 * 1000).setMilliseconds(0)).toISOString().replace(".000", "")
      }
    ]
  });

  const fetchDashboardData = useCallback(async () => {
    if (isCreatingOrder) return; // Don't fetch while creating
    
    setLoading(true);
    console.log('Fetching dashboard data...');
    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        console.log('No access token in sessionStorage');
        setError('Not authenticated. Please login first.');
        return;
      }
      
      console.log('Access token found, making API request');

      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const result = await response.json();
      console.log('Dashboard API response:', result);
      
      if (result.success) {
        setDashboardData(result.data);
        setError(null);
        console.log('Dashboard data updated:', result.data);
      } else {
        console.error('Dashboard API error:', result.error);
        setError(result.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [isCreatingOrder]);

  const createOrder = async () => {
    setIsCreatingOrder(true);
    setError(null);
    
    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setError('Not authenticated. Please login first.');
        return;
      }

      const orderRequest = createSampleOrderRequest();

      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          action: 'createOrder',
          data: {
            orderRequest,
            customerId
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh dashboard data immediately after creating order
        await fetchDashboardData();
      } else {
        setError(result.error || 'Failed to create order');
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'pendinginput': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              📦 Order Lifecycle Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Customer ID"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={createOrder}
                disabled={isCreatingOrder}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
              >
                {isCreatingOrder ? 'Creating...' : '+ Create Order'}
              </button>
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
              >
                {loading ? 'Refreshing...' : '🔄 Refresh'}
              </button>
            </div>
          </div>
          
          {dashboardData && (
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-800">{dashboardData.summary.totalOrders}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">{dashboardData.summary.pendingOrders}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{dashboardData.summary.acceptedOrders}</div>
                <div className="text-sm text-gray-600">Accepted</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{dashboardData.summary.inTransitOrders}</div>
                <div className="text-sm text-gray-600">In Transit</div>
              </div>
            </div>
          )}
          
          {dashboardData && (
            <div className="mt-4 text-sm text-gray-500">
              Last updated: {formatDate(dashboardData.lastUpdated)} • Auto-refreshing every minute
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
            {error.includes('Not authenticated') && (
              <div className="mt-2">
                <p className="text-sm">To get started:</p>
                <ol className="text-sm list-decimal list-inside mt-1">
                  <li>Go to the <a href="/test" className="text-blue-600 underline">test page</a></li>
                  <li>Choose either Track and Trace or Order Creation test</li>
                  <li>Complete the authentication flow</li>
                  <li>Return to this dashboard</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Orders List */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Requests</h2>
             
          {dashboardData && dashboardData.orderRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No orders yet. Create your first order above!
            </div>
          )}
          
          {dashboardData && dashboardData.orderRequests.length > 0 && (
            <div className="space-y-4">
              {dashboardData.orderRequests.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {order.orderRequest.status.orderId ? (
                          <>Order #{order.orderRequest.status.orderId}</>
                        ) : order.orderRequest.requestId ? (
                          <>Request #{order.orderRequest.requestId}</>
                        ) : (
                          <>Request ???</>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        BOL: {order.orderRequest.orderReferenceNumbers?.bol || 'Not set'} • Created: {formatDate(order.orderRequest.createdDate)} • Customer: {order.customerId}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderRequest.status.action || 'pendinginput')}`}>
                        {order.orderRequest.status.action || 'Manual'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Order Request Details */}
                    <div className="bg-gray-50 p-3 rounded">
                      <h4 className="font-medium text-gray-700 mb-2">📝 Order Request</h4>
                      <div className="text-sm space-y-1">
                        <div>Status: {order.orderRequest.status?.action || 'Manual'}</div>
                        <div>Message: {order.orderRequest.status?.reason || '(none)'}</div>
                      </div>
                    </div>
                    
                    {/* Tracking Details */}
                    <div className="bg-gray-50 p-3 rounded">
                      <h4 className="font-medium text-gray-700 mb-2">🚚 Tracking Status</h4>
                      {order.orderDetail ? (
                        <div className="text-sm space-y-1">
                          <div>Status: {order.orderDetail.status || 'Unknown'}</div>
                          <div>{formatDate(order.orderDetail.shipperStop.scheduledArrivalEarly)} ({order.orderDetail.shipperStop.city}, {order.orderDetail.shipperStop.state}) → {formatDate(order.orderDetail.consigneeStop.scheduledArrivalEarly)} ({order.orderDetail.consigneeStop.city}, {order.orderDetail.consigneeStop.state})</div>
                          <div>Stops: {order.orderDetail.intermediateStops?.length}</div>
                        </div>
                      ) : order.id ? (
                        <div className="text-sm text-yellow-600">Fetching tracking data...</div>
                      ) : (
                        <div className="text-sm text-gray-500">No tracking data available yet</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
