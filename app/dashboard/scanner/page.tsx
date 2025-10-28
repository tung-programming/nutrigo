"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X, Loader } from "lucide-react"
import ScanResult from "@/components/scanner/scan-result"

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
}

export default function ScannerPage() {
  const [scanMode, setScanMode] = useState<"camera" | "upload" | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const mockScanResult: ScanData = {
    name: "Coca Cola",
    brand: "The Coca-Cola Company",
    healthScore: 25,
    calories: 140,
    sugar: 39,
    protein: 0,
    fat: 0,
    carbs: 39,
    ingredients: [
      "Carbonated Water",
      "High Fructose Corn Syrup",
      "Caramel Color",
      "Phosphoric Acid",
      "Natural Flavors",
    ],
    warnings: ["High Sugar Content", "Contains Caffeine", "High Calorie Density"],
    timestamp: new Date().toLocaleString(),
  }

  const handleCameraStart = async () => {
    setScanMode("camera")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Unable to access camera. Please check permissions.")
      setScanMode(null)
    }
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        setIsScanning(true)

        // Simulate scanning process
        setTimeout(() => {
          setScanResult(mockScanResult)
          setIsScanning(false)
          setScanMode(null)
          if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
            tracks.forEach((track) => track.stop())
          }
        }, 2000)
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setScanMode("upload")
      setIsScanning(true)

      // Simulate scanning process
      setTimeout(() => {
        setScanResult(mockScanResult)
        setIsScanning(false)
        setScanMode(null)
      }, 2000)
    }
  }

  const handleReset = () => {
    setScanResult(null)
    setScanMode(null)
  }

  if (scanResult) {
    return <ScanResult data={scanResult} onReset={handleReset} />
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Food Scanner</h1>
        <p className="text-muted-foreground">Scan any food or beverage to get instant nutrition insights</p>
      </div>

      {/* Scanner Interface */}
      {!scanMode ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Camera Option */}
          <Card className="p-8 border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition cursor-pointer group">
            <button
              onClick={handleCameraStart}
              className="w-full h-full flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition">
                <Camera size={32} className="text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Use Camera</h3>
                <p className="text-muted-foreground">Point your camera at the food label</p>
              </div>
            </button>
          </Card>

          {/* Upload Option */}
          <Card className="p-8 border-border bg-card/50 backdrop-blur-sm hover:border-accent/50 transition cursor-pointer group">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center group-hover:scale-110 transition">
                <Upload size={32} className="text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Upload Image</h3>
                <p className="text-muted-foreground">Choose an image from your device</p>
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </Card>
        </div>
      ) : (
        /* Camera/Upload View */
        <Card className="p-8 border-border bg-card/50 backdrop-blur-sm space-y-4">
          {scanMode === "camera" && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" width={640} height={480} />

                {/* Scan Frame Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-80 border-2 border-primary rounded-lg opacity-50"></div>
                </div>

                {/* Loading Indicator */}
                {isScanning && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="space-y-4 text-center">
                      <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
                      <p className="text-white font-semibold">Analyzing label...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleCapture}
                  disabled={isScanning}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
                >
                  Capture
                </Button>
                <Button
                  onClick={() => {
                    setScanMode(null)
                    if (videoRef.current?.srcObject) {
                      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
                      tracks.forEach((track) => track.stop())
                    }
                  }}
                  variant="outline"
                  className="flex-1 border-border hover:bg-muted"
                >
                  <X size={18} /> Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Tips Section */}
      <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Tips for Best Results</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span>Ensure the nutrition label is clearly visible and well-lit</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span>Hold the camera steady for 2-3 seconds</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span>Make sure the entire label fits within the frame</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span>Avoid shadows and glare on the label</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
