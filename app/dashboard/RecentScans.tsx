"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface ScanHistory {
  id: string
  productName: string
  brand: string
  healthScore: number
  category: string
  scannedAt: string
  calories: number
  sugar: number
}

interface RecentScansProps {
  scans: ScanHistory[]
}

export function RecentScans({ scans }: RecentScansProps) {
  // ✅ Clear last scan before scanning again
  const handleOpenScanner = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("lastScanResult")
        localStorage.removeItem("scanData")
        sessionStorage.removeItem("lastScan")
      }
    } catch (err) {
      console.warn("Could not clear previous scan:", err)
    }
  }

  return (
    <Card className="p-6 bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/20 shadow-xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Recent Scans</h3>
          <div className="flex gap-3">
            <Link href="/dashboard/history">
              <Button className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white gap-2 shadow-lg shadow-emerald-500/25">
                View All <ArrowRight size={16} />
              </Button>
            </Link>

            {/* ✅ “Scan Again” button that clears old data */}
            <Link href="/dashboard/scanner" onClick={handleOpenScanner}>
              <Button className="bg-linear-to-r from-cyan-500 to-emerald-600 hover:from-cyan-400 hover:to-emerald-500 text-white gap-2 shadow-lg shadow-cyan-500/25">
                Scan Again <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>

        {scans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No scans yet. Start scanning your food items!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-700 hover:border-emerald-500/40 bg-slate-800/50 hover:bg-slate-800/80 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${
                      scan.healthScore >= 70
                        ? "bg-emerald-500/20 text-emerald-400"
                        : scan.healthScore >= 50
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {scan.healthScore}
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {scan.productName}
                    </p>
                    <p className="text-sm text-slate-400">
                      {scan.category} •{" "}
                      {new Date(scan.scannedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      •{" "}
                      {new Date(scan.scannedAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all"
                  size={20}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
