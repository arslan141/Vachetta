export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Main Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-amber-400 rounded-full animate-spin mx-auto opacity-50"></div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Please wait while we prepare your content</p>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6 w-64 bg-gray-200 rounded-full h-2 mx-auto">
          <div className="bg-amber-600 h-2 rounded-full animate-pulse w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
