sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/m/MessageBox",
      "sap/ui/model/Sorter",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/ui/model/FilterType",
      "sap/ui/model/json/JSONModel",
      "sap/ui/unified/DateRange",
      "sap/ui/core/format/DateFormat",
      "sap/ui/core/library",
      "sap/ui/export/Spreadsheet"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
      Controller,
      MessageBox,
      Sorter,
      Filter,
      FilterOperator,
      FilterType,
      JSONModel,
      DateRange,
      DateFormat,
      coreLibrary,
      Spreadsheet,
    ) {
      "use strict";
  
      return Controller.extend("at.clouddna.lagerverwaltung.controller.Produkte", {
        onInit: function () {
          //let oModel = new JSONModel({ employee_ID: null, absencetype_ID: null });
          //this.getView().setModel(oModel, "DetailModel");
        },
  
        onListItemPressed: function (oEvent) {
          let sPath = oEvent.getSource().getBindingContext().getPath();
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("ProduktBearbeiten", {
            ID: sPath.split("(")[1].split(")")[0],
          });
        },

        onCreatePressed: function () {
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("ProduktErstellen");
        },
  
        onDeleteButtonPressed: function (oEvent) {
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();
  
          let oSource = oEvent.getSource();
          let sPath = oSource.getBindingContext().getPath();
          this.selectedBindngContext = oSource.getBindingContext();
          MessageBox.warning(
            oResourceBundle.getText(
              "Do you really want to delete this absence day?"
            ),
            {
              title: oResourceBundle.getText("Delete"),
              actions: [MessageBox.Action.YES, MessageBox.Action.NO],
              emphasizedAction: MessageBox.Action.YES,
              onClose: function (oAction) {
                if (MessageBox.Action.YES === oAction) {
                  this.selectedBindngContext.delete().then(
                    function () {
                      this.getView().getModel().refresh();
                    }.bind(this)
                  );
                }
              }.bind(this),
            }
          );
        },
        toExcel: function () {
          var aColumns = [];
          aColumns.push({
              label: "Produktname",
              property: "Produkt/name"
          });
          aColumns.push({
              label: "Lastname",
              property: "Produkt/beschreibung"
          });
          aColumns.push({
              label: "Anzahl",
              property: "Produkt/anzahl"
          });
          aColumns.push({
            label: "Einkaufspreis",
            property: "Produkt/einkaufspreis"
          });
          aColumns.push({
            label: "Währung",
            property: "Produkt/waehrung"
          });
        
          var mSettings = {
            workbook: {
              columns: aColumns,
              context: {
                application: 'Debug Test Application',
                version: '1.105.0',
                title: 'Produkte',
              },
              hierarchyLevel: 'level'
            },
            dataSource: {
              type: "odata",
              dataUrl: `/Produkte/Absence?$expand=employee,absencetype&$filter=absence_day ge ${oStartFilter} and absence_day le ${oEndFilter}`,
              serviceUrl: ""
            },
            fileName: "Produkte.xlsx"
          };
          var oSpreadsheet = new Spreadsheet(mSettings);
          oSpreadsheet.build();
        },
      });
    }
  );
  