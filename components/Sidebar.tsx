import Link from 'next/link'
import { X, User, Settings, LogOut } from 'lucide-react'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center justify-between bg-[#9CCC65] px-4">
        <span className="text-lg font-semibold text-white">Hospital 1</span>
        <button onClick={onClose} className="text-white">
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
              href="/api/auth/logout"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="mr-3" size={20} />
              Cerrar Sesión
            </Link>
      </nav>
    </div>
  )
}