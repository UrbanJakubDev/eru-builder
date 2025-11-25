'use client'

import { useState, useCallback, useRef } from 'react'
import { FaUpload, FaTimes } from 'react-icons/fa'

interface FileDropZoneProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  accept?: string
  multiple?: boolean
  label?: string
  placeholder?: string
  dragActivePlaceholder?: string
  fileListMaxHeight?: string
  id?: string
  className?: string
}

export default function FileDropZone({
  files,
  onFilesChange,
  accept,
  multiple = false,
  label,
  placeholder = 'Vybrat soubory',
  dragActivePlaceholder = 'Pusťte soubory zde',
  fileListMaxHeight = 'max-h-40',
  id,
  className = ''
}: FileDropZoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const uniqueId = id || `file-drop-${Math.random().toString(36).substr(2, 9)}`

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const newFiles = Array.from(e.dataTransfer.files)
        if (multiple) {
          onFilesChange([...files, ...newFiles])
        } else {
          onFilesChange([newFiles[0]])
        }
      }
    },
    [files, multiple, onFilesChange]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      if (multiple) {
        onFilesChange([...files, ...newFiles])
      } else {
        onFilesChange([newFiles[0]])
      }
    }
    // Reset input so same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors relative ${
          dragActive ? 'border-brand bg-brand/10' : 'border-gray-700 hover:border-brand/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          id={uniqueId}
        />
        <label htmlFor={uniqueId} className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center">
          <FaUpload className={`w-8 h-8 mb-2 ${dragActive ? 'text-brand' : 'text-gray-500'}`} />
          <span className="text-gray-300 font-medium">{dragActive ? dragActivePlaceholder : placeholder}</span>
          {label && <span className="text-xs text-gray-500">{label}</span>}
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className={`bg-gray-800/50 rounded-lg p-2 ${fileListMaxHeight} overflow-y-auto space-y-2`}>
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-800 p-2 rounded text-sm">
              <span className="truncate text-gray-300 max-w-[80%]">{file.name}</span>
              <button
                onClick={() => removeFile(idx)}
                className="text-gray-500 hover:text-red-400 transition-colors"
                type="button"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

