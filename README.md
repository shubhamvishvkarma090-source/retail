# Retail Inventory & Sales Management System

A full-stack starter implementation for the UrsTech SDE assignment.

## Stack
- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS
- Backend: Express, MongoDB, Mongoose, JWT, bcrypt
- API client: browser fetch wrapper

## Prerequisites
Node.js 20+, npm, and MongoDB (local or Atlas).

## Run locally

Start MongoDB first, either as a local service or with a MongoDB Atlas connection string. The backend expects `MONGODB_URI` in `backend/.env`.

### Windows PowerShell

Open two PowerShell terminals, starting each from the project root (the folder containing `README.md`). Use `npm.cmd` instead of `npm` in PowerShell when the execution policy blocks `npm.ps1`.

In terminal 1, start the backend:

```powershell
Set-Location .\backend
Copy-Item .env.example .env
# Edit .env if needed, especially MONGODB_URI and JWT_SECRET.
npm.cmd install
npm.cmd run seed
npm.cmd run dev
```

In terminal 2, start the frontend:

```powershell
Set-Location .\frontend
Copy-Item .env.example .env.local
npm.cmd install
npm.cmd run dev
```

Run `Copy-Item` only when the destination `.env` or `.env.local` does not already exist, so you don't overwrite your configuration. Open `http://localhost:3000`; the backend API runs at `http://localhost:5000`.

If a terminal is already inside `backend`, do not run `cd backend` again. To move from `backend` to the frontend, use `Set-Location ..\frontend` (or open a second terminal at the project root and run the frontend commands there).

### macOS, Linux, or Command Prompt

From the project root, the equivalent commands are:

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

In another terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Seed users (development only):
- Admin: `admin@retail.local` / `Admin123!`
- Staff: `staff@retail.local` / `Staff123!`

Change credentials and secrets before any shared or production deployment.

## Push to GitHub

The root `.gitignore` excludes dependencies, generated build files, local environment files, and common editor/OS files. The checked-in `.env.example` files are safe templates; do not commit `.env` or `.env.local`, and never put real credentials or secrets in example files.

To publish this project, create an empty repository on GitHub, then run these commands from the project root. Replace the URL with the HTTPS or SSH URL for your GitHub repository:

```bash
git init
git add .
git status
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repository-url>
git push -u origin main
```

Review `git status` before committing to confirm that no local environment files or other secrets are staged. GitHub Actions runs the backend tests and builds the frontend for pushes and pull requests.

## Implemented starter flows
- JWT login and `/api/auth/me`
- Role-protected product listing/create/update/deactivate APIs
- Inventory adjustments and movement history
- Sale creation with server-side price calculations, stock validation, transaction attempt, invoice number, and sale history
- Low-stock, sales and profit report APIs
- Dashboard and POS-oriented responsive frontend with live API integration

## Important deployment note
MongoDB transactions require a replica set (MongoDB Atlas supports this). The sale service uses a transaction and returns a clear error if transactions are unavailable; for production, deploy to a replica set and add idempotency keys, rate limiting, structured logging, monitoring, backups, and a full automated test pipeline. This is a project starter, not a security audit.
