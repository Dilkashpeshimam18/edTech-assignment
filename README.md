# Mini EdTech Learning Platform

## Overview
Simple EdTech web app allowing users to browse courses and enroll, with role-based access (student vs professor). Built with Next.js (frontend), Apollo Server + Express + Prisma + PostgreSQL (backend).

## Features
- Browse all courses
- View course details
- Enroll in a course
- Role-based UI (student vs professor)
- Mock authentication (stores user in localStorage)
- GraphQL API

## Tech Stack
- Frontend: Next.js, TypeScript, Context API
- Backend: Express.js, Apollo Server, GraphQL
- Database: PostgreSQL via Prisma ORM
- Authentication: Mock login (no real passwords)

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL (or use Docker)

### Frontend Setup
```bash
cd client
npm install
npm run dev


### Backend Setup
```bash
cd server
# Set DATABASE_URL in .env (e.g., postgres://user:pass@localhost:5432/edtech?schema=public)
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed #To run seed file & add data in db
npm run dev
