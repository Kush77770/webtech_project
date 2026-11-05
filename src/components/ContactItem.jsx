import React from 'react';
import Avatar from './Avatar';
import { formatTime } from '../utils/timeUtils';

export default function ContactItem({ contact, lastMessage, unreadCount, isActive, onClick }) {
  const previewText = lastMessage
    ? lastMessage.type === 'image'
      ? '📷 Photo'
      : lastMessage.text?.substring(0, 50) || ''
    : '';

  const isOwnMsg = lastMessage?.senderId === 'me';

  return (
    <div
      className={`contact-item${isActive ? ' active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Chat with ${contact.name}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="contact-avatar-wrap">
        <Avatar contact={contact} />
        <span className={`online-dot sm${contact.online ? '' : ' offline'}`} aria-label={contact.online ? 'Online' : 'Offline'} />
      </div>

      <div className="contact-body">
        <div className="contact-top">
          <span className="contact-name">{contact.name}</span>
          {lastMessage && (
            <span className={`contact-time${unreadCount > 0 ? ' unread-time' : ''}`}>
              {formatTime(lastMessage.timestamp)}
            </span>
          )}
        </div>
        <div className="contact-bottom">
          <span className="contact-preview">
            {isOwnMsg && <span className="preview-you">You: </span>}
            {previewText}
          </span>
          <div className="contact-meta">
            {unreadCount > 0 && (
              <span className="unread-badge" aria-label={`${unreadCount} unread messages`}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
