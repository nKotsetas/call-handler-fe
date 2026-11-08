import type { Call } from '../types/call'
import { formatDateTime } from '../utils/format'

interface CallItemProps {
  call: Call
}

export function CallItem({ call }: CallItemProps) {
  const directionIcon = call.direction === 'inbound' ? '↙' : '↗'

  return (
    <article className="call-item">
      <span className={`call-item__direction call-item__direction--${call.direction}`}>
        <span aria-hidden="true">{directionIcon}</span> {call.direction}
      </span>
      <span className="call-item__numbers">
        {call.from} → {call.to}
      </span>
      <span className={`badge badge--${call.call_type}`}>{call.call_type}</span>
      <time className="call-item__date" dateTime={call.created_at}>
        {formatDateTime(call.created_at)}
      </time>
    </article>
  )
}
