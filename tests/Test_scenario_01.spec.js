import { expect, test, request } from '@playwright/test';
import * as utils from '../utils/Base_File.js';
import * as td from '../TestData/TestData.js';
import { Authentication, GetEvents, PostBookings, loginwithgmail } from '../Functions_classes/Main.js';


test.beforeAll(async () => {

    utils.apicontext = await request.newContext();// create api context to be used for making API requests in the test cases

    //create an instance of the Authentication class and call the getLogin method to perform login and capture the token from the response
    const authnewclass = new Authentication(utils.LoginUrl, td.yahoologin, utils.apicontext);
    utils.TokenResponse = await authnewclass.getLogin();

    utils.toeknizer = 'Bearer ' + utils.TokenResponse.data.token;//assign token to global variable
    console.log('Captured Token:', utils.TokenResponse.data.token);//print the token value from the login API response
    console.log('Status Code:', utils.TokenResponse.status);//print the status code of the login API response

});

// .serial is used to run the test cases in a sequential manner
test.describe.serial("Scenario 01 : Verify that user can login with valid credentials", () => {

    test("TC 01 : Verify that user can login with valid credentials", async ({ page }) => {
        await page.addInitScript(value => {
            window.localStorage.setItem('token', value);
        }, utils.TokenResponse.data.token);
        await page.goto(utils.BaseUrl);
        expect(utils.TokenResponse.status).toBe(200);//assert the status code of the login API response
    });

    test("TC 02 : Verify that user can access events with valid token", async ({ page }) => {
        await page.addInitScript(value => {
            window.localStorage.setItem('token', value);
        }, utils.TokenResponse.data.token);

        //create an instance of the GetEvents class and call the getEvents method to capture the events response and status code
        const getEventsnewclass = new GetEvents(utils.eventurl, utils.toeknizer, utils.apicontext);
        utils.getEventresponse = await getEventsnewclass.getEvents();

        expect(utils.getEventresponse.status).toBe(200);//assert the status code of the events API response
        console.log('Events Response:', utils.getEventresponse.data);
        utils.eventid = utils.getEventresponse.data.data[0].id;//stored the event id of the first event in the response to a global variable for future use
        console.log('Captured Event ID:', utils.eventid);//print the captured event id value
        expect(utils.getEventresponse.status).toBe(200);//assert the status code of the events API response is 200 or not
    });

    test("TC 03 : Verify that user can create a booking with valid token and event id", async ({ page }) => {
        await page.addInitScript(value => {
            window.localStorage.setItem('token', value);
        }, utils.TokenResponse.data.token);

        //creating booking instance to create a booking for the captured event id and token
        const postBookingnewclass = new PostBookings(utils.bookingBase, utils.toeknizer, utils.apicontext, td.bookingpayload);
        utils.bookingresponse = await postBookingnewclass.postBooking(utils.eventid);

        console.log('Events Response:', utils.bookingresponse.data);
        utils.yahoobookingid = utils.bookingresponse.data.data.bookingRef;//stored the booking id from the booking response to a global variable for future use
        console.log('Captured Booking ID:', utils.yahoobookingid);
        expect(utils.bookingresponse.isSuccess).toBeTruthy();//assert the success status of the booking API response
    });
    test("TC 04/05/06 : Verify that user can login with Gmail credentials", async ({ page }) => {
        //Step 04 : login with Gmail Account by using UI
        await loginwithgmail(page, utils.BaseUrl, td.googlelogin);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('h1')).toContainText(/Discover & Book.*Amazing Events/i);//assert the visibility of the text after login to confirm that the login is successful
        await page.screenshot({ path: 'Loginwith_Gmail.png' });//screenshot after login with Gmail credentials

        //Step 05: navigate to Yahoo's booking URL as Gmail user
        await page.goto(`${utils.BaseUrl}/bookings/${utils.yahoobookingid}`);
        await page.waitForLoadState('networkidle');

        //step 06: Validate Access Denied
        const accessDeniedMessage = page.locator('h3:has-text("Booking not found")');
        await expect(accessDeniedMessage).toBeVisible();//not visible positive assertion
        await page.locator('h3:has-text("Booking not found")').screenshot({ path: 'AccessDenied_Message.png' });//screenshot of the access denied message only
        await page.screenshot({ path: 'AccessDenied.png' });//screenshot after accessing denied booking entire page
    });

});