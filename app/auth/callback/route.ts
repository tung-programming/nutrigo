import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code)
      
      // Redirect to dashboard after successful email confirmation
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    } catch (error) {
      console.error('Error exchanging code for session:', error)
      // Redirect to login on error
      return NextResponse.redirect(new URL('/auth/login?error=confirmation_failed', requestUrl.origin))
    }
  }

  // Redirect to login if no code
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
}
