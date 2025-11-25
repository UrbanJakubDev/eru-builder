'use client'

import { useState } from 'react'
import { FaArrowLeft, FaChevronDown, FaChevronUp, FaBolt, FaFire, FaFileExcel, FaFileCode } from 'react-icons/fa'
import Link from 'next/link'

interface AccordionProps {
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
}

const Accordion = ({ title, children, icon }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-900/30">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-6 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center gap-3">
          {icon && <span className="text-brand">{icon}</span>}
          <h3 className="text-xl font-bold text-white text-left">{title}</h3>
        </div>
        {isOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="p-6 pt-0 border-t border-gray-800">
          <div className="prose prose-invert max-w-none">{children}</div>
        </div>
      )}
    </div>
  )
}

const HelpPage = () => {
  return (
    <div className="w-full max-w-5xl px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-brand transition-colors mb-4">
          <FaArrowLeft className="mr-2" /> Zpět na hlavní stránku
        </Link>
        <h1 className="text-4xl font-bold text-white mb-4">Nápověda a Dokumentace</h1>
        <p className="text-gray-400 text-lg">Kompletní průvodce použitím CHP Statement Tools</p>
      </div>

      <div className="space-y-4">
        {/* Overview */}
        <Accordion title="Přehled Aplikace" icon={<FaBolt />}>
          <div className="space-y-4 text-gray-300">
            <p>
              CHP Statement Tools je webová aplikace určená pro generování a zpracování výkazů pro <strong>ERU</strong> (Energetický regulační úřad) a <strong>OTE</strong>{' '}
              (Operátor trhu s elektřinou).
            </p>
            <p className="text-sm">Aplikace nabízí dvě hlavní sekce:</p>
            <ul className="list-disc list-inside space-y-2 text-sm ml-4">
              <li>
                <strong>ERU</strong>: Generování JSON souborů pro výkazy ERU-E1 (elektřina) a ERU-T1 (teplo)
              </li>
              <li>
                <strong>OTE</strong>: Nástroje pro práci s daty OTE:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Stahování a zpracování dat OTE (Request/Response)</li>
                  <li>Výkazy elektřiny (generování XML výkazů)</li>
                  <li>Výkazy paliv (generování XML výkazů)</li>
                </ul>
              </li>
            </ul>
          </div>
        </Accordion>

        {/* ERU E1 */}
        <Accordion title="ERU-E1: Výkaz elektřiny" icon={<FaBolt />}>
          <div className="space-y-4 text-gray-300">
            <h4 className="text-lg font-semibold text-white">Popis</h4>
            <p className="text-sm">ERU-E1 slouží k vytvoření měsíčního výkazu o výrobě a spotřebě elektřiny ve formátu JSON pro hromadný import do dataportu ERU.</p>

            <h4 className="text-lg font-semibold text-white mt-6">Vstup</h4>
            <p className="text-sm">
              Excel soubor (.xlsx nebo .xlsm) s daty na listu <code className="bg-gray-800 px-1 rounded">"List1"</code>.
            </p>

            <h4 className="text-lg font-semibold text-white mt-6">Požadované sloupce v Excel souboru</h4>
            <div className="bg-gray-800/50 rounded-lg p-4 text-xs space-y-2">
              <p className="text-white font-semibold mb-2">Základní identifikace:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  <code>vykazovanaPerioda</code> - Číslo měsíce (1-12)
                </li>
                <li>
                  <code>kraj</code> - NUTS kód kraje
                </li>
                <li>
                  <code>idVyrobny</code> - Identifikátor výrobny
                </li>
                <li>
                  <code>nazevVyrobny</code> - Název výrobny
                </li>
                <li>
                  <code>pripojenoKPsDs</code> - P/D (Přenosová soustava / Distribuční soustava)
                </li>
              </ul>

              <p className="text-white font-semibold mt-4 mb-2">Paliva (prefix 'g-'):</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  <code>g-vyhrevnostHodnota</code> - Výhřevnost paliva (MJ/m³)
                </li>
                <li>
                  <code>g-porizeniPalivaCelkem</code> - Pořízení paliva celkem
                </li>
                <li>
                  <code>g-spotrebaPalivaVyrobaTepla</code> - Spotřeba na výrobu tepla
                </li>
                <li>
                  <code>g-spotrebaPalivaVyrobaElektriny</code> - Spotřeba na výrobu elektřiny
                </li>
              </ul>

              <p className="text-white font-semibold mt-4 mb-2">Bilance KVET:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  <code>vsazkaPalivaHodnota</code> - Vsázka paliva
                </li>
                <li>
                  <code>vyrobaElektrinyBrutto</code> - Výroba elektřiny brutto
                </li>
                <li>
                  <code>dodavkaUzitecnehoTepla</code> - Dodávka užitečného tepla
                </li>
              </ul>

              <p className="text-white font-semibold mt-4 mb-2">Instalovaný výkon:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  <code>instalovanyTepelnyVykon</code> - Tepelný výkon (MWt)
                </li>
                <li>
                  <code>instalovanyElektrickyVykon</code> - Elektrický výkon (MWe)
                </li>
              </ul>

              <p className="text-white font-semibold mt-4 mb-2">Výroba elektřiny (prefix 've-'):</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  <code>ve-bruttoVyroba, ve-ztraty</code>
                </li>
                <li>
                  <code>ve-primeDodavkyCizimSubjektum</code>
                </li>
                <li>
                  <code>ve-dodavkyDoVlastnihoPodnikuNeboZarizeni</code>
                </li>
                <li>
                  <code>ve-technologickaVlastniSpotrebaNaVyrobuTepla</code>
                </li>
                <li>
                  <code>ve-technologickaVlastniSpotrebaNaVyrobuElektriny</code>
                </li>
              </ul>

              <p className="text-white font-semibold mt-4 mb-2">Výroba tepla (prefix 'vt-'):</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  Stejná struktura jako u elektřiny, prefix <code>vt-</code>
                </li>
              </ul>

              <p className="text-white font-semibold mt-4 mb-2">Bilance dodávek - elektro (prefix 'bde1-', 'bde2-'):</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  <code>bde1-nakupOdber, bde1-ztraty, bde1-vlastniSpotrebaCelkem</code>
                </li>
                <li>
                  <code>bde2-</code> (domacnosti, prumysl, energetika, atd.)
                </li>
              </ul>

              <p className="text-white font-semibold mt-4 mb-2">Bilance dodávek - teplo (prefix 'bdt1-', 'bdt2-'):</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  Stejná struktura jako u elektřiny, prefix <code>bdt-</code>
                </li>
              </ul>
            </div>

            <h4 className="text-lg font-semibold text-white mt-6">Doplňující informace</h4>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
              <li>Kontaktní telefon</li>
              <li>Odpovědný pracovník</li>
            </ul>

            <h4 className="text-lg font-semibold text-white mt-6">Výstup</h4>
            <p className="text-sm">
              JSON soubor <code className="bg-gray-800 px-2 py-1 rounded text-green-400">eru-e1-data.json</code> připravený k importu.
            </p>

            <h4 className="text-lg font-semibold text-white mt-6">Formát JSON výstupu</h4>
            <pre className="bg-gray-950 p-3 rounded mt-2 text-xs text-green-400 overflow-x-auto">
              {`{
  "typVykazu": "E1",
  "vykazy": [
    {
      "identifikacniUdajeVykazu": {
        "ico": "...",
        "typVykazu": "E1",
        "typPeriody": "MONTH",
        "vykazovanaPerioda": 1,
        "vykazovanyRok": 2024,
        "kontaktniTelefon": "+420...",
        "odpovednyPracovnik": "..."
      },
      "e1vykaz": {
        "e1Paliva": { /* ... */ },
        "e1BilanceKvet": { /* ... */ },
        "e1VyrobaADodavkaElektrinyATepla": { /* ... */ }
      }
    }
  ]
}`}
            </pre>
          </div>
        </Accordion>

        {/* ERU T1 */}
        <Accordion title="ERU-T1: Výkaz tepla" icon={<FaFire />}>
          <div className="space-y-4 text-gray-300">
            <h4 className="text-lg font-semibold text-white">Popis</h4>
            <p className="text-sm">ERU-T1 slouží k vytvoření měsíčního výkazu o výrobě a spotřebě tepla ve formátu JSON pro hromadný import do dataportu ERU.</p>

            <h4 className="text-lg font-semibold text-white mt-6">Vstup</h4>
            <p className="text-sm">Excel soubor (.xlsx nebo .xlsm) s několika listy.</p>
            <p className="text-sm text-yellow-400">💡 Šablonu si můžete stáhnout přímo na stránce ERU-T1 pomocí tlačítka "Stáhnout šablonu XLSX".</p>

            <h4 className="text-lg font-semibold text-white mt-6">Struktura šablony</h4>
            <div className="bg-gray-800/50 rounded-lg p-4 text-xs space-y-3">
              <div>
                <p className="text-white font-semibold mb-2">List "UserData" (pevné identifikační údaje):</p>
                <pre className="bg-gray-950 p-2 rounded text-green-400 overflow-x-auto">
                  {`ico                  | 29060109
cisloLicence         | 111018325
vykazovanyRok        | 2024
datovaSchranka       | n9mpdz8
drzitelLicence       | ČEZ Energo, s.r.o.
kontaktniTelefon     | +420...
odpovednyPracovnik   | ...`}
                </pre>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">List "ExportERU" (měsíční data):</p>
                <p className="text-xs text-gray-400 mb-2">Data pro každý měsíc, kraj a typ paliva:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <code>month</code> - Číslo měsíce (1-12)
                  </li>
                  <li>
                    <code>region</code> - Název kraje (např. "Středočeský")
                  </li>
                  <li>
                    <code>typPaliva</code> - Typ paliva (např. "Zemni plyn")
                  </li>
                </ul>

                <p className="text-white font-semibold mt-3 mb-2">Sloupce pro paliva (prefix 'pal_'):</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <code>pal_porizeniPaliv</code> - Pořízení paliva
                  </li>
                  <li>
                    <code>pal_spotrebaPaliva</code> - Spotřeba paliva
                  </li>
                  <li>
                    <code>pal_vyhrevnostHodnota</code> - Výhřevnost
                  </li>
                </ul>

                <p className="text-white font-semibold mt-3 mb-2">Výroba a dodávka tepla (prefix 'h_'):</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <code>h_bruttoVyroba</code> - Brutto výroba tepla
                  </li>
                  <li>
                    <code>h_ztraty</code> - Ztráty
                  </li>
                  <li>
                    <code>h_primeDodavkyCizimSubjektum</code> - Přímé dodávky
                  </li>
                  <li>
                    <code>h_technologickaVlastniSpotreba</code> - Vlastní spotřeba
                  </li>
                  <li>
                    <code>h_dodavkyDoVlastnihoPodnikuNeboZarizeni</code> - Dodávky vlastnímu podniku
                  </li>
                </ul>

                <p className="text-white font-semibold mt-3 mb-2">Bilance (prefix 'bil_'):</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <code>celkovyInstalovanyVykon</code> - Instalovaný výkon
                  </li>
                  <li>
                    <code>bil_bruttoVyroba, bil_nakup, bil_saldo, bil_ztraty</code>
                  </li>
                  <li>
                    <code>bil_vlastniSpotreba</code>
                  </li>
                  <li>
                    <code>bil_domacnosti, bil_prumysl, bil_energetika</code> atd.
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">List "Kraje" (справочник):</p>
                <p className="text-xs text-gray-400">Seznam dostupných krajů s kódy NUTS</p>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">List "Fuels" (справочник):</p>
                <p className="text-xs text-gray-400">Seznam typů paliv</p>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-white mt-6">Čtvrtletí</h4>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
              <li>
                <strong>Q1</strong>: Leden (1), Únor (2), Březen (3)
              </li>
              <li>
                <strong>Q2</strong>: Duben (4), Květen (5), Červen (6)
              </li>
              <li>
                <strong>Q3</strong>: Červenec (7), Srpen (8), Září (9)
              </li>
              <li>
                <strong>Q4</strong>: Říjen (10), Listopad (11), Prosinec (12)
              </li>
            </ul>
            <p className="text-sm text-yellow-400 mt-2">⚠️ Data v listu "ExportERU" musí obsahovat všechny 3 měsíce zvoleného čtvrtletí!</p>

            <h4 className="text-lg font-semibold text-white mt-6">Výstup</h4>
            <p className="text-sm">
              JSON soubor <code className="bg-gray-800 px-2 py-1 rounded text-green-400">eru-t1-data.json</code> připravený k importu.
            </p>

            <h4 className="text-lg font-semibold text-white mt-6">Formát JSON výstupu</h4>
            <pre className="bg-gray-950 p-3 rounded mt-2 text-xs text-green-400 overflow-x-auto">
              {`{
  "typVykazu": "T1",
  "vykazy": [
    {
      "identifikacniUdajeVykazu": {
        "ico": "...",
        "vykazovanaPerioda": 1,  // Q1, Q2, Q3, nebo Q4
        "vykazovanyRok": 2024
      },
      "t1": {
        "mesice": [
          {
            "dataZaMesic": 1,
            "kraje": {
              "kraje": [
                {
                  "dataZaKraj": "Středočeský",
                  "vykazaneHodnoty": {
                    "paliva": { /* seznamy paliv a hodnot */ }
                  }
                }
              ]
            }
          }
          // ... další měsíce
        ]
      }
    }
  ]
}`}
            </pre>
          </div>
        </Accordion>

        {/* OTE Data Download */}
        <Accordion title="OTE: Stahování a Zpracování Dat (Request/Response)" icon={<FaFileCode />}>
          <div className="space-y-4 text-gray-300">
            <h4 className="text-lg font-semibold text-white">Popis</h4>
            <p className="text-sm">
              Nástroj pro generování XML requestů a zpracování XML odpovědí od OTE. Podporuje batch zpracování více souborů najednou pomocí drag & drop nebo výběru.
            </p>

            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <h5 className="font-semibold text-white mb-3">1. Generátor Requestu (XLSX → XML)</h5>

              <h6 className="text-sm font-semibold text-gray-200 mt-4">Vstup:</h6>
              <p className="text-sm">Excel soubor(y) s následujícími sloupci:</p>
              <pre className="bg-gray-950 p-3 rounded mt-2 text-xs text-green-400 overflow-x-auto">
                {`source-id | ean               | date-from  | date-to
TEST_001 | 123456789012345678 | 2024-01-01 | 2024-01-31`}
              </pre>

              <h6 className="text-sm font-semibold text-gray-200 mt-4">Výstup:</h6>
              <p className="text-sm">
                XML soubor <code className="bg-gray-800 px-2 py-1 rounded text-green-400">xml-req.xml</code> obsahující request pro OTE API.
              </p>

              <h6 className="text-sm font-semibold text-gray-200 mt-4">Příklad XML výstupu:</h6>
              <pre className="bg-gray-950 p-3 rounded mt-2 text-xs text-green-400 overflow-x-auto">
                {`<?xml version='1.0' encoding='UTF-8' ?>
<default:RESREQ xmlns:default="http://www.ote-cr.cz/schema/oze/request">
  <default:Location source-id="TEST_001" ean="123456789012345678" 
                    date-from="2024-01-01" date-to="2024-01-31"/>
</default:RESREQ>`}
              </pre>
            </div>

            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <h5 className="font-semibold text-white mb-3">2. Zpracování Odpovědi (XML → XLSX)</h5>

              <h6 className="text-sm font-semibold text-gray-200 mt-4">Vstup:</h6>
              <p className="text-sm">
                XML soubor(y) s odpovědí od OTE obsahující data <code className="bg-gray-800 px-1 rounded">A11</code> (Dodávka) a{' '}
                <code className="bg-gray-800 px-1 rounded">A12</code> (Odběr).
              </p>

              <h6 className="text-sm font-semibold text-gray-200 mt-4">Zpracování:</h6>
              <p className="text-sm">
                Aplikace automaticky sečte všechny hodnoty <strong>A11</strong> (výroba/dodávka) a <strong>A12</strong> (spotřeba/odběr) pro každý EAN. Hodnoty A12 jsou převedeny
                na záporné číslo.
              </p>

              <h6 className="text-sm font-semibold text-gray-200 mt-4">Výstup:</h6>
              <p className="text-sm">
                Excel soubor <code className="bg-gray-800 px-2 py-1 rounded text-green-400">ote-response-processed.xlsx</code> s agregovanými daty:
              </p>
              <pre className="bg-gray-950 p-3 rounded mt-2 text-xs text-green-400 overflow-x-auto">
                {`EAN                | Dodavka  | Odber
859182400707935259 | 96506    | 606`}
              </pre>
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800">
              <h5 className="font-semibold text-blue-300 mb-2">💡 Tip: Batch zpracování</h5>
              <p className="text-sm text-gray-300">
                Můžete nahrát více souborů najednou pomocí <strong>drag & drop</strong> nebo výběrem více souborů. Všechny soubory budou zpracovány a jejich data sloučena do
                jednoho výstupního souboru.
              </p>
            </div>
          </div>
        </Accordion>

        {/* OTE Electricity Report */}
        <Accordion title="OTE: Výkazy elektřiny" icon={<FaBolt />}>
          <div className="space-y-4 text-gray-300">
            <h4 className="text-lg font-semibold text-white">Popis</h4>
            <p className="text-sm">
              Nástroj pro generování XML výkazů elektřiny pro OTE z XLSX šablony. Podporuje generování výkazů s automatickým přiřazením jednotek a správnou logikou pro
              GCR_13C/GCR_13D.
            </p>

            <h4 className="text-lg font-semibold text-white mt-6">Workflow</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm ml-4">
              <li>Stáhněte prázdnou XLSX šablonu pomocí tlačítka "Stáhnout šablonu"</li>
              <li>Vyplňte data do šablony (každý sloupec = jedna Location)</li>
              <li>Nahrajte vyplněnou šablonu a vygenerujte XML výkaz(y)</li>
            </ol>

            <h4 className="text-lg font-semibold text-white mt-6">Struktura šablony</h4>
            <div className="bg-gray-800/50 rounded-lg p-4 text-xs space-y-3">
              <div>
                <p className="text-white font-semibold mb-2">List "Data":</p>
                <p className="text-gray-400 mb-2">První sloupec obsahuje řádky s názvy polí. Každý další sloupec (B, C, D...) představuje jednu Location.</p>
                <p className="text-white font-semibold mt-3 mb-2">Řádky v prvním sloupci (v pořadí):</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <code>Opm-id</code> - Identifikátor OPM
                  </li>
                  <li>
                    <code>Source-id</code> - Identifikátor zdroje
                  </li>
                  <li>
                    <code>GCR_1</code> - Instalovaný výkon (MW)
                  </li>
                  <li>
                    <code>GCR_2</code> - Celková výroba elektřiny (MWH)
                  </li>
                  <li>
                    <code>GCR_3</code> - Výroba elektřiny z obnovitelných zdrojů (MWH)
                  </li>
                  <li>
                    <code>GCR_4</code> - Výroba elektřiny z biomasy (MWH)
                  </li>
                  <li>
                    <code>GCR_5</code> - Výroba elektřiny z bioplynu (MWH)
                  </li>
                  <li>
                    <code>GCR_6</code> - Výroba elektřiny z biokapaliny (MWH)
                  </li>
                  <li>
                    <code>GCR_7</code> - Výroba elektřiny z bioplynu z ČOV (MWH)
                  </li>
                  <li>
                    <code>GCR_13C</code> - Výroba elektřiny z KVET (MWH) - typ C
                  </li>
                  <li>
                    <code>CHP_21G</code> - Počet provozních hodin (HOD)
                  </li>
                  <li>
                    <code>CHP_28B</code> - Celková výroba elektřiny z KVET (MWH)
                  </li>
                  <li>
                    <code>CHP_22B</code> - Výroba elektřiny z KVET pro vlastní spotřebu (MWH)
                  </li>
                  <li>
                    <code>CHP_22C</code> - Účinnost výroby elektřiny (%)
                  </li>
                  <li>
                    <code>CHP_22D</code> - Výroba elektřiny z KVET pro dodávku do sítě (MWH)
                  </li>
                  <li>
                    <code>CHP_22E</code> - Účinnost výroby tepla (%)
                  </li>
                  <li>
                    <code>CHP_22</code> - Celková účinnost KVET (%)
                  </li>
                  <li>
                    <code>CHP_26</code> - Účinnost výroby elektřiny v KVET (%)
                  </li>
                  <li>
                    <code>CHP_22H</code> - Dodávka tepla z KVET
                  </li>
                  <li>
                    <code>GCR_13_TYPE</code> - Typ GCR_13: <code>C</code> nebo <code>D</code> (určuje, zda použít GCR_13C nebo GCR_13D)
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">List "static":</p>
                <p className="text-gray-400 mb-2">Globální parametry pro celý výkaz:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <code>date-from</code> - Datum začátku období (YYYY-MM-DD)
                  </li>
                  <li>
                    <code>date-to</code> - Datum konce období (YYYY-MM-DD)
                  </li>
                  <li>
                    <code>receiver-id</code> - IČO příjemce (default: 8591824000007)
                  </li>
                  <li>
                    <code>date-time</code> - Časové razítko generování
                  </li>
                </ul>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-white mt-6">Speciální logika GCR_13C/GCR_13D</h4>
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-200 mb-2">
                <strong>⚠️ Důležité:</strong> Řádek <code>GCR_13_TYPE</code> pod <code>CHP_22H</code> určuje, zda se v XML použije tag <code>GCR_13C</code> nebo{' '}
                <code>GCR_13D</code>.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-100 ml-4">
                <li>
                  Pokud je hodnota <code>C</code> (nebo prázdná) → použije se <code>GCR_13C</code>
                </li>
                <li>
                  Pokud je hodnota <code>D</code> → použije se <code>GCR_13D</code>
                </li>
                <li>
                  Hodnota z řádku <code>GCR_13C</code> se použije pro oba typy
                </li>
              </ul>
            </div>

            <h4 className="text-lg font-semibold text-white mt-6">Výstup</h4>
            <p className="text-sm">
              XML soubor(y) s názvem <code className="bg-gray-800 px-2 py-1 rounded text-green-400">elektrina-vykaz.xml</code> (nebo{' '}
              <code className="bg-gray-800 px-2 py-1 rounded text-green-400">elektrina-vykaz-1.xml</code>,{' '}
              <code className="bg-gray-800 px-2 py-1 rounded text-green-400">elektrina-vykaz-2.xml</code> pokud je více souborů).
            </p>
            <p className="text-sm text-yellow-400 mt-2">💡 Pokud je v šabloně více než 50 locations, výkaz se automaticky rozdělí do více XML souborů (po 50 locations).</p>

            <h4 className="text-lg font-semibold text-white mt-6">Struktura XML výstupu</h4>
            <pre className="bg-gray-950 p-3 rounded mt-2 text-xs text-green-400 overflow-x-auto">
              {`<?xml version='1.0' encoding='UTF-8' ?>
<RESDATA xmlns="http://www.ote-cr.cz/schema/oze/data"
         message-code="PD1"
         date-time="2025-01-15T10:30:00Z"
         id="..."
         answer-required="false"
         dtd-release="1"
         dtd-version="1">
  <SenderIdentification coding-scheme="14" id="8591824556207"/>
  <ReceiverIdentification coding-scheme="14" id="8591824000007"/>
  <Location date-from="2024-12-01"
            date-to="2024-12-31"
            opm-id="..."
            source-id="..."
            version="1">
    <Data value-type="GCR_1" value="10" unit="MW"/>
    <Data value-type="GCR_2" value="5000" unit="MWH"/>
    <Data value-type="GCR_13C" value="3000" unit="MWH"/>
    <!-- ... další Data elementy ... -->
  </Location>
  <!-- ... další Location elementy ... -->
</RESDATA>`}
            </pre>

            <h4 className="text-lg font-semibold text-white mt-6">Automatické přiřazení jednotek</h4>
            <p className="text-sm">Aplikace automaticky přiřazuje správné jednotky podle typu hodnoty:</p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
              <li>
                <code>GCR_1</code> → <code>MW</code>
              </li>
              <li>
                <code>GCR_2</code>, <code>GCR_3</code>, <code>GCR_4</code>, <code>GCR_5</code>, <code>GCR_6</code>, <code>GCR_7</code>, <code>GCR_13C</code>, <code>GCR_13D</code>,{' '}
                <code>CHP_28B</code>, <code>CHP_22B</code>, <code>CHP_22D</code> → <code>MWH</code>
              </li>
              <li>
                <code>CHP_21G</code> → <code>HOD</code>
              </li>
              <li>
                <code>CHP_22C</code>, <code>CHP_22E</code>, <code>CHP_22</code>, <code>CHP_26</code> → <code>%</code>
              </li>
              <li>
                <code>CHP_22H</code> → bez jednotky
              </li>
            </ul>
          </div>
        </Accordion>

        {/* OTE Fuel Report */}
        <Accordion title="OTE: Výkazy paliv" icon={<FaFire />}>
          <div className="space-y-4 text-gray-300">
            <h4 className="text-lg font-semibold text-white">Popis</h4>
            <p className="text-sm">
              Nástroj pro generování XML výkazů paliv pro OTE z XLSX šablony. Podporuje více paliv na jednu Location a automatické groupování podle source-id, date-from a date-to.
            </p>

            <h4 className="text-lg font-semibold text-white mt-6">Workflow</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm ml-4">
              <li>Stáhněte prázdnou XLSX šablonu pomocí tlačítka "Stáhnout šablonu"</li>
              <li>Vyplňte data do šablony (každý sloupec = jedna kombinace Location + palivo)</li>
              <li>Nahrajte vyplněnou šablonu a vygenerujte XML výkaz(y)</li>
            </ol>

            <h4 className="text-lg font-semibold text-white mt-6">Struktura šablony</h4>
            <div className="bg-gray-800/50 rounded-lg p-4 text-xs space-y-3">
              <div>
                <p className="text-white font-semibold mb-2">List "Data":</p>
                <p className="text-gray-400 mb-2">První sloupec obsahuje řádky s názvy polí. Každý další sloupec (B, C, D...) představuje jednu kombinaci Location + palivo.</p>
                <p className="text-white font-semibold mt-3 mb-2">Řádky v prvním sloupci (v pořadí):</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <code>Source-id</code> - Identifikátor zdroje
                  </li>
                  <li>
                    <code>Date-from</code> - Datum začátku období (YYYY-MM-DD)
                  </li>
                  <li>
                    <code>Date-to</code> - Datum konce období (YYYY-MM-DD)
                  </li>
                  <li>
                    <code>Source-type</code> - Typ zdroje
                  </li>
                  <li>
                    <code>Fuel-type</code> - Typ paliva (povinné)
                  </li>
                  <li>
                    <code>Aib-fuel-type</code> - AIB typ paliva (volitelné)
                  </li>
                  <li>
                    <code>Consumption</code> - Spotřeba paliva
                  </li>
                  <li>
                    <code>Caloric-value</code> - Výhřevnost paliva
                  </li>
                  <li>
                    <code>Burned-heat</code> - Spálené teplo
                  </li>
                  <li>
                    <code>Bio-consumption</code> - Bio spotřeba
                  </li>
                  <li>
                    <code>Water-content</code> - Obsah vody
                  </li>
                  <li>
                    <code>Energy</code> - Energie
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">List "static":</p>
                <p className="text-gray-400 mb-2">Globální parametry pro celý výkaz:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <code>receiver-id</code> - IČO příjemce (default: 8591824000007)
                  </li>
                  <li>
                    <code>date-time</code> - Časové razítko generování
                  </li>
                </ul>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-white mt-6">Podpora více paliv na Location</h4>
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-200 mb-2">
                <strong>💡 Tip:</strong> Pokud má jedna Location více paliv, vytvořte pro každé palivo samostatný sloupec se stejným <code>Source-id</code>, <code>Date-from</code>{' '}
                a <code>Date-to</code>.
              </p>
              <p className="text-sm text-blue-100">
                Aplikace automaticky groupuje sloupce se stejnou kombinací <code>Source-id</code> + <code>Date-from</code> + <code>Date-to</code> do jednoho Location elementu s
                více Data elementy.
              </p>
            </div>

            <h4 className="text-lg font-semibold text-white mt-6">Výstup</h4>
            <p className="text-sm">
              XML soubor(y) s názvem <code className="bg-gray-800 px-2 py-1 rounded text-green-400">paliva-vykaz.xml</code> (nebo{' '}
              <code className="bg-gray-800 px-2 py-1 rounded text-green-400">paliva-vykaz-1.xml</code>,{' '}
              <code className="bg-gray-800 px-2 py-1 rounded text-green-400">paliva-vykaz-2.xml</code> pokud je více souborů).
            </p>
            <p className="text-sm text-yellow-400 mt-2">💡 Pokud je v šabloně více než 50 locations, výkaz se automaticky rozdělí do více XML souborů (po 50 locations).</p>

            <h4 className="text-lg font-semibold text-white mt-6">Struktura XML výstupu</h4>
            <pre className="bg-gray-950 p-3 rounded mt-2 text-xs text-green-400 overflow-x-auto">
              {`<?xml version='1.0' encoding='UTF-8' ?>
<RESFUEL xmlns="http://www.ote-cr.cz/schema/oze/fuel"
         message-code="PF1"
         date-time="2025-01-15T10:30:00Z"
         id="POZE_Fuel_20250115_1"
         answer-required="false"
         dtd-release="1"
         dtd-version="1">
  <SenderIdentification coding-scheme="14" id="8591824556207"/>
  <ReceiverIdentification coding-scheme="14" id="8591824000007"/>
  <Location date-from="2024-12-01"
            date-to="2024-12-31"
            source-id="...">
    <Data source-type="..." 
          fuel-type="..."
          consumption="1000"
          caloric-value="..."
          burned-heat="0"
          bio-consumption="0"
          water-content="0"
          energy="0"/>
    <!-- Pokud má Location více paliv, jsou zde další Data elementy -->
  </Location>
  <!-- ... další Location elementy ... -->
</RESFUEL>`}
            </pre>

            <h4 className="text-lg font-semibold text-white mt-6">Povinná pole</h4>
            <p className="text-sm">Pro správné generování XML musí být vyplněna následující pole:</p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
              <li>
                <code>Source-id</code> (povinné)
              </li>
              <li>
                <code>Date-from</code> (povinné)
              </li>
              <li>
                <code>Date-to</code> (povinné)
              </li>
              <li>
                <code>Source-type</code> (povinné pro Data element)
              </li>
              <li>
                <code>Fuel-type</code> (povinné pro Data element)
              </li>
            </ul>
            <p className="text-sm text-yellow-400 mt-2">⚠️ Sloupce bez těchto povinných polí budou při generování XML přeskočeny.</p>
          </div>
        </Accordion>

        {/* Tips */}
        <Accordion title="Tipy a Best Practices">
          <div className="space-y-4 text-gray-300">
            <h4 className="text-lg font-semibold text-white">Obecné tipy</h4>
            <ul className="list-disc list-inside space-y-2 text-sm ml-4">
              <li>
                Před odesláním vygenerovaných souborů ERÚ <strong>vždy zkontrolujte výstupy</strong> proti aktuální dokumentaci ERÚ.
              </li>
              <li>V případě změn požadavků ERÚ nebo OTE může být nutné aplikaci aktualizovat.</li>
              <li>Pro batch zpracování v OTE použijte drag & drop - ušetříte čas při práci s více soubory.</li>
              <li>Uchováváte si šablony a vstupní soubory pro případnou potřebu opakování generování.</li>
              <li>Aplikace ukládá kontaktní údaje (telefon, odpovědný pracovník) pro ERU do localStorage prohlížeče pro pohodlnější opakované použití.</li>
            </ul>

            <h4 className="text-lg font-semibold text-white mt-6">Tipy pro výkazy elektřiny (OTE)</h4>
            <ul className="list-disc list-inside space-y-2 text-sm ml-4">
              <li>
                <strong>Kontrola GCR_13_TYPE:</strong> Před generováním XML zkontrolujte, že řádek <code>GCR_13_TYPE</code> obsahuje správnou hodnotu (<code>C</code> nebo{' '}
                <code>D</code>). Výchozí hodnota je <code>C</code>.
              </li>
              <li>
                <strong>Jednotky:</strong> Aplikace automaticky přiřazuje správné jednotky podle typu hodnoty. Nemusíte je zadávat ručně.
              </li>
              <li>
                <strong>Rozdělení souborů:</strong> Pokud máte více než 50 locations, výkaz se automaticky rozdělí do více XML souborů. Každý soubor obsahuje maximálně 50
                locations.
              </li>
            </ul>

            <h4 className="text-lg font-semibold text-white mt-6">Tipy pro výkazy paliv (OTE)</h4>
            <ul className="list-disc list-inside space-y-2 text-sm ml-4">
              <li>
                <strong>Více paliv na Location:</strong> Pokud má jedna Location více paliv, vytvořte pro každé palivo samostatný sloupec se stejným <code>Source-id</code>,{' '}
                <code>Date-from</code> a <code>Date-to</code>. Aplikace je automaticky zkombinuje do jednoho Location elementu.
              </li>
              <li>
                <strong>Povinná pole:</strong> Ujistěte se, že každý sloupec obsahuje alespoň <code>Source-id</code>, <code>Date-from</code>, <code>Date-to</code>,{' '}
                <code>Source-type</code> a <code>Fuel-type</code>. Sloupce bez těchto polí budou přeskočeny.
              </li>
              <li>
                <strong>Aib-fuel-type:</strong> Toto pole je volitelné a bude přidáno do XML pouze pokud je vyplněno.
              </li>
            </ul>
          </div>
        </Accordion>

        {/* Support */}
        <Accordion title="Podpora">
          <div className="space-y-4 text-gray-300">
            <p className="text-sm">V případě problémů nebo dotazů kontaktujte:</p>
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-sm">
                <strong>Email:</strong>{' '}
                <a href="mailto:urbanjakubdev@gmail.com" className="text-brand hover:underline">
                  urbanjakubdev@gmail.com
                </a>
              </p>
              <p className="text-sm mt-2">
                <strong>GitHub:</strong>{' '}
                <a href="https://github.com/UrbanJakubDev" target="_blank" rel="noreferrer" className="text-brand hover:underline">
                  UrbanJakubDev
                </a>
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Aplikace je poskytována "tak jak je". Autor nenese žádnou zodpovědnost za případné nesrovnalosti, chyby v reportingu či jakékoliv škody způsobené použitím tohoto
              nástroje.
            </p>
          </div>
        </Accordion>
      </div>
    </div>
  )
}

export default HelpPage
