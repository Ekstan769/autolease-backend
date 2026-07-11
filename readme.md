# AutoLease Backend API

A production-ready car rental and marketplace REST API.

## Tech Stack
- Node.js + Typescript
- Express.js
- PostgreSQL + TypeORM
- JWT Authentication
- bcryptjs

## Setup Instructions
1. Clone the repository
2. Run `npm install`
3. Create a `.env` file using `.env.example`as reference
4. Run `npm run migration:run`
5. Run `npm run dev`

## API Endpoints

## Auth
- POST /api/auth/register
- POST /api/auth/login

### Vehicles
- GET /api/vehicles
- GET /api/vehicles/:id
- POST /api/vehicles (owner only)
- PUT /api/vehicles/:id (owner only)
- DELETE /api/vehicles/:id (owner only)

### Bookings
- POST /api/bookings (customer only)
- GET /api/bookings
- GET /api/bookings/:id
- PATCH /api/bookings/:id/cancel

## Test Credentials
- Admin: admin@autolease.com / password123
- Owner: owner@autolease.com / password123
- Customer: stanley@autolease.com / password123

## ER Diagram
[See ER_DIAGRAM.png in root folder]

## Deployment
Live URL: [https://autolease-backend.onrender.com]
