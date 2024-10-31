import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

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
      // Check if user already exists
      const [existingUsers]: any = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      )

      if (existingUsers.length > 0) {
        return NextResponse.json(
          { error: 'El usuario ya existe' },
          { status: 400 }
        )
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Insert new user
      await connection.execute(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      )

      return NextResponse.json(
        { message: 'Usuario registrado exitosamente' },
        { status: 201 }
      )
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}