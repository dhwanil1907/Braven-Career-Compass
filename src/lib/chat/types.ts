export interface ChatMessage { role: 'user' | 'assistant'; content: string }
export interface ChatProfile { major: string | null; interests: string[]; year: string | null; goal: string | null }
export interface ChatSource { title: string; url: string; kind: 'resource' | 'event' }
export interface ChatRequest { messages: ChatMessage[]; profile?: ChatProfile; stream?: boolean }
export interface ChatSuccess { reply: string; sources: ChatSource[] }
export interface ChatFailure { error: string }
export type ChatStreamEvent =
  | { type: 'delta'; text: string }
  | { type: 'done'; sources: ChatSource[] }
  | { type: 'error'; error: string };
