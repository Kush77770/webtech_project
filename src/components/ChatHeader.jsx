import React from 'react';
import { Phone, Video, Search, MoreVertical, ArrowLeft } from 'lucide-react';
import Avatar from './Avatar';

export default function ChatHeader({
  contact,
  isTyping,
  showSearch,
  showInfo,
  onSearchToggle,
  onInfoToggle,
  onClearChat,
  onBack,
}) {
  return (
    <header className="chat-header">
      <button className="back-btn" onClick={onBack} aria-label="Go back">
        <ArrowLeft size={20} />
      </button>

      <div className="chat-header-left" onClick={onInfoToggle} role="button" tabIndex={0} aria-label="View contact info" onKeyDown={(e) => e.key === 'Enter' && onInfoToggle()}>
        <div className="user-avatar-wrap">
          <Avatar contact={contact} />
          <span className={`online-dot sm${contact.online ? '' : ' offline'}`} aria-hidden="true" />
        </div>
        <div className="chat-header-info">
          <div className="chat-contact-name">{contact.name}</div>
          <div className="chat-contact-status">
            {isTyping ? (
              <span className="status-online">typing…</span>
            ) : contact.online ? (
              <span className="status-online">online</span>
            ) : (
              <span>Last seen {contact.lastSeen || 'recently'}</span>
            )}
          </div>
        </div>
      </div>

      <div className="chat-header-actions">
        <button
          className="icon-btn tooltip"
          data-tip="Voice call"
          aria-label="Voice call (simulation)"
          id="voice-call-btn"
        >
          <Phone size={20} />
        </button>
        <button
          className="icon-btn tooltip"
          data-tip="Video call"
          aria-label="Video call (simulation)"
          id="video-call-btn"
        >
          <Video size={20} />
        </button>
        <button
          className={`icon-btn tooltip${showSearch ? ' active' : ''}`}
          data-tip="Search messages"
          onClick={onSearchToggle}
          aria-label="Search messages"
          aria-expanded={showSearch}
          id="search-messages-btn"
        >
          <Search size={20} />
        </button>
        <button
          className="icon-btn tooltip"
          data-tip="Clear chat"
          onClick={onClearChat}
          aria-label="Clear chat"
          id="clear-chat-btn"
        >
          <MoreVertical size={20} />
        </button>
      </div>
    </header>
  );
}
