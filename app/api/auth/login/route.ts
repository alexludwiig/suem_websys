import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Get connection from pool
    const connection = await pool.getConnection()

    try {
      // Query user from database
      const [rows]: any = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      )

      // Check if user exists
      if (rows.length === 0) {
        return NextResponse.json(
          { error: 'Usuario/Contraseña incorrectos.' },
          { status: 401 }
        )
      }

      const user = rows[0]

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        return NextResponse.json(
          { error: 'Usuario/Contraseña incorrectos.' },
          { status: 401 }
        )
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '8h' }
      )

      // Set HTTP-only cookie with JWT
      const response = NextResponse.json(
        { success: true },
        { status: 200 }
      )
      
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 // 8 hours
      })

      return response
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}