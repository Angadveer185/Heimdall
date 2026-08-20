# Postman Testing Guide for Shelter CRUD & Verification

This document details how to test the Shelter CRUD endpoints and verification system using Postman.

---

## 0. Prerequisite: Authentication

Before calling the shelter registration route (which is authenticated):
1. Register or login a user via `POST /api/auth/register` or `POST /api/auth/login`.
2. Grab the `accessToken` returned in the response (or from cookies).
3. In Postman, go to the **Authorization** tab, select **Bearer Token**, and paste your token.

*Note: The routes for fetching, updating, and deleting shelters do not currently enforce authentication, but the creation route does.*

---

## 1. Create/Register a Shelter

* **Endpoint:** `POST /api/shelters`
* **Headers:** 
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_access_token>`

### Entry A: Valid USA Shelter (Auto-Verifies via ProPublica API)
* **Description:** Registering a real US non-profit using a valid EIN (`135562725` for American Red Cross).
* **Body (JSON):**
```json
{
  "name": "American Red Cross Northwest",
  "country": "USA",
  "organizationIdType": "EIN",
  "organizationId": "13-5562725",
  "description": "Preventing and alleviating human suffering in the face of emergencies.",
  "street": "1900 25th Ave S",
  "city": "Seattle",
  "state": "WA",
  "zip": "98144",
  "longitude": -122.3005,
  "latitude": 47.5862,
  "dropOffHours": "Mon-Fri 9:00 AM - 4:00 PM",
  "contactEmail": "nw@redcross.org",
  "phone": "+12067263500",
  "website": "https://www.redcross.org"
}
```
* **Expected Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b503a1",
    "name": "American Red Cross Northwest",
    "country": "USA",
    "organizationIdType": "EIN",
    "organizationId": "13-5562725",
    "verificationStatus": "PENDING"
  }
}
```
* **After Verification Status check (`GET /api/shelters/64d2572b9a7c3c2f10b503a1`):**
  Status updates to `"VERIFIED"`.

---

### Entry B: Valid Indian Shelter (Auto-Verifies via Format Match)
* **Description:** Registering an Indian shelter with a valid NGO Darpan ID format (`KA/2021/0123456`).
* **Body (JSON):**
```json
{
  "name": "Sahara Hope Center",
  "country": "India",
  "organizationIdType": "NGO_DARPAN",
  "organizationId": "KA/2021/0123456",
  "description": "Providing shelter and medical care for the homeless in Bengaluru.",
  "street": "12 Residency Road",
  "city": "Bengaluru",
  "state": "Karnataka",
  "zip": "560025",
  "longitude": 77.5946,
  "latitude": 12.9716,
  "dropOffHours": "Mon-Sun 8:00 AM - 8:00 PM",
  "contactEmail": "info@saharahope.org",
  "phone": "+918025550123",
  "website": "https://www.saharahope.org"
}
```
* **Expected Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b503a2",
    "name": "Sahara Hope Center",
    "country": "India",
    "organizationIdType": "NGO_DARPAN",
    "organizationId": "KA/2021/0123456",
    "verificationStatus": "PENDING"
  }
}
```
* **After Verification Status check (`GET /api/shelters/64d2572b9a7c3c2f10b503a2`):**
  Status updates to `"VERIFIED"`.

---

### Entry C: Invalid Shelter (Triggers Rejection Status)
* **Description:** Registering a US shelter using an invalid/non-existent EIN (`99-9999999`).
* **Body (JSON):**
```json
{
  "name": "Fictional Seattle Shelter",
  "country": "USA",
  "organizationIdType": "EIN",
  "organizationId": "99-9999999",
  "description": "A test shelter with fake registration credentials.",
  "street": "999 Fake Street",
  "city": "Seattle",
  "state": "WA",
  "zip": "98101",
  "longitude": -122.3321,
  "latitude": 47.6062,
  "dropOffHours": "Mon-Fri 10:00 AM - 4:00 PM",
  "contactEmail": "test@fictionshelter.org",
  "phone": "+12065559999"
}
```
* **Expected Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b503a3",
    "name": "Fictional Seattle Shelter",
    "country": "USA",
    "organizationIdType": "EIN",
    "organizationId": "99-9999999",
    "verificationStatus": "PENDING"
  }
}
```
* **After Verification Status check (`GET /api/shelters/64d2572b9a7c3c2f10b503a3`):**
  Status updates to `"REJECTED"`.
  ```json
  {
    "success": true,
    "data": {
      "id": "64d2572b9a7c3c2f10b503a3",
      "name": "Fictional Seattle Shelter",
      "verificationStatus": "REJECTED",
      "rejectionReason": "Organization not found in ProPublica Nonprofit Database."
    }
  }
  ```

---

## 2. Read/Get All Shelters

* **Endpoint:** `GET /api/shelters`
* **Description:** Fetches all registered shelters.
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64d2572b9a7c3c2f10b503a1",
      "name": "American Red Cross Northwest",
      "country": "USA",
      "organizationIdType": "EIN",
      "organizationId": "13-5562725",
      "verificationStatus": "VERIFIED",
      "description": "Preventing and alleviating human suffering in the face of emergencies.",
      "street": "1900 25th Ave S",
      "city": "Seattle",
      "state": "WA",
      "zip": "98144",
      "longitude": -122.3005,
      "latitude": 47.5862,
      "dropOffHours": "Mon-Fri 9:00 AM - 4:00 PM",
      "contactEmail": "nw@redcross.org",
      "phone": "+12067263500",
      "website": "https://www.redcross.org",
      "createdAt": "2026-08-10T10:00:00.000Z",
      "updatedAt": "2026-08-10T10:00:05.000Z"
    }
  ]
}
```

---

## 3. Read/Get Shelter by ID

* **Endpoint:** `GET /api/shelters/:id` (e.g. `GET /api/shelters/64d2572b9a7c3c2f10b503a1`)
* **Description:** Query a single registered shelter by its MongoDB unique ObjectId.
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b503a1",
    "name": "American Red Cross Northwest",
    "country": "USA",
    "organizationIdType": "EIN",
    "organizationId": "13-5562725",
    "verificationStatus": "VERIFIED",
    "description": "Preventing and alleviating human suffering in the face of emergencies.",
    "street": "1900 25th Ave S",
    "city": "Seattle",
    "state": "WA",
    "zip": "98144",
    "longitude": -122.3005,
    "latitude": 47.5862,
    "dropOffHours": "Mon-Fri 9:00 AM - 4:00 PM",
    "contactEmail": "nw@redcross.org",
    "phone": "+12067263500",
    "website": "https://www.redcross.org"
  }
}
```

---

## 4. Get Shelter by Organization ID

* **Endpoint:** `GET /api/shelters/organization/:organizationId` (e.g. `GET /api/shelters/organization/13-5562725`)
* **Description:** Find a registered shelter via its unique organization identifier (EIN, NGO Darpan, etc.).
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b503a1",
    "name": "American Red Cross Northwest",
    "organizationIdType": "EIN",
    "organizationId": "13-5562725",
    "verificationStatus": "VERIFIED"
  }
}
```

---

## 5. Update/Patch Shelter by ID

* **Endpoint:** `PATCH /api/shelters/:id` (e.g. `PATCH /api/shelters/64d2572b9a7c3c2f10b503a1`)
* **Headers:** `Content-Type: application/json`
* **Description:** Partially updates a shelter configuration.
* **Body (JSON):**
```json
{
  "name": "American Red Cross NW - Main Branch",
  "description": "Preventing and alleviating human suffering in emergencies. Updated description.",
  "dropOffHours": "Mon-Fri 8:00 AM - 6:00 PM"
}
```
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b503a1",
    "name": "American Red Cross NW - Main Branch",
    "description": "Preventing and alleviating human suffering in emergencies. Updated description.",
    "dropOffHours": "Mon-Fri 8:00 AM - 6:00 PM",
    "verificationStatus": "VERIFIED"
  }
}
```

---

## 6. Delete Shelter by ID

* **Endpoint:** `DELETE /api/shelters/:id` (e.g. `DELETE /api/shelters/64d2572b9a7c3c2f10b503a3`)
* **Description:** Deletes a shelter record by ID.
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Shelter deleted successfully"
}
```

---

## 7. Purge All Shelters (Development/Testing Only)

* **Endpoint:** `DELETE /api/shelters`
* **Description:** Purges all shelters from the database. Useful for resetting tests.
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "message": "All shelters purged successfully"
}
```
