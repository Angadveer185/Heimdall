# Postman Testing Guide for Category Endpoints

This document details how to test Category endpoints using Postman.

---

## Authorization Requirements
- Read endpoints (`GET`) do not require authentication.
- Write endpoints (`POST`, `PATCH`, `DELETE`) require a user with the **`SUPER_ADMIN`** role. 
- Ensure you have logged in via `POST /api/auth/login` to set the authentication cookie or include the access token before making write requests.

---

## 1. Category Routes

### A. Create Category
* **Endpoint:** `POST /api/categories`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "name": "Food & Nutrition",
  "icon": "apple-fruit-icon",
  "description": "Edible items, fresh produce, and non-perishable goods."
}
```
* **Expected Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50301",
    "name": "Food & Nutrition",
    "icon": "apple-fruit-icon",
    "description": "Edible items, fresh produce, and non-perishable goods.",
    "createdAt": "2026-08-11T11:00:00.000Z",
    "updatedAt": "2026-08-11T11:00:00.000Z"
  }
}
```

### B. Get All Categories
* **Endpoint:** `GET /api/categories`
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64d2572b9a7c3c2f10b50301",
      "name": "Food & Nutrition",
      "icon": "apple-fruit-icon",
      "description": "Edible items, fresh produce, and non-perishable goods.",
      "createdAt": "2026-08-11T11:00:00.000Z",
      "updatedAt": "2026-08-11T11:00:00.000Z"
    }
  ]
}
```

### C. Get Category by ID
* **Endpoint:** `GET /api/categories/:id` (e.g., `GET /api/categories/64d2572b9a7c3c2f10b50301`)
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50301",
    "name": "Food & Nutrition",
    "icon": "apple-fruit-icon",
    "description": "Edible items, fresh produce, and non-perishable goods.",
    "createdAt": "2026-08-11T11:00:00.000Z",
    "updatedAt": "2026-08-11T11:00:00.000Z"
  }
}
```

### D. Get Category by Name
* **Endpoint:** `GET /api/categories/name/:name` (e.g., `GET /api/categories/name/Food%20%26%20Nutrition`)
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50301",
    "name": "Food & Nutrition",
    "icon": "apple-fruit-icon",
    "description": "Edible items, fresh produce, and non-perishable goods.",
    "createdAt": "2026-08-11T11:00:00.000Z",
    "updatedAt": "2026-08-11T11:00:00.000Z"
  }
}
```

### E. Update Category
* **Endpoint:** `PATCH /api/categories/:id` (e.g., `PATCH /api/categories/64d2572b9a7c3c2f10b50301`)
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "description": "Fresh produce, canned goods, meals, and supplements."
}
```
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50301",
    "name": "Food & Nutrition",
    "icon": "apple-fruit-icon",
    "description": "Fresh produce, canned goods, meals, and supplements.",
    "createdAt": "2026-08-11T11:00:00.000Z",
    "updatedAt": "2026-08-11T11:05:00.000Z"
  }
}
```

### F. Delete Category
* **Endpoint:** `DELETE /api/categories/:id` (e.g., `DELETE /api/categories/64d2572b9a7c3c2f10b50301`)
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b50301",
    "name": "Food & Nutrition"
  }
}
```

### G. Purge All Categories (Development/Testing Only)
* **Endpoint:** `DELETE /api/categories`
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "message": "All categories have been purged"
}
```
