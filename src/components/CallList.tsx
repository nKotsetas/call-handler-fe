import type { Call } from '../types/call'
import { CallItem } from './CallItem'

interface CallListProps {
  calls: Call[]
}

export function CallList({ calls }: CallListProps) {
  return (
    <ul className="call-list">
      {calls.map((call) => (
        <li key={call.id}>
          <CallItem call={call} />
        </li>
      ))}
    </ul>
  )
}
