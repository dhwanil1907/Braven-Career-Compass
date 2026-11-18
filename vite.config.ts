import type { IncomingMessage, ServerResponse } from 'node:http';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import type { Plugin } from 'vite';

const MAX_BODY_BYTES = 32_000;

function readJsonBody(request: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let raw = '';
    request.on('data', (chunk: Buffer) => {
      raw += chunk.toString('utf8');
      if (raw.length > MAX_BODY_BYTES) request.destroy();
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(null);
      }
    });
    request.on('error', () => resolve(null));
  });
}

/** Serves /api/chat in `npm run dev` the way the Vercel function does in production. */
function chatApiDev(env: Record<string, string>): Plugin {
  return {
    name: 'chat-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (request: IncomingMessage, response: ServerResponse) => {
        if (request.method !== 'POST') {
          response.statusCode = 405;
          response.end();
          return;
        }
        const input = await readJsonBody(request);
        const chat = await server.ssrLoadModule('/src/lib/chat/server.ts');
        const { status, body } = await chat.handleChatRequest(input, {
          apiKey: env.NVIDIA_API_KEY,
          model: env.NVIDIA_MODEL || undefined,
          clientId: request.socket.remoteAddress ?? 'dev',
        });
        response.statusCode = status;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(body));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Empty prefix loads every .env key for the dev middleware only; none reach the browser bundle.
  const env = loadEnv(mode, process.cwd(), '');
  return { plugins: [react(), tailwindcss(), chatApiDev(env)] };
});
