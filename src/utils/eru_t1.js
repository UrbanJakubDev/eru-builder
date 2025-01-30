import { read, utils } from 'xlsx';

export class EruT1 {
    constructor() {
        this.quarter = null;
        this.data_df = null;
        this.statements = [];
        this.region = [
            {
                name: "Hlavní město Praha",
                paliv: 1,
                paliva: ["Zemni plyn"]
            },
            {
                name: "Středočeský",
                paliv: 3,
                paliva: [
                    "Zemni plyn",
                    "Biomasa - Brikety a pelety",
                    "Biomasa - Piliny. kura. stepky. drevni odpad",
                ]
            },
            {
                name: "Jihočeský",
                paliv: 1,
                paliva: ["Zemni plyn"]
            },
            {
                name: "Plzeňský",
                paliv: 1,
                paliva: ["Zemni plyn"]
            },
            {
                name: "Karlovarský",
                paliv: 1,
                paliva: ["Zemni plyn"]
            },
            {
                name: "Ústecký",
                paliv: 1,
                paliva: ["Zemni plyn"]
            },
            {
                name: "Liberecký",
                paliv: 1,
                paliva: ["Zemni plyn"]
            },
            {
                name: "Královéhradecký",
                paliv: 1,
                paliva: ["Zemni plyn"]
            },
            {
                name: "Pardubický",
                paliv: 1,
                paliva: ["Zemni plyn"]
            },
            {
                name: "Vysočina",
                paliv: 1,
                paliva: ["Zemni plyn"]
            },
            {
                name: "Jihomoravský",
                paliv: 1,
                paliva: ["Zemni plyn"]
            },
            {
                name: "Olomoucký",
                paliv: 1,
                paliva: ["Zemni plyn"]
            },
            {
                name: "Zlínský",
                paliv: 1,
                paliva: ["Zemni plyn"]
            },
            {
                name: "Moravskoslezský",
                paliv: 1,
                paliva: ["Zemni plyn"]
            }
        ];
    }

    readFile(arrayBuffer, sheetName) {
        const workbook = read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to array of objects, skip first row
        let data = utils.sheet_to_json(worksheet, { range: 1 });
        
        // Convert all numeric values to float and round to 2 decimal places
        data = data.map(row => {
            const newRow = {};
            for (const [key, value] of Object.entries(row)) {
                if (typeof value === 'number') {
                    newRow[key] = Number(value.toFixed(2));
                } else {
                    newRow[key] = value || 0;
                }
            }
            return newRow;
        });

        return data;
    }

    getDate() {
        return new Date().toISOString();
    }

    // Helper function to get months by quarter
    monthsByQuarter(quarter) {
        const quarterMonths = {
            1: [1, 2, 3],
            2: [4, 5, 6],
            3: [7, 8, 9],
            4: [10, 11, 12]
        };
        return quarterMonths[quarter] || [];
    }

    // Filter data based on month, region, and typPaliva
    filterData(data, month, region, typPaliva = null) {
        if (typPaliva === null) {
            return data.filter(row => 
                row.month === month && 
                row.region === region
            );
        }
        return data.filter(row => 
            row.month === month && 
            row.region === region && 
            row.typPaliva === typPaliva
        );
    }

    makeGenSellHeatPart(region, month, palivo) {
        const filteredData = this.filterData(this.data_df, month, region.name, palivo);
        
        return {
            typPaliva: palivo,
            ztraty: filteredData.reduce((sum, row) => sum + (row.h_ztraty || 0), 0),
            bruttoVyroba: filteredData.reduce((sum, row) => sum + (row.h_bruttoVyroba || 0), 0),
            bilancniRozdil: filteredData.reduce((sum, row) => sum + (row.h_bilancniRozdil || 0), 0),
            primeDodavkyCizimSubjektum: filteredData.reduce((sum, row) => sum + (row.h_primeDodavkyCizimSubjektum || 0), 0),
            technologickaVlastniSpotreba: filteredData.reduce((sum, row) => sum + (row.h_technologickaVlastniSpotreba || 0), 0),
            dodavkyDoVlastnihoPodnikuNeboZarizeni: filteredData.reduce((sum, row) => sum + (row.h_dodavkyDoVlastnihoPodnikuNeboZarizeni || 0), 0)
        };
    }

    makePalivaPart(region, month, palivo) {
        const filteredData = this.filterData(this.data_df, month, region.name, palivo);
        
        return {
            typPaliva: palivo,
            jednotkyPaliv: palivo === "Zemni plyn" ? "MWh" : "t",
            porizeniPaliv: filteredData.reduce((sum, row) => sum + (row.pal_porizeniPaliv || 0), 0),
            spotrebaPaliva: filteredData.reduce((sum, row) => sum + (row.pal_spotrebaPaliva || 0), 0),
            vyhrevnostHodnota: filteredData.reduce((sum, row) => sum + (row.pal_vyhrevnostHodnota || 0), 0),
            vyhrevnostJednotky: palivo === "Zemni plyn" ? "MJ/m3" : "GJ/t"
        };
    }

    makeRegionPart(region, month) {
        const filteredData = this.filterData(this.data_df, month, region.name);
        
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
        };
    }

    makeMonthPart(month) {
        return {
            dataZaMesic: month,
            kraje: {
                kraje: this.region.map(region => this.makeRegionPart(region, month))
            }
        };
    }

    makeStatement() {
        const datestr = this.getDate();
        const monthList = this.monthsByQuarter(this.quarter);

        return {
            identifikacniUdajeVykazu: {
                ico: "29060109",
                typVykazu: "T1",
                typPeriody: "QUARTER",
                cisloLicence: [
                    "311018326",
                    "321018327"
                ],
                vykazovanyRok: 2024,
                datovaSchranka: "jakub.urban@hotmail.com",
                drzitelLicence: "ČEZ Energo, s.r.o.",
                kontaktniTelefon: "+420721055966",
                vykazovanaPerioda: this.quarter,
                odpovednyPracovnik: "Jakub Urban",
                datumVytvoreniVykazu: datestr
            },
            t1Komentar: {
                komentar: "Some comment for T1"
            },
            t1: {
                mesice: monthList.map(month => this.makeMonthPart(month))
            }
        };
    }

    generateStatements() {
        return {
            typVykazu: "T1",
            vykazy: [this.makeStatement()]
        };
    }
} 