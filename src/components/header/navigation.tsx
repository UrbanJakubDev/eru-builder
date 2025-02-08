'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {

    const routes = [
        {
            label: 'Home',
            href: '/'
        },
        {
            label: 'Eru E1',
            href: '/eru-e1'
        },
        {
            label: 'Eru T1',
            href: '/eru-t1'
        }
    ]

    const pathname = usePathname()

    return (
        <nav className="p-4">
            <div className="container mx-auto flex justify-end gap-4">
                {routes.map((route) => (
                    <Link 
                        key={route.href}
                        href={route.href}
                        className={`font-bold ${pathname === route.href ? 'text-indigo-600 underline' : ''}`}
                    >
                        {route.label}
                    </Link>
                ))}
            </div>
        </nav>
    )
}