# AI Resume Optimizer

A full-stack AI-powered resume optimization tool.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: FastAPI, Python, OpenAI
- **Database/Auth**: Supabase

## Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- Supabase Project
- OpenAI API Key

### Backend Setup

1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env with your keys
   ```
5. Run server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```

## Database Setup

Run the SQL commands in `supabase/schema.sql` in your Supabase SQL Editor to set up tables and RLS policies.
# resume_ai_port
