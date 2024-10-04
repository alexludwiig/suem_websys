import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const response = await fetch('http://186.64.113.156:4000/citizens/createCitizen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Failed to create citizen' }, { status: 500 })
  }
}