export type CallDirection = 'inbound' | 'outbound'

export type CallType = 'missed' | 'answered' | 'voicemail'

export interface Note {
  id: string
  call_id: string
  content: string
}

export interface Call {
  id: string
  direction: CallDirection
  from: string
  to: string
  call_type: CallType
  duration: number
  is_archived: boolean
  created_at: string
}

export interface CallDetail extends Call {
  notes: Note[]
}
