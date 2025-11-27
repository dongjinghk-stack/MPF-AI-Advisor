import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ChatMessage } from '../../types';
import ScenarioChart from './ScenarioChart';

interface ChatBubbleProps {
  message: ChatMessage;
  onFeedback?: (messageId: string, feedback: 'like' | 'dislike') => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onFeedback }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative group
          ${isBot 
            ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none' 
            : 'bg-blue-600 text-white rounded-tr-none'
          }`}
        >
          {/* Render Text with basic markdown-like line breaks */}
          <div className="whitespace-pre-wrap">
            {message.text.split('\n').map((line, i) => (
                <p key={i} className="min-h-[1rem]">{line}</p>
            ))}
          </div>

          {/* Feedback Controls (Only for Bot) */}
          {isBot && onFeedback && (
            <div className={`absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-2 transition-opacity ${message.feedback ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <button 
                onClick={() => onFeedback(message.id, 'like')}
                className={`p-1.5 rounded-full hover:bg-green-50 transition-colors ${message.feedback === 'like' ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-green-600'}`}
                title="Helpful"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => onFeedback(message.id, 'dislike')}
                className={`p-1.5 rounded-full hover:bg-red-50 transition-colors ${message.feedback === 'dislike' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600'}`}
                title="Not Helpful"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Render Sections (Visualizations) */}
        {message.sections && (
          <div className="w-full mt-2 space-y-2">
            {message.sections.map((section, idx) => {
              if (section.type === 'scenario' && section.data) {
                return <ScenarioChart key={idx} scenario={section.data} />;
              }
              return null;
            })}
          </div>
        )}
        
        <span className="text-[10px] text-gray-400 mt-1 px-1 flex items-center gap-2">
          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          {message.feedback && isBot && (
            <span className="text-xs">
              {message.feedback === 'like' ? '👍' : '👎'}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;