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

// Auth endpoints
export async function signUp(email: string, password: string, name: string): Promise<ApiResponse<User>> {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })
    return await response.json()
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
    return await response.json()
  } catch (error) {
    return { success: false, error: "Failed to login" }
  }
}

export async function logout(): Promise<ApiResponse<null>> {
  try {
    const response = await fetch("/api/auth/logout", { method: "POST" })
    return await response.json()
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
    return await response.json()
  } catch (error) {
    return { success: false, error: "Failed to create scan" }
  }
}

export async function getScanHistory(): Promise<ApiResponse<ScanRecord[]>> {
  try {
    const response = await fetch("/api/scans")
    return await response.json()
  } catch (error) {
    return { success: false, error: "Failed to fetch scan history" }
  }
}

export async function deleteScan(scanId: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`/api/scans/${scanId}`, { method: "DELETE" })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Failed to delete scan" }
  }
}

// Metrics endpoints
export async function getHealthMetrics(): Promise<ApiResponse<HealthMetrics>> {
  try {
    const response = await fetch("/api/metrics")
    return await response.json()
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
    return await response.json()
  } catch (error) {
    return { success: false, error: "Failed to update profile" }
  }
}

export async function getProfile(): Promise<ApiResponse<User>> {
  try {
    const response = await fetch("/api/user/profile")
    return await response.json()
  } catch (error) {
    return { success: false, error: "Failed to fetch profile" }
  }
}
