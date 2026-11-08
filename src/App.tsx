import { useEffect, useState } from 'react'
import { CallDetails } from './components/CallDetails'
import { CallList } from './components/CallList'
import { StatusMessage } from './components/StatusMessage'
import {
  archiveCall,
  archiveErrorDismissed,
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
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null)

  useEffect(() => {
    const request = dispatch(fetchCalls())
    return () => request.abort()
  }, [dispatch])

  function handleArchive(callId: string) {
    setSelectedCallId(null)
    dispatch(archiveCall(callId))
  }

  const isLoading = callsStatus === 'idle' || callsStatus === 'loading'

  return (
    <main className="app">
      <header className="app__header">
        <h1>Call activity</h1>
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
              action={{ label: 'Try again', onClick: () => dispatch(fetchCalls()) }}
            />
          )}

          {callsStatus === 'succeeded' &&
            (calls.length === 0 ? (
              <StatusMessage message="No active calls." />
            ) : (
              <CallList
                calls={calls}
                selectedCallId={selectedCallId}
                onSelectCall={setSelectedCallId}
              />
            ))}
        </section>

        {selectedCallId && (
          <CallDetails
            key={selectedCallId}
            callId={selectedCallId}
            onClose={() => setSelectedCallId(null)}
            onArchive={handleArchive}
          />
        )}
      </div>
    </main>
  )
}

export default App
