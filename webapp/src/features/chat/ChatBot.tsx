import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '@/services/geminiApi';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { Translate } from '@/components/ui/Translate';

interface QuickAction {
  id: string;
  text: string;
  subOptions?: QuickAction[];
}

const STARTER_OPTIONS: QuickAction[] = [
  { id: 'type', text: 'حدد نوع شركتك' },
  { id: 'protection', text: 'هل تريد حماية قانونية' },
  { id: 'activity', text: 'حدد نوع نشاطك' },
  { 
    id: 'start', 
    text: 'ما هي بداية الاجراءات القانونية',
    subOptions: [
      { id: 'reg', text: 'سجل تجاري' },
      { id: 'incorp', text: 'عقد تأسيس' },
      { id: 'tax', text: 'بطاقة ضريبية' }
    ]
  }
];

interface Message {
  role: 'bot' | 'user';
  text: string;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'مرحباً! أنا FormaAI، مساعدك القانوني الذكي. كيف يمكنني مساعدتك في تأسيس شركتك اليوم؟' }
  ]);
  const [activeOptions, setActiveOptions] = useState<QuickAction[]>(STARTER_OPTIONS);
  const [showOptions, setShowOptions] = useState(true);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input.trim();
    if (!textToSend || isTyping) return;

    if (!customMessage) setInput('');
    setShowOptions(false); // Hide options once interaction starts
    
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsTyping(true);

    // History must start with a 'user' message for Gemini API
    const history = messages
      .filter((m, i) => i > 0) 
      .map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

    const botResponse = await getGeminiResponse(textToSend, history);
    
    setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    setIsTyping(false);
  };

  const handleOptionClick = (option: QuickAction) => {
    if (option.subOptions) {
      setActiveOptions(option.subOptions);
    } else {
      handleSend(option.text);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="flex items-center gap-3 text-[#C8A45D]">
            <Bot size={24} />
            <span className="font-bold text-sm tracking-tight text-white uppercase">FormaAI Assistant</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="chatbot-messages custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-msg ${msg.role}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="chat-msg bot italic opacity-50 flex gap-2">
              <span className="animate-pulse">.</span>
              <span className="animate-pulse delay-75">.</span>
              <span className="animate-pulse delay-150">.</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions / Chips */}
        {showOptions && (
          <div className="chat-chips-container">
            {activeOptions.map((option) => (
              <button
                key={option.id}
                className={`chat-chip ${option.subOptions ? '' : 'sub'}`}
                onClick={() => handleOptionClick(option)}
              >
                {option.text}
              </button>
            ))}
          </div>
        )}

        <div className="chatbot-input-area">
          <input 
            type="text" 
            className="chatbot-input" 
            placeholder="اسأل عن تأسيس الشركات..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={() => handleSend()} 
            disabled={!input.trim() || isTyping}
            className="chatbot-send"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Trigger Bubble and Tip */}
      <div className="flex flex-col items-center gap-4">
        {!isOpen && (
          <div className="chat-tip-relative">
            <span>👋 مش عارف تأسس شركتك اسألني هنا</span>
            <span className="arrow-icon">↘️</span>
          </div>
        )}
        <button 
          className="chatbot-bubble"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </button>
      </div>
    </div>
  );
};
