import packageJson from '../../../package.json'

export default function Footer() {

    const currentYear = new Date().getFullYear()
    const signature = 'Eru Builder'
    const version = packageJson.version


    return (
        <footer className="p-4 border-t border-gray-500">
            <div className="mx-auto text-center">
                <p className="text-gray-500">
                    &copy; {currentYear} {signature}. All rights reserved. 
                    <span className="ml-2 text-gray-600">v {version}</span>
                </p>
            </div>
        </footer>
    )
}