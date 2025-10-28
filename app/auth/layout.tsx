"use client"

import type React from "react"

import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">NG</span>
          </div>
          <span className="font-bold text-xl text-foreground">NutriGo</span>
        </Link>

        {/* Auth Form */}
        <div className="relative p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">{children}</div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <Link href="#" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
