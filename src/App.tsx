import { useEffect, useState } from 'react'
import { CallDetails } from './components/CallDetails'
import { CallList } from './components/CallList'
import { StatusMessage } from './components/StatusMessage'
import { getCalls } from './services/callService'
import type { Call } from './types/call'
import { getErrorMessage } from './utils/errors'
import './App.css'

type CallsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; calls: Call[] }

function App() {
  const [callsState, setCallsState] = useState<CallsState>({ status: 'loading' })
  const [reloadCount, setReloadCount] = useState(0)
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    getCalls(controller.signal)
      .then((calls) => setCallsState({ status: 'success', calls }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setCallsState({ status: 'error', message: getErrorMessage(error) })
      })

    return () => controller.abort()
  }, [reloadCount])

  function handleRetry() {
    setCallsState({ status: 'loading' })
    setReloadCount((count) => count + 1)
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>Call activity</h1>
      </header>

      <div className={`layout${selectedCallId ? ' layout--with-details' : ''}`}>
        <section aria-label="Call feed">
          {callsState.status === 'loading' && <StatusMessage tone="loading" message="Loading calls…" />}

          {callsState.status === 'error' && (
            <StatusMessage tone="error" message={callsState.message} onRetry={handleRetry} />
          )}

          {callsState.status === 'success' &&
            (callsState.calls.length === 0 ? (
              <StatusMessage message="No active calls." />
            ) : (
              <CallList
                calls={callsState.calls}
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
          />
        )}
      </div>
    </main>
  )
}

export default App
