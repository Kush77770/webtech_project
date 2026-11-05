import React from 'react';
import Avatar from './Avatar';

export default function TypingIndicator({ contact }) {
  return (
    <div className="typing-indicator" aria-live="polite" aria-label={`${contact.name} is typing`}>
      <Avatar contact={contact} />
      <div className="typing-bubble" aria-hidden="true">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}
