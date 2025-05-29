export function InvoicesSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 xs:h-9 lg:h-10 w-32 bg-gray-200 rounded"></div>
          <div className="mt-1 h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="relative">
        <div className="w-full h-10 xs:h-11 bg-gray-200 rounded-lg"></div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50">
          <div className="grid grid-cols-6 gap-4 p-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="divide-y">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 p-4 border-b border-b-gray-200"
            >
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-5 bg-gray-200 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
