import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getEmbedding, createChatCompletion } from '@/lib/openai'

export async function POST(req: Request) {
  try {
    const { question } = await req.json()
    if (!question) return NextResponse.json({ error: 'question required' }, { status: 400 })

    const qEmbedding = await getEmbedding(question)

    // Simple retrieval of latest 4 documents (replace with vector search if desired)
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('id, title, content, metadata')
      .limit(4)
      .order('created_at', { ascending: false })

    if (error) throw error

    const contextText = (data || [])
      .map((d, i) => `Document ${i + 1} — ${d.title || 'untitled'}:\n${d.content}`)
      .join('\n\n')

    const system = {
      role: 'system',
      content:
        'You are a helpful Bible study assistant. Use the provided documents and scripture references to answer the user.'
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
