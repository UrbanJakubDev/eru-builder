import Button from "../button";

type JsonPreviewHeaderProps = {
    title: string
    buttonText: string
    handleDownloadJson: () => void
}

export default function JsonPreviewHeader({ title, buttonText, handleDownloadJson }: JsonPreviewHeaderProps) {
    return (
        <>
            <div className="flex justify-between items-baseline p-2">
                <h3 className="text-xl font-bold">{title}</h3>
                <Button onClick={handleDownloadJson}>{buttonText}</Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                Tento generátor vygeneruje JSON soubor, který lze použít pro import dat do dataportu ERU pro výkaz ERU-T1.
            </p>
            <hr />
        </>
    )
}