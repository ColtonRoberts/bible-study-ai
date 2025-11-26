import OpenAI from 'openai'

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// helper: get embeddings
export async function getEmbedding(input: string) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input
  })
  return res.data[0].embedding as number[]
}

// helper: chat completion
export async function createChatCompletion(messages: Array<{ role: string; content: string }>) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 800
  })
  return res
}
