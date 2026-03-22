//URL and API endpoints
export let BaseUrl = "https://eventhub.rahulshettyacademy.com";
export let baseapiurl = 'https://api.eventhub.rahulshettyacademy.com';
export let LoginUrl = `${baseapiurl}/api/auth/login`;
export let eventurl = `${baseapiurl}/api/events`;
export let bookingBase = `${baseapiurl}/api/bookings`;

//Global variables to capture the token, event id and API responses
export let apicontext;
export let TokenResponse;
export let getEventresponse;
export let toeknizer;
export let eventid;
export let bookingresponse;
export let yahoobookingid;