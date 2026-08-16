import type { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { DemoPlayer } from '~/components/DemoPlayer'
import { Callout } from '~/components/mdx/Callout'
import { ApiSpec } from '~/components/mdx/ApiSpec'
import { ArchDiagram, SAMPLE_ARCH } from '~/components/mdx/ArchDiagram'
import { BarChart } from '~/components/mdx/BarChart'
import { Compare } from '~/components/mdx/Compare'
import { Diff, SAMPLE_DIFF_UNIFIED } from '~/components/mdx/Diff'
import { FileTree, SAMPLE_FILE_TREE } from '~/components/mdx/FileTree'
import { FootnoteRef, Footnotes } from '~/components/mdx/Footnotes'
import { Kbd, KbdCombo } from '~/components/mdx/Kbd'
import { LineChart } from '~/components/mdx/LineChart'
import { MdxDetails } from '~/components/mdx/MdxDetails'
import { MdxFigure } from '~/components/mdx/MdxFigure'
import { MdxProof } from '~/components/mdx/MdxProof'
import { MdxPullquote } from '~/components/mdx/MdxPullquote'
import { MdxSteps } from '~/components/mdx/MdxSteps'
import { NetworkGraph, SAMPLE_GRAPH } from '~/components/mdx/NetworkGraph'
import { Terminal, SAMPLE_TERMINAL_LINES } from '~/components/mdx/Terminal'
import { Timeline, SAMPLE_TIMELINE } from '~/components/mdx/Timeline'
import { CodeBlock } from '~/components/PostBody'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/lab/components')({
  component: LabComponents,
  head: () => ({
    meta: seo({
      title: 'Components — Lab',
      description: 'Kitchen sink of post blocks and markdown directives.',
      url: '/lab/components',
    }),
  }),
})

const BAR_ITEMS = [
  { label: 'turn p99', value: 12, unit: 'ms' },
  { label: 'schema gen', value: 0.4, unit: 'ms' },
  { label: 'cache hit', value: 1.1, unit: 'ms' },
]

const LINE_POINTS = [
  { label: 't1', value: 18 },
  { label: 't2', value: 14 },
  { label: 't3', value: 11 },
  { label: 't4', value: 13 },
  { label: 't5', value: 10 },
  { label: 't6', value: 12 },
  { label: 't7', value: 9 },
  { label: 't8', value: 12 },
]

function LabBlock({
  id,
  title,
  when,
  directive,
  children,
}: {
  id: string
  title: string
  when: string
  directive?: string
  children: ReactNode
}) {
  return (
    <section className="lab-block" id={id}>
      <h2>{title}</h2>
      <p className="lab-block-when">{when}</p>
      {children}
      {directive ? (
        <pre className="lab-directive-snippet" aria-label="Markdown directive">
          <code>{directive}</code>
        </pre>
      ) : null}
    </section>
  )
}

const TOC = [
  ['callout', 'Callout'],
  ['quote', 'Pullquote'],
  ['steps', 'Steps'],
  ['proof', 'Proof'],
  ['figure', 'Figure'],
  ['demo', 'Demo'],
  ['table', 'Table'],
  ['code', 'Code'],
  ['bar', 'Bar chart'],
  ['line', 'Line chart'],
  ['diff', 'Diff'],
  ['terminal', 'Terminal'],
  ['tree', 'File tree'],
  ['arch', 'Architecture'],
  ['timeline', 'Timeline'],
  ['graph', 'Graph'],
  ['kbd', 'Keyboard'],
  ['details', 'Details'],
  ['api', 'API spec'],
  ['notes', 'Footnotes'],
  ['compare', 'Compare'],
] as const

function LabComponents() {
  return (
    <section className="lab-page lab-components">
      <h1 className="lab-title">Components</h1>
      <p className="lab-lead">
        Real blocks — not screenshots. Each section shows when to use it and the directive an agent would
        write in a post.
      </p>
      <nav className="lab-toc" aria-label="Component list">
        {TOC.map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>

      <LabBlock
        id="callout"
        title="Callout"
        when="Inline note, warning, idea, result, or danger without breaking flow."
        directive={`:::callout{tone="warn" title="Queue lag"}\nReaders miss this in a wall of text.\n:::`}
      >
        <div className="lab-callout-row">
          <Callout tone="note" title="Note">
            Default aside. Use for definitions or caveats.
          </Callout>
          <Callout tone="warn" title="Queue lag">
            Readers miss this in a wall of text.
          </Callout>
          <Callout tone="idea" title="Hypothesis">
            Cache the list, not the markdown AST.
          </Callout>
          <Callout tone="result" title="Result">
            p95 dropped 40ms after the cache.
          </Callout>
          <Callout tone="danger" title="Do not">
            Do not put secrets in posts.
          </Callout>
        </div>
      </LabBlock>

      <LabBlock
        id="quote"
        title="Pullquote"
        when="Pull a single sentence out of the narrative."
        directive={`:::pullquote{cite="lab note"}\nThe turn loop is code.\n:::`}
      >
        <MdxPullquote cite="lab note">The turn loop is code. The model only does NLU.</MdxPullquote>
      </LabBlock>

      <LabBlock
        id="steps"
        title="Steps"
        when="Ordered rollout or how-to without a numbered prose list."
        directive={`:::steps\n1. Scaffold turn loop\n2. Wire OpenAPI tools\n3. Ship sandbox demo\n:::`}
      >
        <MdxSteps>
          <ol>
            <li>Scaffold turn loop in Rust</li>
            <li>Wire OpenAPI tools to the FE</li>
            <li>Ship sandbox demo + poster</li>
          </ol>
        </MdxSteps>
      </LabBlock>

      <LabBlock
        id="proof"
        title="Proof"
        when="Receipt block: tests, benches, repo link."
        directive={`:::proof{tests="142 passing" repo="https://github.com/omnaiduu/bankbot-rs"}\n{"benches":[{"name":"turn p99","value":"12ms"}]}\n:::`}
      >
        <MdxProof tests="142 passing" repo="https://github.com/omnaiduu/bankbot-rs">
          {'{"benches":[{"name":"turn p99","value":"12ms"},{"name":"binary","value":"4.1MB"}]}'}
        </MdxProof>
      </LabBlock>

      <LabBlock
        id="figure"
        title="Figure"
        when="Image with caption — poster stills, diagrams."
        directive={`:::figure{src="/media/demo-poster.svg" alt="Sandbox frame"}\nCaption text.\n:::`}
      >
        <MdxFigure src="/media/demo-poster.svg" alt="Sandbox frame still">
          Poster frame from the demo asset.
        </MdxFigure>
      </LabBlock>

      <LabBlock
        id="demo"
        title="DemoPlayer"
        when="Short H.264 clip with required poster — same file for site and feeds."
        directive={`:::demo{src="/media/demo.mp4" poster="/media/demo-poster.svg" captions="/media/demo.vtt"}\nCaption under the player.\n:::`}
      >
        <DemoPlayer
          src="/media/demo.mp4"
          poster="/media/demo-poster.svg"
          captions="/media/demo.vtt"
          caption="6s sandbox run — poster required, nothing loads until play."
        />
      </LabBlock>

      <LabBlock
        id="table"
        title="GFM table"
        when="Verification matrix or option comparison."
        directive={`| Case | Result |\n| --- | --- |\n| Happy path | green |`}
      >
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Case</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Happy path</td>
                <td>green</td>
              </tr>
              <tr>
                <td>Bad JSON</td>
                <td>typed error</td>
              </tr>
              <tr>
                <td>Missing auth</td>
                <td>reject</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LabBlock>

      <LabBlock
        id="code"
        title="Code block"
        when="Fenced code with language label and copy button."
        directive={'```rust\nmatch intent {\n    Intent::Balance => tools.balances(session).await?,\n}\n```'}
      >
        <CodeBlock className="language-rust">
          {`match intent {
    Intent::Balance => tools.balances(session).await?,
    Intent::Transfer(spec) => tools.transfer(session, spec).await?,
    Intent::Unknown => Reply::clarify("I can check balances or send a transfer."),
}`}
        </CodeBlock>
      </LabBlock>

      <LabBlock
        id="bar"
        title="BarChart"
        when="Compare a few benchmark numbers inline."
        directive={`:::chart{kind="bar"}\n[{"label":"p99","value":12,"unit":"ms"}]\n:::`}
      >
        <BarChart items={BAR_ITEMS} />
      </LabBlock>

      <LabBlock
        id="line"
        title="LineChart"
        when="Latency or metric trend across turns."
        directive={`:::chart{kind="line"}\n[{"label":"t1","value":18}]\n:::`}
      >
        <LineChart points={LINE_POINTS} />
      </LabBlock>

      <LabBlock
        id="diff"
        title="Diff"
        when="Show a small code change — split or unified."
        directive={`:::diff\n-    Intent::Balance => tools.balance().await?,\n+    Intent::Balance => tools.balances(session).await?,\n:::`}
      >
        <Diff unified={SAMPLE_DIFF_UNIFIED} />
      </LabBlock>

      <LabBlock
        id="terminal"
        title="Terminal"
        when="Command output or build log excerpt."
        directive={`:::terminal{prompt="om@lab"}\n["cargo test","test result: ok"]\n:::`}
      >
        <Terminal lines={SAMPLE_TERMINAL_LINES} />
      </LabBlock>

      <LabBlock
        id="tree"
        title="FileTree"
        when="Orient the reader in a repo without a screenshot."
        directive={`:::filetree\n{"name":"bankbot-rs","children":[{"name":"src"}]}\n:::`}
      >
        <FileTree tree={SAMPLE_FILE_TREE} />
      </LabBlock>

      <LabBlock
        id="arch"
        title="ArchDiagram"
        when="Simple left-to-right system flow."
        directive={`:::arch\n[{"id":"client","label":"Client"}]\n:::`}
      >
        <ArchDiagram boxes={SAMPLE_ARCH} />
      </LabBlock>

      <LabBlock
        id="timeline"
        title="Timeline"
        when="Ship log or milestone sequence."
        directive={`:::timeline\n[{"date":"Aug 8","title":"Scaffold"}]\n:::`}
      >
        <Timeline events={SAMPLE_TIMELINE} />
      </LabBlock>

      <LabBlock
        id="graph"
        title="NetworkGraph"
        when="Static node/edge sketch — not interactive."
        directive={`:::graph\n{"nodes":[],"edges":[]}\n:::`}
      >
        <NetworkGraph nodes={SAMPLE_GRAPH.nodes} edges={SAMPLE_GRAPH.edges} />
      </LabBlock>

      <LabBlock id="kbd" title="Kbd" when="Keyboard shortcuts in prose.">
        <p>
          Press <KbdCombo keys={['⌘', 'K']} /> to open the command palette, or <Kbd>Esc</Kbd> to dismiss.
        </p>
      </LabBlock>

      <LabBlock
        id="details"
        title="Details"
        when="Collapse long logs or stack traces."
        directive={`:::details{summary="Full stderr"}\nLong log body…\n:::`}
      >
        <MdxDetails summary="Full stderr">
          <pre>{`WARN turn::auth session missing bearer\nINFO turn::nlu intent=Transfer confidence=0.91\nINFO tools::transfer sandbox=true amount=10.00`}</pre>
        </MdxDetails>
      </LabBlock>

      <LabBlock
        id="api"
        title="ApiSpec"
        when="Document one HTTP endpoint inline."
        directive={`:::apispec{method="POST" path="/v1/transfer" status="201"}\nCreates a sandbox transfer.\n:::`}
      >
        <ApiSpec
          method="POST"
          path="/v1/transfer"
          status={201}
          description="Creates a sandbox transfer after intent classification."
        />
      </LabBlock>

      <LabBlock id="notes" title="Footnotes" when="Citations without breaking reading flow.">
        <Footnotes notes={[{ id: 'fn-rust', text: 'Turn loop ships as a Rust binary with OpenAPI types.' }]}>
          <p>
            The backend is code-owned
            <FootnoteRef n={1} id="fn-rust" /> — the model never invents a transfer.
          </p>
        </Footnotes>
      </LabBlock>

      <LabBlock
        id="compare"
        title="Compare"
        when="Before/after stills side by side."
        directive={`:::compare{before="/og/bankbot-turn-loop" after="/og/bankbot-turn-loop?style=ink" beforeCaption="Parchment" afterCaption="Ink"}\n:::`}
      >
        <Compare
          before={{ src: '/og/bankbot-turn-loop', alt: 'Parchment OG' }}
          after={{ src: '/og/bankbot-turn-loop?style=ink', alt: 'Ink OG' }}
          beforeCaption="Parchment"
          afterCaption="Ink"
        />
      </LabBlock>
    </section>
  )
}
