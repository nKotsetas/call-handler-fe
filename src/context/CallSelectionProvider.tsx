import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { CallSelectionContext } from './callSelectionContext'

interface CallSelectionProviderProps {
  children: ReactNode
}

export function CallSelectionProvider({ children }: CallSelectionProviderProps) {
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null)

  const selectCall = useCallback((callId: string) => setSelectedCallId(callId), [])
  const clearSelection = useCallback(() => setSelectedCallId(null), [])

  const value = useMemo(
    () => ({ selectedCallId, selectCall, clearSelection }),
    [selectedCallId, selectCall, clearSelection],
  )

  return <CallSelectionContext value={value}>{children}</CallSelectionContext>
}
