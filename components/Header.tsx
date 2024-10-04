import Image from 'next/image'
import { Menu } from 'lucide-react'

type HeaderProps = {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between bg-[#8BC34A] px-4">
      <button
        onClick={onToggleSidebar}
        className="text-white"
      >
        <Menu size={24} />
      </button>
      <Image
        src="/suemlogowhite.png"
        alt="SUEM Logo"
        width={80}
        height={20}
        className="h-10 w-auto"
      />
      <div className="w-6" /> {/* Spacer for centering logo */}
    </header>
  )
}