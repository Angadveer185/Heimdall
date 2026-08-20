# Postman Testing Guide for RequestedItem Endpoints

This document details how to test RequestedItem endpoints using Postman. These endpoints allow managing individual item entries within shelter requests.

---

## Authorization Requirements
- Read endpoints (`GET`) do not require authentication.
- Write endpoints (`POST`, `PATCH`, `DELETE`) require a user with **`SHELTER_ADMIN`** or **`SUPER_ADMIN`** role.
- Purge endpoint (`DELETE /api/requested-items`) requires the **`SUPER_ADMIN`** role.
- Ensure you have logged in via `POST /api/auth/login` to set the authentication cookie or include the access token before making write requests.

---

## 1. RequestedItem Routes

### A. Create Requested Item
* **Endpoint:** `POST /api/requested-items`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "requestId": "64d2572b9a7c3c2f10b50341",
  "globalItemId": "64d2572b9a7c3c2f10b50311",
  "quantityNeeded": 25,
  "unit": "kg",
  "notes": "Prefer organic red apples"
}
```
* **Expected Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50351",
    "requestId": "64d2572b9a7c3c2f10b50341",
    "globalItemId": "64d2572b9a7c3c2f10b50311",
    "quantityNeeded": 25,
    "quantityReserved": 0,
    "quantityDelivered": 0,
    "unit": "kg",
    "notes": "Prefer organic red apples",
    "createdAt": "2026-08-11T11:30:00.000Z",
    "updatedAt": "2026-08-11T11:30:00.000Z"
  }
}
```

### B. Get All Requested Items
* **Endpoint:** `GET /api/requested-items`
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64d2572b9a7c3c2f10b50351",
      "requestId": "64d2572b9a7c3c2f10b50341",
      "globalItemId": "64d2572b9a7c3c2f10b50311",
      "quantityNeeded": 25,
      "quantityReserved": 0,
      "quantityDelivered": 0,
      "unit": "kg",
      "notes": "Prefer organic red apples",
      "createdAt": "2026-08-11T11:30:00.000Z",
      "updatedAt": "2026-08-11T11:30:00.000Z"
    }
  ]
}
```

### C. Get Requested Item by ID
* **Endpoint:** `GET /api/requested-items/:id` (e.g., `GET /api/requested-items/64d2572b9a7c3c2f10b50351`)
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50351",
    "requestId": "64d2572b9a7c3c2f10b50341",
    "globalItemId": "64d2572b9a7c3c2f10b50311",
    "quantityNeeded": 25,
    "quantityReserved": 0,
    "quantityDelivered": 0,
    "unit": "kg",
    "notes": "Prefer organic red apples",
    "createdAt": "2026-08-11T11:30:00.000Z",
    "updatedAt": "2026-08-11T11:30:00.000Z"
  }
}
```

### D. Update Requested Item by ID
* **Endpoint:** `PATCH /api/requested-items/:id` (e.g., `PATCH /api/requested-items/64d2572b9a7c3c2f10b50351`)
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "quantityNeeded": 35,
  "notes": "Urgent update: need 10 extra kgs"
}
```
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50351",
    "requestId": "64d2572b9a7c3c2f10b50341",
    "globalItemId": "64d2572b9a7c3c2f10b50311",
    "quantityNeeded": 35,
    "quantityReserved": 0,
    "quantityDelivered": 0,
    "unit": "kg",
    "notes": "Urgent update: need 10 extra kgs",
    "createdAt": "2026-08-11T11:30:00.000Z",
    "updatedAt": "2026-08-11T11:35:00.000Z"
  }
}
```
* **Important Constraint:** If `quantityNeeded` is updated, the new value **cannot** be less than either `quantityReserved` or `quantityDelivered` values on the item. Doing so returns a `400 Bad Request` to preserve inventory integrity.

### E. Delete Requested Item by ID
* **Endpoint:** `DELETE /api/requested-items/:id` (e.g., `DELETE /api/requested-items/64d2572b9a7c3c2f10b50351`)
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50351",
    "requestId": "64d2572b9a7c3c2f10b50341",
    "globalItemId": "64d2572b9a7c3c2f10b50311"
  }
}
```
* **Important Constraint:** Deletion will fail with `400 Bad Request` if `quantityReserved > 0` or `quantityDelivered > 0` to prevent orphaned/broken pledges.

### F. Purge All Requested Items (Development/Testing Only)
* **Endpoint:** `DELETE /api/requested-items`
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "message": "All requested items have been purged"
}
```
