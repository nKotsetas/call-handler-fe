import { createContext, useContext } from 'react'

export interface CallSelectionContextValue {
  selectedCallId: string | null
  selectCall: (callId: string) => void
  clearSelection: () => void
}

export const CallSelectionContext = createContext<CallSelectionContextValue | null>(null)

export function useCallSelection(): CallSelectionContextValue {
  const context = useContext(CallSelectionContext)
  if (!context) {
    throw new Error('useCallSelection must be used inside <CallSelectionProvider>')
  }
  return context
}
