"use client"
import FileBox from "./fileBox"
import SelectBox from "./selectBox"
type FormProps = {
    handleConvert: () => void
    selectedQuarter: string
    setSelectedQuarter: (quarter: string) => void
    file: File | null
    setFile: (file: File | null) => void
    loading: boolean
}

export default function Form({ handleConvert, selectedQuarter, setSelectedQuarter, file, setFile, loading }: FormProps) {

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0]
        if (uploadedFile) {
            setFile(uploadedFile as any) // Type assertion to fix type mismatch
        }
    }

    return (
        <div className="flex flex-col gap-4 ">
            <FileBox handleFileChange={handleFileChange} handleConvert={handleConvert} file={file} loading={loading} />
            <SelectBox
                selectedQuarter={selectedQuarter}
                setSelectedQuarter={setSelectedQuarter}
            />
        </div>
    )
}