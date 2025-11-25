import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import * as XLSX from 'xlsx'

// Types for Request Generation
export interface RequestRow {
  'source-id': string
  ean: string
  'date-from': string
  'date-to': string
}

// Types for Response Processing
interface ProfileData {
  '@_value': string
  '@_unit': string
  '@_status': string
  '@_date-time-from': string
  '@_date-time-to': string
}

interface Profile {
  '@_value-type': string
  ProfileData: ProfileData[]
}

interface Location {
  '@_opm-id': string
  Profile: Profile[]
}

interface XmlResponse {
  RESDATA: {
    Location: Location[] | Location
  }
}

export const generateXmlRequest = (xlsxData: any[]): string => {
  // Filter out empty rows and ensure required fields exist
  const validRows = xlsxData.filter(row => row['source-id'] && row['ean'] && row['date-from'] && row['date-to'])

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true
  })

  const locations = validRows.map(row => ({
    '@_source-id': row['source-id'],
    '@_ean': row['ean'],
    '@_date-to': formatDate(row['date-to']),
    '@_date-from': formatDate(row['date-from'])
  }))

  const xmlObj = {
    'default:RESREQ': {
      '@_xmlns:default': 'http://www.ote-cr.cz/schema/oze/request',
      '@_xmlns': 'http://www.ote-cr.cz/schema/oze/request',
      '@_date-time': new Date().toISOString(),
      '@_dtd-release': '1',
      '@_dtd-version': '1',
      '@_id': '1',
      '@_message-code': 'PDJ',
      'default:SenderIdentification': {
        '@_coding-scheme': '14',
        '@_id': '8591824556207', // Fixed ID from example, maybe needs to be configurable?
        '@_role': 'V'
      },
      'default:ReceiverIdentification': {
        '@_coding-scheme': '14',
        '@_id': '8591824000007'
      },
      'default:Location': locations
    }
  }

  return "<?xml version='1.0' encoding='UTF-8' ?>\n" + builder.build(xmlObj)
}

const formatDate = (dateVal: string | number | Date): string => {
  // Handle Excel serial dates if necessary, or string dates
  if (typeof dateVal === 'number') {
    // Excel date to JS date
    const date = new Date(Math.round((dateVal - 25569) * 86400 * 1000))
    return date.toISOString().split('T')[0]
  }
  if (dateVal instanceof Date) {
    return dateVal.toISOString().split('T')[0]
  }
  // Assume string is already in correct format or close to it.
  // Ideally we should validate YYYY-MM-DD
  return String(dateVal).trim()
}

export const processXmlResponse = (xmlString: string): any[] => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: name => name === 'Location' || name === 'Profile' || name === 'ProfileData'
  })

  const result = parser.parse(xmlString) as XmlResponse

  if (!result.RESDATA || !result.RESDATA.Location) {
    throw new Error('Invalid XML format: Missing RESDATA or Location')
  }

  const locations = Array.isArray(result.RESDATA.Location) ? result.RESDATA.Location : [result.RESDATA.Location]

  const outputData: any[] = []

  locations.forEach(location => {
    const ean = location['@_opm-id']
    if (!ean) return

    let outputQuantity = 0 // A11 (Dodavka)
    let inputQuantity = 0 // A12 (Odber)

    const profiles = location.Profile || []

    profiles.forEach(profile => {
      const valueType = profile['@_value-type']
      const data = profile.ProfileData || []

      const sum = data.reduce((acc, curr) => {
        return acc + (parseFloat(curr['@_value']) || 0)
      }, 0)

      if (valueType === 'A11') {
        outputQuantity += sum
      } else if (valueType === 'A12') {
        inputQuantity += sum
      }
    })

    outputData.push({
      EAN: ean,
      Dodavka: outputQuantity,
      Odber: inputQuantity * -1 // Convert to negative as per requirement
    })
  })

  return outputData
}

export const generateTemplate = (): ArrayBuffer => {
  const headers = ['source-id', 'ean', 'date-from', 'date-to']
  const sampleRow = ['123456', '8591824000007', '2025-01-01', '2025-01-31']

  const worksheet = XLSX.utils.aoa_to_sheet([headers, sampleRow])
  worksheet['!cols'] = headers.map(header => ({ wch: Math.max(header.length + 2, 16) }))

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template')

  // Return binary data ready for Blob creation on the client
  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
}

