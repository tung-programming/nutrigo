"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Bell, Lock, Eye } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyReports: true,
    pushNotifications: false,
    darkMode: true,
    dailyReminder: true,
    reminderTime: "09:00",
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof prev[key] === "boolean" ? !prev[key] : prev[key],
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and account settings</p>
      </div>

      {/* Notifications */}
      <Card className="p-6 border-border bg-card/50 backdrop-blur-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Bell size={20} className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Notifications</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
            <div>
              <p className="font-semibold text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Get updates about your health insights</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => handleToggle("emailNotifications")}
              className="w-5 h-5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
            <div>
              <p className="font-semibold text-foreground">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">Receive weekly nutrition summaries</p>
            </div>
            <input
              type="checkbox"
              checked={settings.weeklyReports}
              onChange={() => handleToggle("weeklyReports")}
              className="w-5 h-5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
            <div>
              <p className="font-semibold text-foreground">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Get real-time alerts on your device</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={() => handleToggle("pushNotifications")}
              className="w-5 h-5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
            <div>
              <p className="font-semibold text-foreground">Daily Reminder</p>
              <p className="text-sm text-muted-foreground">Get reminded to scan your meals</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                name="reminderTime"
                value={settings.reminderTime}
                onChange={handleChange}
                disabled={!settings.dailyReminder}
                className="px-2 py-1 rounded bg-background/50 border border-border text-foreground text-sm"
              />
              <input
                type="checkbox"
                checked={settings.dailyReminder}
                onChange={() => handleToggle("dailyReminder")}
                className="w-5 h-5 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6 border-border bg-card/50 backdrop-blur-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <Lock size={20} className="text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Privacy & Security</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border bg-background/50">
            <Label htmlFor="password" className="text-foreground font-semibold">
              Change Password
            </Label>
            <p className="text-sm text-muted-foreground mb-3">Update your account password</p>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
            <div>
              <p className="font-semibold text-foreground">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" className="border-border hover:bg-muted bg-transparent">
              Enable
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
            <div>
              <p className="font-semibold text-foreground">Data Privacy</p>
              <p className="text-sm text-muted-foreground">Manage your data sharing preferences</p>
            </div>
            <Button variant="outline" className="border-border hover:bg-muted bg-transparent">
              Manage
            </Button>
          </div>
        </div>
      </Card>

      {/* Display */}
      <Card className="p-6 border-border bg-card/50 backdrop-blur-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
            <Eye size={20} className="text-secondary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Display</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
            <div>
              <p className="font-semibold text-foreground">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Always enabled for this account</p>
            </div>
            <input type="checkbox" checked={true} disabled className="w-5 h-5 rounded cursor-not-allowed" />
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/30 bg-destructive/5 backdrop-blur-sm space-y-6">
        <h3 className="text-xl font-semibold text-destructive">Danger Zone</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-background/50">
            <div>
              <p className="font-semibold text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex gap-4">
        <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
          Save Changes
        </Button>
        <Button variant="outline" className="border-border hover:bg-muted bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )
}
