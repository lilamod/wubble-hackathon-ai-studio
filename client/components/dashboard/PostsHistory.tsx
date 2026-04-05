'use client'
import { motion } from 'framer-motion'
import { RefreshCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GeneratedPost } from '@/types'
import { GeneratedPostCard } from './GeneratedPostCard'

interface Props {
  posts: GeneratedPost[]
  onRefresh: () => void
  loading: boolean
}

export function PostsHistory({ posts, onRefresh, loading }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Post History</h3>
          <p className="text-gray-400 text-sm mt-0.5">{posts.length} generated posts</p>
        </div>
        <Button
          variant="ghost"
          onClick={onRefresh}
          disabled={loading}
          className="text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[700px] overflow-y-auto">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <Sparkles className="w-14 h-14 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-1">No posts yet</h3>
            <p className="text-gray-600 text-sm">Generate your first viral post above</p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id || post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
            >
              <GeneratedPostCard post={post} />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
