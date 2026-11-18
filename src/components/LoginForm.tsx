import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/authContext'
import { PasswordInput } from './PasswordInput'

export function LoginForm() {
  const { login } = useAuth()
  const [name, setName] = useState('')
  // The API has no passwords, so this is only required in the form and never sent anywhere.
  const [password, setPassword] = useState('')
  const isIncomplete = name.trim() === '' || password === ''

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isIncomplete) return
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
        <label htmlFor="login-password">Password</label>
        <PasswordInput
          id="login-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
        <button type="submit" className="button" disabled={isIncomplete}>
          Sign in
        </button>
      </form>
    </main>
  )
}
