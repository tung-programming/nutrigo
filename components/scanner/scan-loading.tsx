"use client"

import React from "react"
import { Spinner } from "@/components/ui/spinner"
import { Sparkles } from "lucide-react"

export interface ScanLoadingProps {
  open: boolean
  message?: string
  submessage?: string
  onCancel?: () => void
}

export default function ScanLoading({ open, message = "Analyzing image...", submessage = "AI is processing your image", onCancel }: ScanLoadingProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-linear-to-br from-slate-900/70 to-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-[92%] sm:max-w-md rounded-2xl bg-linear-to-br from-slate-900/90 to-slate-800/90 border border-emerald-500/20 shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center">
        <div className="absolute -top-8 flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-emerald-400 to-teal-400 shadow-lg">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>

        <div className="mt-6 mb-4 flex items-center gap-4">
          <div className="p-2 rounded-full bg-slate-900/50">
            <Spinner className="w-12 h-12 text-emerald-400" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white">{message}</h3>
            <p className="text-sm text-emerald-300 mt-1">{submessage}</p>
          </div>
        </div>

        <div className="mt-2 w-full">
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 animate-progress" style={{ width: "40%" }} />
          </div>
          <p className="text-xs text-slate-400 mt-3">This may take a few seconds — do not close the tab.</p>
        </div>

        {onCancel && (
          <button
            className="mt-6 px-6 py-2 rounded-full bg-transparent border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>

      <style jsx>{`
        .animate-progress {
          animation: progress 3s linear infinite;
        }

        @keyframes progress {
          0% { width: 0%; }
          50% { width: 60%; }
          100% { width: 0%; }
        }
      `}</style>
    </div>
  )
}
