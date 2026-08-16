import { ApiSpec } from './ApiSpec'

export function MdxApiSpec({
  method,
  path,
  status,
  description,
}: {
  method?: string
  path?: string
  status?: string
  description?: string
}) {
  return (
    <ApiSpec
      method={method}
      path={path}
      status={status}
      description={description}
    />
  )
}
