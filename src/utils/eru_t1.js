import { read, utils } from 'xlsx';

export class EruT1 {
    constructor() {
        this.quarter = null;
        this.data_df = null;
        this.statements = [];
        // Add quarters mapping
        this.quarters = {
            Q1: [1, 2, 3],
            Q2: [4, 5, 6],
            Q3: [7, 8, 9],
            Q4: [10, 11, 12]
        };
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

    // Add method to set quarter
    setQuarter(quarter) {
        if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
            throw new Error('Invalid quarter. Must be Q1, Q2, Q3, or Q4');
        }
        this.quarter = quarter;
    }

    readFile(arrayBuffer, sheetName) {
        const workbook = read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to array of objects, skip first row
        let data = utils.sheet_to_json(worksheet, { range: 1 });
        
        // Add debugging to see raw data
        console.log('Raw data sample:', data.slice(0, 2));
        
        // Convert all numeric values to float and round to 2 decimal places
        data = data.map(row => {
            const newRow = {};
            for (const [key, value] of Object.entries(row)) {
                // Skip empty or undefined values
                if (value === undefined || value === '') {
                    continue;
                }
                
                // Handle numeric values
                if (typeof value === 'number') {
                    newRow[key] = Number(value.toFixed(2));
                } else if (typeof value === 'string' && !isNaN(value)) {
                    // Convert string numbers to actual numbers
                    newRow[key] = Number(Number(value).toFixed(2));
                } else {
                    newRow[key] = value;
                }
            }
            return newRow;
        });

        console.log('Processed data sample:', data.slice(0, 2));
        this.data_df = data;
        return data;
    }

    getDate() {
        return new Date().toISOString();
    }


    // Filter data based on month, region, and typPaliva
    filterData(data, month, region, typPaliva = null) {
        if (!data || !Array.isArray(data)) {
            console.warn('No data available for filtering');
            return [];
        }

        console.log(`Filtering for month: ${month}, region: ${region}, fuel: ${typPaliva}`);
        
        const filtered = data.filter(row => {
            const monthMatch = Number(row.month) === Number(month);
            const regionMatch = row.region === region;
            const fuelMatch = typPaliva ? row.typPaliva === typPaliva : true;
            
            return monthMatch && regionMatch && fuelMatch;
        });

        console.log(`Found ${filtered.length} matching rows`);
        if (filtered.length > 0) {
            console.log('Sample filtered row:', filtered[0]);
        }

        return filtered;
    }

    makeGenSellHeatPart(region, month, palivo) {
        const filteredData = this.filterData(this.data_df, month, region.name, palivo);
        
        const result = {
            typPaliva: palivo,
            ztraty: 0,
            bruttoVyroba: 0,
            bilancniRozdil: 0,
            primeDodavkyCizimSubjektum: 0,
            technologickaVlastniSpotreba: 0,
            dodavkyDoVlastnihoPodnikuNeboZarizeni: 0
        };

        filteredData.forEach(row => {
            result.ztraty += Number(row.h_ztraty || 0);
            result.bruttoVyroba += Number(row.h_bruttoVyroba || 0);
            result.bilancniRozdil += Number(row.h_bilancniRozdil || 0);
            result.primeDodavkyCizimSubjektum += Number(row.h_primeDodavkyCizimSubjektum || 0);
            result.technologickaVlastniSpotreba += Number(row.h_technologickaVlastniSpotreba || 0);
            result.dodavkyDoVlastnihoPodnikuNeboZarizeni += Number(row.h_dodavkyDoVlastnihoPodnikuNeboZarizeni || 0);
        });

        // Round all values to 2 decimal places
        for (let key in result) {
            if (typeof result[key] === 'number') {
                result[key] = Number(result[key].toFixed(2));
            }
        }

        return result;
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
        
        if (!this.quarter) {
            console.warn('Quarter not set');
            return null;
        }

        // Use months from the selected quarter
        const monthList = this.quarters[this.quarter];
        console.log('Using months for quarter:', monthList);

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