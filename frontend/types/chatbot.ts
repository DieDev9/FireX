export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}

export interface ChatRequest {
    message: string;
    history?: ChatMessage[];
}

export interface ChatResponse {
    message: string;
    success: boolean;
    error?: string;
}
