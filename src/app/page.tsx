import Link from 'next/link'
import { FaBolt, FaFileInvoice, FaExclamationTriangle } from 'react-icons/fa'

const Home = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-brand mb-4">CHP Statement Tools</h1>
        <small className="text-gray-400">
          Tato aplikace je určena pouze pro generování výkazů pro výrobny s Kogeneranční jednotkou. Aplikace není oficiální nástroj Energetického regulačního úřadu nebo Operátora
          trhu s elektřinou.
        </small>
        <p className="text-xl text-gray-400">Vyberte oblast pro kterou chcete generovat výkazy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link
          href="/eru"
          className="group relative overflow-hidden rounded-2xl border border-gray-700 bg-gray-900/50 p-8 hover:border-brand/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_var(--color-brand)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 p-4 rounded-full bg-gray-800 group-hover:bg-brand/20 transition-colors">
              <FaBolt className="w-12 h-12 text-brand" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">ERU</h2>
            <p className="text-gray-400">Energetický regulační úřad</p>
            <span className="mt-6 text-sm text-brand font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">Přejít na výkazy &rarr;</span>
          </div>
        </Link>

        <Link
          href="/ote"
          className="group relative overflow-hidden rounded-2xl border border-gray-700 bg-gray-900/50 p-8 hover:border-brand/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_var(--color-brand)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 p-4 rounded-full bg-gray-800 group-hover:bg-brand/20 transition-colors">
              <FaFileInvoice className="w-12 h-12 text-brand" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">OTE</h2>
            <p className="text-gray-400">Operátor trhu s elektřinou</p>
            <span className="mt-6 text-sm text-brand font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">Přejít na nástroje &rarr;</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Home
