import React, { useState, useCallback, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import MessageSearch from './MessageSearch';
import ContactInfo from './ContactInfo';
import { getBotResponse, getTypingDelay } from '../data/botResponses';
import { generateId } from '../utils/timeUtils';

export default function ChatWindow({
  contact,
  messages,
  onSendMessage,
  onDeleteMessage,
  onClearChat,
  onBack,
  isMuted,
}) {
  const [isTyping, setIsTyping] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const typingTimerRef = useRef(null);

  // Search results
  const searchResults = searchQuery.trim()
    ? messages
        .map((m, idx) => ({ idx, id: m.id, text: m.text || '' }))
        .filter((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const highlightedId = searchResults[searchIndex]?.id || null;

  const handleSearchNav = (dir) => {
    if (searchResults.length === 0) return;
    setSearchIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return searchResults.length - 1;
      if (next >= searchResults.length) return 0;
      return next;
    });
  };

  const handleSearchQueryChange = (q) => {
    setSearchQuery(q);
    setSearchIndex(0);
  };

  const handleSearchToggle = () => {
    setShowSearch((v) => {
      if (v) {
        setSearchQuery('');
        setSearchIndex(0);
      }
      return !v;
    });
  };

  // Notification sound
  const playNotificationSound = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
    } catch {
      // AudioContext not available
    }
  }, [isMuted]);

  const handleSend = useCallback((payload) => {
    const msgId = generateId();
    const message = {
      id: msgId,
      senderId: 'me',
      timestamp: Date.now(),
      status: 'sent',
      ...payload,
    };
    onSendMessage(message);

    // Simulate bot typing + reply
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setIsTyping(true);

    const delay = getTypingDelay();
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      const botText = getBotResponse(payload.text || 'image');
      const botMsg = {
        id: generateId(),
        senderId: contact.id,
        type: 'text',
        text: botText,
        timestamp: Date.now(),
        status: 'delivered',
      };
      onSendMessage(botMsg);
      playNotificationSound();
    }, delay);
  }, [contact.id, onSendMessage, playNotificationSound]);

  const handleDeleteMessage = useCallback((msgId) => {
    onDeleteMessage(msgId);
  }, [onDeleteMessage]);

  const handleClearChat = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    onClearChat();
    setShowClearConfirm(false);
  };

  return (
    <>
      <div className="chat-window">
        <ChatHeader
          contact={contact}
          isTyping={isTyping}
          showSearch={showSearch}
          showInfo={showInfo}
          onSearchToggle={handleSearchToggle}
          onInfoToggle={() => setShowInfo((v) => !v)}
          onClearChat={handleClearChat}
          onBack={onBack}
        />

        {showSearch && (
          <MessageSearch
            query={searchQuery}
            onQueryChange={handleSearchQueryChange}
            resultCount={searchResults.length}
            currentIndex={searchIndex}
            onPrev={() => handleSearchNav(-1)}
            onNext={() => handleSearchNav(1)}
            onClose={handleSearchToggle}
          />
        )}

        <MessageList
          messages={messages}
          contact={contact}
          isTyping={isTyping}
          searchQuery={searchQuery}
          highlightedId={highlightedId}
          onDeleteMessage={handleDeleteMessage}
          onImageClick={(url) => setLightboxUrl(url)}
        />

        <MessageInput onSend={handleSend} disabled={false} />
      </div>

      {/* Contact Info Panel */}
      {showInfo && (
        <ContactInfo
          contact={contact}
          messages={messages}
          onClose={() => setShowInfo(false)}
          onImageClick={(url) => setLightboxUrl(url)}
        />
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxUrl(null)}
          role="dialog"
          aria-label="Image preview"
          aria-modal="true"
        >
          <button
            className="lightbox-close"
            onClick={() => setLightboxUrl(null)}
            aria-label="Close image preview"
            id="lightbox-close-btn"
          >
            ✕
          </button>
          <img
            className="lightbox-img"
            src={lightboxUrl}
            alt="Full size preview"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Clear Chat Confirm */}
      {showClearConfirm && (
        <div className="confirm-overlay" role="dialog" aria-modal="true" aria-label="Clear chat confirmation">
          <div className="confirm-dialog">
            <h3>Clear Chat</h3>
            <p>Are you sure you want to clear all messages in this conversation? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowClearConfirm(false)} id="cancel-clear-btn">
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmClear} id="confirm-clear-btn">
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
