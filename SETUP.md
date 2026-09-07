# NoteNest Setup & Deployment Guide

Welcome to **NoteNest** — *"Share Knowledge. Learn Together."*

This guide explains how to configure external production credentials, run migrations, and deploy the application. NoteNest is built with a decoupled architecture: it runs out-of-the-box in development using its high-speed in-memory relational data engine, and seamlessly switches to external PostgreSQL and Supabase Storage when credentials are provided.

---

## 1. Prerequisites
- Node.js 18+ or 20+
- npm or pnpm or yarn
- PostgreSQL instance (Neon, Supabase, AWS RDS, or local Docker)

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Populate the keys:
- `DATABASE_URL`: PostgreSQL connection string (e.g. `postgresql://postgres:password@localhost:5432/notenest?sslmode=prefer`)
- `SUPABASE_URL`: Your Supabase Project URL (`https://your-project.supabase.co`)
- `SUPABASE_ANON_KEY`: Supabase public anon key
- `SUPABASE_STORAGE_BUCKET`: Storage bucket name (default: `notes-documents`)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From Google Cloud Console OAuth 2.0 Credentials
- `JWT_SECRET`: High-entropy random 32+ character string

---

## 3. Database Setup (PostgreSQL + Prisma)

1. **Install Prisma CLI**:
   ```bash
   npm install prisma @prisma/client
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Apply Schema Migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the Database**:
   ```bash
   npx prisma db seed
   ```

---

## 4. Supabase Storage Setup

1. Log into your Supabase Dashboard: [https://app.supabase.com](https://app.supabase.com)
2. Navigate to **Storage** $\rightarrow$ **Create a new bucket**:
   - Bucket Name: `notes-documents`
   - Set to **Public bucket** for public study notes or **Private bucket** if utilizing signed URLs.
3. Configure Storage Policies (RLS):
   - **SELECT**: Allow public reads for notes with `visibility = 'public'`.
   - **INSERT**: Allow authenticated users to upload files with MIME type `application/pdf`.
   - Max file size limit: 25MB.

---

## 5. Google OAuth Setup

1. Visit the [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Web Application).
3. Set Authorized JavaScript origins:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
4. Set Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Secret into `.env`.

---

## 6. Local Development

Start the full-stack server (runs Express API backend on port 3000 with Vite middleware):
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 7. Production Deployment (Cloud Run / Vercel / Railway / Docker)

1. **Build the production assets**:
   ```bash
   npm run build
   ```
   This compiles the React client into `dist/` and bundles `server.ts` into a CommonJS production bundle `dist/server.cjs`.

2. **Start the production server**:
   ```bash
   npm start
   ```

3. **Docker Deployment**:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --production=false
   COPY . .
   RUN npm run build
   EXPOSE 3000
   ENV NODE_ENV=production
   CMD ["node", "dist/server.cjs"]
   ```
