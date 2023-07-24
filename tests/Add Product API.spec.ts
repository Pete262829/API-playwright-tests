import { test, expect, request, APIRequestContext } from '@playwright/test';
const API_Calls = require("./common/API_Calls");
const jsonFunctions = require("./common/jsonFunctions");


test('Create single life single benefit app', async ({ page }) => {    

    var authtoken = await API_Calls.authorisation();
    var response = await API_Calls._addLifeAPICall(authtoken,"singlelife.json");
    var addLifeJsonResponse = JSON.parse(await response.text());

    var appRef = jsonFunctions.getProperty(addLifeJsonResponse,"id");
    var lifeOneID = addLifeJsonResponse.customers[0].id;

    var appUrl = await API_Calls._addTermBenefitAPICall(authtoken, appRef, lifeOneID,"singleTermBenefit.json"); 
    
    const responseCode = response.status();
    expect(responseCode).toBe(201);

});

test('Create joint life single benefit app', async ({ page }) => {    

  //TODO need to finish this off
  var authtoken = await API_Calls.authorisation();
  var response = await API_Calls._addLifeAPICall(authtoken,"jointLife.json");
  var addLifeJsonResponse = JSON.parse(await response.text());

  var appRef = jsonFunctions.getProperty(addLifeJsonResponse,"id");
  var life1ID = addLifeJsonResponse.customers[0].id;
  var life2ID = addLifeJsonResponse.customers[1].id;

  var jointAppResponse = await API_Calls._addJointTermBenefitAPICall(authtoken, appRef, life1ID,life2ID,"jointLifeTermBenefit.json"); 
  
  const responseCode = jointAppResponse.status();
  
  var addJointBenJson = JSON.parse(await jointAppResponse.text());

  expect(responseCode).toBe(201);

});


test('Bulk app delete App', async ({ page }) => {  
  var myArray = ["AppID"];

  var authtoken = await API_Calls.authorisation();

  for(let i=0; i<myArray.length; i++){
    var responseCode = await API_Calls._deleteAppAPICall(authtoken, myArray[i]);
  }
});   