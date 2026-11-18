import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/authContext'

export function LoginForm() {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const isEmpty = name.trim() === ''

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isEmpty) return
    login(name)
  }

  return (
    <main className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="login-name">Your name</label>
        <input
          id="login-name"
          className="input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          maxLength={80}
          autoFocus
        />
        <button type="submit" className="button" disabled={isEmpty}>
          Sign in
        </button>
      </form>
    </main>
  )
}
