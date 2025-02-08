import JsonPreviewHeader from './header'
interface JsonPreviewProps {
    jsonData: any
    downloadJson: (json: any) => void
}

export default function JsonPreview({ jsonData, downloadJson }: JsonPreviewProps) {

    const handleDownloadJson = () => {
        downloadJson(jsonData)
    }

    return (
        <>
            <JsonPreviewHeader title="Náhled JSON" buttonText="Stáhnout JSON" handleDownloadJson={handleDownloadJson} />
            <div className="p-2 overflow-y-scroll h-[900px]">
                <pre>{JSON.stringify(jsonData, null, 2)}</pre>
            </div>
        </>
    )
}