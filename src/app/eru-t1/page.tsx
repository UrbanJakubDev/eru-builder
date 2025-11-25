'use client'
import { useState } from 'react'
import { EruT1 } from '@/utils/eru_t1.js'
import { FaArrowLeft, FaFileExcel, FaFileCode, FaInfoCircle, FaDownload } from 'react-icons/fa'
import Link from 'next/link'
import { toast } from 'react-toastify'
import FileDropZone from '@/components/form/FileDropZone'

const EruConverter = () => {
  const [jsonResult, setJsonResult] = useState<any>(null)
  const [selectedQuarter, setSelectedQuarter] = useState('Q1')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const handleConvert = async () => {
    setLoading(true)
    try {
      const handler = new EruT1()
      handler.setQuarter(selectedQuarter)

      const file = files[0]
      if (!file) {
        throw new Error('Vyberte prosím soubor')
      }

      const arrayBuffer = await file.arrayBuffer()
      const data = handler.readFile(arrayBuffer)

      handler.makeStatement()
      const result = handler.generateStatements()

      setJsonResult(result)
      toast.success('Konverze proběhla úspěšně!')
    } catch (err) {
      toast.error((err as Error).message)
      setJsonResult(null)
    } finally {
      setLoading(false)
    }
  }

  const downloadJson = () => {
    if (!jsonResult) return
    try {
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

      const blob = new Blob([JSON.stringify(jsonResult, getCircularReplacer(), 2)], {
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
      toast.success('JSON soubor stažen!')
    } catch (error) {
      toast.error('Chyba při stahování JSON souboru.')
    }
  }

  const handleDownloadTemplate = () => {
    try {
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
      toast.success('Šablona stažena!')
    } catch (error) {
      toast.error('Chyba při generování šablony.')
    }
  }

  return (
    <div className="w-full max-w-6xl px-4 py-8">
      <div className="mb-8">
        <Link href="/eru" className="inline-flex items-center text-gray-400 hover:text-brand transition-colors mb-4">
          <FaArrowLeft className="mr-2" /> Zpět na ERU
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">ERU-T1 Generátor</h1>
            <p className="text-gray-400 mt-2">Generátor měsíčního výkazu o výrobě a spotřebě tepla</p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors border border-gray-600"
          >
            <FaDownload className="text-brand" /> Stáhnout šablonu XLSX
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaFileExcel className="text-green-500" /> Vstupní data
            </h2>

            <div className="space-y-4">
              <FileDropZone
                files={files}
                onFilesChange={newFiles => {
                  setFiles(newFiles.slice(0, 1))
                  setJsonResult(null)
                }}
                accept=".xlsx,.xlsm"
                placeholder="Vybrat Excel soubor"
                dragActivePlaceholder="Pusťte soubor zde"
                label=".xlsx nebo .xlsm"
                id="eru-t1-upload"
              />

              {/* Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Čtvrtletí</label>
                  <select
                    value={selectedQuarter}
                    onChange={e => setSelectedQuarter(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all appearance-none"
                  >
                    <option value="Q1">1. Čtvrtletí (Leden - Březen)</option>
                    <option value="Q2">2. Čtvrtletí (Duben - Červen)</option>
                    <option value="Q3">3. Čtvrtletí (Červenec - Září)</option>
                    <option value="Q4">4. Čtvrtletí (Říjen - Prosinec)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleConvert}
                disabled={files.length === 0 || loading}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  files.length === 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/20'
                }`}
              >
                {loading ? 'Zpracování...' : 'Převést na JSON'}
              </button>
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <FaInfoCircle className="text-blue-400" /> Nápověda
            </h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>1. Stáhněte si šablonu XLSX.</p>
              <p>2. Vyplňte data (zachovejte strukturu).</p>
              <p>3. Nahrajte vyplněný soubor.</p>
              <p>4. Zvolte čtvrtletí a převeďte.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Result Preview */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaFileCode className="text-yellow-500" /> Náhled JSON
              </h2>
              {jsonResult && (
                <button
                  onClick={downloadJson}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-600"
                >
                  Stáhnout JSON
                </button>
              )}
            </div>

            <div className="flex-grow bg-gray-950 rounded-xl border border-gray-800 p-4 overflow-auto max-h-[600px]">
              {jsonResult ? (
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">{JSON.stringify(jsonResult, null, 2)}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <FaFileCode className="w-12 h-12 mb-4 opacity-20" />
                  <p>Zde se zobrazí náhled vygenerovaného JSONu</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EruConverter
