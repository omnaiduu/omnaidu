'use client'

import * as React from 'react'

export function SiteEffects() {
  const barRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const root = document.documentElement
    const bar = barRef.current
    let frame = 0

    const update = () => {
      root.toggleAttribute('data-scrolled', window.scrollY > 8)
      if (!bar) return
      const article = document.querySelector('article.article')
      if (!(article instanceof HTMLElement)) {
        bar.style.transform = 'scaleX(0)'
        return
      }
      const top = article.getBoundingClientRect().top + window.scrollY
      const height = article.offsetHeight - window.innerHeight
      const raw =
        height <= 0 ? (window.scrollY >= top ? 1 : 0) : (window.scrollY - top) / height
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, raw))})`
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="read-progress" aria-hidden>
      <span ref={barRef} className="read-progress-bar" />
    </div>
  )
}
