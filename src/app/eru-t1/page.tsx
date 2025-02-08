'use client'
import { useState } from 'react'
import { EruT1 } from '@/utils/eru_t1.js' // We'll modify eru_e1.js to be a module
import JsonPreview from '@/components/jsonPreview/jsonPreview'
import JsonPreviewHeader from '@/components/jsonPreview/header'
import Section from '@/components/section'
import { toast } from 'react-toastify'
import Form from '@/components/form/index'

const EruConverter = () => {
  const [jsonResult, setJsonResult] = useState(null)
  const [selectedQuarter, setSelectedQuarter] = useState('Q1')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleConvert = async () => {
    setLoading(true)
    try {
      const handler = new EruT1()
      handler.setQuarter(selectedQuarter)

      const arrayBuffer = await file?.arrayBuffer()
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
    <div className="grid grid-cols-6 gap-4 p-4">
      <Section className="col-span-2">
        <JsonPreviewHeader
          title="ERU T1 Converter"
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
      </Section>

      <Section className="col-span-4">
        {jsonResult && <JsonPreview jsonData={jsonResult} downloadJson={downloadJson} />}
      </Section>
    </div>
  )
}

export default EruConverter
