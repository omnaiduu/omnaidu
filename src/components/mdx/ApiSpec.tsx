export function ApiSpec({
  method = 'GET',
  path = '/',
  status,
  description,
}: {
  method?: string
  path?: string
  status?: string | number
  description?: string
}) {
  return (
    <div className="api-spec">
      <div className="api-spec-line">
        <span className={`api-spec-method api-spec-${method.toLowerCase()}`}>{method}</span>
        <code className="api-spec-path">{path}</code>
        {status != null ? <span className="api-spec-status">{status}</span> : null}
      </div>
      {description ? <p className="api-spec-desc">{description}</p> : null}
    </div>
  )
}
