'use client';

import { useState } from 'react';

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

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  timestamp?: string;
}

export default function OrderCreationPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [orderRequestId, setOrderRequestId] = useState('');
  const [customerId, setCustomerId] = useState('1CHC');
  const [orderDetail, setOrderDetail] = useState<any>(null);

  // Sample order request data
const stripMilliseconds = (isoString: string) => isoString.replace(/\.\d{3}(?=Z$)/, '');

const sampleOrderRequest: OrderRequest = {
    orderType: 'LOAD',
    orderReferenceNumbers: {
        bol: `BOL-DEMO-${Date.now()}`,
        consigneeRefno: `CONS-REF-${Date.now()}`
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
            scheduledArrivalEarly: stripMilliseconds(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
        },
        {
            stopType: 'Delivery',
            locationName: 'Demo Consignee',
            address: '456 Innovation Avenue',
            cityName: 'Nashville',
            state: 'TN',
            zipCode: '37203',
            scheduledArrivalEarly: stripMilliseconds(new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString())
        }
    ]
};

  const createOrder = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get access token from sessionStorage
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setError('Not authenticated. Please login first.');
        return;
      }

      const response = await fetch('/api/test/ordercreation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          orderRequest: sampleOrderRequest,
          customerId: customerId
        }),
      });
      
      const apiResult: ApiResponse = await response.json();
      
      if (apiResult.success && apiResult.data) {
        setResult(apiResult.data);
      } else {
        setError(apiResult.error || apiResult.message || 'Failed to create order');
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async () => {
    if (!orderRequestId.trim()) {
      setError('Please enter an order request ID');
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

      const response = await fetch(`/api/test/ordercreation?orderRequestId=${encodeURIComponent(orderRequestId.trim())}&customerId=${encodeURIComponent(customerId)}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const apiResult: ApiResponse = await response.json();
      
      if (apiResult.success && apiResult.data) {
        setOrderDetail(apiResult.data);
      } else {
        setError(apiResult.error || apiResult.message || 'Failed to fetch order details');
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
          📦 Order Creation API Test
        </h1>
        
        <div className="space-y-6">
          {/* Customer ID Input */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              🏢 Customer Settings
            </h2>
            <div className="flex gap-2 items-center">
              <label className="font-medium">Customer ID:</label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Customer ID"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Create Order Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              📝 Create Order Request
            </h2>
            <p className="text-gray-600 mb-4">
              Create a new order request using sample data. The API key and token are handled securely on the server.
            </p>
            
            <div className="mb-4 bg-gray-50 p-3 rounded border">
              <h3 className="font-medium mb-2">Sample Order Request:</h3>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(sampleOrderRequest, null, 2)}
              </pre>
            </div>
            
            <button
              onClick={createOrder}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? 'Creating...' : 'Create Order Request'}
            </button>
            
            {result && (
              <div className="mt-4 bg-green-50 p-4 rounded border">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Order Created Successfully!</h3>
                <pre className="text-sm text-gray-600 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Get Order Detail Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              🔍 Get Order Request Details
            </h2>
            <p className="text-gray-600 mb-4">
              Enter an order request ID to fetch detailed information about a specific order request.
            </p>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={orderRequestId}
                onChange={(e) => setOrderRequestId(e.target.value)}
                placeholder="Enter Order Request ID"
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
                <h3 className="text-lg font-medium text-gray-700 mb-2">Order Request Details:</h3>
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
