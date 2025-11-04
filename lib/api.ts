// API utility functions for NutriGo backend integration

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface ScanRecord {
  id: string
  userId: string
  productName: string
  brand: string
  healthScore: number
  calories: number
  sugar: number
  protein: number
  fat: number
  carbs: number
  ingredients: string[]
  warnings: string[]
  scannedAt: string
}

export interface HealthMetrics {
  totalScans: number
  healthyChoices: number
  averageScore: number
  currentStreak: number
}

// Helper: parse response safely and provide clear errors when HTML or non-JSON is returned
async function parseJsonSafely<T>(response: Response): Promise<T> {
  const text = await response.text()
  const contentType = response.headers.get("content-type") || ""

  // If response isn't JSON, throw with snippet so we can see HTML bodies in logs
  if (!contentType.includes("application/json")) {
    const snippet = text.slice(0, 500)
    throw new Error(`Expected JSON response but got '${contentType || "no content-type"}'. Body starts: ${snippet}`)
  }

  // Try parse
  try {
    const parsed = JSON.parse(text) as T
    if (!response.ok) {
      // If backend included an error field, surface it
      const errMsg = (parsed as any)?.error || (parsed as any)?.message || `HTTP ${response.status}`
      throw new Error(errMsg)
    }
    return parsed
  } catch (err) {
    // If JSON.parse fails, include body snippet for debugging
    const snippet = text.slice(0, 500)
    throw new Error(`Failed to parse JSON response. Body starts: ${snippet}`)
  }
}
// Auth endpoints
export async function signUp(email: string, password: string, name: string): Promise<ApiResponse<User>> {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })
    return await parseJsonSafely<ApiResponse<User>>(response)
  } catch (error) {
    return { success: false, error: "Failed to sign up" }
  }
}

export async function login(email: string, password: string): Promise<ApiResponse<User>> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    return await parseJsonSafely<ApiResponse<User>>(response)
  } catch (error) {
    return { success: false, error: "Failed to login" }
  }
}

export async function logout(): Promise<ApiResponse<null>> {
  try {
    const response = await fetch("/api/auth/logout", { method: "POST" })
    return await parseJsonSafely<ApiResponse<null>>(response)
  } catch (error) {
    return { success: false, error: "Failed to logout" }
  }
}

// Scan endpoints
export async function createScan(
  scanData: Omit<ScanRecord, "id" | "userId" | "scannedAt">,
): Promise<ApiResponse<ScanRecord>> {
  try {
    const response = await fetch("/api/scans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scanData),
    })
    return await parseJsonSafely<ApiResponse<ScanRecord>>(response)
  } catch (error) {
    return { success: false, error: "Failed to create scan" }
  }
}

export async function getScanHistory(): Promise<ApiResponse<ScanRecord[]>> {
  try {
    const response = await fetch("/api/scans")
    return await parseJsonSafely<ApiResponse<ScanRecord[]>>(response)
  } catch (error) {
    return { success: false, error: "Failed to fetch scan history" }
  }
}

export async function deleteScan(scanId: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`/api/scans/${scanId}`, { method: "DELETE" })
    return await parseJsonSafely<ApiResponse<null>>(response)
  } catch (error) {
    return { success: false, error: "Failed to delete scan" }
  }
}

// Metrics endpoints
export async function getHealthMetrics(): Promise<ApiResponse<HealthMetrics>> {
  try {
    const response = await fetch("/api/metrics")
    return await parseJsonSafely<ApiResponse<HealthMetrics>>(response)
  } catch (error) {
    return { success: false, error: "Failed to fetch metrics" }
  }
}

// User endpoints
export async function updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
  try {
    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return await parseJsonSafely<ApiResponse<User>>(response)
  } catch (error) {
    return { success: false, error: "Failed to update profile" }
  }
}

export async function getProfile(): Promise<ApiResponse<User>> {
  try {
    const response = await fetch("/api/user/profile")
    return await parseJsonSafely<ApiResponse<User>>(response)
  } catch (error) {
    return { success: false, error: "Failed to fetch profile" }
  }
}
