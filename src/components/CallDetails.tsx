import { useEffect, useState } from 'react'
import { ApiError, getCall } from '../services/callService'
import type { CallDetail } from '../types/call'
import { getErrorMessage } from '../utils/errors'
import { formatDateTime, formatDuration } from '../utils/format'
import { StatusMessage } from './StatusMessage'

type DetailState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'error'; message: string }
  | { status: 'success'; call: CallDetail }

interface CallDetailsProps {
  callId: string
  onClose: () => void
}

export function CallDetails({ callId, onClose }: CallDetailsProps) {
  const [detailState, setDetailState] = useState<DetailState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    getCall(callId, controller.signal)
      .then((call) => setDetailState({ status: 'success', call }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        if (error instanceof ApiError && error.status === 404) {
          setDetailState({ status: 'not-found' })
          return
        }
        setDetailState({ status: 'error', message: getErrorMessage(error) })
      })

    return () => controller.abort()
  }, [callId])

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

      {detailState.status === 'success' && <CallDetailsBody call={detailState.call} />}
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
