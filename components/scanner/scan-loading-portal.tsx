"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import ScanLoading, { type ScanLoadingProps } from "./scan-loading"

export default function ScanLoadingPortal(props: ScanLoadingProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <ScanLoading {...props} />,
    document.body
  )
}