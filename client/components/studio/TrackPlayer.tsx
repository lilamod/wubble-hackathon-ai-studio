'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Download, Volume2, VolumeX } from 'lucide-react'
import { MusicTrack } from '@/types'

const moodColors: Record<string, string> = {
  energetic: 'from-orange-500 to-yellow-500',
  chill: 'from-blue-500 to-cyan-500',
  dramatic: 'from-red-500 to-rose-500',
  happy: 'from-yellow-400 to-green-400',
  dark: 'from-gray-600 to-gray-800',
  romantic: 'from-pink-500 to-rose-400',
  epic: 'from-purple-500 to-indigo-500',
}

interface Props {
  track: MusicTrack
  compact?: boolean
}

export function TrackPlayer({ track, compact = false }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)

  const gradient = moodColors[track.mood] || 'from-purple-500 to-pink-500'

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress((audio.currentTime / audio.duration) * 100 || 0)
    const onLoad = () => setDuration(audio.duration)
    const onEnd = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoad)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoad)
      audio.removeEventListener('ended', onEnd)
    }
  }, [track.audioUrl])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * audio.duration
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !muted
    setMuted(!muted)
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  if (compact) {
    return (
      <div className="flex items-center gap-4 py-3">
        {track.audioUrl && <audio ref={audioRef} src={track.audioUrl} preload="metadata" />}
        <button onClick={togglePlay} className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg`}>
          {playing ? <Pause className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 text-white ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{track.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer" onClick={seek}>
              <div className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all`} style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-gray-500 shrink-0">{duration ? fmt(duration) : '--:--'}</span>
          </div>
        </div>
        <button onClick={toggleMute} className="text-gray-500 hover:text-white transition-colors">
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        {track.audioUrl && (
          <a href={track.audioUrl} download className="text-gray-500 hover:text-white transition-colors">
            <Download className="w-4 h-4" />
          </a>
        )}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden"
    >
      {track.audioUrl && <audio ref={audioRef} src={track.audioUrl} preload="metadata" />}

      {/* Header gradient bar */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white font-semibold">{track.title}</p>
            <p className="text-gray-500 text-xs mt-0.5 capitalize">{track.mood} · {track.contentType}</p>
          </div>
          {track.audioUrl && (
            <a href={track.audioUrl} download className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <Download className="w-4 h-4 text-gray-400" />
            </a>
          )}
        </div>

        {/* Animated waveform bars */}
        <div className="flex items-center gap-0.5 h-12 mb-4">
          {Array.from({ length: 40 }).map((_, i) => {
            const barProgress = (i / 40) * 100
            const active = barProgress <= progress
            return (
              <motion.div
                key={i}
                className={`flex-1 rounded-full ${active ? `bg-gradient-to-t ${gradient}` : 'bg-white/10'}`}
                animate={playing ? { height: [4, Math.random() * 36 + 4, 4] } : { height: 4 }}
                transition={{ duration: 0.6 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.03 }}
              />
            )
          })}
        </div>

        {/* Seek bar */}
        <div className="h-1.5 bg-white/8 rounded-full cursor-pointer mb-3 group" onClick={seek}>
          <div className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all relative`} style={{ width: `${progress}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
          <span>{audioRef.current ? fmt(audioRef.current.currentTime) : '0:00'}</span>
          <span>{duration ? fmt(duration) : '--:--'}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button onClick={toggleMute} className="p-2 text-gray-500 hover:text-white transition-colors">
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={togglePlay}
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg hover:scale-105 transition-transform`}
          >
            {playing ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
          </button>

          <input
            type="range" min={0} max={1} step={0.05} value={volume}
            onChange={e => { const v = parseFloat(e.target.value); setVolume(v); if (audioRef.current) audioRef.current.volume = v }}
            className="w-16 accent-purple-500"
          />
        </div>
      </div>
    </motion.div>
  )
}
