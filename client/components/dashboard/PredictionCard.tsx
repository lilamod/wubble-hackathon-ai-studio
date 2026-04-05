'use client'
import { motion } from 'framer-motion'
import { TrendingUp, Target, Clock, Percent, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  prediction: any
}

export function PredictionCard({ prediction }: Props) {
  const viralProbability = Math.round(prediction.viralProbability || 0)
  const engagementScore = Math.round(prediction.engagementScore || 0)

  const getViralBadge = (probability: number) => {
    if (probability > 80) return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
    if (probability > 60) return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
    return 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border-indigo-400/30 shadow-2xl h-[420px]">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
            <CardTitle className="text-xl font-black text-white">
              AI Prediction
            </CardTitle>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge className={`px-4 py-2 text-lg font-bold ${getViralBadge(viralProbability)} shadow-lg`}>
              {viralProbability}% Viral Chance
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-white/5 rounded-xl group hover:bg-white/10 transition-all">
              <div className="text-2xl font-black text-emerald-400 mb-1 group-hover:scale-110 transition-transform">
                {prediction.predictedLikes?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Likes</div>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-xl group hover:bg-white/10 transition-all">
              <div className="text-2xl font-black text-blue-400 mb-1 group-hover:scale-110 transition-transform">
                {prediction.predictedComments?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Comments</div>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-xl group hover:bg-white/10 transition-all">
              <div className="text-2xl font-black text-purple-400 mb-1 group-hover:scale-110 transition-transform">
                {prediction.predictedShares?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Shares</div>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-xl group hover:bg-white/10 transition-all">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Percent className="w-6 h-6 text-white font-bold" />
              </div>
              <div className="text-sm font-bold text-white mb-1">{engagementScore}%</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Engagement</div>
            </div>
          </div>

          {/* Best Time */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Best Post Time</span>
            </div>
            <div className="text-2xl font-black text-white">
              {prediction.bestPostTime || '6:00 PM'}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}