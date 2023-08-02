import {expect, request} from '@playwright/test';
const jsonFunctions = require("./jsonFunctions");
const API_Calls = require("./API_Calls");

module.exports = {

    createJointLifeJointBenefitApplication: async function (clientDetailsJson: string, productDetailsJson: string, request: any){

        var clientJsonTemplate = require("./json/" +`${clientDetailsJson}`);
        var productJsonTemplate = require("./json/" +`${productDetailsJson}`);
        
        const authtoken = await API_Calls.authorisation(request);
    
        const response = await API_Calls.addLifeAPICall(authtoken, clientJsonTemplate, request);
        var addLifeJsonResponse = JSON.parse(await response.text());
    
        var appRef = jsonFunctions.getProperty(addLifeJsonResponse,"id");
        var life1ID = addLifeJsonResponse.customers[0].id;
        var life2ID = addLifeJsonResponse.customers[1].id;
    
        const jointAppResponse = await API_Calls.addJointTermBenefitAPICall(authtoken, appRef, life1ID,life2ID, productJsonTemplate, request); 
        
        var responseCode = jointAppResponse.status();
        
        var addJointBenJson = JSON.parse(await jointAppResponse.text());
    
        
        return jointAppResponse;
    }

};