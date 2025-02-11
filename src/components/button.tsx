type ButtonProps = {
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
    className?: string
    loading?: boolean
}

export default function Button({ children, onClick, disabled, className, loading }: ButtonProps) {

    const handleClick = () => {
        onClick()
    }

    return (
        <button
            onClick={handleClick}
            className={`font-semibold text-brand focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500 cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed disabled:border-0 p-4 border-2 border-brand/25 hover:border-indigo-500 rounded-md flex items-center justify-center gap-2 ${className}`}
            disabled={disabled || loading}
        >
            {loading && (
                <svg className="animate-spin h-5 w-5 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {disabled ? "No file selected" : children}
        </button>
    )
}

