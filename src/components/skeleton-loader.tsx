"use client"

interface SkeletonLoaderProps {
  type?: "table" | "card" | "form" | "list"
  rows?: number
  className?: string
}

export function SkeletonLoader({ type = "card", rows = 3, className = "" }: SkeletonLoaderProps) {
    const renderTableSkeleton = () => (
        <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
            {/* Table Header */}
            <div className="border-b border-gray-200 p-4">
                <div className="flex space-x-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
                    ))}
                </div>
            </div>

            {/* Table Rows */}
            {[...Array(rows)].map((_, rowIndex) => (
                <div key={rowIndex} className="border-b border-gray-100 p-4">
                    <div className="flex space-x-4 items-center">
                        {[...Array(4)].map((_, colIndex) => (
                            <div key={colIndex} className="flex-1">
                                <div
                                    className="h-4 bg-gray-200 rounded animate-pulse"
                                    style={{ animationDelay: `${(rowIndex * 4 + colIndex) * 0.1}s` }}
                                />
                            </div>
                        ))}
                        <div className="flex space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

    const renderCardSkeleton = () => (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
            {[...Array(9)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                        <div className="flex-1 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="flex space-x-2">
                                <div className="h-6 bg-gray-200 rounded w-16" />
                                <div className="h-6 bg-gray-200 rounded w-20" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

    const renderFormSkeleton = () => (
        <div className={`bg-white rounded-lg shadow p-6 space-y-6 ${className}`}>
            {[...Array(rows)].map((_, index) => (
                <div key={index} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                    <div className="h-10 bg-gray-200 rounded animate-pulse" style={{ animationDelay: `${index * 0.1}s` }} />
                </div>
            ))}
            <div className="flex justify-end space-x-2 pt-4">
                <div className="h-10 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
        </div>
    )

    const renderListSkeleton = () => (
        <div className={`space-y-4 ${className}`}>
            {[...Array(rows)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    )

    switch (type) {
        case "table":
            return renderTableSkeleton()
        case "form":
            return renderFormSkeleton()
        case "list":
            return renderListSkeleton()
        default:
            return renderCardSkeleton()
    }
}
