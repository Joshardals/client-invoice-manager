export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 xs:h-9 lg:h-10 w-48 bg-gray-200 rounded"></div>
          <div className="mt-1 h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 sm:gap-3">
          <div className="h-9 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-9 w-36 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gray-200 w-10 h-10"></div>
              <div className="ml-3 sm:ml-4 flex-1">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="mt-2 h-6 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Invoices Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 w-36 bg-gray-200 rounded"></div>
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-4 py-3">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-5 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, rowIndex) => (
              <div key={rowIndex} className="px-4 py-3">
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className="h-5 bg-gray-200 rounded"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
