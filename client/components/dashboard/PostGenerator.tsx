'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AudienceInsight } from '@/types'

interface Props {
  audience: AudienceInsight | null
  onGenerate: (niche: string) => void
  loading: boolean
}

const niches = [
  { value: 'fitness', label: '💪 Fitness' },
  { value: 'tech', label: '💻 Tech' },
  { value: 'business', label: '📈 Business' },
  { value: 'lifestyle', label: '✨ Lifestyle' },
  { value: 'gaming', label: '🎮 Gaming' },
  { value: 'general', label: '🌐 General' },
]

export function PostGenerator({ audience, onGenerate, loading }: Props) {
  const [selectedNiche, setSelectedNiche] = useState('general')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 h-[420px] flex flex-col"
    >
      <CardHeader className="p-0 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl border border-yellow-400/20">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              AI Post Generator
            </CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Create viral content in seconds</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col justify-between">
        {!audience ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium mb-1">Analyze your audience first</p>
            <p className="text-sm text-gray-600">Enter your Wubble Account ID above</p>
          </div>
        ) : (
          <>
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/20 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Play className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Audience ready</p>
                  <p className="text-xs text-gray-400">
                    Optimized for {audience.interests?.[0] || 'your audience'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Select value={selectedNiche} onValueChange={setSelectedNiche} disabled={loading}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-11 focus:ring-purple-500/50">
                  <SelectValue placeholder="Choose content niche" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/20">
                  {niches.map((niche) => (
                    <SelectItem
                      key={niche.value}
                      value={niche.value}
                      className="text-white hover:bg-white/10 focus:bg-white/10"
                    >
                      {niche.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => onGenerate(selectedNiche)}
                disabled={!audience || loading}
                size="lg"
                className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold shadow-xl hover:shadow-purple-500/25 transition-all duration-300 group border-0"
              >
                <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                {loading ? 'Generating...' : 'Generate Viral Post'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </motion.div>
  )
}
