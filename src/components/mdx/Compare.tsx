export function Compare({
  before,
  after,
  beforeCaption = 'Before',
  afterCaption = 'After',
}: {
  before: { src: string; alt?: string }
  after: { src: string; alt?: string }
  beforeCaption?: string
  afterCaption?: string
}) {
  return (
    <figure className="compare">
      <div className="compare-grid">
        <div className="compare-item">
          <img src={before.src} alt={before.alt ?? beforeCaption} loading="lazy" />
          <figcaption>{beforeCaption}</figcaption>
        </div>
        <div className="compare-item">
          <img src={after.src} alt={after.alt ?? afterCaption} loading="lazy" />
          <figcaption>{afterCaption}</figcaption>
        </div>
      </div>
    </figure>
  )
}
