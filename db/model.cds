namespace at.clouddna.lagerverwaltung;

using {
    managed,
    sap,
    Currency
} from '@sap/cds/common';


entity Produkt: managed {
    key ID            : UUID;
        name          : String;
        beschreibung  : String;
        anzahl        : Decimal;
        lagerort      : Association to Lagerort;
        einkaufspreis : Decimal;
        waehrung      : Association to Waehrung;
        lieferant     : Association to Lieferant;
}

entity Lieferant: managed {
    key ID           : UUID;
        produkt : Association to Produkt;
        name  : String;
        steuernummer : String;
        lieferungsAnz : Decimal;
        date : Date;
}

entity Lagerort: managed {
    key ID  : UUID;
        ort : String;
        lagerAnz : Decimal;
        produkt : Association to Produkt;
}
entity Waehrung: managed {
    key ID : UUID;
    name : String;
    kuerzel : String;
    symbol : String;
}
