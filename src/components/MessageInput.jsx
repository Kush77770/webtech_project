import React, { useRef, useState, useEffect } from 'react';
import { Smile, Paperclip, Send, X } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import AttachmentPreview from './AttachmentPreview';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState(null); // { file, previewUrl }
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiWrapRef = useRef(null);

  // Auto resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }, [text]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiWrapRef.current && !emojiWrapRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    if (showEmoji) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmoji]);

  // Cleanup object URL on unmount or attachment change
  useEffect(() => {
    return () => {
      if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    };
  }, [attachment]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && !attachment) return;

    if (attachment) {
      onSend({ type: 'image', imageUrl: attachment.previewUrl, text: trimmed || null });
      // Don't revoke here – parent will display it; revoke handled by parent lifecycle
      setAttachment(null);
    } else {
      onSend({ type: 'text', text: trimmed });
    }
    setText('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji) => {
    const ta = textareaRef.current;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newText = text.slice(0, start) + emoji + text.slice(end);
    setText(newText);
    // Restore cursor position after emoji insert
    setTimeout(() => {
      ta.selectionStart = ta.selectionEnd = start + emoji.length;
      ta.focus();
    }, 0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Only JPG, PNG, and WEBP images are supported.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be under 10 MB.');
      return;
    }
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    const previewUrl = URL.createObjectURL(file);
    setAttachment({ file, previewUrl });
    e.target.value = ''; // reset input
  };

  const handleRemoveAttachment = () => {
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    setAttachment(null);
  };

  const canSend = text.trim().length > 0 || attachment !== null;

  return (
    <div className="message-input-area">
      {/* Attachment preview */}
      {attachment && (
        <AttachmentPreview
          file={attachment.file}
          previewUrl={attachment.previewUrl}
          onRemove={handleRemoveAttachment}
        />
      )}

      {/* Emoji picker */}
      {showEmoji && (
        <div ref={emojiWrapRef} className="emoji-picker-wrap">
          <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />
        </div>
      )}

      <div className="input-row">
        <div className="input-wrap">
          <div className="input-actions">
            <button
              className={`icon-btn${showEmoji ? ' active' : ''}`}
              onClick={() => setShowEmoji((v) => !v)}
              aria-label="Open emoji picker"
              id="emoji-picker-btn"
              type="button"
            >
              <Smile size={22} />
            </button>
            <button
              className="icon-btn"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach image"
              id="attach-image-btn"
              type="button"
            >
              <Paperclip size={22} />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            className="msg-textarea"
            placeholder="Type a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={disabled}
            aria-label="Message input"
            id="message-input"
          />
        </div>

        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!canSend || disabled}
          aria-label="Send message"
          id="send-btn"
          type="button"
        >
          <Send size={20} />
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
}
