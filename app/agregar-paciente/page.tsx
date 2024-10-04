'use client'

import { useState } from 'react'
import { Menu, X, User, Settings, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AgregarPaciente() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    DNI: '',
    nombre: '',
    apellido: '',
    grupoSanguineo: '',
    historialPrevio: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/proxy/create-citizen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Error al crear el paciente')
      }

      setSuccess(true)
      setFormData({
        DNI: '',
        nombre: '',
        apellido: '',
        grupoSanguineo: '',
        historialPrevio: '',
      })
    } catch (err) {
      setError('Error al crear el paciente. Por favor, intente de nuevo.')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
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
        <div className="w-6" /> {/* Spacer for centering logo */}
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
              href="/"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <User className="mr-3" size={20} />
              Inicio
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Settings className="mr-3" size={20} />
              Configuración de Perfil
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="mr-3" size={20} />
              Cerrar Sesión
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 bg-gray-100 p-8">
          <h1 className="mb-8 text-center text-4xl font-bold">AGREGAR PACIENTE</h1>
          <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
            <div className="mb-4">
              <label htmlFor="DNI" className="mb-2 block font-bold text-gray-700">
                DNI:
              </label>
              <input
                type="text"
                id="DNI"
                name="DNI"
                value={formData.DNI}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8BC34A] focus:outline-none focus:ring"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="nombre" className="mb-2 block font-bold text-gray-700">
                Nombre:
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8BC34A] focus:outline-none focus:ring"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="apellido" className="mb-2 block font-bold text-gray-700">
                Apellido:
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8BC34A] focus:outline-none focus:ring"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="grupoSanguineo" className="mb-2 block font-bold text-gray-700">
                Grupo Sanguíneo:
              </label>
              <input
                type="text"
                id="grupoSanguineo"
                name="grupoSanguineo"
                value={formData.grupoSanguineo}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8BC34A] focus:outline-none focus:ring"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="historialPrevio" className="mb-2 block font-bold text-gray-700">
                Historial Previo:
              </label>
              <textarea
                id="historialPrevio"
                name="historialPrevio"
                value={formData.historialPrevio}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8BC34A] focus:outline-none focus:ring"
                rows={4}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#8BC34A] px-4 py-2 font-bold text-white hover:bg-[#7CB342] focus:outline-none focus:ring"
            >
              {isLoading ? 'Enviando...' : 'ENVIAR'}
            </button>
          </form>
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
          {success && (
            <p className="mt-4 text-center text-green-500">Paciente creado exitosamente</p>
          )}
        </main>
      </div>
    </div>
  )
}