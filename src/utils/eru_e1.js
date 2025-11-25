import { read, utils, write } from 'xlsx'

export class EruE1 {
  constructor() {
    this.statements = []
  }

  readFile(arrayBuffer, sheetName) {
    // Read from ArrayBuffer instead of file path
    const workbook = read(arrayBuffer, { type: 'array' })
    const worksheet = workbook.Sheets[sheetName]

    // Convert to array of objects, skip first row
    let data = utils.sheet_to_json(worksheet, { range: 1 })

    // Replace null/undefined values with 0
    return data.map(row => {
      Object.keys(row).forEach(key => {
        if (row[key] === null || row[key] === undefined) {
          row[key] = 0
        }
      })
      return row
    })
  }

  getDate() {
    return new Date().toISOString()
  }

  makeStatement(row, date, kontaktniUdaje = {}) {
    const datestr = this.getDate()
    const year = date.getFullYear()
    const { kontaktniTelefon = '+420721055966', odpovednyPracovnik = 'Jakub Urban' } = kontaktniUdaje

    return {
      e1vykaz: {
        e1Paliva: {
          paliva: [
            {
              typPaliva: 'Zemni plyn',
              jednotkaPaliva: 'MWh',
              vyhrevnostHodnota: row['g-vyhrevnostHodnota'],
              vyhrevnostJednotka: 'MJ/m3',
              porizeniPalivaCelkem: row['g-porizeniPalivaCelkem'],
              spotrebaPalivaVyrobaTepla: row['g-spotrebaPalivaVyrobaTepla'],
              spotrebaPalivaVyrobaElektriny: row['g-spotrebaPalivaVyrobaElektriny']
            }
          ]
        },
        pocetPaliv: '1',
        e1Komentar: {
          komentar: ''
        },
        e1BilanceKvet: {
          bilanceKvet: [
            {
              palivoPouziteNaKvet: 'Zemni plyn',
              vsazkaPalivaHodnota: row['vsazkaPalivaHodnota'],
              vyrobaElektrinyBrutto: row['vyrobaElektrinyBrutto'],
              dodavkaUzitecnehoTepla: row['dodavkaUzitecnehoTepla']
            }
          ]
        },
        e1TechnologieKvet: {
          technologieKvet: [
            {
              technologieKvet: 'spalovací pístový motor s rekuperací tepla',
              instalovanyTepelnyVykon: row['instalovanyTepelnyVykon'],
              instalovanyElektrickyVykon: parseFloat(row['instalovanyElektrickyVykon'])
            }
          ],
          pocetTechnologii: '1'
        },
        e1BilanceDodavekAZdroju: {
          bilanceDodavekAZdrojuI: [
            {
              saldo: 0,
              ztraty: row['bde1-ztraty'],
              nakupOdber: row['bde1-nakupOdber'],
              bilanceZdroju: 'elektro',
              bilancniRozdil: 0,
              vlastniSpotrebaCelkem: row['bde1-vlastniSpotrebaCelkem'],
              spotrebaElektrinyNaPrecerpavaniVPve: row['bde1-spotrebaElektrinyNaPrecerpavaniVPve']
            },
            {
              saldo: 0,
              ztraty: row['bdt1-ztraty'],
              nakupOdber: row['bdt1-nakupOdber'],
              bilanceZdroju: 'teplo',
              bilancniRozdil: 0,
              vlastniSpotrebaCelkem: row['bdt1-vlastniSpotrebaCelkem'],
              spotrebaElektrinyNaPrecerpavaniVPve: 0
            }
          ],
          bilanceDodavekAZdrojuII: [
            {
              doprava: parseOrNull(row['bde2-doprava']),
              ostatni: parseOrNull(row['bde2-ostatni']),
              prumysl: parseOrNull(row['bde2-prumysl']),
              domacnosti: parseOrNull(row['bde2-domacnosti']),
              energetika: parseOrNull(row['bde2-energetika']),
              stavebnictvi: parseOrNull(row['bde2-stavebnictvi']),
              bilanceDodavek: 'elektro',
              zemedelstviALesnictvi: parseOrNull(row['bde2-zemedelstviALesnictvi']),
              dodavkyObchodnimSubjektum: parseOrNull(row['bde2-dodavkyObchodnimSubjektum']),
              obchodSluzbySkolstviZdravotnictvi: parseOrNull(row['bde2-obchodSluzbySkolstviZdravotnictvi'])
            },
            {
              doprava: parseOrNull(row['bdt2-doprava']),
              ostatni: parseOrNull(row['bdt2-ostatni']),
              prumysl: parseOrNull(row['bdt2-prumysl']),
              domacnosti: parseOrNull(row['bdt2-domacnosti']),
              energetika: parseOrNull(row['bdt2-energetika']),
              stavebnictvi: parseOrNull(row['bdt2-stavebnictvi']),
              bilanceDodavek: 'teplo',
              zemedelstviALesnictvi: parseOrNull(row['bdt2-zemedelstviALesnictvi']),
              dodavkyObchodnimSubjektum: parseOrNull(row['bdt2-dodavkyObchodnimSubjektum']),
              obchodSluzbySkolstviZdravotnictvi: parseOrNull(row['bdt2-obchodSluzbySkolstviZdravotnictvi'])
            }
          ]
        },
        e1VyrobaADodavkaElektrinyATepla: {
          vyrobaADodavkaElektrinyATepla: [
            {
              typ: 'elektro',
              ztraty: row['ve-ztraty'],
              bruttoVyroba: row['ve-bruttoVyroba'],
              pouzitePalivo: 'Zemni plyn',
              bilancniRozdil: 0,
              primeDodavkyCizimSubjektum: row['ve-primeDodavkyCizimSubjektum'],
              dodavkyDoVlastnihoPodnikuNeboZarizeni: row['ve-dodavkyDoVlastnihoPodnikuNeboZarizeni'],
              technologickaVlastniSpotrebaNaVyrobuTepla: row['ve-technologickaVlastniSpotrebaNaVyrobuTepla'],
              technologickaVlastniSpotrebaNaVyrobuElektriny: row['ve-technologickaVlastniSpotrebaNaVyrobuElektriny']
            },
            {
              typ: 'teplo',
              ztraty: row['vt-ztraty'],
              bruttoVyroba: row['vt-bruttoVyroba'],
              pouzitePalivo: 'Zemni plyn',
              bilancniRozdil: 0,
              primeDodavkyCizimSubjektum: row['vt-primeDodavkyCizimSubjektum'],
              dodavkyDoVlastnihoPodnikuNeboZarizeni: row['vt-dodavkyDoVlastnihoPodnikuNeboZarizeni'],
              technologickaVlastniSpotrebaNaVyrobuTepla: row['vt-technologickaVlastniSpotrebaNaVyrobuTepla'],
              technologickaVlastniSpotrebaNaVyrobuElektriny: row['vt-technologickaVlastniSpotrebaNaVyrobuElektriny']
            }
          ]
        },
        e1TechnologieAInstalovanyVykonVyrobny: {
          kraj: row['kraj'],
          idVyrobny: row['idVyrobny'],
          nazevVyrobny: row['nazevVyrobny'],
          pripojenoKPsDs: row['pripojenoKPsDs'],
          technologieVyrobny: 'Plynová a spalovací (PSE)',
          celkovyInstalovanyTepelnyVykonMWt: row['instalovanyTepelnyVykon'],
          celkovyInstalovanyElektrickyVykonMWe: parseFloat(row['instalovanyElektrickyVykon']),
          licencovanyCelkovyInstalovanyTepelnyVykonMWt: row['instalovanyTepelnyVykon'],
          licencovanyCelkovyInstalovanyElektrickyVykonMWe: parseFloat(row['instalovanyElektrickyVykon'])
        }
      },
      identifikacniUdajeVykazu: {
        ico: '29060109',
        typVykazu: 'E1',
        typPeriody: 'MONTH',
        cisloLicence: ['111018325'],
        vykazovanyRok: year,
        datovaSchranka: 'n9mpdz8',
        drzitelLicence: 'ČEZ Energo, s.r.o.',
        kontaktniTelefon,
        vykazovanaPerioda: parseFloat(row['vykazovanaPerioda']),
        odpovednyPracovnik,
        datumVytvoreniVykazu: datestr
      }
    }
  }

  makeStatements(df, date, kontaktniUdaje = {}) {
    for (const row of df) {
      if (row['nazevVyrobny'] === 0) continue
      const statement = this.makeStatement(row, date, kontaktniUdaje)
      this.statements.push(statement)
    }
  }

  generateStatements() {
    return {
      typVykazu: 'E1',
      vykazy: this.statements
    }
  }

  generateTemplate() {
    const headers = [
      'kraj',
      'idVyrobny',
      'nazevVyrobny',
      'pripojenoKPsDs',
      'instalovanyTepelnyVykon',
      'instalovanyElektrickyVykon',
      'g-vyhrevnostHodnota',
      'g-porizeniPalivaCelkem',
      'g-spotrebaPalivaVyrobaTepla',
      'g-spotrebaPalivaVyrobaElektriny',
      'vsazkaPalivaHodnota',
      'vyrobaElektrinyBrutto',
      'dodavkaUzitecnehoTepla',
      'bde1-ztraty',
      'bde1-nakupOdber',
      'bde1-vlastniSpotrebaCelkem',
      'bde1-spotrebaElektrinyNaPrecerpavaniVPve',
      'bdt1-ztraty',
      'bdt1-nakupOdber',
      'bdt1-vlastniSpotrebaCelkem',
      'bde2-doprava',
      'bde2-ostatni',
      'bde2-prumysl',
      'bde2-domacnosti',
      'bde2-energetika',
      'bde2-stavebnictvi',
      'bde2-zemedelstviALesnictvi',
      'bde2-dodavkyObchodnimSubjektum',
      'bde2-obchodSluzbySkolstviZdravotnictvi',
      'bdt2-doprava',
      'bdt2-ostatni',
      'bdt2-prumysl',
      'bdt2-domacnosti',
      'bdt2-energetika',
      'bdt2-stavebnictvi',
      'bdt2-zemedelstviALesnictvi',
      'bdt2-dodavkyObchodnimSubjektum',
      'bdt2-obchodSluzbySkolstviZdravotnictvi',
      've-ztraty',
      've-bruttoVyroba',
      've-primeDodavkyCizimSubjektum',
      've-dodavkyDoVlastnihoPodnikuNeboZarizeni',
      've-technologickaVlastniSpotrebaNaVyrobuTepla',
      've-technologickaVlastniSpotrebaNaVyrobuElektriny',
      'vt-ztraty',
      'vt-bruttoVyroba',
      'vt-primeDodavkyCizimSubjektum',
      'vt-dodavkyDoVlastnihoPodnikuNeboZarizeni',
      'vt-technologickaVlastniSpotrebaNaVyrobuTepla',
      'vt-technologickaVlastniSpotrebaNaVyrobuElektriny',
      'vykazovanaPerioda'
    ]

    const sampleRow = [
      'Středočeský',
      'ID-001',
      'Výrobna A',
      'ANO',
      5,
      2.5,
      35.2,
      120,
      90,
      30,
      100,
      80,
      60,
      1,
      5,
      2,
      0,
      0.5,
      1.2,
      0.3,
      0.1,
      0.2,
      0.2,
      0.1,
      0.1,
      0.1,
      0.05,
      0.02,
      0.02,
      0.08,
      0.03,
      0.04,
      0.04,
      0.02,
      0.02,
      0.02,
      0.05,
      0.03,
      0.02,
      40,
      300,
      50,
      10,
      5,
      15,
      20,
      150,
      35,
      12,
      6,
      15,
      1
    ]

    const worksheet = utils.aoa_to_sheet([headers, sampleRow])
    worksheet['!cols'] = headers.map(header => ({ wch: Math.max(header.length + 2, 14) }))

    const workbook = {
      SheetNames: ['ERU-E1'],
      Sheets: {
        'ERU-E1': worksheet
      }
    }

    return write(workbook, { type: 'array', bookType: 'xlsx' })
  }
}

// Pomocná funkce pro převod na číslo nebo null
function parseOrNull(val) {
  if (val === null || val === undefined || val === '') return null
  const num = parseFloat(val)
  return isNaN(num) ? null : num
}
