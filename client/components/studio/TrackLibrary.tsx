'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Trash2, RefreshCw, Music, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MusicTrack, Mood, ContentType } from '@/types'

const moodColors: Record<string, string> = {
  energetic: 'from-orange-500 to-yellow-500',
  chill: 'from-blue-500 to-cyan-500',
  dramatic: 'from-red-500 to-rose-500',
  happy: 'from-yellow-400 to-green-400',
  dark: 'from-gray-600 to-gray-700',
  romantic: 'from-pink-500 to-rose-400',
  epic: 'from-purple-500 to-indigo-500',
}

const moodBadge: Record<string, string> = {
  energetic: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  chill: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  dramatic: 'bg-red-500/15 text-red-300 border-red-500/30',
  happy: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  dark: 'bg-gray-500/15 text-gray-300 border-gray-500/30',
  romantic: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  epic: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
}

const statusBadge: Record<string, string> = {
  completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  processing: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  pending: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  failed: 'bg-red-500/15 text-red-400 border-red-500/30',
}

interface Props {
  tracks: MusicTrack[]
  loading: boolean
  activeTrack: MusicTrack | null
  onPlay: (track: MusicTrack) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}

export function TrackLibrary({ tracks, loading, activeTrack, onPlay, onDelete, onRefresh }: Props) {
  const [filter, setFilter] = useState<Mood | ContentType | 'all'>('all')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const moods: Mood[] = ['energetic', 'chill', 'dramatic', 'happy', 'dark', 'romantic', 'epic']
  const types: ContentType[] = ['reel', 'story', 'youtube', 'podcast', 'ad']

  const filtered = filter === 'all'
    ? tracks
    : tracks.filter(t => t.mood === filter || t.contentType === filter)

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">Your Library</h2>
          <p className="text-gray-500 text-sm">{tracks.length} track{tracks.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading}
          className="text-gray-500 hover:text-white hover:bg-white/5 h-8">
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${filter === 'all' ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'border-white/8 text-gray-500 hover:text-gray-300'}`}
        >
          All
        </button>
        {moods.map(m => (
          <button key={m} onClick={() => setFilter(m)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all capitalize ${filter === m ? moodBadge[m] : 'border-white/8 text-gray-500 hover:text-gray-300'}`}>
            {m}
          </button>
        ))}
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all capitalize ${filter === t ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'border-white/8 text-gray-500 hover:text-gray-300'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Track list */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <Music className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No tracks yet</p>
          <p className="text-gray-600 text-sm mt-1">Generate your first track in the Studio tab</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((track, i) => {
              const isActive = activeTrack?._id === track._id
              const gradient = moodColors[track.mood] || 'from-purple-500 to-pink-500'
              return (
                <motion.div
                  key={track._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${isActive ? 'bg-purple-500/10 border-purple-500/25' : 'bg-white/2 border-white/5 hover:bg-white/4 hover:border-white/10'}`}
                >
                  {/* Play button */}
                  <button
                    onClick={() => track.status === 'completed' && onPlay(track)}
                    disabled={track.status !== 'completed'}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${track.status === 'completed' ? `bg-gradient-to-br ${gradient} hover:scale-105 shadow-md` : 'bg-white/5 cursor-not-allowed'}`}
                  >
                    {track.status === 'processing' || track.status === 'pending' ? (
                      <Music className="w-4 h-4 text-gray-400 animate-pulse" />
                    ) : isActive ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    )}
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white text-sm font-medium truncate">{track.title}</p>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${statusBadge[track.status]}`}>
                        {track.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${moodBadge[track.mood] || ''}`}>{track.mood}</span>
                      <span className="text-gray-600 text-xs capitalize">{track.contentType}</span>
                      {track.duration && <span className="text-gray-600 text-xs">{fmt(track.duration)}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {track.audioUrl && (
                      <a href={track.audioUrl} download
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {confirmDelete === track._id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => { onDelete(track._id); setConfirmDelete(null) }}
                          className="px-2 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all">
                          Delete
                        </button>
                        <button onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 text-xs bg-white/5 text-gray-400 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(track._id)}
                        className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
