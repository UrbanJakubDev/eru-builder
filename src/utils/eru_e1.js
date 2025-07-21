import { read, utils } from 'xlsx'

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
}

// Pomocná funkce pro převod na číslo nebo null
function parseOrNull(val) {
  if (val === null || val === undefined || val === '') return null
  const num = parseFloat(val)
  return isNaN(num) ? null : num
}
