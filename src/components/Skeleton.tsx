interface SkeletonProps {
  className?: string
  count?: number
  circle?: boolean
}

export function Skeleton({ className = '', count = 1, circle = false }: SkeletonProps) {
  const skeletons = Array.from({ length: count })

  return (
    <>
      {skeletons.map((_, i) => (
        <div
          key={i}
          className={`
            skeleton
            ${circle ? 'rounded-full' : 'rounded'}
            ${className}
          `}
        />
      ))}
    </>
  )
}

export function MessageSkeleton() {
  return (
    <div className="flex gap-4 mb-6 animate-fadeIn">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

export function InputSkeleton() {
  return (
    <div className="p-4 space-y-2 border-t border-bg-hover">
      <Skeleton className="h-10 w-full rounded" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded" />
        <Skeleton className="h-8 w-24 rounded" />
      </div>
    </div>
  )
}
