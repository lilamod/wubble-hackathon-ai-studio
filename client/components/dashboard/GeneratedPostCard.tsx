'use client'
import { motion } from 'framer-motion'
import { Copy, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GeneratedPost } from '@/types'

interface Props {
  post: GeneratedPost
}

export function GeneratedPostCard({ post }: Props) {
  const copyPost = async () => {
    await navigator.clipboard.writeText(
      `${post.content}\n\n${post.hashtags?.map((t) => `#${t}`).join(' ')}`
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="group h-full"
    >
      <Card className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-xl border-emerald-400/30 shadow-2xl hover:shadow-emerald-500/20 transition-all group-hover:scale-[1.01] overflow-hidden h-[420px]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              ✨ Your Viral Post
            </CardTitle>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyPost}
                className="h-9 w-9 bg-white/10 hover:bg-white/20 text-white"
                title="Copy post"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 bg-white/10 hover:bg-white/20 text-white"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-500/30">
              {post.tone?.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="border-emerald-400/50 text-emerald-300">
              {post.niche}
            </Badge>
            {post.emoji && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200">
                {post.emoji}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          <div className="min-h-[120px] p-5 bg-black/20 rounded-2xl border border-white/10 hover:bg-black/30 transition-all">
            <p className="text-base leading-relaxed text-white font-medium">
              &quot;{post.content}&quot;
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-mono uppercase tracking-wide">Hashtags</span>
              <div className="flex flex-wrap gap-1">
                {post.hashtags?.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono text-gray-300">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-xs text-gray-500 font-mono uppercase tracking-wide">CTA</span>
              <p className="text-sm font-semibold text-white truncate">{post.cta}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
