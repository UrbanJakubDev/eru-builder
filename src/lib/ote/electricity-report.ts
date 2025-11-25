import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import * as XLSX from 'xlsx'

// Types for Electricity Report
interface ElectricityData {
  unit?: string
  value: string
  'value-type': string
}

interface ElectricityLocation {
  'date-from': string
  'date-to': string
  'opm-id': string
  'source-id': string
  version: string
  Data: ElectricityData[] | ElectricityData
}

interface ElectricityReport {
  RESDATA: {
    '@_date-time': string
    '@_id': string
    ReceiverIdentification: {
      '@_id': string
    }
    Location: ElectricityLocation[] | ElectricityLocation
  }
}

export interface ParsedElectricityReport {
  dateTime: string
  receiverId: string
  dateFrom: string
  dateTo: string
  locations: Array<{
    opmId: string
    sourceId: string
    dateFrom: string
    dateTo: string
    version: string
    data: Record<string, { value: string; unit?: string }>
  }>
  allValueTypes: string[]
}

export const parseElectricityReport = (xmlString: string): ParsedElectricityReport => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: name => name === 'Location' || name === 'Data'
  })

  const result = parser.parse(xmlString) as ElectricityReport

  if (!result.RESDATA || !result.RESDATA.Location) {
    throw new Error('Invalid XML format: Missing RESDATA or Location')
  }

  const locations = Array.isArray(result.RESDATA.Location) ? result.RESDATA.Location : [result.RESDATA.Location]
  const receiverId = result.RESDATA.ReceiverIdentification?.['@_id'] || ''
  const dateTime = result.RESDATA['@_date-time'] || new Date().toISOString()

  // Get date-from and date-to from first location
  const firstLocation = locations[0]
  const dateFrom = firstLocation['date-from'] || ''
  const dateTo = firstLocation['date-to'] || ''

  // Collect all unique value-types
  const valueTypeSet = new Set<string>()
  const parsedLocations = locations.map(location => {
    const dataArray = Array.isArray(location.Data) ? location.Data : [location.Data]
    const dataMap: Record<string, { value: string; unit?: string }> = {}

    dataArray.forEach(data => {
      if (data && data['value-type']) {
        valueTypeSet.add(data['value-type'])
        dataMap[data['value-type']] = {
          value: data.value || '',
          unit: data.unit
        }
      }
    })

    return {
      opmId: location['opm-id'] || '',
      sourceId: location['source-id'] || '',
      dateFrom: location['date-from'] || '',
      dateTo: location['date-to'] || '',
      version: location.version || '1',
      data: dataMap
    }
  })

  // If receiverId is not in XML, extract from first opm-id (first 13 characters)
  let finalReceiverId = receiverId
  if (!finalReceiverId && parsedLocations.length > 0) {
    finalReceiverId = parsedLocations[0].opmId.substring(0, 13)
  }

  return {
    dateTime,
    receiverId: finalReceiverId,
    dateFrom,
    dateTo,
    locations: parsedLocations,
    allValueTypes: Array.from(valueTypeSet).sort()
  }
}

export const generateElectricityTemplateFromXml = (xmlString: string): ArrayBuffer => {
  const parsed = parseElectricityReport(xmlString)

  // Create rows: first column has opm-id, source-id, then all value-types
  // Each subsequent column represents one location
  const rows: any[][] = []

  // First column: opm-id, source-id, then all value-types
  const firstColumn = ['opm-id', 'source-id', ...parsed.allValueTypes]

  // Initialize first column
  firstColumn.forEach((label, rowIndex) => {
    if (!rows[rowIndex]) rows[rowIndex] = []
    rows[rowIndex][0] = label
  })

  // Fill data for each location (each location becomes a column starting from B)
  parsed.locations.forEach((location, locationIndex) => {
    const colIndex = locationIndex + 1 // Start from column B (index 1)

    // opm-id (row 0)
    rows[0][colIndex] = location.opmId

    // source-id (row 1)
    rows[1][colIndex] = location.sourceId

    // Value-type rows (starting from row 2)
    parsed.allValueTypes.forEach((valueType, valueTypeIndex) => {
      const rowIndex = valueTypeIndex + 2 // Start from row 2 (after opm-id and source-id)
      if (!rows[rowIndex]) rows[rowIndex] = []

      const data = location.data[valueType]
      rows[rowIndex][colIndex] = data ? data.value : ''
    })
  })

  // Create Data worksheet
  const dataWorksheet = XLSX.utils.aoa_to_sheet(rows)
  // Set column widths: first column wider, others standard
  const maxCols = Math.max(...rows.map(row => row.length))
  dataWorksheet['!cols'] = Array.from({ length: maxCols }, (_, i) => ({
    wch: i === 0 ? 20 : 15
  }))

  // Create static worksheet
  const staticData = [
    ['date-from', parsed.dateFrom],
    ['date-to', parsed.dateTo],
    ['receiver-id', parsed.receiverId],
    ['date-time', parsed.dateTime]
  ]
  const staticWorksheet = XLSX.utils.aoa_to_sheet(staticData)
  staticWorksheet['!cols'] = [{ wch: 20 }, { wch: 30 }]

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, dataWorksheet, 'Data')
  XLSX.utils.book_append_sheet(workbook, staticWorksheet, 'static')

  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
}

// Generate empty template for electricity report
export const generateEmptyElectricityTemplate = (): ArrayBuffer => {
  // Helper function to generate random OPM ID (18 digits starting with 8591824)
  const generateRandomOpmId = (): string => {
    const prefix = '8591824'
    const randomPart = Math.floor(Math.random() * 10000000000)
      .toString()
      .padStart(10, '0')
    return prefix + randomPart
  }

  // Helper function to generate random Source ID (format: XXXXXX_Z11)
  const generateRandomSourceId = (): string => {
    const randomNum = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0')
    return `${randomNum}_Z11`
  }

  // Generate random IDs for dummy data
  const opmId1 = generateRandomOpmId()
  const sourceId1 = generateRandomSourceId()
  const opmId2 = generateRandomOpmId()
  const sourceId2 = generateRandomSourceId()

  // Define the rows in the correct order
  // GCR_13C/GCR_13D will be determined based on the value or a row below CHP_22H
  // Column A: labels, Column B: Location 1 (GCR_13D), Column C: Location 2 (GCR_13C)
  const rows: any[][] = [
    ['Opm-id', opmId1, opmId2],
    ['Source-id', sourceId1, sourceId2],
    ['GCR_1', '0,03', '1,56'],
    ['GCR_2', '19,826', '789,353'],
    ['GCR_3', '0', '17,066'],
    ['GCR_4', '7,57775', '0'],
    ['GCR_5', '7,57775', '0'],
    ['GCR_6', '12,98675', '772,91525'],
    ['GCR_7', '0,7385', '0,62775'],
    ['GCR_13C', '0,7385', '0,62775'], // Value will be used for GCR_13C or GCR_13D based on GCR_13_TYPE
    ['CHP_21G', '660,867', '505,996'],
    ['CHP_28B', '19,826', '789,353'],
    ['CHP_22B', '65,75', '1867,787'],
    ['CHP_22C', '47,242', '49,742'],
    ['CHP_22D', '38,75', '873,611'],
    ['CHP_22E', '90', '90'],
    ['CHP_22', '22,67', '26,97'],
    ['CHP_26', '89,1', '89'],
    ['CHP_22H', '0,531', '0,9'],
    ['GCR_13_TYPE', 'D', 'C'] // Row below CHP_22H to determine GCR_13C or GCR_13D (C or D)
  ]

  // Create Data worksheet
  const dataWorksheet = XLSX.utils.aoa_to_sheet(rows)
  dataWorksheet['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 25 }] // First column width, then wider for data columns

  // Create static worksheet with default values
  const staticData = [
    ['date-from', '2024-12-01'],
    ['date-to', '2024-12-31'],
    ['receiver-id', '8591824000007'],
    ['date-time', new Date().toISOString()]
  ]
  const staticWorksheet = XLSX.utils.aoa_to_sheet(staticData)
  staticWorksheet['!cols'] = [{ wch: 20 }, { wch: 30 }]

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, dataWorksheet, 'Data')
  XLSX.utils.book_append_sheet(workbook, staticWorksheet, 'static')

  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
}

// Map value types to their units
const getUnitForValueType = (valueType: string): string | undefined => {
  const unitMap: Record<string, string> = {
    GCR_1: 'MW',
    GCR_2: 'MWH',
    GCR_3: 'MWH',
    GCR_4: 'MWH',
    GCR_5: 'MWH',
    GCR_6: 'MWH',
    GCR_7: 'MWH',
    GCR_13C: 'MWH',
    GCR_13D: 'MWH',
    CHP_21G: 'HOD',
    CHP_28B: 'MWH',
    CHP_22B: 'MWH',
    CHP_22C: '%',
    CHP_22D: 'MWH',
    CHP_22E: '%',
    CHP_22: '%',
    CHP_26: '%'
    // CHP_22H has no unit
  }
  return unitMap[valueType]
}

export const generateElectricityXmlFromXlsx = (xlsxData: ArrayBuffer): string[] => {
  const workbook = XLSX.read(xlsxData, { type: 'array' })

  // Read static data
  const staticSheet = workbook.Sheets['static']
  if (!staticSheet) {
    throw new Error('Missing "static" sheet in XLSX file')
  }
  const staticData = XLSX.utils.sheet_to_json(staticSheet, { header: 1 }) as any[][]
  const staticMap = new Map<string, string>()
  staticData.forEach(row => {
    if (row[0] && row[1]) {
      staticMap.set(String(row[0]), String(row[1]))
    }
  })

  const dateFrom = staticMap.get('date-from') || ''
  const dateTo = staticMap.get('date-to') || ''
  const receiverId = staticMap.get('receiver-id') || ''
  const dateTime = staticMap.get('date-time') || new Date().toISOString()

  // Read data sheet
  const dataSheet = workbook.Sheets['Data']
  if (!dataSheet) {
    throw new Error('Missing "Data" sheet in XLSX file')
  }

  const dataRows = XLSX.utils.sheet_to_json(dataSheet, { header: 1, defval: '' }) as any[][]
  if (dataRows.length < 2) {
    throw new Error('Invalid data structure: need at least 2 rows')
  }

  // First column contains labels: opm-id (row 0), source-id (row 1), then value-types
  // Each subsequent column (starting from B) represents one location
  const locations: Array<{
    opmId: string
    sourceId: string
    data: Record<string, string>
  }> = []

  // Find opm-id and source-id rows (should be rows 0 and 1)
  const opmIdRowIndex = 0
  const sourceIdRowIndex = 1

  const firstRowLabel = String(dataRows[opmIdRowIndex]?.[0] || '')
    .trim()
    .toLowerCase()
  const secondRowLabel = String(dataRows[sourceIdRowIndex]?.[0] || '')
    .trim()
    .toLowerCase()

  if (!firstRowLabel.includes('opm-id') || !secondRowLabel.includes('source-id')) {
    throw new Error('Invalid data structure: first column must start with Opm-id and Source-id')
  }

  // Collect all value-types from first column (starting from row 2)
  const valueTypes: string[] = []
  const valueTypeRowIndices = new Map<string, number>()

  for (let rowIndex = 2; rowIndex < dataRows.length; rowIndex++) {
    const valueType = String(dataRows[rowIndex]?.[0] || '').trim()
    if (valueType) {
      valueTypes.push(valueType)
      valueTypeRowIndices.set(valueType, rowIndex)
    }
  }

  // Find maximum number of columns (locations)
  const maxCols = Math.max(...dataRows.map(row => row.length), 1)

  // Find GCR_13_TYPE row index (if exists, should be below CHP_22H)
  const gcr13TypeRowIndex = valueTypeRowIndices.get('GCR_13_TYPE')

  // Extract location data from each column (starting from column B, index 1)
  for (let colIndex = 1; colIndex < maxCols; colIndex++) {
    const opmId = String(dataRows[opmIdRowIndex]?.[colIndex] || '').trim()
    const sourceId = String(dataRows[sourceIdRowIndex]?.[colIndex] || '').trim()

    if (!opmId || !sourceId) continue // Skip empty locations

    const locationData: Record<string, string> = {}

    // Check for GCR_13C value
    const gcr13cRowIndex = valueTypeRowIndices.get('GCR_13C')
    let gcr13cValue = ''
    if (gcr13cRowIndex !== undefined) {
      gcr13cValue = String(dataRows[gcr13cRowIndex]?.[colIndex] || '').trim()
    }

    // Check for GCR_13_TYPE to determine if we should use GCR_13C or GCR_13D
    let gcr13Type = 'C' // Default to C
    if (gcr13TypeRowIndex !== undefined) {
      const typeValue = String(dataRows[gcr13TypeRowIndex]?.[colIndex] || '')
        .trim()
        .toUpperCase()
      if (typeValue === 'D') {
        gcr13Type = 'D'
      }
    }

    // Process all value-types
    valueTypes.forEach(valueType => {
      // Skip GCR_13C and GCR_13_TYPE, we'll handle them separately
      if (valueType === 'GCR_13C' || valueType === 'GCR_13_TYPE') {
        return
      }

      const rowIndex = valueTypeRowIndices.get(valueType)
      if (rowIndex !== undefined) {
        const value = String(dataRows[rowIndex]?.[colIndex] || '').trim()
        if (value) {
          locationData[valueType] = value
        }
      }
    })

    // Add GCR_13 value with correct type (C or D)
    if (gcr13cValue) {
      const finalGcr13Type = gcr13Type === 'D' ? 'GCR_13D' : 'GCR_13C'
      locationData[finalGcr13Type] = gcr13cValue
    }

    locations.push({ opmId, sourceId, data: locationData })
  }

  if (locations.length === 0) {
    throw new Error('No valid locations found in XLSX file')
  }

  // Split locations into chunks of 50
  const chunkSize = 50
  const chunks: (typeof locations)[] = []
  for (let i = 0; i < locations.length; i += chunkSize) {
    chunks.push(locations.slice(i, i + chunkSize))
  }

  // Generate XML for each chunk
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true
  })

  const xmlFiles: string[] = []

  chunks.forEach((chunk, chunkIndex) => {
    // Generate unique ID for RESDATA (timestamp-based with chunk index)
    const uniqueId = Date.now().toString() + chunkIndex.toString().padStart(3, '0')

    const locationsXml = chunk.map(location => {
      const dataElements = Object.entries(location.data).map(([valueType, value]) => {
        const unit = getUnitForValueType(valueType)
        const dataObj: any = {
          '@_value-type': valueType,
          '@_value': value
        }
        // Add unit if it exists for this value type
        if (unit) {
          dataObj['@_unit'] = unit
        }
        return dataObj
      })

      return {
        '@_date-from': dateFrom,
        '@_date-to': dateTo,
        '@_opm-id': location.opmId,
        '@_source-id': location.sourceId,
        '@_version': '1',
        Data: dataElements
      }
    })

    const xmlObj = {
      RESDATA: {
        '@_xmlns': 'http://www.ote-cr.cz/schema/oze/data',
        '@_answer-required': 'false',
        '@_date-time': dateTime,
        '@_dtd-release': '1',
        '@_dtd-version': '1',
        '@_id': uniqueId,
        '@_message-code': 'PD1',
        SenderIdentification: {
          '@_coding-scheme': '14',
          '@_id': '8591824556207'
        },
        ReceiverIdentification: {
          '@_coding-scheme': '14',
          '@_id': receiverId
        },
        Location: locationsXml
      }
    }

    const xmlString = "<?xml version='1.0' encoding='UTF-8' ?>\n" + builder.build(xmlObj)
    xmlFiles.push(xmlString)
  })

  return xmlFiles
}
