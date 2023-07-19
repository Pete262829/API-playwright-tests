import { test, expect, request, APIRequestContext } from '@playwright/test';

const API_Calls = require("./common/API_Calls");


test('Create app with single life', async ({ page }) => {    
  var authtoken = await API_Calls.authorisation();
  const apiRequestContext: APIRequestContext = await request.newContext();

  var jsonBody = await API_Calls.singleLifeAppJson(); 

  const response = await apiRequestContext.post(process.env.BASEURL + "api/application", {
      data: jsonBody,
      headers:{
        "Content-Type": "application/json",
        "Authorization":`Bearer ${authtoken}`
        }
      });

  const responseCode = response.status();
  expect(responseCode).toBe(201);

  var responseJson = JSON.parse(await response.text());
  expect(responseJson.customers.length).toBe(1);
});


test('Create app via API, check its searchable on front end', async ({ page }) => {    
  var authtoken = await API_Calls.authorisation();
  var appRef = await API_Calls._addLifeAPICall(authtoken);
  
  await page.goto(`${process.env.BASEURL}` + "dashboard");
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByPlaceholder('Email address').fill(`${process.env.USERNAME}`);
  await page.getByPlaceholder('Password').fill(`${process.env.PASSWORD}`);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByPlaceholder('Enter client name, date of birth (DD/MM/YYYY), or application reference').fill(`${appRef}`);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByText(`${appRef}`).isVisible;

  var responseCode = await API_Calls._deleteAppAPICall(authtoken, appRef);
  expect(responseCode).toBe(204);

  await page.goto(`${process.env.BASEURL}` + "dashboard");
  await page.getByPlaceholder('Enter client name, date of birth (DD/MM/YYYY), or application reference').fill(`${appRef}`);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByText(`${appRef}`).isHidden();

  await page.close();
});


  /* test('Delete App', async ({ page }) => {  
    var authtoken = await API_Calls.authorisation();
    var responseCode = await API_Calls._deleteAppAPICall(authtoken, "");
    expect(responseCode).toBe(204);
     
  }); */
