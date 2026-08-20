# Postman Testing Guide for ShelterRequest Endpoints

This document details how to test ShelterRequest endpoints using Postman. It supports nested creation of requested items.

---

## Authorization Requirements
- Read endpoints (`GET`) do not require authentication.
- Write endpoints (`POST`, `PATCH`, `DELETE`) require a user with **`SHELTER_ADMIN`** or **`SUPER_ADMIN`** role.
- Purge endpoint (`DELETE /api/shelter-requests`) requires the **`SUPER_ADMIN`** role.
- Ensure you have logged in via `POST /api/auth/login` to set the authentication cookie or include the access token before making write requests.

---

## 1. ShelterRequest Routes

### A. Create Shelter Request (With Nested Items)
* **Endpoint:** `POST /api/shelter-requests`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "shelterId": "64d2572b9a7c3c2f10b50321",
  "title": "Winter Food Drive",
  "description": "Weekly food drive to request fresh fruits and resources.",
  "urgency": "HIGH",
  "categoryIds": ["64d2572b9a7c3c2f10b50301"],
  "items": [
    {
      "globalItemId": "64d2572b9a7c3c2f10b50311",
      "quantityNeeded": 50,
      "unit": "kg",
      "notes": "Red apples preferred"
    }
  ]
}
```
* **Expected Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50341",
    "shelterId": "64d2572b9a7c3c2f10b50321",
    "title": "Winter Food Drive",
    "description": "Weekly food drive to request fresh fruits and resources.",
    "urgency": "HIGH",
    "status": "ACTIVE",
    "categoryIds": ["64d2572b9a7c3c2f10b50301"],
    "createdAt": "2026-08-11T11:20:00.000Z",
    "updatedAt": "2026-08-11T11:20:00.000Z",
    "categories": [
      {
        "id": "64d2572b9a7c3c2f10b50301",
        "name": "Food & Nutrition",
        "icon": "apple-fruit-icon"
      }
    ],
    "items": [
      {
        "id": "64d2572b9a7c3c2f10b50351",
        "requestId": "64d2572b9a7c3c2f10b50341",
        "globalItemId": "64d2572b9a7c3c2f10b50311",
        "quantityNeeded": 50,
        "quantityReserved": 0,
        "quantityDelivered": 0,
        "unit": "kg",
        "notes": "Red apples preferred",
        "createdAt": "2026-08-11T11:20:00.000Z",
        "updatedAt": "2026-08-11T11:20:00.000Z",
        "globalItem": {
          "id": "64d2572b9a7c3c2f10b50311",
          "title": "Organic Apples",
          "defaultUnit": "kg"
        }
      }
    ],
    "shelter": {
      "id": "64d2572b9a7c3c2f10b50321",
      "name": "St. Mary's Shelter",
      "city": "Seattle",
      "state": "WA",
      "verificationStatus": "VERIFIED"
    }
  }
}
```

### B. Get All Shelter Requests
* **Endpoint:** `GET /api/shelter-requests`
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64d2572b9a7c3c2f10b50341",
      "shelterId": "64d2572b9a7c3c2f10b50321",
      "title": "Winter Food Drive",
      "description": "Weekly food drive to request fresh fruits and resources.",
      "urgency": "HIGH",
      "status": "ACTIVE",
      "categoryIds": ["64d2572b9a7c3c2f10b50301"],
      "createdAt": "2026-08-11T11:20:00.000Z",
      "updatedAt": "2026-08-11T11:20:00.000Z",
      "categories": [
        {
          "id": "64d2572b9a7c3c2f10b50301",
          "name": "Food & Nutrition",
          "icon": "apple-fruit-icon"
        }
      ],
      "items": [
        {
          "id": "64d2572b9a7c3c2f10b50351",
          "requestId": "64d2572b9a7c3c2f10b50341",
          "globalItemId": "64d2572b9a7c3c2f10b50311",
          "quantityNeeded": 50,
          "quantityReserved": 0,
          "quantityDelivered": 0,
          "unit": "kg",
          "notes": "Red apples preferred",
          "createdAt": "2026-08-11T11:20:00.000Z",
          "updatedAt": "2026-08-11T11:20:00.000Z",
          "globalItem": {
            "id": "64d2572b9a7c3c2f10b50311",
            "title": "Organic Apples",
            "defaultUnit": "kg"
          }
        }
      ],
      "shelter": {
        "id": "64d2572b9a7c3c2f10b50321",
        "name": "St. Mary's Shelter",
        "city": "Seattle",
        "state": "WA",
        "verificationStatus": "VERIFIED"
      }
    }
  ]
}
```

### C. Get Shelter Request by ID
* **Endpoint:** `GET /api/shelter-requests/:id` (e.g., `GET /api/shelter-requests/64d2572b9a7c3c2f10b50341`)
* **Expected Response (`200 OK`):**
*(Returns the same structure as Create or Get All for the matching ID)*

### D. Update Shelter Request by ID
* **Endpoint:** `PATCH /api/shelter-requests/:id` (e.g., `PATCH /api/shelter-requests/64d2572b9a7c3c2f10b50341`)
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "title": "Updated Winter Food Drive",
  "urgency": "CRITICAL",
  "status": "ACTIVE"
}
```
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50341",
    "shelterId": "64d2572b9a7c3c2f10b50321",
    "title": "Updated Winter Food Drive",
    "description": "Weekly food drive to request fresh fruits and resources.",
    "urgency": "CRITICAL",
    "status": "ACTIVE",
    "categoryIds": ["64d2572b9a7c3c2f10b50301"],
    "createdAt": "2026-08-11T11:20:00.000Z",
    "updatedAt": "2026-08-11T11:25:00.000Z",
    "categories": [...],
    "items": [...],
    "shelter": {...}
  }
}
```

### E. Delete Shelter Request by ID
* **Endpoint:** `DELETE /api/shelter-requests/:id` (e.g., `DELETE /api/shelter-requests/64d2572b9a7c3c2f10b50341`)
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50341",
    "title": "Updated Winter Food Drive"
  }
}
```
* **Important Note:** Deletion will fail with a `400 Bad Request` if any requested item inside this request has a reserved or delivered quantity (`quantityReserved > 0` or `quantityDelivered > 0`).

### F. Purge All Shelter Requests (Development/Testing Only)
* **Endpoint:** `DELETE /api/shelter-requests`
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "message": "All shelter requests have been purged"
}
```
