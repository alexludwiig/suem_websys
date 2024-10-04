import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dni = searchParams.get('dni')

  if (!dni) {
    return NextResponse.json({ error: 'DNI is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`http://186.64.113.156:4000/citizens/getCitizenInfo/${dni}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}