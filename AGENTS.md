# 🛡️ Project Heimdall

> **Repository Context & System Prompt Directive**  
> This file establishes the strict technical boundaries, coding standards, architectural rules, and domain models for **Project Heimdall**. All AI agents working on this repository must strictly adhere to these guidelines.

---

## 📌 Project Overview & Domain Rules

**Project Heimdall** is an operational micro-logistics and donation transparency platform that connects local non-profit shelters with community donors[cite: 1, 3, 4].

### Core Principles
1. **Three-Stage Inventory Pipeline:** Never decrement `quantityNeeded` directly when a donation is pledged[cite: 3, 4]. Inventory moves through three states:
   * $\text{Available to Pledge} = \text{quantityNeeded} - \text{quantityReserved}$[cite: 3, 4]
   * `PLEDGED` $\rightarrow$ Increments `quantityReserved`[cite: 3, 4].
   * `DELIVERED` $\rightarrow$ Increments `quantityDelivered` and decrements `quantityReserved` upon QR code scan[cite: 3, 4].
2. **Race Condition Prevention:** All pledge reservations **must** be executed inside a Prisma `$transaction` block using atomic conditions to ensure `quantityReserved` never exceeds available capacity.
3. **Security First:** Never store access/refresh tokens in `localStorage` or client state[cite: 2, 3, 4]. Auth tokens must be transmitted strictly via `httpOnly`, `Secure`, `SameSite=Strict` cookies[cite: 2, 3, 4].
4. **Role-Based Access Control (RBAC):**
   * Public: Browse map/shelters, view active items[cite: 4].
   * `DONOR`: Pledge items, view personal active QR drop-off tickets[cite: 4].
   * `SHELTER_ADMIN`: Manage wishlist items, scan QR code drop-off receipts, attach proof photos[cite: 4].
   * `SUPER_ADMIN`: Approve/reject 501(c)(3) EIN verification queues, suspend reported accounts, manage categories[cite: 3, 4].

---

## 🛠️ Tech Stack & Dependencies

* **Frontend:** Next.js, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion[cite: 1, 3, 6, 7]
* **Backend API:** Express.js (Routing), TypeScript, Zod, `cookie-parser`, JSON Web Tokens (JWT)[cite: 1, 3, 7]
* **Database & ORM:** MongoDB Atlas, Prisma ORM (`@prisma/client`)[cite: 1, 3, 7]
* **External Services:** ProPublica Nonprofit Explorer API (EIN validation), Cloudinary/S3 (photo proof)[cite: 1, 3, 4]

---

## 🗄️ Database Schemas (Prisma Reference)

When generating queries or data mutations, align with this canonical Prisma schema structure:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  DONOR
  SHELTER_ADMIN
  SUPER_ADMIN
}

enum VerificationStatus {
  PENDING
  VERIFIED_501C3
  REJECTED
}

enum Urgency {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum ItemStatus {
  ACTIVE
  FULFILLED
  ARCHIVED
}

enum PledgeStatus {
  RESERVED
  DELIVERED
  VERIFIED_FULFILLED
  CANCELLED
  EXPIRED
}

model User {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  email            String   @unique
  passwordHash     String
  role             Role     @default(DONOR)
  phone            String?
  shelterId        String?  @db.ObjectId
  shelter          Shelter? @relation(fields: [shelterId], references: [id])
  refreshTokenHash String?
  isReported       Boolean  @default(false)
  createdAt        DateTime @default(now())
  pledges          Pledge[]
}

model Shelter {
  id                 String             @id @default(auto()) @map("_id") @db.ObjectId
  name               String
  ein                String             @unique
  verificationStatus VerificationStatus @default(PENDING)
  rejectionReason    String?
  description        String?
  street             String
  city               String
  state              String
  zip                String
  coordinates        Float[]            // [longitude, latitude]
  dropOffHours       String
  contactEmail       String
  phone              String?
  createdAt          DateTime           @default(now())
  admins             User[]
  items              Item[]
  pledges            Pledge[]
}

model Category {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   @unique
  icon        String
  description String?
  items       Item[]
}

model Item {
  id                String     @id @default(auto()) @map("_id") @db.ObjectId
  shelterId         String     @db.ObjectId
  shelter           Shelter    @relation(fields: [shelterId], references: [id])
  categoryId        String     @db.ObjectId
  category          Category   @relation(fields: [categoryId], references: [id])
  title             String
  quantityNeeded    Int
  quantityReserved  Int        @default(0)
  quantityDelivered Int        @default(0)
  unit              String     @default("units")
  urgency           Urgency    @default(MEDIUM)
  status            ItemStatus @default(ACTIVE)
  notes             String?
  createdAt         DateTime   @default(now())
  pledges           Pledge[]
}

model Pledge {
  id                   String       @id @default(auto()) @map("_id") @db.ObjectId
  pledgeCode           String       @unique
  itemId               String       @db.ObjectId
  item                 Item         @relation(fields: [itemId], references: [id])
  shelterId            String       @db.ObjectId
  shelter              Shelter      @relation(fields: [shelterId], references: [id])
  donorId              String       @db.ObjectId
  donor                User         @relation(fields: [donorId], references: [id])
  quantityPledged      Int
  scheduledDropOffDate DateTime
  status               PledgeStatus @default(RESERVED)
  impactPhotoUrl       String?
  shelterThankYouNote  String?
  fulfilledAt          DateTime?
  expiresAt            DateTime
  createdAt            DateTime     @default(now())
}