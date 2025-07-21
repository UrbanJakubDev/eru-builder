import StatementLinkCard from '@/components/statementLinkCard'

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* Levý panel */}
        <section className=" border border-gray-500  rounded-xl p-8 flex flex-col justify-between shadow-lg">
          <article>
            <h1 className="text-3xl font-bold text-brand mb-6">GVE (Generátor výkazů ERU)</h1>
            <p className="text-lg text-gray-200 text-justify mb-8">
              GVE je nástroj pro generování JSON souborů pro výkazy ERU-E1 a ERU-T1. Aplikace umožňuje snadnou konverzi dat z Excel souborů do formátu požadovaného Energetickým
              regulačním úřadem. Tento nástroj významně zjednodušuje proces přípravy výkazů pro ERÚ a minimalizuje možnost chyb při manuálním zpracování dat. Je navržen s důrazem
              na jednoduchost použití a spolehlivost výstupů.
            </p>
            <div className="bg-gray-800 border-l-4 border-brand p-4 mb-8 rounded">
              <p className="text-brand font-semibold mb-2">Důležité upozornění:</p>
              <ul className="list-disc list-inside text-gray-300 text-sm mb-2">
                <li>Energetický regulační úřad (ERÚ) může kdykoliv upravit své požadavky a specifikace pro předávání dat.</li>
                <li>I přes naši snahu o aktualizaci tohoto nástroje mohou změny ERÚ dočasně ovlivnit správnost generovaných výstupů.</li>
              </ul>
              <p className="text-gray-300 text-sm mb-1">Proto důrazně doporučujeme:</p>
              <ul className="list-disc list-inside text-gray-300 text-sm mb-2">
                <li>Vždy důkladně zkontrolovat vygenerované JSON soubory před jejich odesláním</li>
                <li>Ověřit výstupy proti aktuální dokumentaci ERÚ</li>
                <li>V případě pochybností kontaktovat přímo ERÚ nebo autora</li>
              </ul>
              <p className="text-gray-400 text-xs mt-2">
                Aplikace je poskytována "tak jak je". Autor nenese žádnou zodpovědnost za případné nesrovnalosti, chyby v reportingu či jakékoliv škody způsobené použitím tohoto
                nástroje.
              </p>
            </div>
          </article>
          <article className="mt-8">
            <div className="bg-gray-800 rounded p-4 text-xs text-gray-400">
              <p>Pro technickou podporu:</p>
              <p className="mt-1">
                <a href="mailto:urbanjakubdev@gmail.com" className="text-gray-400 hover:underline">
                  urbanjakubdev@gmail.com
                </a>{' '}
                |{' '}
                <a href="https://github.com/UrbanJakubDev" className="text-gray-400 hover:underline">
                  GitHub
                </a>
              </p>
            </div>
          </article>
        </section>
        {/* Pravý panel */}
        <section className="flex flex-col gap-8 justify-center items-center  border border-gray-500  rounded-xl p-8 shadow-lg w-full">
          <StatementLinkCard title="Eru E1" description="Generátor JSON pro výkaz ERU-E1" link="/eru-e1" />
          <StatementLinkCard title="Eru T1" description="Generátor JSON pro výkaz ERU-T1" link="/eru-t1" />
        </section>
      </div>
    </div>
  )
}

export default Home
