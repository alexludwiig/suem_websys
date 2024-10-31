'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al registrar usuario')
      }

      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar usuario')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="h-16 bg-[#8BC34A] flex items-center justify-center">
        <Image
          src="/suemlogowhite.png"
          alt="SUEM Logo"
          width={100}
          height={40}
          className="h-10 w-auto"
        />
      </div>
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <Image
              src="/suemlogotransparent.png"
              alt="SUEM Logo"
              width={150}
              height={60}
              className="mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-gray-900">Registrar mi usuario</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#8BC34A] focus:outline-none focus:ring-[#8BC34A]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#8BC34A] focus:outline-none focus:ring-[#8BC34A]"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña:
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#8BC34A] focus:outline-none focus:ring-[#8BC34A]"
              />
            </div>
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-md bg-[#6B8E23] px-4 py-2 text-white hover:bg-[#556B2F] focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:ring-offset-2"
            >
              REGISTRARSE
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-[#6B8E23] hover:underline">
              Volver al inicio de sesión.
            </Link>
          </div>
          <p className="mt-8 text-center text-xs text-gray-500">
            Snake Software, 2024.
          </p>
        </div>
      </div>
    </div>
  )
}