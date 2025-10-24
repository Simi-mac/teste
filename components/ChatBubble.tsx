import React from 'react';
import type { MessageRole } from '../types';

interface ChatBubbleProps {
  message: string;
  role: MessageRole;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, role }) => {
  const isUser = role === 'user';
  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white self-end'
    : 'bg-white text-slate-800 self-start shadow-sm border border-slate-200';
  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';

  // Basic markdown to HTML conversion
  const formatMessage = (text: string) => {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italics
    
    // Convert lists
    html = html.replace(/^\s*[-*]\s+(.*)/gm, '<li class="ml-4">$1</li>');
    html = html.replace(/<\/li>\n<li/g, '</li><li');
    html = html.replace(/(<li.*<\/li>)/gs, '<ul class="list-disc list-inside my-2">$1</ul>');

    // Convert newlines to breaks
    html = html.replace(/\n/g, '<br />');
    html = html.replace(/<br \/>(\s*<(?:ul|ol))/g, '$1'); // remove break before list
    html = html.replace(/(<\/ul>|<\/li>)<br \/>/g, '$1'); // remove break after list

    return { __html: html };
  };

  return (
    <div className={containerClasses}>
      <div className={`rounded-xl p-4 max-w-prose ${bubbleClasses}`}>
        <div className="prose prose-sm max-w-none text-inherit" dangerouslySetInnerHTML={formatMessage(message)} />
      </div>
    </div>
  );
};

export default ChatBubble;
