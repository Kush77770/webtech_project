import React, { useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import TypingIndicator from './TypingIndicator';
import { formatTime, getDateLabel } from '../utils/timeUtils';

function StatusIcon({ status }) {
  if (status === 'sent') return <span className="status-icon" title="Sent">✓</span>;
  if (status === 'delivered') return <span className="status-icon" title="Delivered">✓✓</span>;
  if (status === 'read') return <span className="status-icon read" title="Read">✓✓</span>;
  return null;
}

function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i}>{part}</mark> : part
  );
}

function MessageBubble({ message, searchQuery, highlightedId, onDelete, onImageClick }) {
  const isOutgoing = message.senderId === 'me';
  const isHighlighted = message.id === highlightedId;

  return (
    <div className={`message-wrap ${isOutgoing ? 'outgoing' : 'incoming'}`} id={`msg-${message.id}`}>
      {message.type === 'image' ? (
        <div
          className={`message-image-wrap${isHighlighted ? ' highlighted' : ''}`}
          onClick={() => onImageClick(message.imageUrl)}
          role="button"
          tabIndex={0}
          aria-label="View image"
          onKeyDown={(e) => e.key === 'Enter' && onImageClick(message.imageUrl)}
        >
          <img className="message-image" src={message.imageUrl} alt="Shared image" loading="lazy" />
          {message.text && (
            <div className="message-text" style={{ padding: '6px 12px 2px' }}>
              {highlightText(message.text, searchQuery)}
            </div>
          )}
          <div className="message-image-footer">
            <span className="message-time">{formatTime(message.timestamp)}</span>
            {isOutgoing && <StatusIcon status={message.status} />}
          </div>
        </div>
      ) : (
        <div className={`message-bubble${isHighlighted ? ' highlighted' : ''}`}>
          <div className="message-text">
            {highlightText(message.text, searchQuery)}
          </div>
          <div className="message-footer">
            <span className="message-time">{formatTime(message.timestamp)}</span>
            {isOutgoing && <StatusIcon status={message.status} />}
          </div>
        </div>
      )}
      <button
        className="msg-delete-btn"
        onClick={() => onDelete(message.id)}
        aria-label="Delete message"
        title="Delete"
        type="button"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

export default function MessageList({ messages, contact, isTyping, searchQuery, highlightedId, onDeleteMessage, onImageClick }) {
  const bottomRef = useRef(null);
  const prevMsgCount = useRef(0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length !== prevMsgCount.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      prevMsgCount.current = messages.length;
    }
  }, [messages]);

  // Also scroll when isTyping changes
  useEffect(() => {
    if (isTyping) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isTyping]);

  // Scroll to highlighted message
  useEffect(() => {
    if (highlightedId) {
      const el = document.getElementById(`msg-${highlightedId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedId]);

  // Group messages by date
  const groups = [];
  let lastDate = null;
  messages.forEach((msg) => {
    const label = getDateLabel(msg.timestamp);
    if (label !== lastDate) {
      groups.push({ type: 'date', label });
      lastDate = label;
    }
    groups.push({ type: 'message', message: msg });
  });

  return (
    <div className="messages-list" role="log" aria-label="Messages" aria-live="polite">
      {groups.map((item, idx) => {
        if (item.type === 'date') {
          return (
            <div key={`date-${idx}`} className="date-separator" aria-label={item.label}>
              <span>{item.label}</span>
            </div>
          );
        }
        const msg = item.message;
        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            searchQuery={searchQuery}
            highlightedId={highlightedId}
            onDelete={onDeleteMessage}
            onImageClick={onImageClick}
          />
        );
      })}

      {isTyping && <TypingIndicator contact={contact} />}

      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}
