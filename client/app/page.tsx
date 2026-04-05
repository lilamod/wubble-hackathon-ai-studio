'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Music, Wand2, Zap, Play, Radio, Mic2 } from 'lucide-react'

const features = [
  { icon: Wand2, color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', iconColor: 'text-purple-400', title: 'Describe Your Vibe', desc: 'Tell the AI what your content is about — it crafts the perfect soundtrack.' },
  { icon: Zap, color: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/30', iconColor: 'text-yellow-400', title: 'Instant Generation', desc: 'Wubble AI generates royalty-free music in seconds, tuned to your mood and format.' },
  { icon: Radio, color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', iconColor: 'text-emerald-400', title: 'Built for Creators', desc: 'Reels, stories, podcasts, YouTube — every format gets its own perfect track.' },
]

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.push('/dashboard')
  }, [user, loading, router])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <Music className="w-8 h-8 text-purple-400 animate-pulse" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Wubble Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 text-sm">Sign In</Button>
          </Link>
          <Link href="/auth/login">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-5 border-0">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 pt-24 pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-xs font-medium mb-8">
            <Zap className="w-3 h-3" /> Powered by Wubble AI
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
            AI Music for Your<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Social Content
            </span>
          </h1>

          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Describe your content. Get a custom, royalty-free soundtrack in seconds.
            Built for reels, stories, podcasts, and YouTube.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white border-0 px-8 h-12 text-base font-semibold">
                <Mic2 className="w-4 h-4 mr-2" /> Start Creating Free
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Fake waveform decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-1 mt-20 mb-16"
        >
          {Array.from({ length: 48 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-purple-600 to-pink-400 rounded-full"
              animate={{ height: [8, Math.random() * 48 + 8, 8] }}
              transition={{ duration: 1.2 + Math.random(), repeat: Infinity, delay: i * 0.04 }}
            />
          ))}
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {features.map(({ icon: Icon, color, border, iconColor, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`p-6 bg-gradient-to-br ${color} rounded-2xl border ${border} text-left`}
            >
              <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm">{title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
