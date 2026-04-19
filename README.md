# 🛡️ Cross-User Authorization Security Testing with Playwright

[![Playwright Tests](https://github.com/IndeewaraC/Cross-User-Authorization-Security-Testing-with-PlayWright/actions/workflows/playwright.yml/badge.svg)](#) *(Note: Replace with your actual GitHub Actions badge link once configured)*

## 💡 TL;DR & Business Value
**The Problem:** Broken Object Level Authorization (BOLA) is a critical OWASP Top 10 vulnerability that can lead to massive data leaks if users can access other tenants' private data by simply changing a URL ID.
**The Solution:** This hybrid API/UI test suite provides automated, continuous validation of the security boundary between different user accounts within the EventHub ecosystem. It ensures strict tenant data isolation, mitigating compliance risks and protecting sensitive user data.

---

## 🏗️ Architecture: The Hybrid Approach
This script utilizes a hybrid testing approach. It leverages Playwright's `request` object for lightning-fast backend data setup, and the `page` object for end-to-end frontend UI verification.

### Phase 1: API-Driven Data Setup (The "Attacker's" Target)
* **Headless Authentication:** The script authenticates as a "Yahoo User" via `POST /api/auth/login`.
* **Resource Discovery:** It queries the `GET /api/events` endpoint to dynamically retrieve a valid `eventId`, ensuring the test is robust and not dependent on hardcoded, stale data.
* **Resource Creation:** A private booking is generated via `POST /api/bookings`. The resulting `yahooBookingId` is captured to serve as the target for the unauthorized access attempt.

### Phase 2: UI-Driven Authorization Bypass Attempt
* **Identity Switch:** The test transitions to the browser UI, logging in as a completely different user ("Gmail User") using a reusable `loginAs` helper.
* **Direct ID Infiltration:** The "Gmail User" attempts to bypass the standard UI navigation by jumping directly to the specific URL of the "Yahoo User’s" private booking: `BASE_URL/bookings/{yahooBookingId}`.

### Phase 3: Security Assertions
* **State Resolution:** The test utilizes `networkidle` to ensure all frontend authorization checks and backend API calls have fully settled.
* **BOLA Validation:** The script asserts that the application successfully denies access at the route level, specifically verifying:
  * The visibility of the "Access Denied" header.
  * The precise error message: *"You are not authorized to view this booking."*

---

## 🧠 Key Technical Concepts Demonstrated
* **API Chaining:** Passing authentication tokens and dynamic IDs across multiple request calls to build complex testing states.
* **Header Management:** Implementing `Authorization: Bearer <token>` for secure API communication.
* **Multi-User Contexts:** Managing two distinct, isolated user identities within a single test execution.
* **Route Guard Testing:** Verifying that frontend routes are strictly protected by backend authorization logic.

---

## 🚀 Setup & Execution

**1. Configuration**
Ensure your `BASE_URL` and user credentials are configured in your constants or environment variables (`.env`). The test expects a `loginAs(page, user)` helper function to be available for UI-based login.

**2. Install Dependencies**
```bash
npm install
npx playwright install
