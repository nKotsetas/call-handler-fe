import { useCallDetail } from '../hooks/useCallDetail'
import type { CallDetail } from '../types/call'
import { formatDateTime, formatDuration } from '../utils/format'
import { StatusMessage } from './StatusMessage'

interface CallDetailsProps {
  callId: string
  onClose: () => void
  onArchive: (callId: string) => void
}

export function CallDetails({ callId, onClose, onArchive }: CallDetailsProps) {
  const detailState = useCallDetail(callId)

  return (
    <aside className="call-details" aria-label="Call details">
      <header className="call-details__header">
        <h2>Call details</h2>
        <button type="button" className="button" onClick={onClose} aria-label="Close details">
          ✕
        </button>
      </header>

      {detailState.status === 'loading' && <StatusMessage tone="loading" message="Loading call…" />}

      {detailState.status === 'not-found' && (
        <StatusMessage tone="error" message="Call not found. It may have been removed." />
      )}

      {detailState.status === 'error' && <StatusMessage tone="error" message={detailState.message} />}

      {detailState.status === 'success' && (
        <>
          <CallDetailsBody call={detailState.call} />
          <button type="button" className="button button--danger" onClick={() => onArchive(callId)}>
            Archive call
          </button>
        </>
      )}
    </aside>
  )
}

interface CallDetailsBodyProps {
  call: CallDetail
}

function CallDetailsBody({ call }: CallDetailsBodyProps) {
  return (
    <>
      <dl className="detail-list">
        <dt>Direction</dt>
        <dd className="capitalize">{call.direction}</dd>
        <dt>From</dt>
        <dd>{call.from}</dd>
        <dt>To</dt>
        <dd>{call.to}</dd>
        <dt>Type</dt>
        <dd>
          <span className={`badge badge--${call.call_type}`}>{call.call_type}</span>
        </dd>
        <dt>Duration</dt>
        <dd>{formatDuration(call.duration)}</dd>
        <dt>Date</dt>
        <dd>
          <time dateTime={call.created_at}>{formatDateTime(call.created_at)}</time>
        </dd>
      </dl>

      <section className="notes">
        <h3>Notes</h3>
        {call.notes.length > 0 ? (
          <ul className="notes__list">
            {call.notes.map((note) => (
              <li key={note.id}>{note.content}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">No notes for this call.</p>
        )}
      </section>
    </>
  )
}
