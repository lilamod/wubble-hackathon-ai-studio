"use client"

import { useState, useEffect } from 'react'

interface Toast {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'info'
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  // Global toast function
  const showToast = (title: string, description?: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString()
    const newToast: Toast = { id, title, description, type }
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  useEffect(() => {
    // Fixed: Proper event listener typing
    const handleCustomToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ title: string; description?: string; type?: Toast['type'] }>
      showToast(customEvent.detail.title, customEvent.detail.description, customEvent.detail.type)
    }
    
    window.addEventListener('appToast', handleCustomToast)
    ;(window as any).showToast = showToast // Global access
    
    return () => {
      window.removeEventListener('appToast', handleCustomToast)
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 flex flex-col-reverse space-y-2 z-[100]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            p-4 rounded-2xl shadow-2xl backdrop-blur-xl border max-w-sm w-80
            transform transition-all duration-300 hover:scale-[1.02]
            ${toast.type === 'success' 
              ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100' 
              : toast.type === 'error' 
              ? 'bg-red-500/20 border-red-400/40 text-red-100'
              : 'bg-blue-500/20 border-blue-500/30 text-blue-100'
            }
          `}
        >
          <div className="font-semibold text-sm">{toast.title}</div>
          {toast.description && (
            <div className="text-xs mt-1 opacity-90">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  )
}