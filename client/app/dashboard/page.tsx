'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { MusicTrack } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, LogOut, Sparkles, Library, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TrackGenerator } from '@/components/studio/TrackGenerator'
import { TrackPlayer } from '@/components/studio/TrackPlayer'
import { TrackLibrary } from '@/components/studio/TrackLibrary'
import { WubbleSetup } from '@/components/studio/WubbleSetup'

type View = 'generate' | 'library'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [view, setView] = useState<View>('generate')
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [tracksLoading, setTracksLoading] = useState(false)
  const [activeTrack, setActiveTrack] = useState<MusicTrack | null>(null)
  const [generatingTrack, setGeneratingTrack] = useState<MusicTrack | null>(null)

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading, router])

  const loadTracks = useCallback(async () => {
    setTracksLoading(true)
    try {
      const res = await api.getMyTracks()
      setTracks(res.data.tracks)
    } catch (e) { console.error(e) }
    finally { setTracksLoading(false) }
  }, [])

  useEffect(() => {
    if (user) loadTracks()
  }, [user, loadTracks])

  // Poll a generating track until done
  useEffect(() => {
    if (!generatingTrack || generatingTrack.status === 'completed' || generatingTrack.status === 'failed') return
    const interval = setInterval(async () => {
      try {
        const res = await api.pollTrack(generatingTrack._id)
        const updated = res.data.track
        setGeneratingTrack(updated)
        if (updated.status === 'completed' || updated.status === 'failed') {
          clearInterval(interval)
          await loadTracks()
          if (updated.status === 'completed') setActiveTrack(updated)
        }
      } catch (e) { console.error(e) }
    }, 3000)
    return () => clearInterval(interval)
  }, [generatingTrack, loadTracks])

  const handleGenerated = (track: MusicTrack) => {
    setGeneratingTrack(track)
    setTracks(prev => [track, ...prev])
  }

  const handleDelete = async (id: string) => {
    await api.deleteTrack(id)
    setTracks(prev => prev.filter(t => t._id !== id))
    if (activeTrack?._id === id) setActiveTrack(null)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <Music className="w-8 h-8 text-purple-400 animate-pulse" />
    </div>
  )
  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Grid bg */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Music className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-bold tracking-tight">Wubble Studio</span>
        </div>

        {/* Nav tabs */}
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
          <button
            onClick={() => setView('generate')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'generate' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Generate
          </button>
          <button
            onClick={() => setView('library')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'library' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Library className="w-3.5 h-3.5" /> Library
            {tracks.length > 0 && (
              <span className="ml-1 text-xs bg-white/10 px-1.5 py-0.5 rounded-full">{tracks.length}</span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 hidden sm:block">{user.email}</span>
          <Button variant="ghost" size="sm" onClick={logout} className="text-gray-500 hover:text-white hover:bg-white/5 h-8 px-3">
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </nav>

      {/* Main */}
      <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {!user.wubbleApiKey ? (
          <WubbleSetup onProvisioned={() => window.location.reload()} />
        ) : (
          <AnimatePresence mode="wait">
            {view === 'generate' ? (
              <motion.div
                key="generate"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <TrackGenerator onGenerated={handleGenerated} />
                <div className="space-y-4">
                  {/* Active generation status */}
                  {generatingTrack && (generatingTrack.status === 'processing' || generatingTrack.status === 'pending') && (
                    <GeneratingStatus track={generatingTrack} />
                  )}
                  {/* Player for latest completed */}
                  {activeTrack && activeTrack.status === 'completed' && (
                    <TrackPlayer track={activeTrack} />
                  )}
                  {/* Recent tracks preview */}
                  {tracks.filter(t => t.status === 'completed').slice(0, 3).map(t => (
                    <TrackRow key={t._id} track={t} onPlay={() => setActiveTrack(t)} active={activeTrack?._id === t._id} />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="library"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <TrackLibrary
                  tracks={tracks}
                  loading={tracksLoading}
                  activeTrack={activeTrack}
                  onPlay={setActiveTrack}
                  onDelete={handleDelete}
                  onRefresh={loadTracks}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Sticky bottom player */}
      {activeTrack?.audioUrl && (
        <div className="relative z-20 border-t border-white/5 bg-black/60 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6">
            <TrackPlayer track={activeTrack} compact />
          </div>
        </div>
      )}
    </div>
  )
}

function GeneratingStatus({ track }: { track: MusicTrack }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-5 bg-purple-500/10 border border-purple-500/20 rounded-2xl"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
          <Music className="w-4 h-4 text-purple-400 animate-pulse" />
        </div>
        <div>
          <p className="text-white text-sm font-semibold">Generating your track...</p>
          <p className="text-gray-500 text-xs">{track.title}</p>
        </div>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-purple-500/40 rounded-full"
            animate={{ height: [4, Math.random() * 20 + 4, 4] }}
            transition={{ duration: 0.8 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.05 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function TrackRow({ track, onPlay, active }: { track: MusicTrack; onPlay: () => void; active: boolean }) {
  const moodColors: Record<string, string> = {
    energetic: 'text-orange-400', chill: 'text-blue-400', dramatic: 'text-red-400',
    happy: 'text-yellow-400', dark: 'text-gray-400', romantic: 'text-pink-400', epic: 'text-purple-400'
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onPlay}
      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${active ? 'bg-purple-500/15 border-purple-500/30' : 'bg-white/3 border-white/5 hover:bg-white/5'}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-purple-500/30' : 'bg-white/5'}`}>
        <Play className={`w-3.5 h-3.5 ${active ? 'text-purple-400' : 'text-gray-400'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{track.title}</p>
        <p className={`text-xs ${moodColors[track.mood] || 'text-gray-500'}`}>{track.mood} · {track.contentType}</p>
      </div>
      {track.duration && <span className="text-xs text-gray-600">{Math.round(track.duration)}s</span>}
    </motion.div>
  )
}
