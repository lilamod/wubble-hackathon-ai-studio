'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Music, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MusicTrack, Mood, ContentType } from '@/types'
import { api } from '@/lib/api'

const moods: { value: Mood; label: string; emoji: string; color: string }[] = [
  { value: 'energetic', label: 'Energetic', emoji: '⚡', color: 'border-orange-500/40 bg-orange-500/10 text-orange-300' },
  { value: 'chill', label: 'Chill', emoji: '🌊', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
  { value: 'dramatic', label: 'Dramatic', emoji: '🎭', color: 'border-red-500/40 bg-red-500/10 text-red-300' },
  { value: 'happy', label: 'Happy', emoji: '✨', color: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300' },
  { value: 'dark', label: 'Dark', emoji: '🌑', color: 'border-gray-500/40 bg-gray-500/10 text-gray-300' },
  { value: 'romantic', label: 'Romantic', emoji: '🌸', color: 'border-pink-500/40 bg-pink-500/10 text-pink-300' },
  { value: 'epic', label: 'Epic', emoji: '🏔️', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
]

const contentTypes: { value: ContentType; label: string; emoji: string; duration: string }[] = [
  { value: 'reel', label: 'Reel', emoji: '📱', duration: '15–30s' },
  { value: 'story', label: 'Story', emoji: '⭕', duration: '10–15s' },
  { value: 'youtube', label: 'YouTube', emoji: '▶️', duration: '60–120s' },
  { value: 'podcast', label: 'Podcast', emoji: '🎙️', duration: '30–60s' },
  { value: 'ad', label: 'Ad', emoji: '📣', duration: '15–30s' },
]

interface Props {
  onGenerated: (track: MusicTrack) => void
}

export function TrackGenerator({ onGenerated }: Props) {
  const [prompt, setPrompt] = useState('')
  const [mood, setMood] = useState<Mood>('energetic')
  const [contentType, setContentType] = useState<ContentType>('reel')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [tempo, setTempo] = useState('')
  const [instruments, setInstruments] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await api.generateTrack({ prompt, mood, contentType, tempo: tempo || undefined, instruments: instruments || undefined })
      onGenerated(res.data.track)
      setPrompt('')
    } catch (e: any) {
      setError(e.message || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const selectedMood = moods.find(m => m.value === mood)!
  const selectedType = contentTypes.find(c => c.value === contentType)!

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <h2 className="text-white font-bold">Generate Track</h2>
          <p className="text-gray-500 text-xs">Describe your content, get a custom soundtrack</p>
        </div>
      </div>

      {/* Prompt */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Describe your content</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. A morning workout montage with fast cuts and high energy..."
          rows={3}
          className="w-full bg-black/30 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 resize-none focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
        />
      </div>

      {/* Mood */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Mood</label>
        <div className="flex flex-wrap gap-2">
          {moods.map(m => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${mood === m.value ? m.color : 'border-white/8 bg-white/3 text-gray-500 hover:text-gray-300 hover:border-white/15'}`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content type */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Format</label>
        <div className="grid grid-cols-5 gap-2">
          {contentTypes.map(c => (
            <button
              key={c.value}
              onClick={() => setContentType(c.value)}
              className={`p-2.5 rounded-xl border text-center transition-all ${contentType === c.value ? 'border-purple-500/40 bg-purple-500/15' : 'border-white/8 bg-white/3 hover:border-white/15'}`}
            >
              <div className="text-lg mb-1">{c.emoji}</div>
              <div className={`text-xs font-medium ${contentType === c.value ? 'text-purple-300' : 'text-gray-500'}`}>{c.label}</div>
              <div className="text-xs text-gray-600">{c.duration}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          Advanced options
        </button>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-2 gap-3 mt-3"
          >
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tempo (BPM)</label>
              <Input
                value={tempo}
                onChange={e => setTempo(e.target.value)}
                placeholder="e.g. 128"
                className="bg-black/30 border-white/8 text-white text-sm h-9 placeholder:text-gray-600 focus-visible:ring-purple-500/30"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Instruments</label>
              <Input
                value={instruments}
                onChange={e => setInstruments(e.target.value)}
                placeholder="e.g. guitar, synth"
                className="bg-black/30 border-white/8 text-white text-sm h-9 placeholder:text-gray-600 focus-visible:ring-purple-500/30"
              />
            </div>
          </motion.div>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-xs p-3 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</p>
      )}

      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white border-0 font-semibold"
      >
        <Music className="w-4 h-4 mr-2" />
        {loading ? 'Sending to Wubble AI...' : 'Generate Track'}
      </Button>

      {/* Summary pill */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
        <span className={`px-2 py-0.5 rounded-full border ${selectedMood.color}`}>{selectedMood.emoji} {selectedMood.label}</span>
        <span>·</span>
        <span className="text-gray-500">{selectedType.emoji} {selectedType.label} ({selectedType.duration})</span>
      </div>
    </motion.div>
  )
}
