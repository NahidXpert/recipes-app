import { Check, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ConnectivityNotice() {
  const [online, setOnline] = useState(() => navigator.onLine)
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    let reconnectTimer

    function handleOffline() {
      window.clearTimeout(reconnectTimer)
      setOnline(false)
      setShowReconnected(false)
    }

    function handleOnline() {
      setOnline(true)
      setShowReconnected(true)
      reconnectTimer = window.setTimeout(() => setShowReconnected(false), 4000)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.clearTimeout(reconnectTimer)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (!online) {
    return (
      <div className="connectivity-notice connectivity-offline" role="alert">
        <WifiOff size={17} aria-hidden="true" />
        <span>You’re offline. Saved recipes and previously loaded content may still be available.</span>
      </div>
    )
  }

  if (!showReconnected) return null

  return (
    <div className="connectivity-notice connectivity-online" role="status">
      <Check size={17} aria-hidden="true" />
      <span>You’re back online.</span>
    </div>
  )
}
