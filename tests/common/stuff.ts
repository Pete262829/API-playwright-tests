import {APIRequestContext, request} from '@playwright/test';

module.exports = {
    
    authorisation: async function (){
    const apiRequestContext: APIRequestContext = await request.newContext();

    const response = await apiRequestContext.post("/*the URL here*/", {
        data: {
            username: '/*what the username is*/',
            password: '/*the password*/',
        }
        });
  
    const token = JSON.parse(await response.text());
    return token.access_token;
    },

    singleLifeAppJson: async function(){
        const responseJson = require("./json/singlelife.json")

        return responseJson;

    }


};
