import Link from 'next/link'

type StatementLinkCardProps = {
  title: string
  description: string
  link: string
}

export default function StatementLinkCard({ title, description, link }: StatementLinkCardProps) {
  return (
    <Link
      href={link}
      className="w-full max-w-xs md:max-w-sm flex flex-col justify-center items-center gap-4  border-2 border-gray-500 rounded-2xl p-8 transition-all duration-200 shadow-md hover:shadow-brand hover:scale-105 hover:border-brand focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer"
    >
      <h2 className="text-3xl font-bold text-brand text-center">{title}</h2>
      <p className="text-gray-200 text-center text-base">{description}</p>
    </Link>
  )
}
