'use client'

import { useState } from 'react'
import { FaArrowLeft, FaFileExcel, FaFileCode, FaDownload } from 'react-icons/fa'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { generateEmptyElectricityTemplate, generateElectricityXmlFromXlsx } from '@/lib/ote/electricity-report'
import FileDropZone from '@/components/form/FileDropZone'

const ElectricityReportPage = () => {
  const [elecXlsxFiles, setElecXlsxFiles] = useState<File[]>([])
  const [isProcessingElecXlsx, setIsProcessingElecXlsx] = useState(false)

  const handleDownloadTemplate = () => {
    try {
      const template = generateEmptyElectricityTemplate()
      const blob = new Blob([template], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'elektrina-vykaz-template.xlsx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Šablona stažena!')
    } catch (error) {
      console.error('Template download failed', error)
      toast.error('Chyba při generování šablony.')
    }
  }

  const handleElectricityXlsxToXml = async () => {
    if (elecXlsxFiles.length === 0) return

    setIsProcessingElecXlsx(true)
    try {
      // Process first XLSX file
      const file = elecXlsxFiles[0]
      const arrayBuffer = await file.arrayBuffer()
      const xmlFiles = generateElectricityXmlFromXlsx(arrayBuffer)

      // Download all XML files
      for (let i = 0; i < xmlFiles.length; i++) {
        const blob = new Blob([xmlFiles[i]], { type: 'application/xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = xmlFiles.length > 1 ? `elektrina-vykaz-${i + 1}.xml` : 'elektrina-vykaz.xml'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        // Small delay between downloads
        if (i < xmlFiles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      toast.success(`Vygenerováno ${xmlFiles.length} XML soubor${xmlFiles.length > 1 ? 'ů' : ''}!`)
      setElecXlsxFiles([])
    } catch (error) {
      console.error(error)
      toast.error('Chyba při generování XML: ' + (error instanceof Error ? error.message : 'Neznámá chyba'))
    } finally {
      setIsProcessingElecXlsx(false)
    }
  }

  return (
    <div className="w-full max-w-6xl px-4 py-8">
      <div className="mb-8">
        <Link href="/ote" className="inline-flex items-center text-gray-400 hover:text-brand transition-colors mb-4">
          <FaArrowLeft className="mr-2" /> Zpět na OTE
        </Link>
        <h1 className="text-3xl font-bold text-white">Výkaz Elektřiny</h1>
        <p className="text-gray-400 mt-2">Stáhněte šablonu, vyplňte data a vygenerujte XML výkaz</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Download Template */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-900/30 rounded-lg">
                <FaFileExcel className="w-8 h-8 text-purple-500" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">Šablona pro Výkaz Elektřiny</h2>
                <p className="text-sm text-gray-400">Stáhněte prázdnou XLSX šablonu pro vyplnění dat</p>
              </div>
            </div>
              <button
              onClick={handleDownloadTemplate}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-purple-500/20"
              >
              <FaDownload /> Stáhnout šablonu
              </button>
          </div>
        </div>

        {/* XLSX to XML Generator */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-900/30 rounded-lg">
              <FaFileCode className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Generátor XML</h2>
              <p className="text-sm text-gray-400">XLSX &rarr; XML (po 50 locations)</p>
            </div>
          </div>

          <div className="space-y-6 flex-grow flex flex-col">
            <FileDropZone
              files={elecXlsxFiles}
              onFilesChange={setElecXlsxFiles}
              accept=".xlsx, .xls"
              multiple={false}
              placeholder="Vybrat XLSX soubor"
              dragActivePlaceholder="Pusťte soubor zde"
              label="nebo přetáhněte sem"
              id="elec-xlsx-upload"
            />

            <div className="mt-auto">
              <button
                onClick={handleElectricityXlsxToXml}
                disabled={elecXlsxFiles.length === 0 || isProcessingElecXlsx}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  elecXlsxFiles.length === 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20'
                }`}
              >
                {isProcessingElecXlsx ? (
                  'Zpracování...'
                ) : (
                  <>
                    <FaFileCode /> Generovat XML ({elecXlsxFiles.length})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ElectricityReportPage
