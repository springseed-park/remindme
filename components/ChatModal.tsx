import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../App';
import { getChatResponse } from '../services/openaiService';

interface Message {
    author: 'user' | 'ai';
    text: string;
}

const ChatModal: React.FC<{ onClose: () => void; }> = ({ onClose }) => {
    const context = useContext(AppContext);
    const [messages, setMessages] = useState<Message[]>([
        { author: 'ai', text: '안녕하세요! 어떤 이야기를 나누고 싶으신가요?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading || !context?.userProfile) return;

        const userMessage: Message = { author: 'user', text: trimmedInput };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const response = await getChatResponse(trimmedInput, context.userProfile.conversationStyle);
        
        const aiMessage: Message = { 
            author: 'ai', 
            text: response || "죄송해요, 답변을 생성하는 데 실패했어요." 
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-sm rounded-2xl shadow-lg flex flex-col animate-fade-in-up" style={{height: '85vh', maxHeight: '700px'}}>
                <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold">마음이와 대화하기</h2>
                        <p className="text-xs text-gray-500">이 대화는 저장되지 않고 사라져요.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
                </header>
                
                <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.author === 'ai' && <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>}
                            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.author === 'user' ? 'bg-indigo-500 text-white rounded-br-lg' : 'bg-gray-700 text-gray-200 rounded-bl-lg'}`}>
                                <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                             <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                             <div className="max-w-[80%] p-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-lg">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>
                
                <footer className="p-2 border-t border-gray-700 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="메시지 입력..."
                            className="flex-1 w-full p-3 bg-gray-800 border-gray-700 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-3 bg-indigo-500 rounded-lg text-white disabled:bg-gray-600">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ChatModal;