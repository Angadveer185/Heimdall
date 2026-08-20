# Postman Testing Guide for User & Auth Endpoints

This document details how to test User and Authentication endpoints using Postman.

---

## 1. Authentication Endpoints

These endpoints manage registration, login, token refresh, and logout.

### A. Register User
* **Endpoint:** `POST /api/auth/register`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "Password123!",
  "phone": "+1234567890"
}
```
* **Expected Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64d2572b9a7c3c2f10b503b1",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "role": "DONOR",
      "phone": "+1234567890"
    },
    "accessToken": "eyJhbGciOi..."
  }
}
```

### B. Login User
* **Endpoint:** `POST /api/auth/login`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "email": "jane.doe@example.com",
  "password": "Password123!"
}
```
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64d2572b9a7c3c2f10b503b1",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "role": "DONOR"
    },
    "accessToken": "eyJhbGciOi..."
  }
}
```

### C. Refresh Access Token
* **Endpoint:** `POST /api/auth/refresh`
* **Description:** Refreshes the session using the HTTP-only refresh token cookie.
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "accessToken": "new_eyJhbGciOi..."
}
```

### D. Logout User
* **Endpoint:** `POST /api/auth/logout`
* **Headers:** `Authorization: Bearer <access_token>`
* **Description:** Clears the cookie and invalidates the session.
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. User CRUD Endpoints

These endpoints manage user records.

### A. Get All Users
* **Endpoint:** `GET /api/users`
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64d2572b9a7c3c2f10b503b1",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "role": "DONOR",
      "phone": "+1234567890",
      "createdAt": "2026-08-10T11:00:00.000Z",
      "updatedAt": "2026-08-10T11:00:00.000Z"
    }
  ]
}
```

### B. Get User by ID
* **Endpoint:** `GET /api/users/:id` (e.g., `GET /api/users/64d2572b9a7c3c2f10b503b1`)
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b503b1",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "DONOR",
    "phone": "+1234567890"
  }
}
```

### C. Update User by ID
* **Endpoint:** `PATCH /api/users/:id` (e.g., `PATCH /api/users/64d2572b9a7c3c2f10b503b1`)
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "name": "Jane Smith",
  "phone": "+1987654321"
}
```
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64d2572b9a7c3c2f10b503b1",
    "name": "Jane Smith",
    "email": "jane.doe@example.com",
    "role": "DONOR",
    "phone": "+1987654321"
  }
}
```

### D. Delete User by ID
* **Endpoint:** `DELETE /api/users/:id` (e.g., `DELETE /api/users/64d2572b9a7c3c2f10b503b1`)
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### E. Purge All Users (Development/Testing Only)
* **Endpoint:** `DELETE /api/users`
* **Expected Response (`200 OK`):**
```json
{
  "success": true,
  "message": "All users purged successfully"
}
```
