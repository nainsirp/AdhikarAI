# ⚖️ AdhikarAI

<div align="center">

### AI-Powered Legal Assistance Platform

Empowering citizens with accessible, multilingual, and intelligent legal support through AI.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google-Gemini-blue?style=for-the-badge)

</div>

---

## 📖 Overview

Legal information is often difficult to understand, scattered across multiple sources, and inaccessible to people without legal expertise.

**AdhikarAI** is an AI-powered legal assistance platform that simplifies legal guidance by combining **Large Language Models, Retrieval-Augmented Generation (RAG), OCR, multilingual support, and secure document management** into a single application.

The platform enables users to understand their legal rights, draft legal notices, analyze legal documents, and discover nearby legal resources through a modern, intuitive interface.

---

# ✨ Key Features

## 🤖 AI Legal Assistant

- Context-aware legal guidance powered by Google Gemini
- Multilingual conversations
- Simplified explanations of legal terminology
- Conversation history
- Follow-up question support

---

## 📝 AI Legal Notice Generator

Generate professionally structured legal notices for scenarios such as:

- Consumer complaints
- Workplace harassment
- Property disputes
- Domestic violence
- Cybercrime
- Contract breaches
- Defamation
- Right to Information (RTI)

Users can edit, preview, and export notices as PDF.

---

## 📄 Intelligent Document Analysis

Upload legal documents to:

- Extract text using OCR
- Generate summaries
- Highlight important clauses
- Translate documents
- Explain legal language in plain English

---

## 🔍 AI-Powered Legal Search


Instead of keyword matching, AdhikarAI understands the meaning behind user queries to retrieve more relevant legal information.

---

## 📍 Nearby Legal Services

Locate nearby:

- Police Stations
- Courts
- Legal Aid Centres
- Lawyers

Integrated with Google Maps.

---

## 🔐 Secure Authentication

Supports

- Email Authentication
- Google OAuth
- JWT Authentication
- Refresh Tokens
- Role-Based Access Control (RBAC)

---

## ☁️ Secure Document Storage

- User-specific document management
- Cloud storage integration
- Secure uploads
- PDF download support

---
# 🏗 System Architecture

```
                                                React + TypeScript
                                                       │
                                                       │ REST API
                                                       ▼
                                               Express.js + Node.js
                                                       │
                                       ┌───────────────┼───────────────┐
                                       │               │               │
                                       ▼               ▼               ▼
                                  PostgreSQL        Google Gemini      File Storage
                                                       │
                                                       ▼
                                                   Prisma ORM
                                                       │
                                                       ▼
                                                    pgvector
                                             (Vector Search / RAG)
```

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form

---

## Backend

- Node.js
- Express.js
- TypeScript

---

## Database

- PostgreSQL
- Prisma ORM
- pgvector

---

## Authentication

- JWT
- Google OAuth
- Email OTP Verification
- RBAC

---

## AI

- Google Gemini API
- OCR
- Prompt Engineering
- Document Summarization
- Translation
- Retrieval-Augmented Generation (RAG)

---

## Developer Tools

- Git
- GitHub
- REST APIs
- Zod
- ESLint
- Prettier

---

# 📂 Folder Structure

```
AdhikarAI

client/
│
├── src
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── services
│   ├── utils
│   └── assets
│
server/
│
├── src
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── services
│   ├── prisma
│   ├── utils
│   └── config
│
shared/

docs/

README.md
```

---

# 🚀 Getting Started

## Clone

```bash
git clone https://github.com/nainsirp/AdhikarAI.git

cd AdhikarAI
```

---

## Install

```bash
npm install
```

---

## Configure Environment Variables

```env
DATABASE_URL=

JWT_SECRET=

JWT_REFRESH_SECRET=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GEMINI_API_KEY=

SMTP_USER=

SMTP_PASS=

CLOUD_STORAGE_KEY=
```

---

## Start Development

```bash
npm run dev
```

---

# 🔄 Workflow

```
User

↓

Authentication

↓

AI Assistant / Document Upload

↓

Backend Validation

↓

Gemini API

↓

Vector Retrieval (pgvector)

↓

Response Generation

↓

Save Conversation

↓

Return Response
```

---

# 🔒 Security

AdhikarAI follows several security best practices.

- JWT Access & Refresh Tokens
- Password Hashing
- Input Validation using Zod
- SQL Injection Prevention via Prisma
- Role-Based Authorization
- Environment Variable Protection
- API Rate Limiting
- CORS Protection

---

# 📊 Future Roadmap

- Voice-based legal consultation
- Case timeline generation
- Court judgement summarization
- AI-powered legal research
- Lawyer appointment booking
- Mobile application
- Offline mode
- Regional language expansion

---

# 🤝 Contributing

Contributions are welcome.

```bash
Fork the repository

Create a feature branch

Commit your changes

Open a Pull Request
```

---

# ⚠️ Disclaimer

AdhikarAI is intended to improve legal awareness and accessibility.

The information generated by the platform should not be considered a substitute for professional legal advice. Users are encouraged to consult qualified legal practitioners for case-specific guidance.

---

# 👩‍💻 Author

**Nainsi Raja Parmar**

GitHub: https://github.com/nainsirp

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
