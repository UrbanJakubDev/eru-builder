import { generateXmlRequest, processXmlResponse } from '../src/lib/ote/data-download'
import * as fs from 'fs'
import * as path from 'path'

const runTests = () => {
    console.log('--- Testing Request Generation ---')
    const mockXlsxData = [
        { 'source-id': 'TEST_001', 'ean': '123456789012345678', 'date-from': '2024-01-01', 'date-to': '2024-01-31' },
        { 'source-id': 'TEST_002', 'ean': '987654321098765432', 'date-from': '2024-01-01', 'date-to': '2024-01-31' }
    ]
    const xmlReq = generateXmlRequest(mockXlsxData)
    console.log('Generated XML Request (First 200 chars):')
    console.log(xmlReq.substring(0, 200))

    if (xmlReq.includes('TEST_001') && xmlReq.includes('123456789012345678')) {
        console.log('✅ Request Generation Test Passed')
    } else {
        console.error('❌ Request Generation Test Failed')
    }

    console.log('\n--- Testing Response Processing ---')
    const xmlResPath = path.join(process.cwd(), 'xml-res.xml')
    if (fs.existsSync(xmlResPath)) {
        const xmlResContent = fs.readFileSync(xmlResPath, 'utf-8')
        try {
            const processedData = processXmlResponse(xmlResContent)
            console.log(`Processed ${processedData.length} records.`)
            if (processedData.length > 0) {
                console.log('First record:', processedData[0])
                // Check if values are summed (A11 output, A12 input * -1)
                // Based on xml-res.xml inspection earlier:
                // First location: 036522_Z11, opm-id="859182400707935259"
                // It has A11 and A12 profiles.
                // A11 sum seems to be around 140,000 (many 190s)
                // A12 sum seems to be small negative (some -2, -3)

                const firstRec = processedData[0]
                if (firstRec.EAN === '859182400707935259' && typeof firstRec.Dodavka === 'number' && typeof firstRec.Odber === 'number') {
                    console.log('✅ Response Processing Test Passed (Structure correct)')
                } else {
                    console.error('❌ Response Processing Test Failed (Data mismatch)')
                }
            } else {
                console.warn('⚠️ No records found in processed data')
            }
        } catch (e) {
            console.error('❌ Response Processing Error:', e)
        }
    } else {
        console.warn('⚠️ xml-res.xml not found, skipping real file test')
    }
}

runTests()
