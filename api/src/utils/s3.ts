import { S3Client } from '@aws-sdk/client-s3';

// Client S3 compatible MinIO
export const s3 = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ''
  }
});

export const S3_BUCKET = process.env.S3_BUCKET || 'inventory';


