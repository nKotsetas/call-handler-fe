interface StatusAction {
  label: string
  onClick: () => void
}

interface StatusMessageProps {
  message: string
  tone?: 'info' | 'loading' | 'error'
  action?: StatusAction
}

export function StatusMessage({ message, tone = 'info', action }: StatusMessageProps) {
  return (
    <div className={`status status--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {tone === 'loading' && <span className="spinner" aria-hidden="true" />}
      <p>{message}</p>
      {action && (
        <button type="button" className="button" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
