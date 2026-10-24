import { AlertCircle, LoaderCircle } from 'lucide-react'

export function Loading({ label = 'Finding something delicious…' }) {
  return <div className="feedback" role="status"><LoaderCircle className="spinner" size={22} />{label}</div>
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <AlertCircle size={20} />
      <span>{message}</span>
      {onRetry && <button className="text-button" onClick={onRetry}>Try again</button>}
    </div>
  )
}

export function EmptyState({ title, description, children }) {
  return (
    <div className="empty-state">
      <span className="empty-mark" aria-hidden="true">✳</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  )
}
