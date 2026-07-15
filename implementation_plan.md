# Implementation Plan – AdhikarAI Full-Stack Migration (PERN)

This plan outlines the architecture, database schema, and migration roadmap to convert the current static AdhikarAI frontend into an enterprise-grade, secure, and scalable full-stack application using TypeScript, React, Node.js, Express, and PostgreSQL.

---

## Architectural Choices & Tech Stack

We will migrate the application to a modern **PERN** (PostgreSQL, Express, React, Node) stack with **TypeScript** on both frontend and backend.

### Recommended Database: PostgreSQL + Prisma ORM
We choose **PostgreSQL** with **Prisma ORM** over MongoDB for the following reasons:
1. **Relational Integrity**: Legal notice drafts, user profiles, uploaded document metadata, lawyer verification processes, and audit trails are highly relational.
2. **Prisma Type Safety**: Prisma generates TypeScript types directly from the schema, ensuring compilation-level type checking between the database and the backend controller/services.
3. **pgvector for local RAG**: Rather than paying for and maintaining a separate Vector Database (like Pinecone/Chroma), PostgreSQL supports `pgvector`. This lets us store and query embeddings of uploaded legal documents directly in the main database, simplifying architecture and reducing cost.
4. **Audit Logs & Strict Security**: Relational databases are optimized for transactional logs and structured security rules which are critical for legal applications.

---

## Technical Specifications

### Authentication & Authorization (RBAC)
* **JWT Access & Refresh Tokens**: Access token (15 mins, memory/header), Refresh token (7 days, secure, HttpOnly, SameSite=Strict cookie).
* **Email OTP Verification**: OTP sent via NodeMailer/SMTP on signup; verified before login activation.
* **Google OAuth**: Integrates Google Sign-In using Firebase Auth compatibility or directly via OAuth2 client libraries.
* **Role-Based Access Control (RBAC)**: Roles defined as `USER`, `LAWYER`, and `ADMIN`. Handled via a robust middleware guard `authorizeRoles(...roles)`.

### Database Schema (Prisma PostgreSQL)

```prisma
enum Role {
  USER
  LAWYER
  ADMIN
}

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  passwordHash  String?
  name          String
  role          Role           @default(USER)
  isVerified    Boolean        @default(false)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  profileImage  String?
  
  lawyerProfile LawyerProfile?
  evidence      Evidence[]
  chatSessions  ChatSession[]
  savedNotices  SavedNotice[]
  auditLogs     AuditLog[]
}

model LawyerProfile {
  id             String   @id @default(uuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  barNumber      String   @unique
  specialization String
  experienceYrs  Int
  isVerified     Boolean  @default(false)
}

model Evidence {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  fileName    String
  mimeType    String
  fileSize    Int
  storageUrl  String
  storagePath String
  category    String
  createdAt   DateTime @default(now())
  
  embeddings  DocumentEmbedding[]
}

model DocumentEmbedding {
  id          String   @id @default(uuid())
  evidenceId  String
  evidence    Evidence @relation(fields: [evidenceId], references: [id], onDelete: Cascade)
  chunkText   String
  embedding   Unsupported("vector(768)") // pgvector embedding field
}

model ChatSession {
  id        String    @id @default(uuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String
  createdAt DateTime  @default(now())
  messages  Message[]
}

model Message {
  id            String      @id @default(uuid())
  sessionId     String
  session       ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  sender        String      // "user" or "ai"
  text          String
  createdAt     DateTime    @default(now())
}

model SavedNotice {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  subject   String
  sName     String
  sAddr     String
  sCity     String
  sState    String
  rName     String
  rAddr     String
  rCity     String
  rState    String
  details   String
  docHtml   String
  createdAt DateTime @default(now())
}

model AuditLog {
  id        String   @id @default(uuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  action    String
  ipAddress String
  createdAt DateTime @default(now())
}
```

### Modular AI Service (Google Gemini integration)
We will build a modular `AIService` class using `@google/generative-ai` with separate helper methods:
1. **`chatAssistant(history, prompt)`**: Maintains conversation context, returns answers in regional languages with relevant Indian legal article citations.
2. **`noticeGenerator(subject, sender, recipient, details)`**: Prepares standard structured legal notices formatted in raw HTML.
3. **`documentSummarizer(text)`**: Distills long cases or legal texts into simple plain summaries.
4. **`translationService(text, targetLang)`**: Standardizes prompt-based translations.
5. **`ocrReader(imageBuffer)`**: Extract text from documents/images using optical character recognition.

---

## Frontend Architecture (No Changes to UI/UX)

As requested, **the UI/UX will look and feel exactly identical** to the current layout. We will preserve:
* The warm-gray (#F5F5F5) background, dark maroon colors, trust-card styles, typography, and navbar scroll transitions.
* The form layouts, modal transitions, and dashboard look.
* We will build this in React using:
  * **Vite + React Router** for routing.
  * **Tailwind CSS** configured with your specific color variables (e.g. `maroon: #8B1A1A`).
  * **React Query** for fetching, loading-indicators, page caching, and error state handling.
  * **Context / Zustand** for session tokens and offline storage sync.

---

## Directory Structure

### Backend (`/backend`)
```
src/
├── config         # Env, DB configurations, Cloudinary initialization
├── controllers    # Auth, User, Evidence, Notice, AI controller methods
├── middleware     # authGuard, roleGuard, rateLimiter, errorHandler, multer
├── routes         # authRoutes, userRoutes, evidenceRoutes, aiRoutes
├── services       # AIService, EmailService, StorageService
├── repositories   # Prisma query repository layer
├── models         # Prisma schema and interfaces
├── validations    # Zod schemas for user requests
├── utils          # customErrors, logger, jwtGenerator
├── database       # prismaClient setup
├── types          # Custom request and typescript typings
└── app.ts         # Server bootstrapper
```

### Frontend (`/frontend`)
```
src/
├── components     # Reusable buttons, forms, modals, file-cards
├── pages          # Index, Login, Signup, Dashboard, AskAI, EvidenceVault, DraftNotices
├── layouts        # Navbar, Sidebar, Page wrappers
├── hooks          # useAuth, useUpload, useSavedDrafts
├── services       # API requests wrapper (axios)
├── context        # AuthSessionContext
├── routes         # AppRoutes (Public vs Protected Guards)
├── lib            # Shadcn/tailwind helpers
├── utils          # formatSize, formatDate, getFileCategory
└── assets         # CSS variables, custom icons
```

---

## Verification Plan

### Automated Tests
1. Unit tests for AI Service responses using Jest/Supertest.
2. Request validation tests (Zod checks for signup and legal notice inputs).
3. JWT Authentication guard tests (valid vs expired tokens).

### Manual Verification
1. Verify user profile sync on login and session expiry redirection.
2. Test file upload flow: drag-dropping a PDF, verifying it saves to LocalStorage/Cloudinary, and displays in the vault grid.
3. Verify that changing states correctly populates Indian cities in the Notice Drafter.
4. Validate PDF export output matches exactly the styling of the old tool.
