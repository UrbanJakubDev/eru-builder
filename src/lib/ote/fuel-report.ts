import { XMLBuilder } from 'fast-xml-parser'
import * as XLSX from 'xlsx'

// Generate empty template for fuel report
export const generateEmptyFuelTemplate = (): ArrayBuffer => {
  // Define the rows in the correct order based on VBA code structure
  const rows: any[][] = [
    ['Source-id'],
    ['Date-from'],
    ['Date-to'],
    ['Source-type'],
    ['Fuel-type'],
    ['Aib-fuel-type'],
    ['Consumption'],
    ['Caloric-value'],
    ['Burned-heat'],
    ['Bio-consumption'],
    ['Water-content'],
    ['Energy']
  ]

  // Create Data worksheet
  const dataWorksheet = XLSX.utils.aoa_to_sheet(rows)
  dataWorksheet['!cols'] = [{ wch: 20 }] // First column width

  // Create static worksheet with default values
  const staticData = [
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

export const generateFuelXmlFromXlsx = (xlsxData: ArrayBuffer): string[] => {
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

  const receiverId = staticMap.get('receiver-id') || '8591824000007'
  const dateTime = staticMap.get('date-time') || new Date().toISOString()

  // Read data sheet
  const dataSheet = workbook.Sheets['Data']
  if (!dataSheet) {
    throw new Error('Missing "Data" sheet in XLSX file')
  }

  const dataRows = XLSX.utils.sheet_to_json(dataSheet, { header: 1, defval: '' }) as any[][]
  if (dataRows.length < 3) {
    throw new Error('Invalid data structure: need at least 3 rows (Source-id, Date-from, Date-to)')
  }

  // First column contains labels: Source-id (row 0), Date-from (row 1), Date-to (row 2), then data fields
  // Each subsequent column (starting from B) represents one Location + Data combination
  const locations: Array<{
    sourceId: string
    dateFrom: string
    dateTo: string
    sourceType: string
    fuelType: string
    aibFuelType: string
    consumption: string
    caloricValue: string
    burnedHeat: string
    bioConsumption: string
    waterContent: string
    energy: string
  }> = []

  // Find row indices for each field
  const sourceIdRowIndex = 0
  const dateFromRowIndex = 1
  const dateToRowIndex = 2

  const fieldRowIndices = new Map<string, number>()
  for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
    const fieldName = String(dataRows[rowIndex]?.[0] || '').trim()
    if (fieldName) {
      fieldRowIndices.set(fieldName.toLowerCase(), rowIndex)
    }
  }

  // Find maximum number of columns (locations)
  const maxCols = Math.max(...dataRows.map(row => row.length), 1)

  // Extract location data from each column (starting from column B, index 1)
  for (let colIndex = 1; colIndex < maxCols; colIndex++) {
    const sourceId = String(dataRows[sourceIdRowIndex]?.[colIndex] || '').trim()
    const dateFrom = String(dataRows[dateFromRowIndex]?.[colIndex] || '').trim()
    const dateTo = String(dataRows[dateToRowIndex]?.[colIndex] || '').trim()

    if (!sourceId || !dateFrom || !dateTo) continue // Skip empty locations

    const getFieldValue = (fieldName: string): string => {
      const rowIndex = fieldRowIndices.get(fieldName.toLowerCase())
      if (rowIndex !== undefined) {
        return String(dataRows[rowIndex]?.[colIndex] || '').trim()
      }
      return ''
    }

    locations.push({
      sourceId,
      dateFrom,
      dateTo,
      sourceType: getFieldValue('Source-type'),
      fuelType: getFieldValue('Fuel-type'),
      aibFuelType: getFieldValue('Aib-fuel-type'),
      consumption: getFieldValue('Consumption'),
      caloricValue: getFieldValue('Caloric-value'),
      burnedHeat: getFieldValue('Burned-heat'),
      bioConsumption: getFieldValue('Bio-consumption'),
      waterContent: getFieldValue('Water-content'),
      energy: getFieldValue('Energy')
    })
  }

  if (locations.length === 0) {
    throw new Error('No valid locations found in XLSX file')
  }

  // Group locations by source-id, date-from, date-to to create Location elements
  // Each Location can have multiple Data elements (different fuels)
  const locationGroups = new Map<string, typeof locations>()
  locations.forEach(location => {
    const key = `${location.sourceId}|${location.dateFrom}|${location.dateTo}`
    if (!locationGroups.has(key)) {
      locationGroups.set(key, [])
    }
    locationGroups.get(key)!.push(location)
  })

  // Convert grouped locations to arrays for chunking
  const locationArrays: Array<{
    sourceId: string
    dateFrom: string
    dateTo: string
    dataElements: Array<{
      sourceType: string
      fuelType: string
      aibFuelType: string
      consumption: string
      caloricValue: string
      burnedHeat: string
      bioConsumption: string
      waterContent: string
      energy: string
    }>
  }> = []

  locationGroups.forEach((group, key) => {
    const [sourceId, dateFrom, dateTo] = key.split('|')
    locationArrays.push({
      sourceId,
      dateFrom,
      dateTo,
      dataElements: group.map(loc => ({
        sourceType: loc.sourceType,
        fuelType: loc.fuelType,
        aibFuelType: loc.aibFuelType,
        consumption: loc.consumption,
        caloricValue: loc.caloricValue,
        burnedHeat: loc.burnedHeat,
        bioConsumption: loc.bioConsumption,
        waterContent: loc.waterContent,
        energy: loc.energy
      }))
    })
  })

  // Split locations into chunks of 50
  const chunkSize = 50
  const chunks: (typeof locationArrays)[] = []
  for (let i = 0; i < locationArrays.length; i += chunkSize) {
    chunks.push(locationArrays.slice(i, i + chunkSize))
  }

  // Generate XML for each chunk
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true
  })

  const xmlFiles: string[] = []

  chunks.forEach((chunk, chunkIndex) => {
    // Generate unique ID for RESFUEL (timestamp-based with chunk index)
    const uniqueId = `POZE_Fuel_${new Date().toISOString().split('T')[0].replace(/-/g, '')}_${chunkIndex + 1}`

    const locationsXml = chunk
      .map(location => {
        const dataElements = location.dataElements
          .filter(data => data.sourceType && data.fuelType) // Only include if source-type and fuel-type are present
          .map(data => {
            const dataObj: any = {
              '@_source-type': data.sourceType || '',
              '@_fuel-type': data.fuelType || '',
              '@_consumption': data.consumption || '0',
              '@_caloric-value': data.caloricValue || '',
              '@_burned-heat': data.burnedHeat || '0',
              '@_bio-consumption': data.bioConsumption || '0',
              '@_water-content': data.waterContent || '0',
              '@_energy': data.energy || '0'
            }
            // Add aib-fuel-type only if present
            if (data.aibFuelType) {
              dataObj['@_aib-fuel-type'] = data.aibFuelType
            }
            return dataObj
          })

        // Only include Location if it has at least one Data element
        if (dataElements.length === 0) {
          return null
        }

        return {
          '@_date-from': location.dateFrom,
          '@_date-to': location.dateTo,
          '@_source-id': location.sourceId,
          Data: dataElements.length === 1 ? dataElements[0] : dataElements
        }
      })
      .filter((location): location is NonNullable<typeof location> => location !== null) // Filter out null locations

    const xmlObj = {
      RESFUEL: {
        '@_xmlns': 'http://www.ote-cr.cz/schema/oze/fuel',
        '@_answer-required': 'false',
        '@_date-time': dateTime,
        '@_dtd-release': '1',
        '@_dtd-version': '1',
        '@_id': uniqueId,
        '@_message-code': 'PF1',
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

