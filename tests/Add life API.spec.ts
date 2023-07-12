import { test, expect, request, APIRequestContext } from '@playwright/test';

const loginVerify = require("./common/stuff");


test('authenticate', async ({ page }) => {
    
  var authtoken = await loginVerify.authorisation();

  const apiRequestContext: APIRequestContext = await request.newContext();
  
  var jsonBody = await loginVerify.singleLifeAppJson(); 

  const response = await apiRequestContext.post("", {
      data: jsonBody,
      headers:{
        "Content-Type": "application/json",
        "Authorization":`Bearer ${authtoken}`
        }
      });

  //const resBody = await response.json();
  const responseCode = await response.status();
  console.log(await response.text());

  await expect(responseCode).toBe(201);

  var responseJson = JSON.parse(response.text());
  await expect(responseJson.customers.count()).toBe(1);
});
