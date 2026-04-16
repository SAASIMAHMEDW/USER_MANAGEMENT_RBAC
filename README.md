# Purple Merit User Management System

A production-grade full-stack User Management System built with the MERN stack for Purple Merit Technologies.

## Live Demo

- **Frontend URL**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- MongoDB via Mongoose (Atlas)
- JWT (access + refresh tokens)
- bcryptjs for password hashing
- express-validator for validation
- helmet for security headers
- express-rate-limit for rate limiting

### Frontend
- React 18 + TypeScript
- Vite
- React Router v6
- React Context + useReducer
- Axios with interceptors
- TailwindCSS
- React Hot Toast
- React Hook Form + Zod

## Features

- **Authentication**: JWT-based auth with access/refresh tokens
- **Role-Based Access Control (RBAC)**: Admin, Manager, User roles
- **User Management**: CRUD operations with soft delete
- **Audit Trails**: Track user creation and updates
- **Profile Management**: Users can update their own profiles
- **Dashboard**: Role-based dashboard views

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## Environment Setup

### Server

```bash
cd server
cp .env.example .env
```

Update `.env` with your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/usermgmt
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_ORIGIN=http://localhost:5173
```

### Client

```bash
cd client
cp .env.example .env
```

Update `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation

### Server

```bash
cd server
npm install
```

### Client

```bash
cd client
npm install
```

## Running Locally

### First Time Setup

Seed the database with initial users:

```bash
cd server
npm run seed
```

### Start the Server

```bash
cd server
npm run dev
```

### Start the Client

```bash
cd client
npm run dev
```

## Seeded Credentials

| Role    | Email                      | Password    |
|---------|----------------------------|-------------|
| Admin   | admin@purplemerit.com      | Admin@123   |
| Manager | manager@purplemerit.com    | Manager@123 |
| User    | user1@example.com          | User@123    |
| User    | user2@example.com          | User@123    |
| User    | user3@example.com          | User@123    |

## API Endpoints

### Authentication

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| POST   | /api/auth/login    | Login user           |
| POST   | /api/auth/refresh  | Refresh access token|
| POST   | /api/auth/logout   | Logout user         |

### Users

| Method | Endpoint           | Description                    | Auth Required        |
|--------|--------------------|--------------------------------|----------------------|
| GET    | /api/users         | Get all users                  | Admin, Manager       |
| POST   | /api/users         | Create new user                | Admin only           |
| GET    | /api/users/me      | Get own profile                | All roles            |
| PUT    | /api/users/me      | Update own profile            | All roles            |
| GET    | /api/users/:id     | Get user by ID                 | Admin, Manager       |
| PUT    | /api/users/:id     | Update user                    | Admin, Manager       |
| DELETE | /api/users/:id     | Deactivate user (soft delete)  | Admin only           |

## Folder Structure

```
/
├── client/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── profile/
│   │   │   └── dashboard/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── context/
│   │   └── routes/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   └── users/
│   │   └── shared/
│   │       ├── constants/
│   │       ├── middlewares/
│   │       ├── types/
│   │       └── utils/
│   └── package.json
│
└── README.md
```

## Deployment Notes

### Build for Production

**Server:**
```bash
cd server
npm run build
npm start
```

**Client:**
```bash
cd client
npm run build
npm run preview
```

### Security Features

1. Passwords hashed with bcrypt (salt rounds: 12)
2. JWT access tokens expire in 15 minutes
3. Refresh tokens expire in 7 days (httpOnly cookies)
4. Rate limiting on auth routes (10 req/15 min per IP)
5. CORS restricted to configured origin
6. Helmet security headers enabled
7. Input validation on all endpoints
8. Passwords never returned in API responses

### Environment Variables

Never commit `.env` files to version control. Always use `.env.example` as a template.
