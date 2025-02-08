import { read, utils } from 'xlsx'
import { utils as xlsxUtils, write } from 'xlsx'

export class EruT1 {
  constructor() {
    this.quarter = 1
    this.data_df = null
    this.statements = []
    this.quarters = {
      Q1: [1, 2, 3],
      Q2: [4, 5, 6],
      Q3: [7, 8, 9],
      Q4: [10, 11, 12]
    }
    this.region = []
    this.userData = {
      ico: '',
      typVykazu: 'T1',
      typPeriody: 'QUARTER',
      cisloLicence: [],
      vykazovanyRok: new Date().getFullYear(),
      datovaSchranka: '',
      drzitelLicence: '',
      kontaktniTelefon: '',
      odpovednyPracovnik: ''
    }

    // Add default regions for template
    this.defaultRegions = [
      {
        name: 'Středočeský',
        paliv: 3,
        paliva: ['Zemni plyn', 'Biomasa - Brikety a pelety', 'Biomasa - Piliny kura stepky drevni odpad']
      },
      {
        name: 'Hlavní město Praha',
        paliv: 1,
        paliva: ['Zemni plyn']
      }
      // Add more default regions as needed
    ]
  }

  // Modify setQuarter method to handle the conversion
  setQuarter(quarter) {
    if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
      throw new Error('Invalid quarter. Must be Q1, Q2, Q3, or Q4')
    }
    // Convert 'Q1' to 1, 'Q2' to 2, etc.
    this.quarter = Number(quarter.replace('Q', ''))
  }

  // Add method to analyze data and build regions structure
  analyzeData() {
    if (!this.data_df || !Array.isArray(this.data_df)) {
      return
    }

    const regionMap = new Map()

    this.data_df.forEach(row => {
      if (!row.region || !row.typPaliva) return

      if (!regionMap.has(row.region)) {
        regionMap.set(row.region, new Set())
      }
      regionMap.get(row.region).add(row.typPaliva)
    })

    this.region = Array.from(regionMap.entries()).map(([name, fuels]) => ({
      name,
      paliv: fuels.size,
      paliva: Array.from(fuels)
    }))
  }

  // Add method to read user data
  readUserData(worksheet) {
    if (!worksheet) return

    const rows = utils.sheet_to_json(worksheet, {
      header: 1,
      raw: false
    })

    const fieldMap = new Map(rows.map(row => [String(row[0]).trim(), row[1]]))

    this.userData = {
      ico: fieldMap.get('ico') || '',
      typVykazu: 'T1',
      typPeriody: 'QUARTER',
      cisloLicence: fieldMap.get('cisloLicence')
        ? fieldMap
            .get('cisloLicence')
            .split(',')
            .map(l => l.trim())
        : [],
      vykazovanyRok: Number(fieldMap.get('vykazovanyRok')) || new Date().getFullYear(),
      vykazovanaPerioda: this.quarter,
      datovaSchranka: fieldMap.get('datovaSchranka') || '',
      drzitelLicence: fieldMap.get('drzitelLicence') || '',
      kontaktniTelefon: fieldMap.get('kontaktniTelefon') || '',
      odpovednyPracovnik: fieldMap.get('odpovednyPracovnik') || ''
    }
  }

  // Modify readFile method
  readFile(arrayBuffer) {
    const workbook = read(arrayBuffer, { type: 'array' })

    const userDataSheet = workbook.Sheets['UserData']
    if (userDataSheet) {
      this.readUserData(userDataSheet)
    }

    const worksheet = workbook.Sheets['ExportERU']
    if (!worksheet) {
      throw new Error('ExportERU sheet not found in workbook')
    }

    let data = utils.sheet_to_json(worksheet, { range: 0 })

    data = data
      .filter(row => row.__rowNum__ > 0)
      .map(row => {
        const newRow = {}
        for (const [key, value] of Object.entries(row)) {
          if (value === undefined || value === '' || key === '__rowNum__') {
            continue
          }

          if (typeof value === 'number') {
            newRow[key] = Number(value.toFixed(2))
          } else if (typeof value === 'string' && !isNaN(value)) {
            newRow[key] = Number(Number(value).toFixed(2))
          } else {
            newRow[key] = value
          }
        }
        return newRow
      })

    this.validateQuarterData(data)
    this.data_df = data
    this.analyzeData()

    return data
  }

  // Add new validation method
  validateQuarterData(data) {
    if (!this.quarter) {
      throw new Error('Čtvrtletí není vybráno. Vyberte čtvrtletí před nahráním dat.')
    }

    const expectedMonths = this.quarters[`Q${this.quarter}`]
    const dataMonths = [...new Set(data.map(row => Number(row.month)))].sort((a, b) => a - b)

    const invalidMonths = dataMonths.filter(month => !expectedMonths.includes(month))
    if (invalidMonths.length > 0) {
      throw new Error(`Data obsahují měsíce (${invalidMonths.join(', ')}) které nepatří do Q${this.quarter} ` + `(očekávané měsíce: ${expectedMonths.join(', ')})`)
    }

    const missingMonths = expectedMonths.filter(month => !dataMonths.includes(month))
    if (missingMonths.length > 0) {
      throw new Error(`Data chybí měsíce (${missingMonths.join(', ')}) pro Q${this.quarter}`)
    }
  }

  getDate() {
    return new Date().toISOString()
  }

  // Filter data based on month, region, and typPaliva
  filterData(data, month, region, typPaliva = null) {
    if (!data || !Array.isArray(data)) {
      return []
    }

    const filtered = data.filter(row => {
      // Ensure month is treated as a number and handle potential string/number mismatches
      const rowMonth = Number(row.month)
      const targetMonth = Number(month)

      const monthMatch = rowMonth === targetMonth
      const regionMatch = String(row.region).trim() === String(region).trim()
      const fuelMatch = typPaliva ? String(row.typPaliva).trim() === String(typPaliva).trim() : true

      return monthMatch && regionMatch && fuelMatch
    })

    return filtered
  }

  makeGenSellHeatPart(region, month, palivo) {
    const filteredData = this.filterData(this.data_df, month, region.name, palivo)

    const result = {
      typPaliva: palivo,
      ztraty: 0,
      bruttoVyroba: 0,
      bilancniRozdil: 0,
      primeDodavkyCizimSubjektum: 0,
      technologickaVlastniSpotreba: 0,
      dodavkyDoVlastnihoPodnikuNeboZarizeni: 0
    }

    filteredData.forEach(row => {
      result.ztraty += Number(row.h_ztraty || 0)
      result.bruttoVyroba += Number(row.h_bruttoVyroba || 0)
      result.bilancniRozdil += Number(row.h_bilancniRozdil || 0)
      result.primeDodavkyCizimSubjektum += Number(row.h_primeDodavkyCizimSubjektum || 0)
      result.technologickaVlastniSpotreba += Number(row.h_technologickaVlastniSpotreba || 0)
      result.dodavkyDoVlastnihoPodnikuNeboZarizeni += Number(row.h_dodavkyDoVlastnihoPodnikuNeboZarizeni || 0)
    })

    // Round all values to 2 decimal places
    for (let key in result) {
      if (typeof result[key] === 'number') {
        result[key] = Number(result[key].toFixed(2))
      }
    }

    return result
  }

  makePalivaPart(region, month, palivo) {
    const filteredData = this.filterData(this.data_df, month, region.name, palivo)

    // Sum up all values for this combination
    const result = {
      typPaliva: palivo,
      jednotkyPaliv: palivo === 'Zemni plyn' ? 'MWh' : 't',
      porizeniPaliv: filteredData.reduce((sum, row) => {
        const val = Number(row.pal_porizeniPaliv) || 0
        return sum + val
      }, 0),
      spotrebaPaliva: filteredData.reduce((sum, row) => {
        const val = Number(row.pal_spotrebaPaliva) || 0
        return sum + val
      }, 0),
      vyhrevnostHodnota: filteredData.reduce((sum, row) => {
        const val = Number(row.pal_vyhrevnostHodnota) || 0
        return sum + val
      }, 0),
      vyhrevnostJednotky: palivo === 'Zemni plyn' ? 'MJ/m3' : 'GJ/t'
    }

    // Round all numeric values to 2 decimal places
    for (let key in result) {
      if (typeof result[key] === 'number') {
        result[key] = Number(result[key].toFixed(2))
      }
    }

    return result
  }

  makeRegionPart(region, month) {
    const filteredData = this.filterData(this.data_df, month, region.name)

    return {
      dataZaKraj: region.name,
      vykazaneHodnoty: {
        paliva: {
          pocetPaliv: String(region.paliv),
          paliva: region.paliva.map(palivo => this.makePalivaPart(region, month, palivo)),
          vyrobaADodavkaTepla: region.paliva.map(palivo => this.makeGenSellHeatPart(region, month, palivo))
        },
        celkovyInstalovanyVykon: filteredData.reduce((sum, row) => sum + (row.celkovyInstalovanyVykon || 0), 0),
        bilanceDodavekAZdroju: {
          nakup: filteredData.reduce((sum, row) => sum + (row.bil_nakup || 0), 0),
          saldo: filteredData.reduce((sum, row) => sum + (row.bil_saldo || 0), 0),
          ztraty: filteredData.reduce((sum, row) => sum + (row.bil_ztraty || 0), 0),
          doprava: filteredData.reduce((sum, row) => sum + (row.bil_doprava || 0), 0),
          ostatni: filteredData.reduce((sum, row) => sum + (row.bil_ostatni || 0), 0),
          prumysl: filteredData.reduce((sum, row) => sum + (row.bil_prumysl || 0), 0),
          domacnosti: filteredData.reduce((sum, row) => sum + (row.bil_domacnosti || 0), 0),
          energetika: filteredData.reduce((sum, row) => sum + (row.bil_energetika || 0), 0),
          bruttoVyroba: filteredData.reduce((sum, row) => sum + (row.bil_bruttoVyroba || 0), 0),
          stavebnictvi: filteredData.reduce((sum, row) => sum + (row.bil_stavebnictvi || 0), 0),
          bilancniRozdil: filteredData.reduce((sum, row) => sum + (row.bil_bilancniRozdil || 0), 0),
          vlastniSpotreba: filteredData.reduce((sum, row) => sum + (row.bil_vlastniSpotreba || 0), 0),
          zemedelstviALesnictvi: filteredData.reduce((sum, row) => sum + (row.bil_zemedelstviALesnictvi || 0), 0),
          dodavkyObchodnimSubjektum: filteredData.reduce((sum, row) => sum + (row.bil_dodavkyObchodnimSubjektum || 0), 0),
          obchodSluzbySkolstviZdravotnictvi: filteredData.reduce((sum, row) => sum + (row.bil_obchodSluzbySkolstviZdravotnictvi || 0), 0)
        }
      }
    }
  }

  makeMonthPart(month) {
    // If no regions analyzed, use default regions
    const regionsToUse = this.region.length > 0 ? this.region : this.defaultRegions

    return {
      dataZaMesic: month,
      kraje: {
        kraje: regionsToUse.map(region => this.makeRegionPart(region, month))
      }
    }
  }

  // Modify makeStatement method
  makeStatement() {
    const datestr = this.getDate()

    if (!this.quarter) {
      return null
    }

    // Use the quarter number directly for the period
    const monthList = this.quarters[`Q${this.quarter}`] // Convert back to Q1, Q2, etc for months lookup

    return {
      identifikacniUdajeVykazu: {
        ...this.userData,
        vykazovanaPerioda: this.quarter, // Use number directly
        datumVytvoreniVykazu: datestr
      },
      t1Komentar: {
        komentar: 'Some comment for T1'
      },
      t1: {
        mesice: monthList.map(month => this.makeMonthPart(month))
      }
    }
  }

  generateStatements() {
    return {
      typVykazu: 'T1',
      vykazy: [this.makeStatement()]
    }
  }

  // Modify generateTemplate to use default regions if no data loaded
  generateTemplate() {
    // Use default regions if no data analyzed yet
    const regionsToUse = this.region.length > 0 ? this.region : this.defaultRegions

    // Create UserData worksheet with transposed format
    const userDataFields = [
      ['ico', this.userData.ico],
      ['cisloLicence', this.userData.cisloLicence],
      ['vykazovanyRok', this.userData.vykazovanyRok],
      ['datovaSchranka', this.userData.datovaSchranka],
      ['drzitelLicence', this.userData.drzitelLicence],
      ['kontaktniTelefon', this.userData.kontaktniTelefon],
      ['odpovednyPracovnik', this.userData.odpovednyPracovnik]
    ]

    // Create worksheet with transposed data
    const userDataWs = xlsxUtils.aoa_to_sheet(userDataFields)

    // Set column widths for UserData (now we need only 2 columns)
    userDataWs['!cols'] = [
      { wch: 20 }, // Field names
      { wch: 40 } // Values
    ]

    // Create ExportERU worksheet
    const dataHeaders = [
      'month',
      'region',
      'typPaliva',
      // Paliva section
      'pal_porizeniPaliv',
      'pal_spotrebaPaliva',
      'pal_vyhrevnostHodnota',
      // Heat generation section
      'h_ztraty',
      'h_bruttoVyroba',
      'h_bilancniRozdil',
      'h_primeDodavkyCizimSubjektum',
      'h_technologickaVlastniSpotreba',
      'h_dodavkyDoVlastnihoPodnikuNeboZarizeni',
      // Bilance section
      'celkovyInstalovanyVykon',
      'bil_nakup',
      'bil_saldo',
      'bil_ztraty',
      'bil_doprava',
      'bil_ostatni',
      'bil_prumysl',
      'bil_domacnosti',
      'bil_energetika',
      'bil_bruttoVyroba',
      'bil_stavebnictvi',
      'bil_bilancniRozdil',
      'bil_vlastniSpotreba',
      'bil_zemedelstviALesnictvi',
      'bil_dodavkyObchodnimSubjektum',
      'bil_obchodSluzbySkolstviZdravotnictvi'
    ]

    const sampleData = []

    regionsToUse.forEach(region => {
      region.paliva.forEach(palivo => {
        for (let month = 1; month <= 3; month++) {
          sampleData.push({
            month: month,
            region: region.name,
            typPaliva: palivo
          })
        }
      })
    })

    // Create ExportERU worksheet with headers and data
    const dataWs = xlsxUtils.json_to_sheet(sampleData, { header: dataHeaders })

    // Set column widths for ExportERU
    const dataColWidths = dataHeaders.map(header => ({
      wch: Math.max(header.length, 15)
    }))
    dataWs['!cols'] = dataColWidths

    // Create workbook with both sheets
    const wb = {
      SheetNames: ['UserData', 'ExportERU'],
      Sheets: {
        UserData: userDataWs,
        ExportERU: dataWs
      }
    }

    const wbout = write(wb, { type: 'array', bookType: 'xlsx' })
    return new Uint8Array(wbout)
  }
}
