import Button from "../button"
import { RiFileExcel2Line } from "react-icons/ri";



type FileBoxProps = {
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleConvert: () => void
    file: File | null
    loading: boolean
}

export default function FileBox({ handleFileChange, handleConvert, file, loading }: FileBoxProps) {
    return (
        <div className="col-span-full">
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-200/25 px-6 py-10">
                <div className="text-center">
                    <div className="flex justify-center items-center">
                        <RiFileExcel2Line className="text-brand text-4xl" />
                    </div>
                    <div className="mt-4 flex text-sm/6 text-gray-600 justify-center gap-1">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md  font-semibold text-brand focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500">
                            <span>Nahrajte soubor</span>
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                accept=".xlsx,.xlsm,.numbers"
                                onChange={handleFileChange}
                                className="sr-only"
                            />
                        </label>
                        <p>nebo přetáhněte a upravte</p>
                    </div>
                    <p className="text-xs/5 text-gray-600 mb-4">Excel soubory (.xlsx, .xlsm, .numbers)</p>
                    <Button
                        onClick={handleConvert}
                        disabled={!file || loading}
                        loading={loading}
                    >Převést na JSON</Button>
                </div>
            </div>
        </div>
    )
}