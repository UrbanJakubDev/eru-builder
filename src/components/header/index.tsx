"use client"

import Logo from './logo'
import Navigation from './navigation'
import { usePathname } from 'next/navigation'

export default function Header() {

    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
            <div className="max-w-screen-2xl mx-auto px-4 h-16 flex justify-between items-center">
                <Logo />
                <Navigation />
            </div>
        </header>

    )
}