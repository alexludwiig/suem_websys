'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, User, Settings, LogOut } from 'lucide-react'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => {
        if (!data.authenticated) {
          router.push('/')
        } else {
          setIsLoading(false)
        }
      })
      .catch(() => {
        router.push('/')
      })
  }, [router])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center justify-between bg-[#8BC34A] px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white"
        >
          <Menu size={24} />
        </button>
        <Image
          src="/suemlogowhite.png"
          alt="SUEM Logo"
          width={100}
          height={40}
          className="h-10 w-auto"
        />
        <div className="w-6" />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between bg-[#9CCC65] px-4">
            <span className="text-lg font-semibold text-white">Hospital 1</span>
            <button onClick={() => setSidebarOpen(false)} className="text-white">
              <X size={24} />
            </button>
          </div>
          <nav className="mt-8">
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Settings className="mr-3" size={20} />
              Configuración de Perfil
            </Link>
            <Link
              href="/api/auth/logout"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="mr-3" size={20} />
              Cerrar Sesión
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 bg-gray-100 p-8">
          <h1 className="mb-8 text-center text-4xl font-bold">BIENVENIDO</h1>
          <h2 className="mb-8 text-center text-xl">
            SISTEMA ÚNICO DE EMERGENCIAS MÉDICAS
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { title: 'BUSCAR PACIENTE', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', href: '/buscar-paciente' },
              { title: 'AGREGAR PACIENTE', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', href: '/agregar-paciente' },
              { title: 'CONFIGURAR PERFIL', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', href: '/profile' },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105"
              >
                <svg
                  className="mb-4 h-16 w-16 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                <h3 className="text-center text-lg font-semibold">{item.title}</h3>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}