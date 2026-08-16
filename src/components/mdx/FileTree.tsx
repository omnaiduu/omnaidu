export type TreeNode = { name: string; children?: TreeNode[] }

function TreeBranch({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const isDir = Boolean(node.children?.length)

  return (
    <li className={isDir ? 'filetree-dir' : 'filetree-file'} style={{ paddingLeft: depth * 14 }}>
      <span className="filetree-name">{node.name}</span>
      {node.children ? (
        <ul>
          {node.children.map((child) => (
            <TreeBranch key={child.name} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export function FileTree({ tree }: { tree: TreeNode }) {
  return (
    <div className="filetree">
      <ul>
        <TreeBranch node={tree} />
      </ul>
    </div>
  )
}

export const SAMPLE_FILE_TREE: TreeNode = {
  name: 'app',
  children: [
    {
      name: 'src',
      children: [
        { name: 'main.rs' },
        { name: 'lib.rs' },
        {
          name: 'tools',
          children: [{ name: 'mod.rs' }],
        },
      ],
    },
    { name: 'Cargo.toml' },
  ],
}
