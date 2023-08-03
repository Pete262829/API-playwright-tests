import { test, expect, request, APIRequestContext } from '@playwright/test';

const API_Calls = require("./common/API_Calls");
const Group_API_Calls = require("./common/Group_API_Calls");
const jsonFunctions = require("./common/jsonFunctions");


test('Create single life single benefit app', async ( {page, request} ) => {    

  var authtoken = await API_Calls.authorisation(request);
  var response = await API_Calls.addLifeAPICall(authtoken,"singlelife.json", request);
  var addLifeJsonResponse = JSON.parse(await response.text());

  var appRef = jsonFunctions.getProperty(addLifeJsonResponse,"id");
  var lifeOneID = addLifeJsonResponse.customers[0].id;

  var appUrl = await API_Calls.addTermBenefitAPICall(authtoken, appRef, lifeOneID,"singleTermBenefit.json", request); 
  
  const responseCode = response.status();
  expect(responseCode).toBe(201);

});

test('Create joint life single benefit app', async ({ page, request }) => {    

  const JsonfileName = "jointLifeTermBenefit.json";
  var jsonTemplate = require("./common/json/" +`${JsonfileName}`);
  
  var authtoken = await API_Calls.authorisation(request);
  var response = await API_Calls.addLifeAPICall(authtoken,"jointLife.json", request);
  var addLifeJsonResponse = JSON.parse(await response.text());

  var appRef = jsonFunctions.getProperty(addLifeJsonResponse,"id");
  var life1ID = addLifeJsonResponse.customers[0].id;
  var life2ID = addLifeJsonResponse.customers[1].id;

  var jointAppResponse = await API_Calls.addJointTermBenefitAPICall(authtoken, appRef, life1ID,life2ID,JsonfileName, request); 
  
  var responseCode = jointAppResponse.status();
  
  var addJointBenJson = JSON.parse(await jointAppResponse.text());

  expect(addJointBenJson.coverAmount).toBe(jsonTemplate.coverAmount);
  expect(addJointBenJson.livesAssured[0].refersTo).toBe(life1ID);
  expect(addJointBenJson.livesAssured[1].refersTo).toBe(life2ID);
  expect(responseCode).toBe(201);
});

test('Add Joint Life App With Joint Term', async ({page, request}) => {
  var finalResponse = await Group_API_Calls.createJointLifeJointBenefitApplication("jointLife.json","jointLifeTermBenefit.json", request);

  const responseCode = finalResponse.status();
  expect(responseCode).toBe(201);
});


test('Bulk app delete App', async ({ page, request }) => {  
  var myArray = ["UME000033723","UME000033722","UME000033721","UME000033720","UME000033719","UME000033718","UME000033717","UME000033716","UME000033713","UME000033712","UME000033711","UME000033710","UME000033709","UME000033708","UME000033707","UME000033706","UME000033705","UME000033704","UME000033703","UME000033702"];

  var authtoken = await API_Calls.authorisation(request);

  for(let i=0; i<myArray.length; i++){
    var responseCode = await API_Calls.deleteAppAPICall(authtoken, myArray[i], request);
  }
});   