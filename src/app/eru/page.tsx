import Link from 'next/link'
import { FaArrowLeft, FaBolt, FaExclamationTriangle, FaFire } from 'react-icons/fa'

const EruPage = () => {
  return (
    <div className="w-full max-w-4xl px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-brand transition-colors mb-4">
          <FaArrowLeft className="mr-2" /> Zpět na rozcestník
        </Link>
        <h1 className="text-3xl font-bold text-white">ERU Výkazy</h1>
        <p className="text-gray-400 mt-2">Generátor JSON souborů pro výkazy ERU</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/eru-e1"
          className="group relative overflow-hidden rounded-2xl border border-gray-700 bg-gray-900/50 p-8 hover:border-brand/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_var(--color-brand)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 p-4 rounded-full bg-gray-800 group-hover:bg-brand/20 transition-colors">
              <FaBolt className="w-10 h-10 text-brand" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">ERU E1</h2>
            <p className="text-gray-400 mb-6">Měsíční výkaz o výrobě a spotřebě elektřiny</p>
            <span className="text-sm text-brand font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">Otevřít generátor &rarr;</span>
          </div>
        </Link>

        <Link
          href="/eru-t1"
          className="group relative overflow-hidden rounded-2xl border border-gray-700 bg-gray-900/50 p-8 hover:border-brand/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_var(--color-brand)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 p-4 rounded-full bg-gray-800 group-hover:bg-brand/20 transition-colors">
              <FaFire className="w-10 h-10 text-brand" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">ERU T1</h2>
            <p className="text-gray-400 mb-6">Měsíční výkaz o výrobě a spotřebě tepla</p>
            <span className="text-sm text-brand font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">Otevřít generátor &rarr;</span>
          </div>
        </Link>
      </div>

      {/* Important Notice */}
      <div className="mt-12 w-full max-w-4xl">
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <FaExclamationTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-yellow-200 mb-4">Důležité upozornění</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>Energetický regulační úřad (ERÚ) může kdykoliv upravit své požadavky a specifikace pro předávání dat.</p>
                <p>I přes naši snahu o aktualizaci tohoto nástroje mohou změny ERÚ dočasně ovlivnit správnost generovaných výstupů.</p>
                <p className="font-semibold text-yellow-200 mt-4">Proto důrazně doporučujeme:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Vždy důkladně zkontrolovat vygenerované JSON soubory před jejich odesláním</li>
                  <li>Ověřit výstupy proti aktuální dokumentaci ERÚ</li>
                  <li>V případě pochybností kontaktovat přímo ERÚ nebo autora</li>
                </ul>
                <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-yellow-800/50">
                  Aplikace je poskytována "tak jak je". Autor nenese žádnou zodpovědnost za případné nesrovnalosti, chyby v reportingu či jakékoliv škody způsobené použitím tohoto
                  nástroje.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EruPage
