export default function TestIndexPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🧪 API Test Pages
        </h1>
        
        <p className="text-gray-600 mb-8">
          Test the McLeod Software APIs using your authenticated session. All API calls are made server-side to keep your API keys secure.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Track and Trace API */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🚚</span>
              <h2 className="text-xl font-semibold text-gray-800">
                Track and Trace API
              </h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Test the Track and Trace API to retrieve order information and order details.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="text-sm">
                <span className="font-medium">Available endpoints:</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Get Orders - Retrieve all orders</li>
                <li>• Get Order Detail - Get specific order information</li>
              </ul>
            </div>
            
            <a
              href="/test/trackandtrace"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Test Track & Trace →
            </a>
          </div>

          {/* Order Creation API */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📦</span>
              <h2 className="text-xl font-semibold text-gray-800">
                Order Creation API
              </h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Test the Order Creation API to create new order requests and retrieve order request details.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="text-sm">
                <span className="font-medium">Available endpoints:</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create Order Request - Submit new orders</li>
                <li>• Get Order Request Detail - Check order status</li>
              </ul>
            </div>
            
            <a
              href="/test/ordercreation"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Test Order Creation →
            </a>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-blue-500 text-lg mr-2">🔒</span>
            <div>
              <h3 className="font-medium text-blue-800 mb-1">Security</h3>
              <p className="text-blue-700 text-sm">
                All API calls are made from the server using your authenticated session. 
                API keys and tokens never leave the server, ensuring your credentials remain secure.
              </p>
            </div>
          </div>
        </div>

        {/* Environment Variables Required */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-yellow-500 text-lg mr-2">⚙️</span>
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">Required Environment Variables</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• <code>API_KEY</code> - Your McLeod API key</li>
                <li>• <code>MCLD_TENANT</code> - Your tenant ID (default: 2)</li>
                <li>• <code>CUSTOMER_ID</code> - Your customer ID (default: 1CHC)</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
