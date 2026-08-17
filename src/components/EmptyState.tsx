import type { ReactNode } from 'react'

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state-dot" aria-hidden />
      <p>{children}</p>
    </div>
  )
}
