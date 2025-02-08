import Link from "next/link"

type StatementLinkCardProps = {
    title: string
    description: string
    link: string
}

export default function StatementLinkCard({ title, description, link }: StatementLinkCardProps) {
    return (
        <Link href={link} className="flex flex-col gap-4 border-2 border-gray-500 p-20 hover:shadow-md hover:shadow-gray-500">
            <h2>{title}</h2>
            <p>{description}</p>
        </Link>
    )
}