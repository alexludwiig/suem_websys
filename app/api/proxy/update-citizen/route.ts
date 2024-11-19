import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const dni = searchParams.get('dni')

  if (!dni) {
    return NextResponse.json({ error: 'DNI is required' }, { status: 400 })
  }

  try {
    const body = await request.json()

    const response = await fetch(`http://186.64.113.156:4000/citizens/updateCitizen/${dni}`, {
      method: 'PUT',
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
    return NextResponse.json({ error: 'Failed to update citizen' }, { status: 500 })
  }
}