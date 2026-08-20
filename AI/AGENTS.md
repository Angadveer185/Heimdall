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
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

// ==========================================
// ENUMS
// ==========================================

enum Role {
  DONOR
  SHELTER_ADMIN
  SUPER_ADMIN
}

enum VerificationStatus {
  PENDING
  VERIFIED
  REJECTED
}

enum Urgency {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum RequestStatus {
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

enum OrganizationIdType {
  EIN
  NGO_DARPAN
  SECTION8_CIN
  SOCIETY_REGISTRATION
  TRUST_REGISTRATION
  CHARITY_NUMBER
  OTHER
}

// ==========================================
// CORE & USER MODELS
// ==========================================

model User {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  email            String   @unique
  passwordHash     String
  role             Role     @default(DONOR)
  phone            String?
  profileImageUrl  String?

  shelterId        String?  @db.ObjectId
  shelter          Shelter? @relation(fields: [shelterId], references: [id])

  refreshTokenHash String?
  isReported       Boolean  @default(false)

  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  pledges          Pledge[]
  pledgesCompleted Int      @default(0)
  pledgesExpired   Int      @default(0)

  @@index([role])
}

model Shelter {
  id                  String             @id @default(auto()) @map("_id") @db.ObjectId
  name                String
  country             String
  organizationIdType  OrganizationIdType
  organizationId      String             @unique

  verificationStatus  VerificationStatus @default(PENDING)
  rejectionReason     String?

  description         String?
  street              String
  city                String
  state               String
  zip                 String

  longitude           Float
  latitude            Float

  dropOffHours        String
  contactEmail        String
  phone               String?
  website             String?
  profileImageUrl     String?
  shelterImages       String[]

  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt

  admins              User[]
  requests            ShelterRequest[]
  pledges             Pledge[]

  @@index([verificationStatus])
  @@index([country])
}

// ==========================================
// GLOBAL CATALOG (Decoupled & Standardized)
// ==========================================

model Category {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   @unique
  icon        String
  description String?

  items       GlobalItem[]
  requests    ShelterRequest[] @relation(fields: [requestIds], references: [id])
  requestIds  String[]         @db.ObjectId

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model GlobalItem {
  id             String          @id @default(auto()) @map("_id") @db.ObjectId
  title          String          @unique
  description    String?
  defaultUnit    String          @default("units")

  categoryId     String?         @db.ObjectId
  category       Category?       @relation(fields: [categoryId], references: [id])

  requestedItems RequestedItem[]

  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  @@index([categoryId])
}

// ==========================================
// SHELTER REQUESTS & PLEDGES
// ==========================================

model ShelterRequest {
  id             String          @id @default(auto()) @map("_id") @db.ObjectId

  shelterId      String          @db.ObjectId
  shelter        Shelter         @relation(fields: [shelterId], references: [id])

  title          String
  description    String?
  urgency        Urgency         @default(MEDIUM)
  status         RequestStatus   @default(ACTIVE)

  categoryIds    String[]        @db.ObjectId
  categories     Category[]      @relation(fields: [categoryIds], references: [id])

  items          RequestedItem[]

  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  @@index([shelterId])
  @@index([status])
  @@index([urgency])
}

model RequestedItem {
  id                String         @id @default(auto()) @map("_id") @db.ObjectId

  requestId         String         @db.ObjectId
  request           ShelterRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)

  globalItemId      String         @db.ObjectId
  globalItem        GlobalItem     @relation(fields: [globalItemId], references: [id])

  quantityNeeded    Int
  quantityReserved  Int            @default(0)
  quantityDelivered Int            @default(0)
  unit              String         @default("units")

  notes             String?

  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  pledges           PledgedItem[]

  @@index([requestId])
  @@index([globalItemId])
}

model Pledge {
  id                   String        @id @default(auto()) @map("_id") @db.ObjectId
  pledgeCode           String        @unique

  donorId              String        @db.ObjectId
  donor                User          @relation(fields: [donorId], references: [id])

  shelterId            String        @db.ObjectId
  shelter              Shelter       @relation(fields: [shelterId], references: [id])

  items                PledgedItem[]
  scheduledDropOffDate DateTime
  status               PledgeStatus  @default(RESERVED)

  impactPhotoUrl       String?
  shelterThankYouNote  String?
  fulfilledAt          DateTime?
  expiresAt            DateTime

  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  @@index([status])
  @@index([expiresAt])
  @@index([donorId])
}

model PledgedItem {
  id              String        @id @default(auto()) @map("_id") @db.ObjectId
  pledgeId        String        @db.ObjectId
  pledge          Pledge        @relation(fields: [pledgeId], references: [id], onDelete: Cascade)
  requestedItemId String        @db.ObjectId
  requestedItem   RequestedItem @relation(fields: [requestedItemId], references: [id])
  quantityPledged Int
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```