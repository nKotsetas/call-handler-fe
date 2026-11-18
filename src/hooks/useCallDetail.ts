import { useEffect, useState } from 'react'
import { useCurrentUser } from '../context/authContext'
import { ApiError, getCall } from '../services/callService'
import type { CallDetail } from '../types/call'
import { getErrorMessage } from '../utils/errors'

export type CallDetailState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'error'; message: string }
  | { status: 'success'; call: CallDetail }

export function useCallDetail(callId: string): CallDetailState {
  const { id: userId } = useCurrentUser()
  const [detailState, setDetailState] = useState<CallDetailState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    getCall(userId, callId, controller.signal)
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
  }, [userId, callId])

  return detailState
}
