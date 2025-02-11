type UnderConstructionProps = {
    size?: 'small' | 'large'
}

export default function UnderConstruction({ size = 'large' }: UnderConstructionProps) {



    if (size === 'small') {
        return (
            <div className="eru-converter">
                <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-6 mb-6 shadow-lg">
                    <p className="mt-6 text-center text-gray-600">Tato funkce je v&nbsp;fázi vývoje.</p>
                </div>
            </div>
        )
    }

    if (size === 'large') {


        return (
            <div className="eru-converter">
                <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-6 mb-6 shadow-lg">
                    <div className="flex items-center justify-center space-x-4">
                        <span className="text-4xl">🏗️</span>
                        <span className="text-4xl">⚠️</span>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-orange-700 uppercase tracking-wider">
                                Under Construction
                            </h3>
                            <div className="flex items-center justify-center space-x-2 mt-2">
                                <span className="text-2xl">🔨</span>
                                <span className="text-2xl">⚡</span>
                                <span className="text-2xl">🔧</span>
                                <span className="text-2xl">⚙️</span>
                            </div>
                        </div>
                        <span className="text-4xl">⚠️</span>
                        <span className="text-4xl">🏗️</span>
                    </div>
                    <p className="mt-6 text-center text-gray-600">Tato funkce je v&nbsp;fázi vývoje.</p>
                </div>
            </div>
        )
    }
}