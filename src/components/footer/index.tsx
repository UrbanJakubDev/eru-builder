import packageJson from '../../../package.json'

export default function Footer() {

    const currentYear = new Date().getFullYear()
    const signature = 'CHP Statement Tools'
    const version = packageJson.version


    return (
        <footer className="p-6 border-t border-gray-800 bg-gray-950/50 mt-auto">
            <div className="mx-auto text-center">
                <p className="text-gray-500 text-sm">
                    &copy; {currentYear} <span className="text-gray-400 font-medium">{signature}</span>. All rights reserved.
                    <span className="ml-2 text-gray-600 text-xs">v{version}</span>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                    Created by <a href="https://github.com/UrbanJakubDev" target="_blank" rel="noreferrer" className="hover:text-brand transition-colors">UrbanJakubDev</a>
                </p>
            </div>
        </footer>
    )
}