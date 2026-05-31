# ITC Smart Shift & Workforce Management System

Full-stack workforce management app with a Node/Express/MongoDB backend and React/MUI frontend.

## Features

- Super Admin login with email and password.
- Admin login with mandatory TOTP verification.
- JWT access tokens, refresh tokens, bcrypt password hashing, RBAC, Helmet, CORS, rate limiting, sanitization, encrypted TOTP secrets, and audit logs.
- Employee management with search, filters, sorting, and pagination-ready API.
- Attendance persistence with a single save workflow.
- 4-week roster generation using Team A/B/C shift rotation.
- Replacement suggestions from saved attendance and assignment workflow.
- Shift swap validation and history.
- Dashboard and analytics charts for attendance, manpower, replacements, and team performance.
- Idempotent seed script with users, 30 employees, attendance history, roster, replacement, and swap data.
- Dockerfiles and Docker Compose.

## Project Structure

```text
Backend/
  src/config
  src/controllers
  src/middleware
  src/models
  src/routes
  src/services
  src/utils
  src/validators
  src/seeds
  src/cron
Frontend/
  src/components
  src/pages
  src/layouts
  src/routes
  src/redux
  src/services
  src/hooks
  src/context
  src/utils
  src/theme
```

## Local Setup

1. Create backend environment file:

```bash
cd Backend
copy .env.example .env
```

2. Install backend dependencies and seed MongoDB:

```bash
npm install
npm run seed
npm run dev
```

3. Create frontend environment file:

```bash
cd ../Frontend
copy .env.example .env
```

4. Install frontend dependencies and start the UI:

```bash
npm install
npm run dev
```

## Docker Setup

```bash
copy Backend\.env.example Backend\.env
docker compose up --build
```

After containers are running, seed the database:

```bash
docker compose exec backend npm run seed
```

## Default Accounts

- Super Admin: `superadmin@itc.com` / `SuperAdmin@123`
- Admin 1: `admin1@itc.com` / `Admin@123`
- Admin 2: `admin2@itc.com` / `Admin@123`

The seed command prints TOTP setup keys for newly created admins. Admins created from the UI receive a QR code and manual setup key immediately after creation.

## API Summary

- `POST /api/auth/login`
- `POST /api/auth/verify-totp`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`
- `POST /api/admins`
- `GET /api/admins`
- `PUT /api/admins/:id`
- `PATCH /api/admins/:id/status`
- `PATCH /api/admins/:id/reset-password`
- `GET /api/employees`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`
- `POST /api/attendance/save`
- `GET /api/attendance`
- `POST /api/roster/generate`
- `GET /api/roster`
- `GET /api/replacements/suggestions`
- `POST /api/replacements/assign`
- `POST /api/swaps/create`
- `GET /api/swaps/history`
- `GET /api/analytics/dashboard`
