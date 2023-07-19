import dotenv from 'dotenv';
import {APIRequestContext, request} from '@playwright/test';

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

    singleLifeAppJson: async function(){
        const responseJson = require("./json/singlelife.json")
        return responseJson;
    },


    _addLifeAPICall: async function (authtoken: string) {
        const apiRequestContext: APIRequestContext = await request.newContext();
        var jsonBody = require("./json/singlelife.json");

        const response = await apiRequestContext.post(`${process.env.BASEURL}` + "api/application", {
            data: jsonBody,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        });

        const responseCode = await response.status();
        var responseJson = JSON.parse(await response.text());
        return responseJson.id;
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
    }


};
