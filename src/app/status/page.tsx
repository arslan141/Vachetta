"use client";

import { useState, useEffect } from "react";

export default function StatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Error fetching status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">System Status</h1>
          
          {status && (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Cart Status */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h2 className="text-xl font-semibold text-green-800 mb-2">🛒 Cart System</h2>
                  <p className="text-green-700">{status.cart.status}</p>
                  <p className="text-sm text-green-600 mt-1">{status.cart.note}</p>
                </div>

                {/* Stripe Status */}
                <div className={`border rounded-lg p-4 ${status.services.stripe.configured 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'}`}>
                  <h2 className="text-xl font-semibold mb-2">💳 Stripe Payments</h2>
                  <p className={status.services.stripe.configured ? 'text-green-700' : 'text-yellow-700'}>
                    {status.services.stripe.configured ? '✅ Configured' : '⚠️ Not configured'}
                  </p>
                  {status.services.stripe.testMode && (
                    <p className="text-sm text-blue-600 mt-1">🧪 Test mode enabled</p>
                  )}
                </div>

                {/* MongoDB Status */}
                <div className={`border rounded-lg p-4 ${status.services.mongodb.configured 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'}`}>
                  <h2 className="text-xl font-semibold mb-2">🗄️ MongoDB Database</h2>
                  <p className={status.services.mongodb.configured ? 'text-green-700' : 'text-yellow-700'}>
                    {status.services.mongodb.configured ? '✅ Configured' : '⚠️ Using mock data'}
                  </p>
                </div>

                {/* KV Storage Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h2 className="text-xl font-semibold text-blue-800 mb-2">💾 Cart Storage</h2>
                  <p className="text-blue-700">
                    {status.services.kv.configured ? '✅ Vercel KV' : '🔄 Mock KV (Development)'}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">Cart data persistence working</p>
                </div>

                {/* Authentication Status */}
                <div className={`border rounded-lg p-4 ${status.services.google.configured 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'}`}>
                  <h2 className="text-xl font-semibold mb-2">🔐 Authentication</h2>
                  <p className={status.services.google.configured ? 'text-green-700' : 'text-yellow-700'}>
                    {status.services.google.configured ? '✅ Google OAuth configured' : '⚠️ Limited authentication'}
                  </p>
                </div>

                {/* NextAuth Status */}
                <div className={`border rounded-lg p-4 ${status.services.nextAuth.configured 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'}`}>
                  <h2 className="text-xl font-semibold mb-2">🔑 Session Management</h2>
                  <p className={status.services.nextAuth.configured ? 'text-green-700' : 'text-yellow-700'}>
                    {status.services.nextAuth.configured ? '✅ NextAuth configured' : '⚠️ Basic setup'}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              {status.recommendations && status.recommendations.length > 0 && (
                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-amber-800 mb-3">📋 Setup Recommendations</h3>
                  <ul className="list-disc list-inside text-amber-700 space-y-1">
                    {status.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-8 bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🚀 Quick Actions</h3>
                <div className="space-y-2">
                  <a 
                    href="/" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                  >
                    View Homepage
                  </a>
                  <a 
                    href="/api/check-env" 
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
                  >
                    Check Environment
                  </a>
                  <a 
                    href="/api/debug-cart" 
                    className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    Debug Cart
                  </a>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                Last checked: {new Date(status.timestamp).toLocaleString()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
