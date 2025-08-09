// KV utility that switches between Vercel KV and mock KV based on environment
import { mockKV } from './mock-kv';

// Check if Vercel KV credentials are available
const hasVercelKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

let kvInstance: any;

if (hasVercelKV) {
  // Dynamically import Vercel KV only if credentials are available
  try {
    const vercelKV = require("@vercel/kv");
    kvInstance = vercelKV.kv;
  } catch (error) {
    console.warn("Vercel KV not available, using mock KV for development");
    kvInstance = mockKV;
  }
} else {
  // Use mock KV for local development
  kvInstance = mockKV;
}

export const kv = kvInstance;
