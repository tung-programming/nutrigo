"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, MapPin, Save, Edit2, Bell, Moon, FileText, Sparkles, Crown, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import Link from "next/link"

export default function ProfilePage() {
  const supabase = createClientComponentClient()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentPlan, setCurrentPlan] = useState("nutrigo") // nutrigo, nutriplus, or nutripro
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          toast.error("Failed to load profile")
          return
        }

        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          const { data: { session } } = await supabase.auth.getSession()
          const userMetadata = session?.user?.user_metadata || {}

          setFormData({
            name: profile?.full_name || userMetadata.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
            email: user.email || '',
            phone: profile?.phone || userMetadata.phone || '',
            location: profile?.location || userMetadata.location || '',
            bio: profile?.bio || userMetadata.bio || '',
          })
          
          // Get user's current plan
          setCurrentPlan(profile?.subscription_plan || userMetadata.subscription_plan || 'nutrigo')
        }
      } catch (err) {
        console.error('Error:', err)
        toast.error("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [supabase])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw userError || new Error('No user found')

      const [{ error: metadataError }, { error: profileError }] = await Promise.all([
        supabase.auth.updateUser({
          data: {
            full_name: formData.name,
            phone: formData.phone,
            location: formData.location,
            bio: formData.bio
          }
        }),
        supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: formData.name,
            phone: formData.phone,
            location: formData.location,
            bio: formData.bio,
            updated_at: new Date().toISOString(),
          })
      ])

      if (metadataError) throw metadataError
      if (profileError) throw profileError

      toast.success("Profile updated successfully")
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const plans = {
    nutrigo: { name: 'NutriGo', icon: '🌱', price: 'Free' },
    nutriplus: { name: 'NutriPlus', icon: '🍊', price: '₹249/month' },
    nutripro: { name: 'NutriPro', icon: '🏆', price: '₹499/month' }
  }

  const currentPlanDetails = plans[currentPlan as keyof typeof plans] || plans.nutrigo

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="p-4 md:p-8 lg:p-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/25">
              <User size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Profile Settings
              </h1>
              <p className="text-slate-400 text-lg">Manage your account information</p>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                {isLoading ? (
                  <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                ) : (
                  <User size={48} className="text-white" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center border-2 border-slate-900">
                <Sparkles size={16} className="text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-black text-white">
                {isLoading ? (
                  <div className="h-8 w-48 bg-slate-700 rounded animate-pulse" />
                ) : (
                  formData.name || "Set up your profile"
                )}
              </h2>
              <div className="text-slate-400 text-sm">
                {isLoading ? (
                  <div className="h-5 w-32 bg-slate-700 rounded animate-pulse" />
                ) : (
                  formData.email
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => !isSaving && setIsEditing(!isEditing)}
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0"
                  disabled={isLoading || isSaving}
                >
                  <Edit2 size={16} className="mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Form */}
        <Card className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-teal-500/20 shadow-xl space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-white">Personal Information</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300 font-semibold">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-500" size={18} />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="pl-10 h-12 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-xl disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="pl-10 h-12 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-xl disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300 font-semibold">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-slate-500" size={18} />
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="pl-10 h-12 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-xl disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-300 font-semibold">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="pl-10 h-12 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-xl disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-slate-300 font-semibold">
              Bio
            </Label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 disabled:opacity-50 transition-all"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>

          {isEditing && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save size={18} />
                  Save Changes
                </div>
              )}
            </Button>
          )}
        </Card>

        {/* Preferences */}
        <Card className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/20 shadow-xl space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-white">Preferences</h3>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Bell,
                title: "Email Notifications",
                description: "Get updates about your health insights",
                checked: true
              },
              {
                icon: FileText,
                title: "Weekly Reports",
                description: "Receive weekly nutrition summaries",
                checked: true
              },
              {
                icon: Moon,
                title: "Dark Mode",
                description: "Always enabled for this account",
                checked: true,
                disabled: true
              }
            ].map((pref, idx) => (
              <div key={idx} className="group flex items-center justify-between p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-emerald-500/40 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    <pref.icon size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{pref.title}</p>
                    <p className="text-sm text-slate-400">{pref.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    defaultChecked={pref.checked}
                    disabled={pref.disabled}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 disabled:opacity-50"></div>
                </label>
              </div>
            ))}
          </div>
        </Card>

        {/* Compact Subscription Section - At Bottom */}
        {currentPlan !== 'nutripro' && (
          <Card className="p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-xl border border-amber-500/30 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Crown size={24} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-black text-white">Current Plan:</span>
                    <span className="text-lg font-black text-amber-400">{currentPlanDetails.icon} {currentPlanDetails.name}</span>
                  </div>
                  <p className="text-sm text-slate-400">Upgrade to unlock unlimited scans and advanced features</p>
                </div>
              </div>
              <Link href="/pricing">
                <Button className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 text-white font-bold px-6 py-3 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 border-0 whitespace-nowrap">
                  Upgrade Now
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Already on Premium Plan */}
        {currentPlan === 'nutripro' && (
          <Card className="p-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-xl border border-emerald-500/30 shadow-xl">
            <div className="flex items-center justify-center gap-3">
              <Sparkles size={24} className="text-emerald-400" />
              <p className="text-lg font-bold text-emerald-400">You're on the best plan! 🎉</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
