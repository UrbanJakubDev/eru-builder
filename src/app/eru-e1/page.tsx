'use client'
import React, { useState } from 'react'
import { EruE1 } from '@/utils/eru_e1.js' // We'll modify eru_e1.js to be a module
import UnderConstruction from '@/components/underConstruction'
import Section from '@/components/section'
import JsonPreview from '@/components/jsonPreview/jsonPreview'

const EruConverter = () => {
  const [file, setFile] = useState<File | null>(null)
  const [jsonResult, setJsonResult] = useState<{ typVykazu: string; vykazy: any[] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [inConstruction, setInConstruction] = useState(false)
  const [kontaktniTelefon, setKontaktniTelefon] = useState('+420771529378')
  const [odpovednyPracovnik, setOdpovednyPracovnik] = useState('Nikol Doležalová')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile as any)
    }
  }

  const handleConvert = async () => {
    setLoading(true)
    try {
      const handler = new EruE1()
      if (!file) {
        throw new Error('No file selected')
      }
      const arrayBuffer = await (file as File).arrayBuffer()
      const data = handler.readFile(arrayBuffer, 'List1')
      handler.makeStatements(data, new Date(), {
        kontaktniTelefon,
        odpovednyPracovnik
      })
      const result = handler.generateStatements()
      setJsonResult(result)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError('Error processing file: ' + errorMessage)
      setJsonResult(null)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const downloadJson = (data: any) => {
    try {
      // Helper function to remove circular references
      const getCircularReplacer = () => {
        const seen = new WeakSet()
        return (key: string, value: any) => {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
              return '[Circular Reference]'
            }
            seen.add(value)
          }
          return value
        }
      }

      const blob = new Blob([JSON.stringify(data, getCircularReplacer(), 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'eru-e1-data.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading JSON:', error)
      alert('Error creating JSON file. Check console for details.')
    }
  }

  if (inConstruction) {
    return <UnderConstruction size="large" />
  }

  return (
    <div className="grid grid-cols-6 gap-4 p-4">
      <Section className="col-span-2">
        <h2 className="text-xl font-bold mb-2">ERU-E1 Generátor</h2>
        <div className="flex flex-col gap-4">
          <div>
            <input type="file" accept=".xlsx,.xlsm" onChange={handleFileChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kontaktní telefon:
              <input
                list="kontakty"
                value={kontaktniTelefon}
                onChange={e => setKontaktniTelefon(e.target.value)}
                placeholder="Zadejte nebo vyberte telefon"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring focus:ring-brand focus:ring-opacity-50"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Odpovědný pracovník:
              <input
                type="text"
                value={odpovednyPracovnik}
                onChange={e => setOdpovednyPracovnik(e.target.value)}
                placeholder="Zadejte jméno"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring focus:ring-brand focus:ring-opacity-50"
              />
            </label>
          </div>
          <button onClick={handleConvert} disabled={!file || loading} className="bg-brand text-white px-4 py-2 rounded disabled:opacity-50">
            {loading ? 'Převádím...' : 'Převést na JSON'}
          </button>
        </div>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        <details className="mt-4">
          <summary className="text-lg font-bold cursor-pointer">Obecné informace</summary>
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-4">Zdrojový soubor umožňuje vygenerovat hromadný import dat do dataportu ERU, pro výkaz ERU-E1.</p>
          </div>
        </details>
        <details className="mt-4">
          <summary className="text-lg font-bold cursor-pointer">Návod k použití ERU-E1 Konvertoru</summary>
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-4">1. Nahrajte soubor: Klikněte na pole pro nahrání souboru a vyberte svůj Excel soubor.</p>
            <p className="text-sm text-gray-600 mb-4">2. Vyplňte kontaktní údaje: Zadejte telefon a odpovědného pracovníka.</p>
            <p className="text-sm text-gray-600 mb-4">3. Spusťte konverzi: Klikněte na tlačítko "Převést na JSON". Po úspěšné konverzi si můžete stáhnout výsledný JSON soubor.</p>
          </div>
        </details>
      </Section>
      <Section className="col-span-4">{jsonResult && <JsonPreview jsonData={jsonResult} downloadJson={downloadJson} />}</Section>
    </div>
  )
}

export default EruConverter
