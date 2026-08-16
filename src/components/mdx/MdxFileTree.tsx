import * as React from 'react'
import { nodeText } from '~/lib/node-text'
import { FileTree, type TreeNode } from './FileTree'

export function MdxFileTree({ children }: { children?: React.ReactNode }) {
  const tree = React.useMemo(() => {
    const raw = nodeText(children).trim()
    if (!raw.startsWith('{')) return null
    try {
      return JSON.parse(raw) as TreeNode
    } catch {
      return null
    }
  }, [children])

  if (!tree) return null
  return <FileTree tree={tree} />
}
