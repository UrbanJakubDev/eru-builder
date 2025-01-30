export enum PalivoType {
    BIOMASA_BRIKETY = "Biomasa - Brikety a pelety",
    BIOMASA_CELULOZOVE = "Biomasa - Celulozove vyluhy",
    BIOMASA_KAPALNA = "Biomasa - Kapalna biopaliva",
    BIOMASA_OSTATNI = "Biomasa - Ostatni biomasa",
    BIOMASA_PALIVOVE = "Biomasa - Palivove drivi",
    BIOMASA_PILINY = "Biomasa - Piliny. kura. stepky. drevni odpad",
    BIOMASA_ROSTLINNE = "Biomasa - Rostlinne materialy neaglomerovane (vcetne aglomeratu)",
    BIOMETAN = "Biometan",
    BIOPLYN_KALOVY = "Bioplyn - Kalovy plyn",
    BIOPLYN_OSTATNI = "Bioplyn - Ostatni bioplyn",
    BIOPLYN_SKLADKOVY = "Bioplyn - Skladkovy plyn",
    CERNE_UHLI_PRUMYSLOVE = "Cerne uhli prumyslove",
    CERNE_UHLI_TRIDENE = "Cerne uhli tridene",
    CERNOUHELNE_KALY = "Cernouhelne kaly a granulat",
    HNEDE_UHLI_BRIKETY = "Hnede uhli - Brikety",
    HNEDE_UHLI_LIGNIT = "Hnede uhli - Lignit",
    HNEDE_UHLI_MOUROVE = "Hnede uhli - Mourove kaly",
    HNEDE_UHLI_PRUMYSLOVE = "Hnede uhli prumyslove",
    HNEDE_UHLI_TRIDENE = "Hnede uhli tridene",
    JADERNE_PALIVO = "Jaderne palivo",
    KOKS = "Koks",
    ODPADNI_TEPLO = "Odpadni teplo",
    OSTATNI = "Ostatni",
    OSTATNI_KAPALNA_DEHET = "Ostatni kapalna paliva - Dehet",
    OSTATNI_KAPALNA_DTS = "Ostatni kapalna paliva - Dehtova topna smes (DTS)",
    OSTATNI_KAPALNA_NEZATRIDENE = "Ostatni kapalna paliva - Nezatridene",
    OSTATNI_KAPALNA_ORGANIKA = "Ostatni kapalna paliva - Organika",
    OSTATNI_KAPALNA_TECHNOL = "Ostatni kapalna paliva - Technol.palivo",
    OSTATNI_PEVNA_NEZATRIDENE = "Ostatni pevna paliva - Nezatridene",
    OSTATNI_PEVNA_PRUMYSLOVY = "Ostatni pevna paliva - Prumyslovy odpad",
    OSTATNI_PEVNA_KOMUNALNI = "Ostatni pevna paliva - Tuhy komunalni odpad",
    OSTATNI_PLYNY_DEGAZACNI = "Ostatni plyny - Degazacni plyn",
    OSTATNI_PLYNY_ENERGOPLYN = "Ostatni plyny - Energoplyn",
    OSTATNI_PLYNY_CHUDY = "Ostatni plyny - Chudy expanzni plyn",
    OSTATNI_PLYNY_KOKSARENSKY = "Ostatni plyny - Koksarensky plyn",
    OSTATNI_PLYNY_KONVERTOROVY = "Ostatni plyny - Konvertorovy plyn",
    OSTATNI_PLYNY_LPG = "Ostatni plyny - LPG",
    OSTATNI_PLYNY_NEZATRIDENE = "Ostatni plyny - Nezatridene",
    OSTATNI_PLYNY_RAFINERSKY = "Ostatni plyny - Rafinersky plyn",
    OSTATNI_PLYNY_TOPNY = "Ostatni plyny - Topny Plyn",
    OSTATNI_PLYNY_VYSOKOPECNI = "Ostatni plyny - Vysokopecni plyn",
    OSTATNI_PLYNY_VZDUCHOCPAVKOVA = "Ostatni plyny - Vzduchocpavkova smes (druhotny zdroj)",
    OSTATNI_PLYNY_ZBYTKOVY = "Ostatni plyny - Zbytkovy plyn",
    TOPNE_OLEJE_02 = "Topne oleje s obsahem siry do 0.2% hm.",
    TOPNE_OLEJE_10 = "Topne oleje s obsahem siry do 1.0% hm.",
    TOPNE_OLEJE_NAD_10 = "Topne oleje s obsahem siry nad 1.0% hm.",
    ZEMNI_PLYN = "Zemni plyn"
}

export enum JednotkaPaliva {
    TUNA = "t",
    GIGAJOULE = "GJ",
    MEGAWATT_HODINA = "MWh",
    TISIC_METRU_KRYCH = "tis. m3"
}

export enum VyhrevnostJednotka {
    GIGAJOULE_TUNA = "GJ/t",
    MEGAJOULE_METR = "MJ/m3"
}

export enum TechnologieKvet {
    KONDENZACNI = "kondenzační odběrová turbína",
    MIKROTURBINA = "mikroturbína",
    ORC = "organický Rankinův cyklus (ORC)",
    PALIVOVY_CLANEK = "palivový článek",
    PARNI_PROTITLAKA = "parní protitlaká turbína",
    PARNI_STROJ = "parní stroj s rekuperací tepla",
    PAROPLYNOVE = "paroplynové zařízení s dodávkou tepla",
    PLYNOVA_TURBINA = "plynová turbína s rekuperací tepla",
    SPALOVACI_MOTOR = "spalovací pístový motor s rekuperací tepla",
    STIRLING = "Stirlingův motor s rekuperací tepla",
    KOMBINACE = "kombinace technologií"
}

export enum Kraj {
    PRAHA = "Hlavní město Praha",
    JIHOCESKY = "Jihočeský",
    JIHOMORAVSKY = "Jihomoravský",
    KARLOVARSKY = "Karlovarský",
    KRALOVEHRADECKY = "Královéhradecký",
    LIBERECKY = "Liberecký",
    MORAVSKOSLEZSKY = "Moravskoslezský",
    OLOMOUCKY = "Olomoucký",
    PARDUBICKY = "Pardubický",
    PLZENSKY = "Plzeňský",
    STREDOCESKY = "Středočeský",
    USTECKY = "Ústecký",
    VYSOCINA = "Vysočina",
    ZLINSKY = "Zlínský"
}

export enum PripojenoKPsDs {
    CEPS = "ČEPS, a.s.",
    CEZ = "ČEZ Distribuce, a.s.",
    EGD = "EG.D, a.s.",
    PRE = "PREdistribuce, a.s.",
    UCED = "UCED Chomutov s.r.o.",
    JINA = "Jiná"
}

export enum TechnologieVyrobny {
    JADERNA = "Jaderná (JE)",
    PARNI = "Parní (PE)",
    PAROPLYNOVA = "Paroplynová (PPE)",
    PLYNOVA = "Plynová a spalovací (PSE)",
    PRECERPAVACI = "Přečerpávací vodní (PVE)",
    VODNI = "Vodní nad 10 MW (VE > 10 MW)",
    OSTATNI = "Ostatní (OST)"
}

export enum TypVykazu {
    E1 = "E1"
}

export enum TypPeriody {
    MONTH = "MONTH"
}

export enum BilanceZdroju {
    ELEKTRO = "elektro",
    TEPLO = "teplo"
}

// You might also want to define some interfaces for the data structures
export interface E1VykazData {
    typVykazu: TypVykazu;
    vykazy: Array<{
        e1vykaz: {
            e1TechnologieKvet: {
                pocetTechnologii: string;
                technologieKvet?: Array<{
                    technologieKvet: TechnologieKvet;
                    instalovanyTepelnyVykon?: number;
                    instalovanyElektrickyVykon?: number;
                }>;
            };
            // Add other properties as needed
        };
        identifikacniUdajeVykazu?: {
            ico?: string;
            typVykazu: TypVykazu;
            typPeriody: TypPeriody;
            cisloLicence?: string[];
            vykazovanyRok: number;
            vykazovanaPerioda: number;
            // Add other properties as needed
        };
    }>;
} 