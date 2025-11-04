# NutriGo - Food Scanner & Health Score App

## Prerequisites
- Node.js 18+ installed
- Git installed
- A Supabase account
- A Google Cloud account (for Gemini AI API)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/pranavraok/NutriGo.git
cd NutriGo
```

### 2. Environment Setup

#### Frontend (.env.local)
Create a file named `.env.local` in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
BACKEND_URL=http://localhost:4000
```

#### Backend (.env)
Create a file named `.env` in the `backend` directory:
```env
PORT=4000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Create the following tables:

#### scans Table
```sql
create table scans (
  id text primary key,
  user_id text,
  detected_name text,
  brand text,
  nutrition jsonb,
  warnings text[],
  health_score integer,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  barcode text,
  source text
);
```

### 4. Install Dependencies

#### Frontend
```bash
npm install
# or
pnpm install
```

#### Backend
```bash
cd backend
npm install
```

### 5. Start the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```

#### Start Frontend (in a new terminal)
```bash
# From the root directory
npm run dev
```

## Environment Variables Guide

### Required Frontend Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key (public)
- `BACKEND_URL`: The URL where your backend is running (default: http://localhost:4000)

### Required Backend Variables
- `PORT`: Backend server port (default: 4000)
- `FRONTEND_URL`: Frontend application URL (default: http://localhost:3000)
- `JWT_SECRET`: Secret key for JWT tokens
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase service role key
- `GEMINI_API_KEY`: Google Gemini AI API key

## Getting the Required Keys

### Supabase Keys
1. Go to [Supabase](https://supabase.com) and create a new project
2. Once created, go to Project Settings -> API
3. You'll find:
   - Project URL (`SUPABASE_URL`)
   - anon public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - service_role key (`SUPABASE_KEY`)

### Gemini AI Key
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the Gemini API
4. Create API credentials
5. Copy the API key

## Common Issues & Solutions

1. **"supabaseUrl is required" Error**
   - Check if you've created the `.env` file in the backend directory
   - Verify that SUPABASE_URL is correctly set

2. **Backend Connection Issues**
   - Ensure backend is running on port 4000
   - Check if BACKEND_URL is correctly set in frontend .env.local

3. **Image Upload Errors**
   - Ensure the `uploads` directory exists in the backend folder
   - Check file permissions

4. **Database Errors**
   - Verify Supabase table schema
   - Check if all required columns exist

## Support

For any issues, please:
1. Check the common issues section
2. Verify your environment variables
3. Ensure all required dependencies are installed
4. Create an issue on GitHub if problem persists

## Directory Structure
```
nutrigo-app/
├── app/                   # Next.js pages and routes
├── backend/              # Express backend server
├── components/           # React components
├── lib/                  # Shared utilities
├── public/              # Static assets
├── styles/              # CSS styles
├── .env.local           # Frontend environment variables
└── backend/.env         # Backend environment variables
```