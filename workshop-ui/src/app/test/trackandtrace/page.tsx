'use client';

import { useState } from 'react';

interface Order {
  orderId: string;
  status: string;
  shipperStop?: {
    city: string;
    state: string;
  };
  consigneeStop?: {
    city: string;
    state: string;
  };
}

interface ApiResponse {
  success: boolean;
  data?: Order[] | any;
  count?: number;
  error?: string;
  message?: string;
  timestamp?: string;
}

export default function TrackAndTracePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [orderDetail, setOrderDetail] = useState<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get access token from sessionStorage
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setError('Not authenticated. Please login first.');
        return;
      }

      const response = await fetch('/api/test/trackandtrace', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const result: ApiResponse = await response.json();
      
      if (result.success && result.data) {
        setOrders(result.data as Order[]);
      } else {
        setError(result.error || result.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async () => {
    if (!selectedOrderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Get access token from sessionStorage
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setError('Not authenticated. Please login first.');
        return;
      }

      const response = await fetch('/api/test/trackandtrace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ orderId: selectedOrderId.trim() }),
      });
      
      const result: ApiResponse = await response.json();
      
      if (result.success && result.data) {
        setOrderDetail(result.data);
      } else {
        setError(result.error || result.message || 'Failed to fetch order details');
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🚚 Track and Trace API Test
        </h1>
        
        <div className="space-y-6">
          {/* Get Orders Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              📦 Get Orders
            </h2>
            <p className="text-gray-600 mb-4">
              Fetch all orders from the Track and Trace API. The API key and token are handled securely on the server.
            </p>
            
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? 'Loading...' : 'Fetch Orders'}
            </button>
            
            {orders.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Orders ({orders.length}):
                </h3>
                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {orders.slice(0, 10).map((order, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded border">
                      <div className="font-medium">ID: {order.orderId}</div>
                      <div className="text-sm text-gray-600">Status: {order.status}</div>
                      {order.shipperStop && (
                        <div className="text-sm text-gray-600">
                          From: {order.shipperStop.city}, {order.shipperStop.state}
                        </div>
                      )}
                      {order.consigneeStop && (
                        <div className="text-sm text-gray-600">
                          To: {order.consigneeStop.city}, {order.consigneeStop.state}
                        </div>
                      )}
                    </div>
                  ))}
                  {orders.length > 10 && (
                    <div className="text-sm text-gray-500 text-center">
                      ... and {orders.length - 10} more orders
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Get Order Detail Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              🔍 Get Order Details
            </h2>
            <p className="text-gray-600 mb-4">
              Enter an order ID to fetch detailed information about a specific order.
            </p>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                placeholder="Enter Order ID"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={fetchOrderDetail}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
              >
                {loading ? 'Loading...' : 'Get Details'}
              </button>
            </div>
            
            {orderDetail && (
              <div className="mt-4 bg-gray-50 p-4 rounded border">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Order Details:</h3>
                <pre className="text-sm text-gray-600 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(orderDetail, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <a
            href="/test"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            ← Back to Test Index
          </a>
        </div>
      </div>
    </div>
  );
}
