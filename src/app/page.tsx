
import StatementLinkCard from '@/components/statementLinkCard'

const Home = () => {
  return (
    <div className='pt-8 px-8'>
      <div className="grid xl:grid-cols-2 gap-12 xl:gap-4">
        <section>
          <article className="mb-4">
            <p className="text-xl text-justify">
              GVE (Generátor výkazů ERU) je nástroj pro generování JSON souborů pro výkazy ERU-E1 a ERU-T1. Aplikace umožňuje snadnou konverzi dat z Excel souborů do formátu požadovaného Energetickým regulačním úřadem.

              Tento nástroj významně zjednodušuje proces přípravy výkazů pro ERÚ a minimalizuje možnost chyb při manuálním zpracování dat. Je navržen s důrazem na jednoduchost použití a spolehlivost výstupů.
            </p>

            <div className="mt-12 space-y-4">
              <p className="text-justify text-brand font-semibold text-xl">
                Důležité upozornění:
              </p>
              <p className="text-justify">
                Energetický regulační úřad (ERÚ) může kdykoliv upravit své požadavky a specifikace pro předávání dat. I přes naši kontinuální snahu o aktualizaci tohoto nástroje mohou takové změny dočasně ovlivnit správnost generovaných výstupů.
              </p>
              <p className="text-justify">
                Proto důrazně doporučujeme:
              </p>
              <ul className="list-disc list-inside text-justify">
                <li>Vždy důkladně zkontrolovat vygenerované JSON soubory před jejich odesláním</li>
                <li>Ověřit výstupy proti aktuální dokumentaci ERÚ</li>
                <li>V případě pochybností kontaktovat přímo ERÚ nebo autora</li>
              </ul>
            </div>
          </article>

          <article className="mt-12">
            <div className="text-xs text-gray-500">
              <p>Pro technickou podporu:</p>
              <p className="mt-1">
                <a href="mailto:urbanjakubdev@gmail.com" className="text-gray-500 hover:underline">urbanjakubdev@gmail.com</a> | <a href="https://github.com/UrbanJakubDev" className="text-gray-500 hover:underline">GitHub</a>
              </p>
            </div>
          </article>
        </section>
        <section className="w-full flex flex-col gap-8 justify-start items-center">
          <StatementLinkCard title="Eru E1" description="Generátor JSON pro výkaz ERU-E1" link="/eru-e1" />
          <StatementLinkCard title="Eru T1" description="Generátor JSON pro výkaz ERU-T1" link="/eru-t1" />
        </section>
      </div>
        <p className="text-justify text-gray-400 text-xs mt-12 xl:mt-28">
            **Upozorňujeme, že aplikace může obsahovat chyby a je poskytována "tak jak je". Autor nenese žádnou zodpovědnost za případné nesrovnalosti, chyby v reportingu či jakékoliv přímé nebo nepřímé škody způsobené použitím tohoto nástroje.**
        </p>
        </div>
  )
}

export default Home
