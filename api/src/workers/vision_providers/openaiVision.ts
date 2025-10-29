import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import OpenAI from 'openai';

type DescribeParams = { s3Key: string; subjectType?: 'item' | 'container' };

const s3 = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ''
  }
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return await new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

export async function describeImage(params: DescribeParams) {
  const bucket = process.env.S3_BUCKET || 'inventory';
  const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: params.s3Key }));
  const buf = await streamToBuffer(obj.Body as any);
  const b64 = buf.toString('base64');

  const role = params.subjectType === 'container' ? 'meuble/rangement' : 'objet';
  const prompt = `Tu es un assistant d'inventaire maison. Décris brièvement le ${role} sur la photo: titre court, résumé, 3-6 tags, et si meuble essaie d'estimer type.`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Tu renvoies un JSON strict.' },
      {
        role: 'user',
        content: [
          { type: 'input_text', text: prompt },
          { type: 'input_image', image_url: `data:image/jpeg;base64,${b64}` }
        ] as any
      }
    ],
    response_format: { type: 'json_object' }
  });

  const text = resp.choices[0]?.message?.content || '{}';
  let parsed: any = {};
  try {
    parsed = JSON.parse(text);
  } catch {}
  return parsed;
}


