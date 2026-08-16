import { Compare } from './Compare'

export function MdxCompare({
  before,
  after,
  beforeCaption,
  afterCaption,
}: {
  before?: string
  after?: string
  beforeCaption?: string
  afterCaption?: string
}) {
  if (!before || !after) return null
  return (
    <Compare
      before={{ src: before, alt: beforeCaption ?? 'Before' }}
      after={{ src: after, alt: afterCaption ?? 'After' }}
      beforeCaption={beforeCaption}
      afterCaption={afterCaption}
    />
  )
}
