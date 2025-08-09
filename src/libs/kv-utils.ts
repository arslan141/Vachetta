// KV utility that falls back to mock implementation when Vercel KV is not available
import { mockKV } from './mock-kv';

let kv: any;

try {
  // Try to import Vercel KV
  const { kv: vercelKV } = require('@vercel/kv');
  
  // Check if required environment variables exist and are not placeholder values
  if (process.env.KV_REST_API_URL && 
      process.env.KV_REST_API_TOKEN &&
      !process.env.KV_REST_API_URL.includes('your_') &&
      process.env.KV_REST_API_URL.startsWith('http')) {
    kv = vercelKV;
  } else {
    console.log('Vercel KV credentials not found, using mock KV for local development');
    kv = mockKV;
  }
} catch (error) {
  console.log('Vercel KV not available, using mock KV for local development');
  kv = mockKV;
}

export { kv };
