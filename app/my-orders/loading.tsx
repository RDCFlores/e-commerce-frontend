export default function LoadingMyOrders() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}