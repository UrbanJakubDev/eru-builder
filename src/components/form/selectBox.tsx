export default function SelectBox({ selectedQuarter, setSelectedQuarter }: { selectedQuarter: string, setSelectedQuarter: (quarter: string) => void }) {
    return (
        <div className="mb-4">
            <select
                value={selectedQuarter}
                onChange={e => setSelectedQuarter(e.target.value)}
                className="mt-1 p-4 block w-full rounded-md bg-transparent text-indigo-600 border-2 border-indigo-600/25 hover:border-indigo-500 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-none sm:text-sm"
            >
                <option value="Q1">Q1 (Led-Bře)</option>
                <option value="Q2">Q2 (Úno-Kvě)</option>
                <option value="Q3">Q3 (Čer-Čvc)</option>
                <option value="Q4">Q4 (Zář-Pro)</option>
            </select>
        </div>
    )
}
