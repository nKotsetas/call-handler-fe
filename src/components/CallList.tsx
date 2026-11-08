import type { Call } from '../types/call'
import { CallItem } from './CallItem'

interface CallListProps {
  calls: Call[]
  selectedCallId: string | null
  onSelectCall: (callId: string) => void
}

export function CallList({ calls, selectedCallId, onSelectCall }: CallListProps) {
  return (
    <ul className="call-list">
      {calls.map((call) => (
        <li key={call.id}>
          <CallItem call={call} isSelected={call.id === selectedCallId} onSelect={onSelectCall} />
        </li>
      ))}
    </ul>
  )
}
