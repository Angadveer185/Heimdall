# Postman Testing Guide for PledgedItem Endpoints

This document details how to test PledgedItem endpoints using Postman. These endpoints manage individual items pledged under reservation-stage donations, ensuring three-stage inventory pipeline and authorization rules are met.

---

## Authorization Requirements
- Read endpoints (`GET`) require a user with **`DONOR`** role (inherits to `SHELTER_ADMIN` and `SUPER_ADMIN`).
  - Access is restricted: Donors can only view items in their own pledges, and Shelter Admins can only view items in pledges destined for their shelter.
- Write endpoints (`POST`, `PATCH`, `DELETE`) require a user with **`DONOR`** role.
  - Donors can only modify items in their own pledges.
  - Shelter Admins can modify items in pledges destined for their shelter.
  - Super Admins have full access.
- Purge and Get All endpoints require the **`SUPER_ADMIN`** role.
- Ensure you have logged in via `POST /api/auth/login` to set the authentication cookie before making requests.

---

## 1. PledgedItem Routes

### A. Create Pledged Item
* **Endpoint:** `POST /api/pledged-items`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "pledgeId": "64d2572b9a7c3c2f10b50371",
  "requestedItemId": "64d2572b9a7c3c2f10b50351",
  "quantityPledged": 5
}
```
* **Expected Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50381",
    "pledgeId": "64d2572b9a7c3c2f10b50371",
    "requestedItemId": "64d2572b9a7c3c2f10b50351",
    "quantityPledged": 5,
    "createdAt": "2026-08-12T11:00:00.000Z",
    "updatedAt": "2026-08-12T11:00:00.000Z"
  }
}
```
* **Inventory Update:** This automatically increments `quantityReserved` on the associated `RequestedItem` by 5.

### B. Get All Pledged Items
* **Endpoint:** `GET /api/pledged-items`
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64d2572b9a7c3c2f10b50381",
      "pledgeId": "64d2572b9a7c3c2f10b50371",
      "requestedItemId": "64d2572b9a7c3c2f10b50351",
      "quantityPledged": 5,
      "createdAt": "2026-08-12T11:00:00.000Z",
      "updatedAt": "2026-08-12T11:00:00.000Z"
    }
  ]
}
```

### C. Get Pledged Item by ID
* **Endpoint:** `GET /api/pledged-items/:id` (e.g., `GET /api/pledged-items/64d2572b9a7c3c2f10b50381`)
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50381",
    "pledgeId": "64d2572b9a7c3c2f10b50371",
    "requestedItemId": "64d2572b9a7c3c2f10b50351",
    "quantityPledged": 5,
    "createdAt": "2026-08-12T11:00:00.000Z",
    "updatedAt": "2026-08-12T11:00:00.000Z"
  }
}
```

### D. Update Pledged Item by ID
* **Endpoint:** `PATCH /api/pledged-items/:id` (e.g., `PATCH /api/pledged-items/64d2572b9a7c3c2f10b50381`)
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "quantityPledged": 8
}
```
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50381",
    "pledgeId": "64d2572b9a7c3c2f10b50371",
    "requestedItemId": "64d2572b9a7c3c2f10b50351",
    "quantityPledged": 8,
    "createdAt": "2026-08-12T11:00:00.000Z",
    "updatedAt": "2026-08-12T11:05:00.000Z"
  }
}
```
* **Inventory Update:** Adjusts `quantityReserved` on the associated `RequestedItem` by the difference (`+3`). If requested quantity exceeds the remaining available slots, it returns a `400 Bad Request`.

### E. Delete Pledged Item by ID
* **Endpoint:** `DELETE /api/pledged-items/:id` (e.g., `DELETE /api/pledged-items/64d2572b9a7c3c2f10b50381`)
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50381",
    "pledgeId": "64d2572b9a7c3c2f10b50371",
    "requestedItemId": "64d2572b9a7c3c2f10b50351",
    "quantityPledged": 8
  }
}
```
* **Inventory Update:** Automatically decrements `quantityReserved` on the associated `RequestedItem` by `8`.

### F. Purge All Pledged Items (Development/Testing Only)
* **Endpoint:** `DELETE /api/pledged-items`
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "message": "All pledged items have been purged"
}
```
