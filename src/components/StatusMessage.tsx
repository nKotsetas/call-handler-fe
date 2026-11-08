interface StatusMessageProps {
  message: string
  tone?: 'info' | 'loading' | 'error'
  onRetry?: () => void
}

export function StatusMessage({ message, tone = 'info', onRetry }: StatusMessageProps) {
  return (
    <div className={`status status--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {tone === 'loading' && <span className="spinner" aria-hidden="true" />}
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
