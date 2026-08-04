# Heimdall

> Bridging donors and shelters through transparent, item-based donations.

Heimdall is a full-stack web application that connects community donors with verified non-profit shelters through an itemized wishlist system. Instead of anonymous cash donations or unwanted goods, donors can reserve exactly what a shelter needs and receive proof that their donation was delivered.

The project is built with a modern TypeScript stack and emphasizes security, scalability, accessibility, and real-world logistics.

---

## ✨ Features

### 👥 User Management
- Create, read, update, and delete users
- Role-based architecture
- Input validation using Zod
- Standardized API responses
- MongoDB + Prisma integration

### 🏠 Shelter Management *(Planned)*
- Register shelters
- EIN / 501(c)(3) verification
- Geo-location support
- Shelter administrator portal

### 📦 Wishlist Items *(Planned)*
- Create and manage item requests
- Categories
- Urgency levels
- Quantity tracking

### 🤝 Donation Pledges *(Planned)*
- Reserve requested items
- Atomic inventory updates
- QR code drop-off tickets
- Delivery confirmation
- Proof-of-impact photos

### 🛡 Authentication *(Planned)*
- JWT Authentication
- HTTP-only Cookies
- Refresh Token Rotation
- Role-based Authorization

### 📊 Admin Dashboard *(Planned)*
- Shelter verification
- User moderation
- Analytics
- Category management

---

# Tech Stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Lucide Icons

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- MongoDB
- Zod

## Future Integrations

- Cloudinary / AWS S3
- QR Code Generation
- ProPublica Nonprofit Explorer API

---

# Project Structure

```
src/
│
├── app/                # Next.js App Router
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── validators/
│   ├── utils/
│   └── api/
│
├── lib/
├── types/
└── prisma/
```

---

# Getting Started

## Prerequisites

- Node.js 22+
- npm
- MongoDB Atlas (or local MongoDB)

---

## Installation

Clone the repository

```bash
git clone https://github.com/<your-username>/heimdall.git
```

Enter the project

```bash
cd heimdall
```

Install dependencies

```bash
npm install
```

Create an environment file

```bash
cp .env.example .env
```

Configure your environment variables.

Example:

```env
DATABASE_URL="mongodb+srv://..."
JWT_SECRET="your-secret"
PORT=3000
```

Generate Prisma Client

```bash
npx prisma generate
```

Push schema to MongoDB

```bash
npx prisma db push
```

Run the development server

```bash
npm run dev
```

---

# API

Current implemented endpoints:

## Users

### Create User

```
POST /api/users
```

### Get User

```
GET /api/users/:id
```

### Update User

```
PATCH /api/users/:id
```

### Delete User

```
DELETE /api/users/:id
```

---

# Example Response

```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "DONOR"
  }
}
```

---

# Validation

The API uses **Zod** for request validation.

Examples:

- Empty names rejected
- Invalid email addresses rejected
- Invalid ObjectIds rejected
- Duplicate emails prevented
- Required fields enforced

---

# Development Roadmap

## ✅ Completed

- Project setup
- Express server
- Prisma + MongoDB
- User CRUD API
- Validation middleware
- Error handling
- Consistent API responses

---

## 🚧 In Progress

- Category CRUD
- Shelter CRUD
- Wishlist Items
- Route organization under `src/server`

---

## 📌 Planned

- Authentication
- Role middleware
- QR pledge system
- Atomic reservation transactions
- Admin dashboard
- Shelter verification
- Image uploads
- Analytics

---

# Design Philosophy

Heimdall is designed around three core principles:

- **Trust** through transparent donations
- **Accessibility** with WCAG-focused dark/light themes
- **Reliability** through transactional inventory management

The interface uses:

- Adaptive Dark/Light mode
- Tailwind Slate color palette
- Sky Blue branding
- Amber "Bifrost" accents
- Smooth transitions
- Mobile-first responsive layouts

---

# License

This project is licensed under the MIT License.

---

# Acknowledgements

Inspired by the need for greater transparency in charitable giving, Heimdall aims to eliminate donation waste and ensure that every contribution reaches people who need it most.