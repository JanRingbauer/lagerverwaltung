sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/routing/History",
      "sap/ui/model/json/JSONModel",
      "sap/ui/core/Fragment",
      "sap/base/Log",
      "sap/m/MessageBox",
      "sap/ui/model/Sorter",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/ui/model/FilterType",
      "sap/ui/unified/DateRange",
      "sap/ui/core/format/DateFormat",
      "sap/ui/core/library",
      "sap/ui/export/Spreadsheet"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, JSONModel, Fragment, Log, MessageBox, Sorter, Filter, FilterOperator, FilterType, DateRange, DateFormat, library, Spreadsheet) {
      "use strict";
  
      return Controller.extend("at.clouddna.lagerverwaltung.controller.ProduktErstellen", {
        _fragmentList: {},
        bCreate: false,
  
        onInit: function () {
          let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("Produkte")
            .attachPatternMatched(this._onPatternMatched, this);
        },
  
        _onPatternMatched: function (oEvent) {
            this.bCreate = true; 
            this.getView().unbindElement();
            let oModel=new JSONModel({
              name: this.getView().getModel("createModel").oData.name,
              beschreibung: this.getView().getModel("createModel").oData.beschreibung,
              anzahl: this.getView().getModel("createModel").oData.anzahl,
              einkaufspreis: this.getView().getModel("createModel").oData.einkaufspreis,
              waehrung: this.getView().getModel("createModel").oData.waehrung
            });
            this.getView().setModel(oModel, "createModel");

          },
        
        onDeleteButtonPressed: function (oEvent){
          //let oModel = this.getView().getModel();
          let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
              
          let oSource = oEvent.getSource();
          let sPath = oSource.getBindingContext().getPath();
              
          MessageBox.warning(oResourceBundle.getText("Wollen Sie den Eintrag wirklich löschen?"), {
              title: oResourceBundle.getText("Delete"),
              actions: [MessageBox.Action.YES, MessageBox.Action.NO],
              emphasizedAction: MessageBox.Action.YES,
              onClose: function(oAction){
                  if(MessageBox.Action.YES === oAction){
                    this.getView().getObjectBinding().getBoundContext().delete().then(function(){
                    this.getView().getModel().refresh()
                    }.bind(this));
                    this.onNavBack();
                    }
              }.bind(this)}
  
              );
          },
        onNavBack: function () {
          let oHistory = History.getInstance();
          let sPreviousHash = oHistory.getPreviousHash();
  
          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Produkte");
          }
        },
        onEditPressed: function () {
          this._toggleEdit(true);
        },
  
        _toggleEdit: function (bEditMode) {
          let oEditModel = this.getView().getModel("editModel");
          oEditModel.setProperty("/editmode", bEditMode);
        },
  
        onSavePressed: function (oEvent) {
          let oModel = this.getView().getModel();
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();
          let sSuccessText = this.bCreate
            ? oResourceBundle.getText("Ihr Eintrag wurde erfolgreich erstellt!")
            : oResourceBundle.getText("Ihr Eintrag wurde erfolgreich geändert!");
            
          //this.getView().bindElement(oListBindingContext.getPath());
          if(this.bCreate){
            
            let oListBindingContext=this.getView().getModel().bindList("/Produkt").create(this.getView().getModel("createModel").getData());
    
            oModel.submitBatch("$auto").then((oData, response) => {
              MessageBox.success(sSuccessText, {
                onClose: () => {
                  if (this.bCreate) {
                    this.onNavBack();
                  } else {
                    this._toggleEdit(false);
                  }
                this.getView().getModel().refresh()
                }
                
              }
              );
            
            (oError) => {
              MessageBox.error(oError.message);
            }
            });
    
          }else{
            oModel.submitBatch("$auto").then(
              (oData, response) => {
                MessageBox.success(sSuccessText, {
                  onClose: () => {
                    if (!this.bCreate) {
                      this.onNavBack();
                    } else {
                      this._toggleEdit(false);
                    }
                    this.getView().getModel().refresh()
                    },
                });
              },
              (oError) => {
                MessageBox.error(oError.message);
              },
            );
          }
        },
      });
    },
  );

