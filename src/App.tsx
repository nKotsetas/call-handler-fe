import { useEffect, useRef } from 'react'
import { CallDetails } from './components/CallDetails'
import { CallList } from './components/CallList'
import { StatusMessage } from './components/StatusMessage'
import { ThemeToggle } from './components/ThemeToggle'
import { UserMenu } from './components/UserMenu'
import { useCurrentUser } from './context/authContext'
import { useCallSelection } from './context/callSelectionContext'
import {
  archiveCall,
  archiveErrorDismissed,
  callsReset,
  fetchCalls,
  selectArchiveError,
  selectCalls,
  selectCallsError,
  selectCallsStatus,
} from './store/callsSlice'
import { useAppDispatch, useAppSelector } from './store/hooks'
import './App.css'

function App() {
  const dispatch = useAppDispatch()
  const calls = useAppSelector(selectCalls)
  const callsStatus = useAppSelector(selectCallsStatus)
  const callsError = useAppSelector(selectCallsError)
  const archiveError = useAppSelector(selectArchiveError)
  const { id: userId } = useCurrentUser()
  const { selectedCallId, clearSelection } = useCallSelection()
  const inFlightRequests = useRef(new Set<{ abort: () => void }>())

  useEffect(() => {
    const request = dispatch(fetchCalls(userId))
    return () => request.abort()
  }, [dispatch, userId])

  // When the session ends (logout unmounts App), cancel in-flight requests and drop
  // the previous user's calls so the next user starts from a clean slice.
  useEffect(() => {
    const requests = inFlightRequests.current
    return () => {
      requests.forEach((request) => request.abort())
      requests.clear()
      dispatch(callsReset())
    }
  }, [dispatch, userId])

  function track(request: Promise<unknown> & { abort: () => void }) {
    const requests = inFlightRequests.current
    requests.add(request)
    void request.finally(() => requests.delete(request))
  }

  function handleArchive(callId: string) {
    clearSelection()
    track(dispatch(archiveCall({ userId, callId })))
  }

  function handleRetry() {
    track(dispatch(fetchCalls(userId)))
  }

  const isLoading = callsStatus === 'idle' || callsStatus === 'loading'

  return (
    <main className="app">
      <header className="app__header">
        <h1>Call activity</h1>
        <div className="app__actions">
          <UserMenu />
          <ThemeToggle />
        </div>
      </header>

      {archiveError && (
        <div className="app__banner">
          <StatusMessage
            tone="error"
            message={`Could not archive the call: ${archiveError}`}
            action={{ label: 'Dismiss', onClick: () => dispatch(archiveErrorDismissed()) }}
          />
        </div>
      )}

      <div className={`layout${selectedCallId ? ' layout--with-details' : ''}`}>
        <section aria-label="Call feed">
          {isLoading && <StatusMessage tone="loading" message="Loading calls…" />}

          {callsStatus === 'failed' && (
            <StatusMessage
              tone="error"
              message={callsError ?? 'Could not load calls.'}
              action={{ label: 'Try again', onClick: handleRetry }}
            />
          )}

          {callsStatus === 'succeeded' &&
            (calls.length === 0 ? (
              <StatusMessage message="No active calls." />
            ) : (
              <CallList calls={calls} />
            ))}
        </section>

        {selectedCallId && (
          <CallDetails
            key={selectedCallId}
            callId={selectedCallId}
            onClose={clearSelection}
            onArchive={handleArchive}
          />
        )}
      </div>
    </main>
  )
}

export default App
