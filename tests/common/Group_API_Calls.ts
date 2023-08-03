import {expect, request} from '@playwright/test';
const jsonFunctions = require("./jsonFunctions");
const API_Calls = require("./API_Calls");

module.exports = {

    createJointLifeJointBenefitApplication: async function (clientDetailsJson: string, productDetailsJson: string, request: any){

        //var clientJsonTemplate = require("./json/" +`${clientDetailsJson}`);
        //var productJsonTemplate = require("./json/" +`${productDetailsJson}`);
        
        var authtoken = await API_Calls.authorisation(request);
    
        var addLiferesponse = await API_Calls.addLifeAPICall(authtoken, clientDetailsJson, request);
        var addLifeJsonResponse = JSON.parse(await addLiferesponse.text());
    
        var appRef = jsonFunctions.getProperty(addLifeJsonResponse,"id");
        var life1ID = addLifeJsonResponse.customers[0].id;
        var life2ID = addLifeJsonResponse.customers[1].id;
    
        var jointAppResponse = await API_Calls.addJointTermBenefitAPICall(authtoken, appRef, life1ID,life2ID, productDetailsJson, request); 
        
        var responseCode = jointAppResponse.status();
        
        var addJointBenJson = JSON.parse(await jointAppResponse.text());
    
        
        return jointAppResponse;
    }

};