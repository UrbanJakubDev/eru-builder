'use client'
import { useState } from 'react'
import { EruT1 } from '@/utils/eru_t1.js' // We'll modify eru_e1.js to be a module
import JsonPreview from '@/components/jsonPreview/jsonPreview'
import JsonPreviewHeader from '@/components/jsonPreview/header'
import Section from '@/components/section'
import { toast } from 'react-toastify'
import Form from '@/components/form/index'

const EruConverter = () => {
  const [jsonResult, setJsonResult] = useState<any>(null)
  const [selectedQuarter, setSelectedQuarter] = useState('Q1')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleConvert = async () => {
    setLoading(true)
    try {
      const handler = new EruT1()
      handler.setQuarter(selectedQuarter)

      if (!file) {
        throw new Error('Please select a file')
      }

      const arrayBuffer = await file.arrayBuffer()
      const data = handler.readFile(arrayBuffer)

      handler.makeStatement()
      const result = handler.generateStatements()

      setJsonResult(result)

      // Add delay to show loading state
    } catch (err) {
      toast.error((err as Error).message)
      setJsonResult(null)
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
      a.download = 'eru-t1-data.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Error creating JSON file. Check console for details.')
    }
  }

  const handleDownloadTemplate = () => {
    const handler = new EruT1()
    const template = handler.generateTemplate()

    const blob = new Blob([template], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'eru-t1-template.xlsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className=" flex flex-col md:grid md:grid-cols-6 gap-4 p-4">
      <Section className="col-span-2">
        <JsonPreviewHeader
          title="ERU-T1 Generátor"
          buttonText="Stáhnout šablonu XLSX"
          handleDownloadJson={handleDownloadTemplate} />

        <Form
          handleConvert={handleConvert}
          selectedQuarter={selectedQuarter}
          setSelectedQuarter={setSelectedQuarter}
          file={file}
          setFile={setFile}
          loading={loading}
        />

        <details className="mt-4">
          <summary className="text-lg font-bold cursor-pointer">Obecné informace</summary>
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-4">
              Zdrojový soubor umožnuje vygenerovat hromadný import dat do dataportu ERU, pro výkaz ERU-T1, za čtvrtletí.
              Data se generují pro měsíc, kraj a palivo. Měsíce musí být ve zvoleném čtvrtletí.
            </p>
          </div>
        </details>
        <details className="mt-4">
          <summary className="text-lg font-bold cursor-pointer">Návod k použití ERU-T1 Konvertoru</summary>
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-4">
              1. Stáhněte si šablonu: Nejprve klikněte na tlačítko "Stáhnout šablonu XLSX" pro stažení vzorového souboru. Tento soubor obsahuje strukturu, kterou je třeba dodržet při vkládání vašich dat.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              2. Vyplňte data: Otevřete stažený soubor v aplikaci, která podporuje formát XLSX (např. Microsoft Excel). Vložte vaše data do příslušných sloupců. Ujistěte se, že zachováte následující sloupce a řádky:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>Sloupec A: [Název sloupce] - Popis, co by měl obsahovat.</li>
              <li>Sloupec B: [Název sloupce] - Popis, co by měl obsahovat.</li>
              <li>Řádek 1: Musí obsahovat hlavičky sloupců, které nesmí být změněny.</li>
            </ul>
            <p className="text-sm text-gray-600 mb-4">
              3. Nahrajte soubor: Po vyplnění dat se vraťte na tuto stránku a nahrajte upravený soubor pomocí formuláře.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              4. Spusťte konverzi: Klikněte na tlačítko "Convert" pro spuštění konverze. Během konverze se zobrazí indikátor načítání.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              5. Stáhněte výsledky: Po úspěšné konverzi si můžete stáhnout výsledný JSON soubor, který obsahuje zpracovaná data.
            </p>
          </div>
        </details>
      </Section>

      <Section className="min-h-28 col-span-4">
        {jsonResult && <JsonPreview jsonData={jsonResult} downloadJson={downloadJson} />}
      </Section>
    </div>
  )
}

export default EruConverter
