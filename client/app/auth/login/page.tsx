'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Music } from 'lucide-react'

type Tab = 'login' | 'signup'

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const router = useRouter()

  const reset = (nextTab: Tab) => {
    setTab(nextTab)
    setError('')
    setEmail('')
    setPassword('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(email, password)
      } else {
        await register(email, password)
      }
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 flex items-center justify-center p-4">
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-3 shadow-lg shadow-purple-500/30">
            <Music className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Wubble Studio</h1>
          <p className="text-gray-400 text-sm mt-1">AI music for your content</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardContent className="p-6">
            {/* Tabs */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-6">
              {(['login', 'signup'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => reset(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    tab === t
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === 'login' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === 'login' ? 10 : -10 }}
                transition={{ duration: 0.15 }}
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  {tab === 'signup' && (
                    <p className="text-center text-sm text-gray-400 -mt-1 mb-2">
                      Create your free account
                    </p>
                  )}

                  {error && (
                    <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/50"
                  />
                  <Input
                    type="password"
                    placeholder={tab === 'signup' ? 'Password (min 6 characters)' : 'Password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={tab === 'signup' ? 6 : undefined}
                    className="h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/50"
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 font-semibold"
                  >
                    {loading
                      ? tab === 'login' ? 'Signing in...' : 'Creating account...'
                      : tab === 'login' ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-5">
                  {tab === 'login' ? (
                    <>No account?{' '}
                      <button onClick={() => reset('signup')} className="text-purple-400 hover:text-purple-300 font-medium">
                        Sign up free
                      </button>
                    </>
                  ) : (
                    <>Already have an account?{' '}
                      <button onClick={() => reset('login')} className="text-purple-400 hover:text-purple-300 font-medium">
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-600 mt-4">
          <Link href="/" className="hover:text-gray-400 transition-colors">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  )
}
