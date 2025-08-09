import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Test | Vachetta",
  description: "Test admin page",
};

export default async function AdminTest() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">🎉 Admin Route Works!</h1>
        <p className="mt-4 text-gray-600">
          If you can see this page, the admin route is working correctly.
        </p>
        <p className="mt-2 text-gray-600">
          Now we need to fix the authentication to make the real admin dashboard accessible.
        </p>
      </div>
    </div>
  );
}
