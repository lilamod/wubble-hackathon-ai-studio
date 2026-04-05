'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Music, Zap, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

export function WubbleSetup({ onProvisioned }: { onProvisioned: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const provision = async () => {
    setLoading(true)
    setError('')
    try {
      await api.provisionWubble()
      onProvisioned()
    } catch (e: any) {
      setError(e.message || 'Failed to connect Wubble')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
          <Music className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-black text-white mb-3">Connect Wubble AI</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Activate your Wubble AI account to start generating custom music for your content.
          This takes one click.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Key, label: 'API Key', desc: 'Auto-provisioned' },
            { icon: Zap, label: 'Credits', desc: 'Ready to use' },
            { icon: Music, label: 'Music AI', desc: 'Wubble powered' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="p-3 bg-white/3 border border-white/5 rounded-xl">
              <Icon className="w-4 h-4 text-purple-400 mx-auto mb-2" />
              <p className="text-white text-xs font-semibold">{label}</p>
              <p className="text-gray-600 text-xs">{desc}</p>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</p>
        )}

        <Button
          onClick={provision}
          disabled={loading}
          className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white border-0 font-semibold"
        >
          {loading ? 'Connecting...' : 'Connect Wubble AI'}
        </Button>
      </motion.div>
    </div>
  )
}
