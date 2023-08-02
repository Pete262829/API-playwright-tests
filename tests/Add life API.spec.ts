import { test, expect, request, APIRequestContext } from '@playwright/test';

const API_Calls = require("./common/API_Calls");
const jsonFunctions = require("./common/jsonFunctions");


test('Create app with single life', async ({ page, request }) => {    

  var authtoken = await API_Calls.authorisation(request);
  var response = await API_Calls.addLifeAPICall(authtoken,"singlelife.json", request);
  var responseJson = JSON.parse(await response.text());
  
  const responseCode = response.status();
  expect(responseCode).toBe(201);

  var responseJson = JSON.parse(await response.text());
  expect(responseJson.customers.length).toBe(1); 

});


  test('Create app with two lives', async ({ page, request }) => {    

  var authtoken = await API_Calls.authorisation(request);
  var response = await API_Calls.addLifeAPICall(authtoken,"jointLife.json", request);
  var responseJson = JSON.parse(await response.text());
  
  const responseCode = response.status();
  expect(responseCode).toBe(201);

  var responseJson = JSON.parse(await response.text());
  expect(responseJson.customers.length).toBe(2); 

});


test('Create app via API, check its searchable on front end', async ({ page, request }) => {    
  var authtoken = await API_Calls.authorisation(request);
  var response = await API_Calls.addLifeAPICall(authtoken,"singlelife.json", request);
  var responseJson = JSON.parse(await response.text());
  var appRef = jsonFunctions.getProperty(responseJson,"id");

  await page.goto(`${process.env.BASEURL}` + "dashboard");
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByPlaceholder('Email address').fill(`${process.env.USERNAME}`);
  await page.getByPlaceholder('Password').fill(`${process.env.PASSWORD}`);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByPlaceholder('Enter client name, date of birth (DD/MM/YYYY), or application reference').fill(`${appRef}`);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByText(`${appRef}`).isVisible;

  var responseCode = await API_Calls.deleteAppAPICall(authtoken, appRef, request);
  expect(responseCode).toBe(204);

  await page.goto(`${process.env.BASEURL}` + "dashboard");
  await page.getByPlaceholder('Enter client name, date of birth (DD/MM/YYYY), or application reference').fill(`${appRef}`);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByText(`${appRef}`).isHidden();

  await page.close();

});

test('Create app with single life then add a second life', async ({ page, request }) => {    
  var authtoken = await API_Calls.authorisation(request);
  var response = await API_Calls.addLifeAPICall(authtoken,"singlelife.json", request);
  var responseJson = JSON.parse(await response.text());
  var appRef = jsonFunctions.getProperty(responseJson,"id");

  const firstResponseCode = response.status();
  expect(firstResponseCode).toBe(201);

  var response = await API_Calls.addSecondLifeAPICall(authtoken,"secondSingleLife.json", appRef, request);

  const secondResponseCode = response.status();
  expect(secondResponseCode).toBe(201);

  var response = await API_Calls.getCustomerAPICall(authtoken, appRef, request);

  const getResponseCode = response.status();
  expect(getResponseCode).toBe(200);

  const getResponseJson = JSON.parse (await response.text())
  expect(getResponseJson.length).toBe(2); 

});




