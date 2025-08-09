import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { kv } from '@/libs/kv-utils';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }
  const key = `cart-${session.user._id}`;
  const raw = await kv.get(key);
  return NextResponse.json({ key, raw });
}
