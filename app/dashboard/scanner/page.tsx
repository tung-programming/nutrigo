"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X, Sparkles, Zap, CheckCircle } from "lucide-react"
import ScanResult from "@/components/scanner/scan-result"
import ScanLoadingPortal from "@/components/scanner/scan-loading-portal"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface ScanData {
  name: string
  brand: string
  healthScore: number
  calories: number
  sugar: number
  protein: number
  fat: number
  carbs: number
  ingredients: string[]
  warnings: string[]
  timestamp: string
  productName?: string
  detected_name?: string
  product_name?: string
}

export default function ScannerPage() {
  const supabase = createClientComponentClient()
  const [scanMode, setScanMode] = useState<"camera" | "upload" | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const SCAN_API_URL = "/api/scan/image"
  const HISTORY_API_URL = "/api/scans"

  // ✅ Reset scanner state whenever you open this page
  useEffect(() => {
    try {
      localStorage.removeItem("lastScan")
      localStorage.removeItem("scanData")
      sessionStorage.removeItem("lastScan")
      setScanResult(null)
      setScanMode(null)
    } catch (err) {
      console.warn("Could not clear old scan data:", err)
    }
  }, [])

  // 🔑 Helper to get current user ID
  const getCurrentUserId = async (): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id) return user.id
    } catch {}
    if (typeof window !== "undefined") {
      const keys = ["nutrigo_current_user", "currentUser", "user"]
      for (const key of keys) {
        const raw = localStorage.getItem(key)
        if (!raw) continue
        try {
          const parsed = JSON.parse(raw)
          if (parsed?.id) return parsed.id
        } catch {
          if (raw.startsWith("user_") || raw.length > 6) return raw
        }
      }
    }
    return null
  }

  const saveScanToHistory = async (dataToSave: ScanData) => {
    if (isSaving) return
    setIsSaving(true)
    console.log("Attempting to save scan to history:", dataToSave)

    try {
      const resolvedName =
        dataToSave.productName ||
        dataToSave.name ||
        dataToSave.product_name ||
        dataToSave.detected_name ||
        dataToSave.brand ||
        ""

      const userId = await getCurrentUserId()
      if (!userId) {
        console.warn("⚠️ No userId found — scan not linked to any account.")
        localStorage.setItem("lastScan", JSON.stringify(dataToSave))
        return
      }

      const payload = {
        userId,
        productName: resolvedName,
        brand: dataToSave.brand || "",
        healthScore: dataToSave.healthScore,
        calories: dataToSave.calories,
        sugar: dataToSave.sugar,
        protein: dataToSave.protein,
        fat: dataToSave.fat,
        carbs: dataToSave.carbs,
        ingredients: dataToSave.ingredients || [],
        warnings: dataToSave.warnings || [],
      }

      const response = await fetch(HISTORY_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Failed to save scan. Status: ${response.status}. Details: ${errorData}`)
      }

      console.log("✅ Scan successfully saved to history.")
    } catch (error) {
      console.error("❌ Error saving scan to history:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCameraStart = async () => {
    setScanMode("camera")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Unable to access camera. Please check permissions.")
      setScanMode(null)
    }
  }

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return
    const context = canvasRef.current.getContext("2d")
    if (!context) return

    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return
      setIsScanning(true)
      try {
        const formData = new FormData()
        formData.append("image", blob, "capture.jpg")

        const response = await fetch(SCAN_API_URL, { method: "POST", body: formData })
        const resText = await response.text()
        if (!response.ok) throw new Error(`Scan failed: ${resText}`)

        const data = JSON.parse(resText)
        setScanResult(data)
        localStorage.setItem("lastScan", JSON.stringify(data))
        await saveScanToHistory(data)
      } catch (err) {
        console.error("Error during capture or scan:", err)
        alert((err as Error).message || "Failed to process the image.")
      } finally {
        stopCamera()
        setIsScanning(false)
      }
    }, "image/jpeg")
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setScanMode("upload")
    setIsScanning(true)
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch(SCAN_API_URL, { method: "POST", body: formData })
      const resText = await response.text()
      if (!response.ok) throw new Error(`Upload failed: ${resText}`)
      const data = JSON.parse(resText)

      setScanResult(data)
      localStorage.setItem("lastScan", JSON.stringify(data))
      await saveScanToHistory(data)
    } catch (err) {
      console.error("Error during file upload or scan:", err)
      alert((err as Error).message || "Upload failed.")
    } finally {
      setIsScanning(false)
      setScanMode(null)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const handleReset = () => {
    stopCamera()
    setScanResult(null)
    setScanMode(null)
    try {
      localStorage.removeItem("lastScan")
      sessionStorage.removeItem("lastScan")
    } catch {}
  }

  if (scanResult) {
    return <ScanResult data={scanResult} onReset={handleReset} />
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <ScanLoadingPortal
        open={isScanning}
        message="Analyzing label..."
        submessage="AI is processing your image"
        onCancel={handleReset}
      />

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="p-4 md:p-8 lg:p-12 space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/25">
              <Zap size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">Food Scanner</h1>
              <p className="text-slate-400 text-lg">
                Scan any food or beverage to get instant nutrition insights
              </p>
            </div>
          </div>
        </div>

        {/* Main Options */}
        {!scanMode ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="group relative p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-xl cursor-pointer overflow-hidden">
              <button
                onClick={handleCameraStart}
                className="relative w-full h-full flex flex-col items-center justify-center space-y-6 text-center"
              >
                <div className="w-24 h-24 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Camera size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white">Use Camera</h3>
                <p className="text-slate-400">Point your camera at the food label</p>
              </button>
            </Card>

            <Card className="group relative p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 shadow-xl cursor-pointer overflow-hidden">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full h-full flex flex-col items-center justify-center space-y-6 text-center"
              >
                <div className="w-24 h-24 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Upload size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white">Upload Image</h3>
                <p className="text-slate-400">Choose an image from your device</p>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </Card>
          </div>
        ) : (
          // Camera Active View
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 shadow-xl space-y-6">
            {scanMode === "camera" && (
              <div className="space-y-6">
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border-2 border-emerald-500/30">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" width={640} height={480} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="max-w-[70%] sm:w-64 max-h-[70%] sm:h-80 border-4 border-emerald-400/50 rounded-2xl shadow-lg shadow-emerald-500/25"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={handleCapture}
                    disabled={isScanning}
                    className="flex-1 h-14 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold text-lg shadow-lg transition-all"
                  >
                    <Camera size={20} className="mr-2" /> Capture & Scan
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="h-14 px-8 border-2 border-slate-700 hover:border-red-500/50 bg-slate-800/50 hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-all"
                  >
                    <X size={20} className="mr-2" /> Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Tips Section */}
        <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/20 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-white">Tips for Best Results</h3>
          </div>
          <ul className="space-y-4">
            {[
              "Ensure the nutrition label is clearly visible and well-lit",
              "Hold the camera steady for 2–3 seconds",
              "Make sure the entire label fits within the frame",
              "Avoid shadows and glare on the label",
            ].map((tip, idx) => (
              <li key={idx} className="flex items-start gap-4 group">
                <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                  <CheckCircle size={14} className="text-emerald-400" />
                </div>
                <span className="text-slate-300 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
