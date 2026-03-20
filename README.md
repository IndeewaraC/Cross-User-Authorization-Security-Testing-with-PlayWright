# Cross-User-Authorization-Security-Testing-with-PlayWright
This test suite validates the security boundary between different user accounts within the EventHub ecosystem. The primary objective is to ensure that a "Gmail User" cannot view or access a booking created by a "Yahoo User," even if they possess the direct UUID/ID of that booking.


The script utilizes a hybrid approach, leveraging Playwright's request object for fast data setup and the page object for end-to-end UI verification.

Phase 1: API-Driven Data Setup (The "Attacker's" Target)
Headless Authentication: The script authenticates as a Yahoo User via POST /api/auth/login.

Resource Discovery: It queries the GET /api/events endpoint to dynamically retrieve a valid eventId, ensuring the test is not dependent on hardcoded data.

Resource Creation: A private booking is generated via POST /api/bookings. The resulting yahooBookingId is captured to serve as the target for the unauthorized access attempt.

Phase 2: UI-Driven Authorization Bypass Attempt
Identity Switch: The test transitions to the browser UI, logging in as a completely different user (Gmail User) using a reusable loginAs helper.

Direct ID Infiltration: The Gmail User attempts to bypass the standard UI navigation by jumping directly to the specific URL of the Yahoo User’s booking: BASE_URL/bookings/{yahooBookingId}.

Phase 3: Security Assertions
State Resolution: The test utilizes networkidle to ensure all authorization checks and API calls have settled.

BOLA Validation: The script asserts that the application denies access, specifically looking for:

The "Access Denied" header.

The error message: "You are not authorized to view this booking."

### Key Technical Concepts
API Chaining: Passing tokens and IDs across multiple request calls to build a complex state.

Header Management: Implementing Authorization: Bearer <token> for secure API communication.

Multi-User Contexts: Managing two distinct user identities within a single test execution.

Route Guard Testing: Verifying that frontend routes are protected by backend authorization logic.

### How to Run the Assignment
Ensure your BASE_URL and user credentials are configured in the constants or environment variables.

The test expects a loginAs(page, user) helper function to be available for UI-based login.

Execute the test using:
npx playwright test tests/security/authorization.spec.js
