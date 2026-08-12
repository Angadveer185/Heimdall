# Postman Testing Guide for GlobalItem Endpoints

This document details how to test GlobalItem (catalog catalog items) endpoints using Postman.

---

## Authorization Requirements
- Read endpoints (`GET`) do not require authentication.
- Write endpoints (`POST`, `PATCH`, `DELETE`) require a user with the **`SUPER_ADMIN`** role.
- Ensure you have logged in via `POST /api/auth/login` to set the authentication cookie or include the access token before making write requests.

---

## 1. GlobalItem Routes

### A. Create Global Item
* **Endpoint:** `POST /api/global-items`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "title": "Fresh Apples",
  "description": "Red or green fresh orchard apples",
  "defaultUnit": "kg",
  "categoryId": "64d2572b9a7c3c2f10b50301"
}
```
* **Expected Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50311",
    "title": "Fresh Apples",
    "description": "Red or green fresh orchard apples",
    "defaultUnit": "kg",
    "categoryId": "64d2572b9a7c3c2f10b50301",
    "createdAt": "2026-08-11T11:10:00.000Z",
    "updatedAt": "2026-08-11T11:10:00.000Z"
  }
}
```

### B. Get All Global Items
* **Endpoint:** `GET /api/global-items`
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64d2572b9a7c3c2f10b50311",
      "title": "Fresh Apples",
      "description": "Red or green fresh orchard apples",
      "defaultUnit": "kg",
      "categoryId": "64d2572b9a7c3c2f10b50301",
      "createdAt": "2026-08-11T11:10:00.000Z",
      "updatedAt": "2026-08-11T11:10:00.000Z"
    }
  ]
}
```

### C. Get Global Item by ID
* **Endpoint:** `GET /api/global-items/:id` (e.g., `GET /api/global-items/64d2572b9a7c3c2f10b50311`)
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50311",
    "title": "Fresh Apples",
    "description": "Red or green fresh orchard apples",
    "defaultUnit": "kg",
    "categoryId": "64d2572b9a7c3c2f10b50301",
    "createdAt": "2026-08-11T11:10:00.000Z",
    "updatedAt": "2026-08-11T11:10:00.000Z"
  }
}
```

### D. Update Global Item by ID
* **Endpoint:** `PATCH /api/global-items/:id` (e.g., `PATCH /api/global-items/64d2572b9a7c3c2f10b50311`)
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "title": "Organic Apples",
  "description": "Fresh organic apples from local farms"
}
```
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50311",
    "title": "Organic Apples",
    "description": "Fresh organic apples from local farms",
    "defaultUnit": "kg",
    "categoryId": "64d2572b9a7c3c2f10b50301",
    "createdAt": "2026-08-11T11:10:00.000Z",
    "updatedAt": "2026-08-11T11:15:00.000Z"
  }
}
```

### E. Delete Global Item by ID
* **Endpoint:** `DELETE /api/global-items/:id` (e.g., `DELETE /api/global-items/64d2572b9a7c3c2f10b50311`)
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50311",
    "title": "Organic Apples"
  }
}
```

### F. Purge All Global Items (Development/Testing Only)
* **Endpoint:** `DELETE /api/global-items`
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "message": "All items have been purged"
}
```
