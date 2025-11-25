import Link from 'next/link'
import { FaArrowLeft, FaCloudDownloadAlt, FaBolt, FaFire, FaExclamationTriangle } from 'react-icons/fa'

const OtePage = () => {
  return (
    <div className="w-full max-w-4xl px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-brand transition-colors mb-4">
          <FaArrowLeft className="mr-2" /> Zpět na rozcestník
        </Link>
        <h1 className="text-3xl font-bold text-white">OTE Nástroje</h1>
        <p className="text-gray-400 mt-2">Správa dat a výkazů pro OTE</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/ote/data-download"
          className="group p-6 rounded-xl border border-gray-700 bg-gray-900/50 hover:border-brand/50 transition-all hover:shadow-lg hover:shadow-brand/10"
        >
          <div className="mb-4 p-3 rounded-lg bg-gray-800 w-fit group-hover:bg-brand/20 transition-colors">
            <FaCloudDownloadAlt className="w-6 h-6 text-brand" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Stahování Dat</h3>
          <p className="text-sm text-gray-400">Generování XML zprávy pro stažení dat z OTE</p>
        </Link>

        <Link
          href="/ote/electricity-report"
          className="group p-6 rounded-xl border border-gray-700 bg-gray-900/50 hover:border-brand/50 transition-all hover:shadow-lg hover:shadow-brand/10"
        >
          <div className="mb-4 p-3 rounded-lg bg-gray-800 w-fit group-hover:bg-brand/20 transition-colors">
            <FaBolt className="w-6 h-6 text-brand" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Výkazy elektřiny</h3>
          <p className="text-sm text-gray-400">Generování souborů pro hromadný import výkazů elektřiny</p>
        </Link>

        <Link
          href="#"
          className="group p-6 rounded-xl border border-gray-700 bg-gray-900/50 hover:border-brand/50 transition-all hover:shadow-lg hover:shadow-brand/10"
        >
          <div className="mb-4 p-3 rounded-lg bg-gray-800 w-fit group-hover:bg-brand/20 transition-colors">
            <FaFire className="w-6 h-6 text-brand" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Výkazy Paliv</h3>
          <p className="text-sm text-gray-400">Tuhle sekci připravujeme</p>
        </Link>
      </div>

           {/* Important Notice for OTE */}
           <div className="mt-12 w-full max-w-4xl">
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <FaExclamationTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-yellow-200 mb-4">Důležité upozornění</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>Operátor trhu s elektřinou (OTE) může kdykoliv změnit své požadavky a strukturu pro předávání nebo import/export dat.</p>
                <p>I přes naši snahu o správnost a aktuálnost tohoto nástroje mohou změny OTE dočasně ovlivnit správné generování souborů nebo podání dat.</p>
                <p className="font-semibold text-yellow-200 mt-4">Proto doporučujeme:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Vždy pečlivě zkontrolovat vygenerované XML nebo XLSX soubory před jejich odesláním nebo importem do OTE portálu</li>
                  <li>Ověřit výstupy proti aktuální dokumentaci OTE</li>
                  <li>V případě nejasností či problémů kontaktovat přímo OTE nebo autora tohoto nástroje</li>
                </ul>
                <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-yellow-800/50">
                  Tento nástroj je poskytován "tak jak je". Autor nenese odpovědnost za případné chyby, nekompatibility nebo škody způsobené použitím, či za jakékoliv změny v datové struktuře OTE.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OtePage
