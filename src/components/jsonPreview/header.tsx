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
            <hr />
        </>
    )
}