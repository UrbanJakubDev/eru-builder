    
type SectionProps = {
    children: React.ReactNode
    className?: string
}

export default function Section({ children, className }: SectionProps) {
    return (
        <section className={`flex flex-col gap-4 bg-white border-2 rounded-2xl border-gray-500 p-4 ${className}`}>
            {children}
        </section>
    )
}