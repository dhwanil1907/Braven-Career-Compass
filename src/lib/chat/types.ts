export interface ChatMessage { role: 'user' | 'assistant'; content: string }
export interface ChatProfile { major: string | null; interests: string[]; year: string | null; goal: string | null }
export interface ChatSource { title: string; url: string; kind: 'resource' | 'event' }
export interface ChatRequest { messages: ChatMessage[]; profile?: ChatProfile }
export interface ChatSuccess { reply: string; sources: ChatSource[] }
export interface ChatFailure { error: string }
