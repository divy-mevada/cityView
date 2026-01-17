import React, { useState } from 'react';
import { Send } from 'lucide-react';
import type { ChatMessage } from '../types';

interface ChatbotProps {
  onMessageSend?: (message: string) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onMessageSend }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I can help you analyze city data and provide insights for government decision-making. Ask me about air quality, traffic, healthcare, or urban development.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    const currentInput = input;
    setInput('');

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await response.json();

      if (response.ok) {
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: data.reply,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }

    onMessageSend?.(currentInput);
  };

  return (
    <div className="card h-96 flex flex-col">
      <h3 className="text-lg font-semibold mb-4">What-If Analysis</h3>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-3 py-2 rounded-lg ${message.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
              }`}>
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about city data and policies..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="btn-primary flex items-center disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};