import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getEmbedding } from '@/lib/openai'

export async function POST(req: Request) {
  try {
    const { title, content, metadata } = await req.json()
    if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 })

    // compute embedding
    const embedding = await getEmbedding(content)

    // insert into supabase (service role)
    const { data, error } = await supabaseAdmin
      .from('documents')
      .insert([
        { title: title ?? null, content, embedding, metadata: metadata ?? {} }
      ])

    if (error) throw error
    return NextResponse.json({ ok: true, id: data?.[0]?.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: (err as any).message || 'error' }, { status: 500 })
  }
}
