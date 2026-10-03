import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { rowsFromDirective, rowsFromPost } from './proof-rows.ts'

describe('proof rows', () => {
  it('stacks two benches and a repo, with labels from the post', () => {
    const rows = rowsFromDirective({
      repo: 'https://github.com/omnaiduu/example',
      body: JSON.stringify({
        benches: [
          { name: 'E4B', value: '6 pass, 1 partial, 1 fail' },
          { name: '12B', value: '5 pass, 2 partial, 1 fail' },
        ],
      }),
    })

    assert.equal(rows.length, 3)
    assert.deepEqual(
      rows.map((row) => row.label),
      ['E4B', '12B', 'Repo'],
    )
    assert.equal(rows[0]?.value, '6 pass, 1 partial, 1 fail')
    assert.equal(rows[1]?.value, '5 pass, 2 partial, 1 fail')
    assert.equal(rows[2]?.href, 'https://github.com/omnaiduu/example')
    assert.equal(rows.some((row) => row.label === 'Tests'), false)
  })

  it('shows a repo by itself as one row', () => {
    const rows = rowsFromPost({
      proofTests: null,
      proofBenches: [],
      repo: 'https://github.com/omnaiduu/example',
    })

    assert.equal(rows.length, 1)
    assert.equal(rows[0]?.label, 'Repo')
    assert.equal(rows[0]?.href, 'https://github.com/omnaiduu/example')
  })

  it('still renders legacy tests and benches without inventing a Tests label', () => {
    const rows = rowsFromPost({
      proofTests: '142 passed',
      proofBenches: [{ name: 'p95', value: '12ms' }],
      repo: null,
    })

    assert.deepEqual(
      rows.map((row) => [row.label, row.value]),
      [
        ['', '142 passed'],
        ['p95', '12ms'],
      ],
    )
  })

  it('uses a label the directive supplies for the tests value', () => {
    const rows = rowsFromDirective({
      label: 'Suites',
      tests: '142 passed',
      body: '{"benches":[{"label":"p99","value":"40ms"}]}',
    })

    assert.deepEqual(
      rows.map((row) => [row.label, row.value]),
      [
        ['Suites', '142 passed'],
        ['p99', '40ms'],
      ],
    )
  })

  it('returns nothing when there is nothing to show', () => {
    assert.deepEqual(rowsFromPost({ proofTests: null, proofBenches: [], repo: null }), [])
    assert.deepEqual(rowsFromDirective({ body: 'not json', repo: '  ' }), [])
  })
})
