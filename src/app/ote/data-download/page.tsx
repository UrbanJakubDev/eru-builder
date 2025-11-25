'use client'

import { useState } from 'react'
import { FaArrowLeft, FaFileExcel, FaFileCode, FaDownload } from 'react-icons/fa'
import Link from 'next/link'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'
import { generateXmlRequest, processXmlResponse, generateTemplate } from '@/lib/ote/data-download'
import FileDropZone from '@/components/form/FileDropZone'

const DataDownloadPage = () => {
  const [reqFiles, setReqFiles] = useState<File[]>([])
  const [resFiles, setResFiles] = useState<File[]>([])
  const [isProcessingReq, setIsProcessingReq] = useState(false)
  const [isProcessingRes, setIsProcessingRes] = useState(false)

  // --- Request Generation (XLSX -> XML) ---

  const handleDownloadTemplate = () => {
    try {
      const template = generateTemplate()
      const blob = new Blob([template], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'ote-request-template.xlsx'
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

  const handleGenerateRequest = async () => {
    if (reqFiles.length === 0) return

    setIsProcessingReq(true)
    try {
      let allData: any[] = []

      for (const file of reqFiles) {
        const data = await file.arrayBuffer()
        const workbook = XLSX.read(data)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        allData = [...allData, ...jsonData]
      }

      // Filter valid rows
      const validData = allData.filter(row => row['source-id'] && row['ean'] && row['date-from'] && row['date-to'])

      // Split into chunks of 50 rows
      const chunkSize = 50
      const chunks: any[][] = []
      for (let i = 0; i < validData.length; i += chunkSize) {
        chunks.push(validData.slice(i, i + chunkSize))
      }

      // Generate XML for each chunk and download
      for (let i = 0; i < chunks.length; i++) {
        const xmlOutput = generateXmlRequest(chunks[i])
        const blob = new Blob([xmlOutput], { type: 'application/xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = chunks.length > 1 ? `xml-req-${i + 1}.xml` : 'xml-req.xml'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        // Small delay between downloads to avoid browser blocking
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      toast.success(`Vygenerováno ${chunks.length} XML soubor${chunks.length > 1 ? 'ů' : ''} z ${validData.length} řádků!`)
      setReqFiles([]) // Clear after success
    } catch (error) {
      console.error(error)
      toast.error('Chyba při generování XML: ' + (error instanceof Error ? error.message : 'Neznámá chyba'))
    } finally {
      setIsProcessingReq(false)
    }
  }

  // --- Response Processing (XML -> XLSX) ---

  const handleProcessResponse = async () => {
    if (resFiles.length === 0) return

    setIsProcessingRes(true)
    try {
      let allProcessedData: any[] = []

      // Process all XML files and merge into one array
      for (const file of resFiles) {
        const text = await file.text()
        const processedData = processXmlResponse(text)
        allProcessedData = [...allProcessedData, ...processedData]
      }

      // Generate single XLSX file from all merged data
      const worksheet = XLSX.utils.json_to_sheet(allProcessedData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

      // Download single merged file
      XLSX.writeFile(workbook, 'ote-response-processed.xlsx')

      toast.success(`Sloučeno ${resFiles.length} XML soubor${resFiles.length > 1 ? 'ů' : ''} do jednoho XLSX (${allProcessedData.length} záznamů)!`)
      setResFiles([]) // Clear after success
    } catch (error) {
      console.error(error)
      toast.error('Chyba při zpracování XML: ' + (error instanceof Error ? error.message : 'Neznámá chyba'))
    } finally {
      setIsProcessingRes(false)
    }
  }

  return (
    <div className="w-full max-w-6xl px-4 py-8">
      <div className="mb-8">
        <Link href="/ote" className="inline-flex items-center text-gray-400 hover:text-brand transition-colors mb-4">
          <FaArrowLeft className="mr-2" /> Zpět na OTE
        </Link>
        <h1 className="text-3xl font-bold text-white">Stahování a Zpracování Dat</h1>
        <p className="text-gray-400 mt-2">Generování XML requestů a zpracování XML odpovědí</p>
      </div>

      <div className="space-y-8">
        {/* Standard OTE Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Request Generator Section */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-900/30 rounded-lg">
                  <FaFileExcel className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Generátor Requestu</h2>
                  <p className="text-sm text-gray-400">XLSX &rarr; XML</p>
                </div>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors border border-gray-600 text-sm"
              >
                <FaDownload className="text-brand" /> Stáhnout šablonu
              </button>
            </div>

            <div className="space-y-6 flex-grow flex flex-col">
              <FileDropZone
                files={reqFiles}
                onFilesChange={setReqFiles}
                accept=".xlsx, .xls"
                multiple
                placeholder="Vybrat XLSX soubory"
                dragActivePlaceholder="Pusťte soubory zde"
                label="nebo přetáhněte sem"
                id="req-upload"
              />

              <div className="mt-auto">
                <button
                  onClick={handleGenerateRequest}
                  disabled={reqFiles.length === 0 || isProcessingReq}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    reqFiles.length === 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/20'
                  }`}
                >
                  {isProcessingReq ? (
                    'Zpracování...'
                  ) : (
                    <>
                      <FaFileCode /> Generovat XML Request ({reqFiles.length})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Response Processor Section */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-900/30 rounded-lg">
                <FaFileCode className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Zpracování Odpovědi</h2>
                <p className="text-sm text-gray-400">XML &rarr; XLSX</p>
              </div>
            </div>

            <div className="space-y-6 flex-grow flex flex-col">
              <FileDropZone
                files={resFiles}
                onFilesChange={setResFiles}
                accept=".xml"
                multiple
                placeholder="Vybrat XML soubory"
                dragActivePlaceholder="Pusťte soubory zde"
                label="nebo přetáhněte sem"
                id="res-upload"
              />

              <div className="mt-auto">
                <button
                  onClick={handleProcessResponse}
                  disabled={resFiles.length === 0 || isProcessingRes}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    resFiles.length === 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/20'
                  }`}
                >
                  {isProcessingRes ? (
                    'Zpracování...'
                  ) : (
                    <>
                      <FaDownload /> Zpracovat a Stáhnout XLSX ({resFiles.length})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataDownloadPage
