'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { chatbot } from '@/lib/api-client';
import type { ChatMessage } from '@/types/chatbot';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content: '¡Hola! Soy el asistente virtual de FireX. ¿En qué puedo ayudarte hoy?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const history = messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            const response = await chatbot.sendMessage(input, history);

            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: response.message,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                    aria-label="Abrir chat"
                >
                    <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Asistente FireX</h3>
                                <p className="text-xs text-white/80">En línea</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-2 rounded-full transition-colors"
                            aria-label="Cerrar chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                    <p
                                        className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                    >
                                        {message.timestamp?.toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Escribiendo...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu mensaje..."
                                className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                rows={1}
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                aria-label="Enviar mensaje"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
