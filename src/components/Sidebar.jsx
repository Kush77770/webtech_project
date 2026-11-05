import React, { useState } from 'react';
import { MessageCircle, Sun, Moon, Volume2, VolumeX, Plus, X } from 'lucide-react';
import Avatar from './Avatar';
import ContactList from './ContactList';

const MY_PROFILE = {
  name: 'You',
  avatarColor: '#6c5ce7',
  initials: 'YO',
  about: 'Hey there! I am using ChatVibe 😊',
};

export default function Sidebar({
  contacts,
  conversations,
  unreadCounts,
  activeContactId,
  theme,
  isMuted,
  onToggleTheme,
  onToggleMute,
  onSelectContact,
  isMobileHidden,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);

  // Contacts without a conversation (or all – show all in new chat)
  const newChatContacts = contacts.filter((c) => c.id !== activeContactId);

  return (
    <aside className={`sidebar${isMobileHidden ? ' mobile-hidden' : ''}`} aria-label="Sidebar">
      {/* Header */}
      <header className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon" aria-hidden="true">
            <MessageCircle size={22} />
          </div>
          <span className="logo-text">ChatVibe</span>
        </div>
        <div className="sidebar-actions">
          <button
            className="icon-btn tooltip"
            data-tip="New Chat"
            onClick={() => setShowNewChat((v) => !v)}
            aria-label="New chat"
            aria-expanded={showNewChat}
            id="new-chat-btn"
          >
            <Plus size={20} />
          </button>
          <button
            className="mute-btn tooltip"
            data-tip={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute notification sounds' : 'Mute notification sounds'}
            id="mute-btn"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button
            className="theme-toggle tooltip"
            data-tip={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            id="theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* User profile */}
      <div className="user-profile">
        <div className="user-avatar-wrap">
          <Avatar contact={MY_PROFILE} />
          <span className="online-dot" aria-hidden="true" />
        </div>
        <div className="user-info">
          <div className="user-name">{MY_PROFILE.name}</div>
          <div className="user-status">{MY_PROFILE.about}</div>
        </div>
      </div>

      {/* New chat dropdown */}
      {showNewChat && (
        <div className="new-chat-modal" role="dialog" aria-label="New chat">
          <div className="new-chat-header">
            <h4>New Chat</h4>
            <button
              className="icon-btn"
              onClick={() => setShowNewChat(false)}
              aria-label="Close new chat"
            >
              <X size={16} />
            </button>
          </div>
          <div className="new-chat-contacts" role="list">
            {newChatContacts.map((c) => (
              <div
                key={c.id}
                className="new-chat-contact"
                role="listitem"
                onClick={() => {
                  onSelectContact(c.id);
                  setShowNewChat(false);
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSelectContact(c.id);
                    setShowNewChat(false);
                  }
                }}
              >
                <Avatar contact={c} />
                <div className="new-chat-contact-info">
                  <div className="new-chat-contact-name">{c.name}</div>
                  <div className="new-chat-contact-phone">{c.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact List */}
      <ContactList
        contacts={contacts}
        conversations={conversations}
        unreadCounts={unreadCounts}
        activeContactId={activeContactId}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onSelectContact={(id) => {
          onSelectContact(id);
          setShowNewChat(false);
        }}
      />
    </aside>
  );
}
