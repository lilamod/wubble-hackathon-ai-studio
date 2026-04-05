import { motion } from 'framer-motion'
import { Users, Clock, Hash, Flame } from 'lucide-react'
import { AudienceInsight } from '@/types'

interface Props {
  audience: AudienceInsight | null
  loading: boolean
}

export function AudienceInsights({ audience, loading }: Props) {
  if (!audience || loading) {
    return (
      <motion.div 
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 h-96 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">No Audience Data</h3>
          <p className="text-gray-400">Analyze your Wubble account first</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 col-span-full lg:col-span-1"
    >
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-8 h-8 text-blue-400" />
        <h3 className="text-2xl font-bold text-white">Audience Intelligence</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="group p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
          <div className="text-3xl font-bold text-white mb-2">
            {audience.demographics.reduce((sum, d) => sum + d.percentage, 0).toFixed(0)}%
          </div>
          <div className="text-gray-400 flex items-center gap-2">
            <Flame className="w-4 h-4" />
            Active Users
          </div>
        </div>

        <div className="group p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
          <div className="text-3xl font-bold text-emerald-400 mb-2">
            {audience.peak_times[0] || 'N/A'}
          </div>
          <div className="text-gray-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Peak Time
          </div>
        </div>

        <div className="group p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {audience.interests.length}
          </div>
          <div className="text-gray-400 flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Interests
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Top Interests</h4>
        <div className="flex flex-wrap gap-2">
          {audience.interests.slice(0, 8).map((interest, i) => (
            <span 
              key={i}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                       backdrop-blur-sm rounded-full text-sm text-white border border-white/20 hover:from-purple-500/30"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}