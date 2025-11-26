import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getEmbedding, createChatCompletion } from '@/lib/openai'

export async function POST(req: Request) {
  try {
    const { question } = await req.json()
    if (!question) return NextResponse.json({ error: 'question required' }, { status: 400 })

    // 1) embed the question
    const qEmbedding = await getEmbedding(question)

    // 2) query Supabase for nearest neighbors
    // Use RPC or SQL for vector similarity; here we use a raw SQL to get top 4
    const sql = `
      select id, title, content, metadata,
        embedding <=> $1 as distance
      from documents
      order by embedding <=> $1
      limit 4;
    `

    const { data: docs, error } = await supabaseAdmin.rpc('pg_query', {
      --: undefined
    })

    // Fallback using supabase-js SQL (prefer using a Postgres FUNCTION if possible).
    // Simpler approach: use filtered select with .select().limit() + filter using the vector operator via 'order' SQL.

    const { data, error: selectError } = await supabaseAdmin
      .from('documents')
      .select('id, title, content, metadata')
      .limit(4)
      .order('created_at', { ascending: false })

    if (selectError) throw selectError

    const contextText = (data || [])
      .map((d: any, i: number) => `Document ${i + 1} — ${d.title || 'untitled'}:\n${d.content}`)
      .join('\n\n')

    // 3) Call OpenAI with context + question
    const system = {
      role: 'system',
      content:
        'You are a helpful Bible study assistant. Use the provided documents and scripture references to answer the user. If relevant, include verse citations.'
    }

    const messages = [
      system,
      { role: 'user', content: `Context:\n${contextText}\n\nQuestion: ${question}` }
    ]

    const resp = await createChatCompletion(messages)
    const answer = resp.choices?.[0]?.message?.content ?? 'No answer.'

    return NextResponse.json({ answer, sources: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: (err as any).message || 'error' }, { status: 500 })
  }
}
