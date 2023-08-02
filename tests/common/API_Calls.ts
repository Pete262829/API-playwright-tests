import dotenv from 'dotenv';
import {APIRequestContext, expect, request} from '@playwright/test';
const jsonFunctions = require("./jsonFunctions");

module.exports = {
    authorisation: async function ( request: any ){
        dotenv.config();
        
        const response = await request.post(`${process.env.BASEURL}api/auth`, {
                    
            data: {     
                username: process.env.USERNAME,
                password: process.env.PASSWORD
            }
            });
    
        const token = JSON.parse(await response.text());
        return token.access_token;
    },

    addLifeAPICall: async function (authtoken: string, fileName: string, request: any) {
        //const apiRequestContext: APIRequestContext = await request.newContext();
        var jsonBody = require("./json/" +`${fileName}`);

        const response = await request.post(`${process.env.BASEURL}api/application`, {
            data: jsonBody,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        });

        return response;
    },

    addSecondLifeAPICall: async function (authtoken: string, fileName: string,  appRef: String, request: any) {
        
        var jsonBody = require("./json/" +`${fileName}`);
        const response = await request.post(`${process.env.BASEURL}` + `api/application/${appRef}/customer`, {
            data: jsonBody,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        });

        return response;
    },


    getCustomerAPICall: async function (authtoken: string, appRef: String, request: any) {
                
        const response = await request.get(`${process.env.BASEURL}api/application/${appRef}/customer`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        });

        return response;
    },
    


    deleteAppAPICall: async function (authtoken: string, appID: string, request: any){
        
        const response = await request.delete(`${process.env.BASEURL}api/application/${appID}`, {
            
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        });
        const responseCode = response.status();     
        return responseCode;
    },


    addTermBenefitAPICall: async function (authtoken: string, appID: String, lifeID: string, fileName: string, request: any) {
        //const apiRequestContext: APIRequestContext = await request.newContext();
        var jsonTemplate = require("./json/" +`${fileName}`);

        var oldArray = JSON.stringify(jsonTemplate).replace("LIFE1ID", `${lifeID}`); //convert to JSON string
        var sendBody = JSON.parse(oldArray); //convert back to array

        const response = await request.post(`${process.env.BASEURL}api/application/${appID}/product/`, {
            data: sendBody,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        });

        return response;
    },

    addJointTermBenefitAPICall: async function (authtoken: string, appID: String, life1ID: string, life2ID: string, fileName: string, request: any) {
        var jsonTemplate = require("./json/" +`${fileName}`);

        var oldArray = JSON.stringify(jsonTemplate).replace("LIFE1ID", `${life1ID}`); //convert to JSON string
        var oldArray = JSON.stringify(oldArray).replace("LIFE2ID", `${life2ID}`); //convert to JSON string
        var sendBody = JSON.parse(oldArray); //convert back to array

        const response = await request.post(`${process.env.BASEURL}api/application/${appID}/product/`, {
            data: sendBody,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        });

        return response;
    }

};
