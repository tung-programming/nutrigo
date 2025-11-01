"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, MapPin, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

export default function ProfilePage() {
  const supabase = createClientComponentClient()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
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
          // Get user metadata or additional profile data from your database
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          // Get user's session for additional metadata
          const { data: { session } } = await supabase.auth.getSession()
          const userMetadata = session?.user?.user_metadata || {}

          // Set form data from profile or user auth data
          setFormData({
            name: profile?.full_name || userMetadata.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
            email: user.email || '',
            phone: profile?.phone || userMetadata.phone || '',
            location: profile?.location || userMetadata.location || '',
            bio: profile?.bio || userMetadata.bio || '',
          })
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

      // Update both user metadata and profile
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

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      {/* Profile Header */}
      <Card className="p-8 border-border bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            {isLoading ? (
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            ) : (
              <User size={48} className="text-white" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {isLoading ? (
                <div className="h-8 w-48 bg-slate-700 rounded animate-pulse" />
              ) : (
                formData.name || "Set up your profile"
              )}
            </h2>
            <div className="text-muted-foreground text-sm">
              {isLoading ? (
                <div className="h-5 w-32 bg-slate-700 rounded animate-pulse" />
              ) : (
                formData.email
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => !isSaving && setIsEditing(!isEditing)}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
                disabled={isLoading || isSaving}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card className="p-8 border-border bg-card/50 backdrop-blur-sm space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="pl-10 bg-background/50 border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="pl-10 bg-background/50 border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="pl-10 bg-background/50 border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground">
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!isEditing}
                className="pl-10 bg-background/50 border-border"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-foreground">
            Bio
          </Label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-3 rounded-lg bg-background/50 border border-border text-foreground placeholder-muted-foreground disabled:opacity-50"
            rows={4}
          />
        </div>

        {isEditing && (
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground gap-2"
          >
            <Save size={18} /> Save Changes
          </Button>
        )}
      </Card>

      {/* Preferences */}
      <Card className="p-8 border-border bg-card/50 backdrop-blur-sm space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Preferences</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
            <div>
              <p className="font-semibold text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Get updates about your health insights</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
            <div>
              <p className="font-semibold text-foreground">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">Receive weekly nutrition summaries</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
            <div>
              <p className="font-semibold text-foreground">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Always enabled for this account</p>
            </div>
            <input type="checkbox" defaultChecked disabled className="w-5 h-5 rounded cursor-pointer" />
          </div>
        </div>
      </Card>
    </div>
  )
}
