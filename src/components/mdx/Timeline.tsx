export type TimelineEvent = { date: string; title: string; detail?: string }

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="timeline">
      {events.map((event) => (
        <li key={event.title} className="timeline-event">
          <time className="timeline-date">{event.date}</time>
          <div className="timeline-body">
            <strong>{event.title}</strong>
            {event.detail ? <p>{event.detail}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

export const SAMPLE_TIMELINE: TimelineEvent[] = [
  { date: 'Aug 8', title: 'Turn loop scaffold', detail: 'Rust state machine + OpenAPI types.' },
  { date: 'Aug 10', title: 'Sandbox fixtures', detail: '142 tests, transfer happy path green.' },
  { date: 'Aug 12', title: 'Demo + post', detail: '6s MP4, same asset for feeds.' },
]
