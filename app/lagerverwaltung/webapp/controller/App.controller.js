sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("at.clouddna.lagerverwaltung.controller.App", {
            onInit: function () {
            },
            _onListItemPressed: function(oEvent){
                let oRouter=this.getOwnerComponent().getRouter();
                if(oEvent.getParameters().listItem.getId().includes("produkte_ID")){
                    oRouter.navTo("Produkte");
                }else if(oEvent.getParameters().listItem.getId().includes("lieferanten_ID")){
                    oRouter.navTo("Lieferanten");
                }else if(oEvent.getParameters().listItem.getId().includes("lagerorte_ID")){
                    oRouter.navTo("Lagerorte");
                }
              }
        });
    });
