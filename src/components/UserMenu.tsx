import { useAuth } from '../context/authContext'

export function UserMenu() {
  const { user, logout } = useAuth()
  if (!user) return null

  return (
    <div className="user-menu">
      <span>
        Signed in as <strong>{user.name}</strong>
      </span>
      <button type="button" className="button" onClick={logout}>
        Log out
      </button>
    </div>
  )
}
