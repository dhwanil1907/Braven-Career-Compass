import { handleChatRequest } from '../src/lib/chat/server';

/**
 * Vercel function behind the site's assistant chat. The NVIDIA key lives only in the server
 * environment (NVIDIA_API_KEY); the browser never sees it.
 */
export async function POST(request: Request): Promise<Response> {
  let input: unknown = null;
  try {
    input = await request.json();
  } catch {
    // Not JSON; the handler answers with a 400.
  }
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const { status, body } = await handleChatRequest(input, {
    apiKey: process.env.NVIDIA_API_KEY,
    model: process.env.NVIDIA_MODEL || undefined,
    clientId: forwardedFor || 'anon',
  });
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}
