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
  
        /*onListItemPressed: function (oEvent) {
          let sPath = oEvent.getSource().getBindingContext().getPath();
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("", {
            ID: sPath.split("(")[1].split(")")[0],
          });
        },*/
  
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
          let oStart = this.getView().byId("calendar").getStartDate();
          let oEnd = new Date(oStart.getFullYear(), oStart.getMonth() + 1, 0);
          let oStartFilter = oStart.toISOString().split("T")[0];
          let oEndFilter = oEnd.toISOString().split("T")[0];
          aColumns.push({
              label: "Produktname",
              property: "Produkte/name"
          });
          aColumns.push({
              label: "Lastname",
              property: "Produkte/beschreibung"
          });
          aColumns.push({
              label: "Anzahl",
              property: "Produkte/anzahl"
          });
          aColumns.push({
            label: "Einkaufspreis",
            property: "Produkte/einkaufspreis"
          });
          aColumns.push({
            label: "Währung",
            property: "Produkte"
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
  