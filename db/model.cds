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
        anzahl        : String;
        lagerort      : Association to Lagerort;
        einkaufspreis : Decimal;
        waehrung      : Association to Waehrung;
        lieferant     : Association to Lieferant;
}

entity Lieferant: managed {
    key ID           : UUID;
        name         : String;
        steuernummer : String;
}

entity Lagerort: managed {
    key ID  : UUID;
        ort : String;
}
entity Waehrung: managed {
    key ID : UUID;
    name : String;
    kuerzel : String;
    symbol : String;
}
