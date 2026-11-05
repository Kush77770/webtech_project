import React from 'react';

export default function Avatar({ contact, size = 'md', onClick }) {
  const sizeClass = size === 'lg' ? 'avatar lg' : size === 'xl' ? 'avatar xl' : 'avatar';
  return (
    <div
      className={sizeClass}
      style={{ background: contact.avatarColor }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View profile of ${contact.name}` : undefined}
    >
      {contact.initials}
    </div>
  );
}
