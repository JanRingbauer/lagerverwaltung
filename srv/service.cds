using at.clouddna.lagerverwaltung as lv from '../db/model';

service Lagerverwaltung {
    entity Produkt as projection on lv.Produkt;
    entity Lieferant as projection on lv.Lieferant;
    entity Lagerort as projection on lv.Lagerort;
}