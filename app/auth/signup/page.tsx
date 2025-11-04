"use client"

import { supabase } from "@/lib/supabaseClient"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHappy, setIsHappy] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const [stars] = useState(() => {
    if (typeof window === 'undefined') return []
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.7 + 0.3,
    }))
  })

  useEffect(() => {
    setIsMounted(true)

    // ✅ OAuth redirect handling with duplicate user detection
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, 'Session:', session)

      if (event === 'SIGNED_IN' && session) {
        try {
          const user = session.user
          
          // ✅ Check if email is confirmed
          if (!user.email_confirmed_at) {
            console.log('Email not confirmed yet, signing out')
            setError("Please verify your email address before accessing the dashboard.")
            await supabase.auth.signOut()
            setIsLoading(false)
            return
          }

          // ✅ Check if user already existed (was created more than 5 seconds ago)
          const userCreationTime = new Date(user.created_at).getTime()
          const now = new Date().getTime()
          const isNewUser = (now - userCreationTime) < 5000 // 5 seconds window for new user

          if (!isNewUser) {
            // ✅ User already registered - show error popup and redirect to login
            console.log('User already registered, showing error popup')
            setShowErrorPopup(true)
            await supabase.auth.signOut()
            
            setTimeout(() => {
              router.push('/auth/login')
            }, 3000)
            return
          }

          // ✅ New user - show success popup
          console.log('New user signed up successfully via OAuth')
          setShowSuccessPopup(true)
          
          // Sign out the user so they can log in properly
          await supabase.auth.signOut()
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
          
        } catch (err) {
          console.error('Error handling auth state change:', err)
          setError("An error occurred during authentication. Please try again.")
          await supabase.auth.signOut()
          setIsLoading(false)
        }
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && !isPasswordFocused && !isConfirmPasswordFocused) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isPasswordFocused, isConfirmPasswordFocused])

  useEffect(() => {
    if (formData.name && formData.email && formData.password && formData.confirmPassword) {
      setIsHappy(true)
    } else {
      setIsHappy(false)
    }
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
    setSuccess("")
  }

  // ✅ Enhanced manual sign-up with duplicate detection
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Basic form validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required")
      setIsLoading(false)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { 
            full_name: formData.name,
            display_name: formData.name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        // ✅ Handle duplicate email error
        if (signUpError.message.includes('already registered') || 
            signUpError.message.includes('User already registered')) {
          setShowErrorPopup(true)
          setIsLoading(false)
          
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
          return
        } else {
          setError(signUpError.message)
          setIsLoading(false)
          return
        }
      }

      if (data.user) {
        // ✅ Check if user already exists (no new identity created)
        if (data.user.identities && data.user.identities.length === 0) {
          setShowErrorPopup(true)
          setIsLoading(false)
          
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
          return
        }

        // ✅ New user created successfully - show success popup
        setShowSuccessPopup(true)
        
        // Clear form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      }

      setIsLoading(false)
    } catch (err: any) {
      console.error('Unexpected error during sign-up:', err)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // ✅ Google sign-up
  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/signup` || `${process.env.REDIRECT_URL}/auth/signup`,
        scopes: 'email profile',
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  const calculateEyePosition = (centerX: number, centerY: number) => {
    if (isPasswordFocused || isConfirmPasswordFocused) return { x: 0, y: 0 }
    
    const deltaX = mousePosition.x - centerX
    const deltaY = mousePosition.y - centerY
    const angle = Math.atan2(deltaY, deltaX)
    const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 60, 3)
    
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    }
  }

  const areEyesClosed = isPasswordFocused || isConfirmPasswordFocused

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* ✅ Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-emerald-500/20 animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-in zoom-in duration-500 delay-100">
                <CheckCircle2 size={48} className="text-emerald-400 animate-in zoom-in duration-500 delay-200" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Account Created! 🎉</h2>
                <p className="text-slate-300 text-sm">
                  Your account has been successfully created.
                </p>
                <p className="text-emerald-400 text-sm font-semibold">
                  Please log in to continue.
                </p>
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                  <span>Redirecting to login page...</span>
                </div>
              </div>

              <Button
                onClick={() => router.push('/auth/login')}
                className="mt-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-semibold px-6 py-2 rounded-lg shadow-lg shadow-emerald-500/25 transition-all duration-300"
              >
                Go to Login Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Error Popup Modal for Duplicate User */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-red-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-red-500/20 animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center animate-in zoom-in duration-500 delay-100">
                <AlertCircle size={48} className="text-red-400 animate-in zoom-in duration-500 delay-200" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Already Registered!</h2>
                <p className="text-slate-300 text-sm">
                  This email is already registered with us.
                </p>
                <p className="text-red-400 text-sm font-semibold">
                  Please log in to continue.
                </p>
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                  <span>Redirecting to login page...</span>
                </div>
              </div>

              <Button
                onClick={() => router.push('/auth/login')}
                className="mt-4 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 hover:from-red-400 hover:via-orange-400 hover:to-red-500 text-white font-semibold px-6 py-2 rounded-lg shadow-lg shadow-red-500/25 transition-all duration-300"
              >
                Go to Login Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button - Fixed Position */}
      <Link 
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all duration-300 backdrop-blur-sm group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-sm font-medium">Back</span>
      </Link>

      {/* Animated Background with Stars */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        
        {isMounted && stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes sway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          33% { transform: translateX(2px) rotate(1deg); }
          66% { transform: translateX(-2px) rotate(-1deg); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-0 items-center relative z-10">
        {/* Left Side - Animated Characters (keep all existing characters) */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-l-3xl border-l border-t border-b border-emerald-500/20 p-12 relative overflow-visible h-[700px]">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `radial-gradient(circle, #34d399 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-[420px] h-[380px]">
              
              {/* Character 1: Orange Semicircle */}
              <div 
                className="absolute bottom-0 left-0 w-48 h-28 bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-full shadow-2xl transition-all duration-500 z-40 flex flex-col items-center pt-7"
                style={{
                  transform: `translateY(${isHappy ? '-15px' : '0'})`,
                  animation: 'sway 4s ease-in-out infinite, breathe 3s ease-in-out infinite',
                }}
              >
                <div className="flex gap-7">
                  <div className="w-5 h-5 bg-slate-900 rounded-full relative overflow-hidden transition-all duration-300">
                    {areEyesClosed ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-white rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(100, 350).x * 3}px, ${1 + calculateEyePosition(100, 350).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="w-5 h-5 bg-slate-900 rounded-full relative overflow-hidden transition-all duration-300">
                    {areEyesClosed ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-white rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(100, 350).x * 3}px, ${1 + calculateEyePosition(100, 350).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                </div>
                <div 
                  className={`transition-all duration-500 mt-4 ${
                    isHappy ? 'w-16 h-3 border-b-[3px] border-slate-900 rounded-b-full' : 'w-14 h-2 bg-slate-900 rounded-full'
                  }`}
                ></div>
              </div>

              {/* Character 2: Purple Rectangle */}
              <div 
                className="absolute bottom-0 left-20 w-32 h-80 bg-gradient-to-b from-purple-500 to-purple-600 rounded-t-3xl shadow-2xl transition-all duration-500 z-10 flex flex-col items-center pt-8"
                style={{
                  transform: `translateY(${isHappy ? '-20px' : '0'})`,
                  animation: 'sway 5s ease-in-out infinite 0.5s, breathe 4s ease-in-out infinite',
                }}
              >
                <div className="flex gap-5 mt-2">
                  <div className="w-5 h-5 bg-white rounded-full relative overflow-hidden transition-all duration-300">
                    {areEyesClosed ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-slate-900 rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(180, 240).x * 3}px, ${1 + calculateEyePosition(180, 240).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="w-5 h-5 bg-white rounded-full relative overflow-hidden transition-all duration-300">
                    {areEyesClosed ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-slate-900 rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(180, 240).x * 3}px, ${1 + calculateEyePosition(180, 240).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                </div>
                <div 
                  className={`transition-all duration-500 mt-4 ${
                    isHappy ? 'w-12 h-2 bg-white rounded-full' : 'w-10 h-1 bg-white rounded-full'
                  }`}
                ></div>
              </div>

              {/* Character 3: WHITE Rectangle */}
              <div 
                className="absolute bottom-0 left-36 w-36 h-40 bg-gradient-to-b from-white to-gray-100 rounded-t-3xl shadow-2xl border-2 border-gray-200 transition-all duration-500 z-20 flex flex-col items-center pt-16"
                style={{
                  transform: `translateY(${isHappy ? '-16px' : '0'})`,
                  animation: 'sway 4.5s ease-in-out infinite 1s, breathe 3.5s ease-in-out infinite',
                }}
              >
                <div className="flex gap-5">
                  <div className="w-5 h-5 bg-slate-900 rounded-full relative overflow-hidden transition-all duration-300">
                    {areEyesClosed ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-white rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(270, 320).x * 3}px, ${1 + calculateEyePosition(270, 320).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="w-5 h-5 bg-slate-900 rounded-full relative overflow-hidden transition-all duration-300">
                    {areEyesClosed ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-white rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(270, 320).x * 3}px, ${1 + calculateEyePosition(270, 320).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                </div>
                <div 
                  className={`transition-all duration-500 mt-5 ${
                    isHappy ? 'w-12 h-2 bg-slate-900 rounded-full' : 'w-10 h-1 bg-slate-900 rounded-full'
                  }`}
                ></div>
              </div>

              {/* Character 4: Yellow */}
              <div 
                className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-3xl shadow-2xl transition-all duration-500 z-30 flex flex-col items-center pt-10"
                style={{
                  transform: `translateY(${isHappy ? '-14px' : '0'})`,
                  animation: 'sway 3.5s ease-in-out infinite 1.5s, breathe 3s ease-in-out infinite',
                }}
              >
                <div className="flex gap-5">
                  <div className="w-5 h-5 bg-slate-900 rounded-full relative overflow-hidden transition-all duration-300">
                    {areEyesClosed ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-yellow-200 rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(380, 340).x * 3}px, ${1 + calculateEyePosition(380, 340).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="w-5 h-5 bg-slate-900 rounded-full relative overflow-hidden transition-all duration-300">
                    {areEyesClosed ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-yellow-200 rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(380, 340).x * 3}px, ${1 + calculateEyePosition(380, 340).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                </div>
                <div 
                  className={`transition-all duration-500 mt-5 ${
                    isHappy ? 'w-14 h-2 border-b-[3px] border-slate-900 rounded-b-full' : 'w-12 h-1 bg-slate-900 rounded-full'
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-r-3xl lg:rounded-l-none rounded-3xl border border-emerald-500/20 p-8 shadow-2xl h-[700px] flex flex-col justify-center">
          <div className="space-y-4 max-w-md mx-auto w-full">
            <div className="text-center space-y-1 mb-4">
              <h1 className="text-2xl font-black text-white">Create Account</h1>
              <p className="text-slate-400 text-xs">Join NutriGo today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="name" className="text-slate-300 text-xs">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-10 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg text-sm"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-slate-300 text-xs">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-10 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg text-sm"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-slate-300 text-xs">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    className="h-10 pr-10 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-slate-300 text-xs">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setIsConfirmPasswordFocused(true)}
                    onBlur={() => setIsConfirmPasswordFocused(false)}
                    className="h-10 pr-10 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/25 transition-all duration-300 border-0 mt-3 text-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </div>
                )}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 text-[10px] text-slate-500 bg-slate-900">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 border border-slate-700 hover:border-slate-600 bg-slate-800/30 hover:bg-slate-800/50 text-white rounded-lg transition-all text-sm flex items-center justify-center"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign up with Google</span>
              </Button>
            </form>

            <p className="text-center text-xs text-slate-400 pt-2">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
