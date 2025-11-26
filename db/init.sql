-- Run this in Supabase SQL Editor to create the documents table with a vector column

create extension if not exists vector;
create extension if not exists "uuid-ossp";

create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),
  title text,
  content text,
  embedding vector(1536), -- length depends on embedding model (OpenAI text-embedding-3-small is 1536)
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists documents_embedding_idx on documents using ivfflat (embedding vector_cosine_ops) with (lists = 100);
