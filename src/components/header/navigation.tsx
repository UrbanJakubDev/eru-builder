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
            label: 'ERU',
            href: '/eru'
        },
        {
            label: 'OTE',
            href: '/ote'
        },
        {
            label: 'Nápověda',
            href: '/help'
        }
    ]

    const pathname = usePathname()

    return (
        <nav>
            <div className="flex items-center gap-1">
                {routes.map((route) => {
                    const isActive = pathname === route.href || (route.href !== '/' && pathname.startsWith(route.href))

                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                ? 'bg-brand/10 text-brand'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            {route.label}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}