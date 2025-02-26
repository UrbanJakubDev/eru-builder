"use client"

import Logo from './logo'
import Navigation from './navigation'
import { usePathname } from 'next/navigation'

export default function Header() {

    const pathname = usePathname()

    return (
        <header className="p-4 border-b border-gray-500 flex justify-between items-center text-gray-400">
            <Logo />
            <Navigation/>
            {/* {pathname !== '/' && <Navigation />} */}
        </header>

    )
}