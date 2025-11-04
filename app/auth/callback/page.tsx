"use client"

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [error, setError] = useState<string>("")
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // ✅ CRITICAL FIX: Let Supabase handle the entire callback automatically
        // This handles PKCE flow properly
        const { data, error: authError } = await supabase.auth.getSession()

        if (authError) {
          console.error('Auth error:', authError)
          setError(authError.message)
          setStatus('error')
          setTimeout(() => router.push('/auth/login'), 3000)
          return
        }

        if (data.session) {
          // ✅ Session exists - successful login!
          setStatus('success')
          
          setTimeout(() => {
            router.push('/dashboard')
            router.refresh()
          }, 1500)
        } else {
          // No session found
          setError("No session found. Please try logging in again.")
          setStatus('error')
          setTimeout(() => router.push('/auth/login'), 3000)
        }
      } catch (err: any) {
        console.error('Unexpected error:', err)
        setError(err.message || "Authentication failed")
        setStatus('error')
        setTimeout(() => router.push('/auth/login'), 3000)
      }
    }

    handleCallback()
  }, [router, supabase])

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
            <AlertCircle size={48} className="text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Authentication Failed</h2>
            <p className="text-red-400 text-sm">{error}</p>
            <p className="text-slate-400 text-xs">Redirecting to login...</p>
          </div>
          <div className="w-16 h-16 mx-auto border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
            <CheckCircle2 size={48} className="text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Authentication Successful!</h2>
            <p className="text-slate-400">Redirecting to dashboard...</p>
          </div>
          <div className="w-16 h-16 mx-auto border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  // Loading state
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center animate-pulse">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Authenticating...</h2>
          <p className="text-slate-400">Please wait while we log you in</p>
        </div>
      </div>
    </div>
  )
}