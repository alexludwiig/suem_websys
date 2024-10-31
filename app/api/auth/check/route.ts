import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }

  try {
    jwt.verify(token.value, process.env.JWT_SECRET!)
    return NextResponse.json({ authenticated: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
}