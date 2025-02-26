import Link from "next/link"

type StatementLinkCardProps = {
    title: string
    description: string
    link: string
}

export default function StatementLinkCard({ title, description, link }: StatementLinkCardProps) {
    return (
        <Link href={link} className="flex flex-col justify-center items-center gap-4 bg-white border-2 rounded-2xl border-gray-500 w-full xl:w-150 h-60 hover:shadow-md hover:shadow-brand">
            <h2 className="text-3xl font-bold text-brand">{title}</h2>
            <p>{description}</p>
        </Link>
    )
}