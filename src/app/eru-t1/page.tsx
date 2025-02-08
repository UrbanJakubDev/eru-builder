'use client'
import { useState } from 'react'
import { EruT1 } from '@/utils/eru_t1.js' // We'll modify eru_e1.js to be a module
import { toast } from 'react-toastify'

const EruConverter = () => {
  const [file, setFile] = useState(null)
  const [jsonResult, setJsonResult] = useState(null)
  const [selectedQuarter, setSelectedQuarter] = useState('Q1')
  const [eruHandler, setEruHandler] = useState(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      try {
        const handler = new EruT1()
        const arrayBuffer = await uploadedFile.arrayBuffer()
        handler.readFile(arrayBuffer)
        setEruHandler(handler)
      } catch (err) {
        toast.error('Error analyzing file: ' + err.message)
      }
    }
  }

  const handleConvert = async () => {
    try {
      const handler = new EruT1()
      handler.setQuarter(selectedQuarter)

      const arrayBuffer = await file.arrayBuffer()
      const data = handler.readFile(arrayBuffer)

      handler.makeStatement()
      const result = handler.generateStatements()

      setJsonResult(result)
    } catch (err) {
      toast.error(err.message)
      setJsonResult(null)
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
    <div className="eru-converter">
      <h2>ERU T1 Converter</h2>

      <div className="mb-4">
        <button onClick={handleDownloadTemplate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm">
          Download Template XLSX
        </button>
      </div>

      <div className="file-input">
        <input type="file" accept=".xlsx,.xlsm,.numbers" onChange={handleFileChange} />
        <button onClick={handleConvert} disabled={!file}>
          Convert to JSON
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Quarter</label>
        <select
          value={selectedQuarter}
          onChange={e => setSelectedQuarter(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="Q1">Q1 (Jan-Mar)</option>
          <option value="Q2">Q2 (Apr-Jun)</option>
          <option value="Q3">Q3 (Jul-Sep)</option>
          <option value="Q4">Q4 (Oct-Dec)</option>
        </select>
      </div>

      {jsonResult && (
        <div className="result-preview">
          <h3>Preview:</h3>
          <button onClick={() => downloadJson(jsonResult)}>Download JSON</button>
          <pre>{JSON.stringify(jsonResult, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default EruConverter
