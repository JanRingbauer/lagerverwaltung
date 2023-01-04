sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/routing/History",
      "sap/ui/model/json/JSONModel",
      "sap/ui/core/Fragment",
      "sap/base/Log",
      "sap/m/MessageBox",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, JSONModel, Fragment, Log, MessageBox) {
      "use strict";
  
      return Controller.extend("at.clouddna.lagerverwaltung.controller.ProduktBearbeitung", {
        bCreate: false,
  
        onInit: function () {
          let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("ProduktBearbeiten")
            .attachPatternMatched(this._onPatternMatched, this);
        },
  
        _onPatternMatched: function (oEvent) {
          this.bCreate = false; 
          let id = oEvent.getParameter("arguments").ID;
          if (id) {
            let sPath = "/Produkt(" + id + ")";
            this.getView().bindObject(sPath);
          }
        },
        onDeleteButtonPressed: function (oEvent){
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
            oRouter.navTo("TargetMain");
          }
        },
        onEditPressed: function () {
          this._toggleEdit(true);
        },
  
        _toggleEdit: function (bEditMode) {
          let oEditModel = this.getView().getModel("editModel");
  
          oEditModel.setProperty("/editmode", bEditMode);
  
          this._showCustomerFragment(bEditMode ? "ChangeEmployee" : "Employee");
        },
  
        
         onSavePressed: function () {
          let oModel = this.getView().getModel();
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();
            debugger;
          let sSuccessText = this.bCreate
            ? oResourceBundle.getText("Your employee has been created successfully.")
            : oResourceBundle.getText("Your employee has been updated successfully.");
            
          //this.getView().bindElement(oListBindingContext.getPath());
          if(this.bCreate){
            
            let oListBindingContext=this.getView().getModel().bindList("/Employee").create(this.getView().getModel("createModel").getData());
            debugger;
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
  