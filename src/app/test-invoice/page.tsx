import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

const TestInvoice = async () => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Test Invoice Access</h1>
        <p className="mb-4">You need to be logged in to test invoice access.</p>
        <p className="mb-2">Test credentials:</p>
        <ul className="mb-4 list-disc pl-6">
          <li>Email: arslanahmad713@gmail.com</li>
          <li>Password: testpassword123</li>
        </ul>
        <a 
          href="/login" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login First
        </a>
      </div>
    );
  }

  const testOrderId = "6898622305304ea69f7253de"; // Latest order _id from database
  const testStripeSessionId = "cs_test_a1ynTEDMjcKSq73WiVtsG6ShUv1zkHJcqklHScMeSD4CvmUyrVbOw3ym9f"; // Latest session
  const oldTestOrderId = "68985ac3e13307b88e136f0e"; // Previous order _id  
  const oldTestStripeSessionId = "cs_test_a1ReA4glOoIsbxTtxJhFIOvBggPr9u6B3GG4fVq2qRZQ7MQbOtksduUDIO"; // Previous session

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Invoice Access</h1>
      <div className="mb-4 p-4 bg-green-100 rounded">
        <p className="font-semibold">✅ Authenticated as: {session.user?.email}</p>
        <p>User ID: {session.user?._id}</p>
        <p>Role: {session.user?.role}</p>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Database Info:</h2>
          <p><strong>Latest Order _id:</strong> {testOrderId}</p>
          <p><strong>Latest Stripe Session:</strong> {testStripeSessionId}</p>
          <p><strong>Previous Order _id:</strong> {oldTestOrderId}</p>
          <p><strong>Previous Session:</strong> {oldTestStripeSessionId}</p>
          <p><strong>User ID:</strong> 6897b143d3f2e622d3bea2b2</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Test Latest Invoice by Order _id:</h2>
          <a 
            href={`/api/invoice/${testOrderId}`}
            target="_blank"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block mr-2"
          >
            Access Latest Invoice by _id
          </a>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Test Latest Invoice by Stripe Session:</h2>
          <a 
            href={`/api/invoice/${testStripeSessionId}`}
            target="_blank"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block mr-2"
          >
            Access Latest Invoice by Session (The Issue)
          </a>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Test Previous Invoice (Working):</h2>
          <a 
            href={`/api/invoice/${oldTestOrderId}`}
            target="_blank"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 inline-block mr-2"
          >
            Access Previous Invoice by _id
          </a>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Test Invoice Status:</h2>
          <a 
            href={`/api/stripe/invoice-status?session_id=${testStripeSessionId}`}
            target="_blank"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 inline-block mr-2"
          >
            Check Latest Invoice Status
          </a>
          <a 
            href={`/api/stripe/invoice-status?session_id=${oldTestStripeSessionId}`}
            target="_blank"
            className="bg-purple-300 text-white px-4 py-2 rounded hover:bg-purple-400 inline-block"
          >
            Check Previous Invoice Status
          </a>
        </div>

        <div className="p-4 border rounded bg-yellow-50">
          <h2 className="text-lg font-semibold mb-2">Expected Results:</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>✅ Latest Invoice by _id should work (PDF download)</li>
            <li>❓ Latest Invoice by Session should work now (after invoice-status call)</li>
            <li>✅ Previous Invoice by _id should work (PDF download)</li>
            <li>✅ Invoice Status should work (shows existing order)</li>
          </ul>
          <div className="mt-4 p-3 bg-blue-100 rounded">
            <p className="text-sm"><strong>Note:</strong> If invoice by session fails, it means the invoice endpoint still needs to handle session ID lookup properly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInvoice;
