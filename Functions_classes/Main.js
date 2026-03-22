export class Authentication {
    //Class contains sub methosds which are used in all the test cases

    constructor(loginurl, yahoologin, apicontext) {
        this.loginapi = loginurl;
        this.yahooLoginPayload = yahoologin;
        this.request = apicontext;
    }

    async getLogin() {
        const loginapiurl = this.loginapi;
        const response_Auth = await this.request.post(loginapiurl, {
            data: this.yahooLoginPayload
        });
        if (!response_Auth.ok()) {
            throw new Error(`Login API failed with status ${response_Auth.status()}`);//check if the response is not successful and throw an error with the status code
        }
        const fullresponse = await response_Auth.json();
        return { data: fullresponse, status: response_Auth.status() };//return the full response and status code as an object
    }
}

export class GetEvents {

    constructor(eventurl, toeknizer, apicontext) {
        this.eventapi = eventurl;
        this.request = apicontext;
        this.token = toeknizer;
    }
    async getEvents() {
        const eventapiurl = this.eventapi;
        const response_getEvent = await this.request.get(eventapiurl, {
            headers: {
                'Authorization': this.token
            }
        });
        if (!response_getEvent.ok()) {
            throw new Error(`Events API failed with status ${response_getEvent.status()}`);//check if the response is not successful and throw an error with the status code
        }

        const fullresponse_getEvent = await response_getEvent.json();
        return { data: fullresponse_getEvent, status: response_getEvent.status() };
    }
}

export class PostBookings {

    constructor(bookingBase, toeknizer, apicontext, bookingpayload) {
        this.bookingapi = bookingBase;
        this.request = apicontext;
        this.token = toeknizer;
        this.bookingpayload = bookingpayload;
    }

    async postBooking(capturedId) {
        const bookingapiurl = this.bookingapi;
        const finalbookingpayload = {
            eventId: capturedId,
            ...this.bookingpayload //this is spread operator and it contains exsisting obj and "unpacks" or "spills"
        };
        console.log(finalbookingpayload);
        const response_postBooking = await this.request.post(bookingapiurl, {
            headers: {
                'Authorization': this.token
            },
            data: finalbookingpayload
        });
        if (!response_postBooking.ok()) {
            const errorReason = await response_postBooking.text(); // this is a method to capture the error reason from the response body when the API response is not successful and print it in the console for better debugging
            console.error("SERVER ERROR REASON:", errorReason);
            throw new Error(`Booking API failed with status ${response_postBooking.status()}`);//check if the response is not successful and throw an error with the status code
        }
        const fullresponse_postBooking = await response_postBooking.json();
        return { data: fullresponse_postBooking, status: response_postBooking.status(), isSuccess: response_postBooking.ok() };
    }
}

    export async function loginwithgmail(page,BaseUrl,googlelogin) {
    //function for login with Gmail by UI
    await page.goto(`${BaseUrl}/login`);
    await page.getByLabel('Email').fill(googlelogin.email);
    await page.getByLabel('Password').fill(googlelogin.password);
    await page.locator('#login-btn').click();
    await page.waitForNavigation();
    }