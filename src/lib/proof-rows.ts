export type ProofRow = {
  label: string
  value: string
  href?: string
}

type Fact = {
  name?: string
  label?: string
  value?: string
}

const REPO_VALUE = 'Open GitHub →'

export function rowsFromPost(input: {
  proofTests?: string | null
  proofBenches?: Fact[] | null
  repo?: string | null
}): ProofRow[] {
  return assemble({
    tests: input.proofTests,
    facts: input.proofBenches ?? [],
    repo: input.repo,
  })
}

export function rowsFromDirective(input: {
  tests?: string | null
  label?: string | null
  repo?: string | null
  repoLabel?: string | null
  body?: string | null
}): ProofRow[] {
  return assemble({
    tests: input.tests,
    testsLabel: input.label,
    facts: factsFromBody(input.body ?? ''),
    repo: input.repo,
    repoLabel: input.repoLabel,
  })
}

function assemble(input: {
  tests?: string | null
  testsLabel?: string | null
  facts: Fact[]
  repo?: string | null
  repoLabel?: string | null
}): ProofRow[] {
  const rows: ProofRow[] = []
  const tests = input.tests?.trim()
  if (tests) {
    rows.push({ label: input.testsLabel?.trim() ?? '', value: tests })
  }

  for (const fact of input.facts) {
    const label = text(fact.label) || text(fact.name)
    const value = text(fact.value)
    if (!label && !value) continue
    rows.push({ label, value })
  }

  const repo = input.repo?.trim()
  if (repo) {
    rows.push({
      label: input.repoLabel?.trim() || 'Repo',
      value: REPO_VALUE,
      href: repo,
    })
  }

  return rows
}

function factsFromBody(body: string): Fact[] {
  const raw = body.trim()
  if (!raw.startsWith('{')) return []
  try {
    const parsed = JSON.parse(raw) as { benches?: unknown; items?: unknown; rows?: unknown }
    return [...asFacts(parsed.benches), ...asFacts(parsed.items), ...asFacts(parsed.rows)]
  } catch {
    return []
  }
}

function asFacts(value: unknown): Fact[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is Fact => Boolean(item) && typeof item === 'object')
}

function text(value: unknown) {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}
