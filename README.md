This repo contains a minimal RAG starter using Next.js, Supabase, and OpenAI.

## Setup
1. Create a Supabase project and run the SQL in `db/init.sql`.
2. Create an empty GitHub repo and paste these files.
3. Add environment variables to Vercel (see top of this document).
4. Deploy to Vercel.

Endpoints:
- `POST /api/ingest` — upload a document (title, content) to be embedded and stored.
- `POST /api/chat` — ask a question; the system will retrieve relevant docs from Supabase and call OpenAI.


