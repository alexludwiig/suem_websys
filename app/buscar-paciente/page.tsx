'use client'

import { useState } from 'react'
import { Search, Plus, User, Pencil } from 'lucide-react'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import Link from 'next/link'

interface PatientInfo {
  _id: string
  DNI: number
  nombre: string
  apellido: string
  grupoSanguineo: string
  fechaUltAtencion: string
  historialPrevio: string[]
}

function PatientInfoCard({ patient, onAddHistory }: { patient: PatientInfo; onAddHistory: () => void }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-2xl font-bold">Información del Paciente</h2>
        <button
          onClick={onAddHistory}
          className="rounded bg-[#8BC34A] p-2 text-white hover:bg-[#7CB342]"
          aria-label="Agregar historial"
        >
          <Pencil size={20} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">DNI:</p>
          <p>{patient.DNI}</p>
        </div>
        <div>
          <p className="font-semibold">Nombre:</p>
          <p>{patient.nombre} {patient.apellido}</p>
        </div>
        <div>
          <p className="font-semibold">Grupo Sanguíneo:</p>
          <p>{patient.grupoSanguineo}</p>
        </div>
        <div>
          <p className="font-semibold">Última Atención:</p>
          <p>{new Date(patient.fechaUltAtencion).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="font-semibold">Historial Previo:</p>
        <ul className="list-inside list-disc">
          {patient.historialPrevio.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function BuscarPaciente() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchNumber, setSearchNumber] = useState('')
  const [searchResult, setSearchResult] = useState<PatientInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showHistoryInput, setShowHistoryInput] = useState(false)
  const [newHistory, setNewHistory] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSearch = async () => {
    if (!searchNumber) {
      setError('Por favor, ingrese un número para buscar.')
      return
    }

    setIsLoading(true)
    setError('')
    setSearchResult(null)
    setShowHistoryInput(false)

    try {
      const response = await fetch(`/api/proxy?dni=${searchNumber}`)

      if (!response.ok) {
        throw new Error('Error en la búsqueda')
      }

      const data: PatientInfo = await response.json()
      setSearchResult(data)
    } catch (err) {
      setError('Error al buscar el paciente. Por favor, intente de nuevo.')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddHistory = () => {
    setShowHistoryInput(true)
  }

  const handleUpdateHistory = async () => {
    if (!searchResult || !newHistory) return

    setIsUpdating(true)
    setError('')

    try {
      const response = await fetch(`/api/proxy/update-citizen?dni=${searchResult.DNI}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nuevoHistorial: newHistory }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el historial')
      }

      const updatedPatient: PatientInfo = await response.json()
      setSearchResult(updatedPatient)
      setShowHistoryInput(false)
      setNewHistory('')
    } catch (err) {
      setError('Error al actualizar el historial. Por favor, intente de nuevo.')
      console.error('Error:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="relative flex-1 overflow-auto bg-gray-100 p-8">
        <h1 className="mb-8 text-center text-4xl font-bold">BUSCAR PACIENTE</h1>
        <div className="relative mx-auto max-w-2xl">
          <input
            type="text"
            placeholder="Ingrese el DNI del paciente..."
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-4 pr-12 focus:border-[#8BC34A] focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="absolute right-0 top-0 rounded-r-lg bg-[#8BC34A] p-2 text-white hover:bg-[#7CB342] disabled:bg-gray-400"
            aria-label="Buscar"
          >
            <Search size={24} />
          </button>
        </div>

        {isLoading && <p className="mt-4 text-center">Buscando...</p>}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        {searchResult && (
          <div className="mt-8">
            <PatientInfoCard patient={searchResult} onAddHistory={handleAddHistory} />
          </div>
        )}

        {showHistoryInput && (
          <div className="mt-4">
            <textarea
              value={newHistory}
              onChange={(e) => setNewHistory(e.target.value)}
              placeholder="Ingrese la nueva entrada del historial..."
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#8BC34A] focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
              rows={4}
            />
            <button
              onClick={handleUpdateHistory}
              disabled={isUpdating}
              className="mt-2 rounded bg-[#8BC34A] px-4 py-2 text-white hover:bg-[#7CB342] disabled:bg-gray-400"
            >
              {isUpdating ? 'Actualizando...' : 'Actualizar Historial'}
            </button>
          </div>
        )}

        <div className="fixed bottom-8 right-8">
          <Link href="/agregar-paciente">
            <button
              className="rounded-full bg-[#8BC34A] p-4 text-white shadow-lg hover:bg-[#7CB342]"
              aria-label="Agregar paciente"
            >
              <Plus size={24} />
            </button>
          </Link>
        </div>
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-10">
          <User size={400} />
        </div>
      </main>
    </div>
  )
}