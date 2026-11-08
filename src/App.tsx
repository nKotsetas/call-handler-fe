import { useEffect, useState } from 'react'
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

      {callsState.status === 'loading' && <StatusMessage tone="loading" message="Loading calls…" />}

      {callsState.status === 'error' && (
        <StatusMessage tone="error" message={callsState.message} onRetry={handleRetry} />
      )}

      {callsState.status === 'success' &&
        (callsState.calls.length === 0 ? (
          <StatusMessage message="No active calls." />
        ) : (
          <CallList calls={callsState.calls} />
        ))}
    </main>
  )
}

export default App
