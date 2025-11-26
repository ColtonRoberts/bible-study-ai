'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Page() {
  const [question, setQuestion] = useState('')
  const [chat, setChat] = useState<Array<{ q: string; a: string }>>([])
  const [loading, setLoading] = useState(false)

  async function send() {
    if (!question) return
    setLoading(true)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    })
    const json = await res.json()
    const answer = json.answer ?? json.error ?? 'No answer.'
    setChat((c) => [{ q: question, a: answer }, ...c])
    setLoading(false)
    setQuestion('')
  }

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bible Study AI</h1>

      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded"
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about a verse, passage, or topic..."
        />
        <div className="flex gap-2 mt-2">
          <button onClick={send} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
      </div>

      <section>
        {chat.map((m, i) => (
          <div key={i} className="mb-4 p-3 border rounded">
            <div className="font-semibold">Q: {m.q}</div>
            <div className="mt-2">A: {m.a}</div>
          </div>
        ))}
      </section>
    </main>
  )
}
