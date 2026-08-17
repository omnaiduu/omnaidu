'use client'

import * as React from 'react'
import { SITE_URL } from '~/lib/site'

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    const url = path.startsWith('http') ? path : `${SITE_URL}${path}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button type="button" className="cite-btn" onClick={copy}>
      {copied ? 'Copied' : 'Copy link'}
    </button>
  )
}
