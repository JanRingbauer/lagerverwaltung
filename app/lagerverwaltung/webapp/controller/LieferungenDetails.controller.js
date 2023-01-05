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
  
      return Controller.extend("at.clouddna.lagerverwaltung.controller.LieferungenDetails", {
        _fragmentList: {},
        bCreate: false,
  
        onInit: function () {
          let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("LieferungBearbeiten")
            .attachPatternMatched(this._onPatternMatchedDetail, this);
  
          oRouter
            .getRoute("LieferungErstellen")
            .attachPatternMatched(this._onPatternMatchedCreate, this);
        },
  
        _onPatternMatchedDetail: function (oEvent) {
          this.bCreate = false; 
          let id = oEvent.getParameter("arguments").ID;
          if (id) {
            let sPath = "/Lieferant(" + id + ")";
            this.getView().bindObject(sPath);
          }
  
          this._setFragement("LieferungBearbeiten");
        },
  
        _onPatternMatchedCreate: function (oEvent) {
          this.bCreate = true; 
          this.getView().unbindElement();
          let oModel=new JSONModel({
            produkt_ID : "",
            lieferungsAnz: 1,
            name:"",
            steuernummer:0
          });
          this.getView().setModel(oModel, "createModel");
          
          this._setFragement("LieferungErstellen");
        },
        onDeleteButtonPressed: function (oEvent){
          let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
              
          let oSource = oEvent.getSource();
          let sPath = oSource.getBindingContext().getPath();
              
          MessageBox.warning(oResourceBundle.getText("Wollen Sie ihren Eintrag wirklich löschen?"), {
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
        _setFragement: function (sFragmentName) {
          let oPage = this.getView().byId("lieferungen_page");
          oPage.removeAllContent();
          if (this._fragmentList[sFragmentName]) {
            oPage.insertContent(this._fragmentList[sFragmentName]);
          } else {
            Fragment.load({
              id: this.getView().createId(sFragmentName),
              name: "at.clouddna.lagerverwaltung.view.fragment." + sFragmentName,
              controller: this,
            }).then(
              function (oFragment) {
                this._fragmentList[sFragmentName] = oFragment;
                oPage.insertContent(this._fragmentList[sFragmentName]);
              }.bind(this)
            );
          }
        },

        handleCalendarSelect: function (oEvent) {
          let oCalendar = oEvent.getSource();
          this._updateText(oCalendar);
        },
        handleStartDateChange: function (oEvent) {
          let oStart = oEvent.getSource().getStartDate();
          let oEnd = new Date(oStart.getFullYear(), oStart.getMonth() + 1, 0);
          let aFilter = [];
          let oView = this.getView();
          let aAndFilter = new Filter(aFilter, true);
          oView
            .byId("lieferungen_page")
            .getBinding("items")
            .filter(aAndFilter, FilterType.Application);
          let oDateRangeSelector = this.getView().byId("searchField");
        },
  
        _updateText: function (oCalendar) {
          let oText = this.byId("selectedDate"),
            aSelectedDates = oCalendar.getSelectedDates(),
            oDate = aSelectedDates[0].getStartDate();
          oDate = new Date(
            Date.UTC(oDate.getFullYear(), oDate.getMonth(), oDate.getDate())
          );
          let oInput = this.getView().getModel("DetailModel").getData(),
            oCreateData = {
              employee_ID: oInput.employee_ID,
              absence_day: oDate.toISOString().split("T")[0],
              absencetype_ID: oInput.absencetype_ID,
            };
          let oListBindingContext = this.getView()
            .getModel()
            .bindList("/Lieferung")
            .create(oCreateData);
          this.getView().getModel().refresh();
        },
  
        onNavBack: function () {
          let oHistory = History.getInstance();
          let sPreviousHash = oHistory.getPreviousHash();
  
          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("LieferungenDetails");
          }
        },
        onEditPressed: function () {
          this._toggleEdit(true);
        },
  
        _toggleEdit: function (bEditMode) {
          let oEditModel = this.getView().getModel("editModel");
  
          oEditModel.setProperty("/editmode", bEditMode);
  
          this._showCustomerFragment(bEditMode ? "LieferungBearbeiten" : "LieferungenDetails");
        },
  
        
         onSavePressed: function () {
          let oModel = this.getView().getModel();
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();
            debugger;
          let sSuccessText = this.bCreate
            ? oResourceBundle.getText("Ihr Eintrag wurde erfolgreich erstellt.")
            : oResourceBundle.getText("Ihr eintrag wurde erfolgreich bearbeitet.");
            
          //this.getView().bindElement(oListBindingContext.getPath());
          if(this.bCreate){
            
            let oListBinding=oModel.bindList("/Lieferant");
            oListBinding.attachCreateCompleted((oEvent)=>{
              debugger;
            })
            let oCreateModelData=this.getView().getModel("createModel").getData();
            debugger;
            oListBinding.create(this.getView().getModel("createModel").getData());

            //let oListBindingContext=this.getView().getModel().bindList("/Lieferant").create(this.getView().getModel("createModel").getData());
        
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
  