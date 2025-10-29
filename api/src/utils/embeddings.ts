import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text: string) {
  const model = 'text-embedding-3-small';
  const res = await openai.embeddings.create({ model, input: text });
  const vector = res.data[0]?.embedding || [];
  return { vector: Buffer.from(new Float32Array(vector).buffer), provider: 'openai', model };
}


