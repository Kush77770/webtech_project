import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initialContacts, initialConversations } from './data/initialContacts';
import './styles/global.css';
import './styles/sidebar.css';
import './styles/chat.css';
import './styles/components.css';

const STORAGE_KEYS = {
  contacts: 'chatvibe_contacts',
  conversations: 'chatvibe_conversations',
  unread: 'chatvibe_unread',
  theme: 'chatvibe_theme',
  muted: 'chatvibe_muted',
  initialized: 'chatvibe_initialized',
};

// Compute unread counts from conversations
function computeUnreadCounts(conversations) {
  const counts = {};
  Object.entries(conversations).forEach(([contactId, msgs]) => {
    counts[contactId] = msgs.filter((m) => m.senderId !== 'me' && m.status === 'unread').length;
  });
  return counts;
}

export default function App() {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.theme, 'light');
  const [isMuted, setIsMuted] = useLocalStorage(STORAGE_KEYS.muted, false);
  const [contacts, setContacts] = useLocalStorage(STORAGE_KEYS.contacts, null);
  const [conversations, setConversations] = useLocalStorage(STORAGE_KEYS.conversations, null);
  const [activeContactId, setActiveContactId] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data on first launch
  useEffect(() => {
    const initialized = localStorage.getItem(STORAGE_KEYS.initialized);
    if (!initialized) {
      setContacts(initialContacts);
      setConversations(initialConversations);
      localStorage.setItem(STORAGE_KEYS.initialized, 'true');
    } else {
      if (!contacts) setContacts(initialContacts);
      if (!conversations) setConversations(initialConversations);
    }
    setTimeout(() => setIsLoading(false), 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle responsive
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const unreadCounts = computeUnreadCounts(conversations || {});

  const handleSelectContact = useCallback((contactId) => {
    setActiveContactId(contactId);
    if (isMobileView) setShowChatMobile(true);

    // Mark messages as read
    setConversations((prev) => {
      if (!prev) return prev;
      const msgs = prev[contactId];
      if (!msgs) return prev;
      const updated = msgs.map((m) =>
        m.senderId !== 'me' && m.status === 'unread' ? { ...m, status: 'read' } : m
      );
      return { ...prev, [contactId]: updated };
    });
  }, [isMobileView, setConversations]);

  const handleSendMessage = useCallback((contactId, message) => {
    setConversations((prev) => {
      const existing = prev?.[contactId] || [];
      return { ...(prev || {}), [contactId]: [...existing, message] };
    });
    // Update sent message status to 'delivered' after a short delay
    if (message.senderId === 'me') {
      setTimeout(() => {
        setConversations((prev) => {
          if (!prev) return prev;
          const msgs = prev[contactId];
          if (!msgs) return prev;
          const updated = msgs.map((m) =>
            m.id === message.id ? { ...m, status: 'delivered' } : m
          );
          return { ...prev, [contactId]: updated };
        });
      }, 800);
      // Mark as read after 2s
      setTimeout(() => {
        setConversations((prev) => {
          if (!prev) return prev;
          const msgs = prev[contactId];
          if (!msgs) return prev;
          const updated = msgs.map((m) =>
            m.id === message.id ? { ...m, status: 'read' } : m
          );
          return { ...prev, [contactId]: updated };
        });
      }, 2500);
    }
  }, [setConversations]);

  const handleDeleteMessage = useCallback((contactId, msgId) => {
    setConversations((prev) => {
      if (!prev) return prev;
      const msgs = prev[contactId];
      if (!msgs) return prev;
      return { ...prev, [contactId]: msgs.filter((m) => m.id !== msgId) };
    });
  }, [setConversations]);

  const handleClearChat = useCallback((contactId) => {
    setConversations((prev) => ({ ...(prev || {}), [contactId]: [] }));
  }, [setConversations]);

  const handleBack = () => {
    setShowChatMobile(false);
    setActiveContactId(null);
  };

  const activeContact = contacts?.find((c) => c.id === activeContactId) || null;
  const activeMessages = (conversations || {})[activeContactId] || [];

  if (isLoading) {
    return (
      <div className="loading-overlay" aria-label="Loading ChatVibe">
        <div className="loading-logo">
          <div className="loading-icon">
            <MessageCircle size={40} />
          </div>
          <h2>ChatVibe</h2>
          <div className="loading-dots" aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar
        contacts={contacts || []}
        conversations={conversations || {}}
        unreadCounts={unreadCounts}
        activeContactId={activeContactId}
        theme={theme}
        isMuted={isMuted}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onToggleMute={() => setIsMuted((m) => !m)}
        onSelectContact={handleSelectContact}
        isMobileHidden={isMobileView && showChatMobile}
      />

      {/* Chat Window or Empty State */}
      {activeContact ? (
        <ChatWindow
          contact={activeContact}
          messages={activeMessages}
          onSendMessage={(msg) => handleSendMessage(activeContactId, msg)}
          onDeleteMessage={(msgId) => handleDeleteMessage(activeContactId, msgId)}
          onClearChat={() => handleClearChat(activeContactId)}
          onBack={handleBack}
          isMuted={isMuted}
        />
      ) : (
        <div className={`empty-state${isMobileView && showChatMobile ? '' : ''}`} aria-label="Welcome screen">
          <div className="empty-content">
            <div className="empty-icon-wrap">
              <MessageCircle size={60} aria-hidden="true" />
            </div>
            <h2>Welcome to ChatVibe</h2>
            <p>
              Select a conversation from the left to start chatting.
              Your messages are stored locally in your browser.
            </p>
            <div className="empty-badge">
              <span>🔒</span>
              <span>End-to-end simulated · Stored locally</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
