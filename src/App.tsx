import { CallList } from './components/CallList'
import { mockCalls } from './data/mockCalls'
import './App.css'

function App() {
  const activeCalls = mockCalls.filter((call) => !call.is_archived)

  return (
    <main className="app">
      <header className="app__header">
        <h1>Call activity</h1>
      </header>
      <CallList calls={activeCalls} />
    </main>
  )
}

export default App
