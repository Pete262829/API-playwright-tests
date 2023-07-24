import dotenv from 'dotenv';
import {APIRequestContext, expect, request} from '@playwright/test';

module.exports = {
    
    authorisation: async function (){
        dotenv.config();
        const apiRequestContext: APIRequestContext = await request.newContext();

        const response = await apiRequestContext.post(`${process.env.BASEURL}` + "api/auth", {
            data: {
                username: process.env.USERNAME,
                password: process.env.PASSWORD,
            }
            });
    
        const token = JSON.parse(await response.text());
        return token.access_token;
    },

    _addLifeAPICall: async function (authtoken: string, fileName: string) {
        const apiRequestContext: APIRequestContext = await request.newContext();
        var jsonBody = require("./json/" +`${fileName}`);

        const response = await apiRequestContext.post(`${process.env.BASEURL}` + "api/application", {
            data: jsonBody,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        });

        return response;
    },

    _addSecondLifeAPICall: async function (authtoken: string, fileName: string,  appRef: String) {
        const apiRequestContext: APIRequestContext = await request.newContext();
        var jsonBody = require("./json/" +`${fileName}`);

        const appURL = `${process.env.BASEURL}` + "api/application/" + `${appRef}` + "/customer";
        
        const response = await apiRequestContext.post(`${appURL}`, {
            data: jsonBody,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        });

        return response;
    },


    _getCustomerAPICall: async function (authtoken: string, appRef: String) {
        const apiRequestContext: APIRequestContext = await request.newContext();
        const appURL = `${process.env.BASEURL}` + "api/application/" + `${appRef}` + "/customer";
        
        const response = await apiRequestContext.get(`${appURL}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        });

        return response;
    },
    


    _deleteAppAPICall: async function (authtoken: string, appID: string){
        const apiRequestContext: APIRequestContext = await request.newContext();

        const response = await apiRequestContext.delete(`${process.env.BASEURL}` + "api/application/" + `${appID}`, {
            
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        });
        const responseCode = response.status();     
        return responseCode;
    },


    _addTermBenefitAPICall: async function (authtoken: string, appID: String, lifeID: string, fileName: string) {
        const apiRequestContext: APIRequestContext = await request.newContext();
        var jsonTemplate = require("./json/" +`${fileName}`);

        var oldArray = JSON.stringify(jsonTemplate).replace("LIFE1ID", `${lifeID}`); //convert to JSON string
        var sendBody = JSON.parse(oldArray); //convert back to array

        const response = await apiRequestContext.post(`${process.env.BASEURL}` + "api/application/" +`${appID}` + "/product/", {
            data: sendBody,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        });

        return response;
    },

    _addJointTermBenefitAPICall: async function (authtoken: string, appID: String, life1ID: string, life2ID: string, fileName: string) {
        const apiRequestContext: APIRequestContext = await request.newContext();
        var jsonTemplate = require("./json/" +`${fileName}`);

        var oldArray = JSON.stringify(jsonTemplate).replace("LIFE1ID", `${life1ID}`); //convert to JSON string
        var oldArray = JSON.stringify(oldArray).replace("LIFE2ID", `${life2ID}`); //convert to JSON string
        var sendBody = JSON.parse(oldArray); //convert back to array

        const response = await apiRequestContext.post(`${process.env.BASEURL}` + "api/application/" +`${appID}` + "/product/", {
            data: sendBody,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        });

        return response;
    }
};