import React, { useState, useMemo } from 'react';
import { X, ArrowLeft, Phone, Info, Image as ImageIcon } from 'lucide-react';
import Avatar from './Avatar';

export default function ContactInfo({ contact, messages, onClose, onImageClick }) {
  const sharedImages = useMemo(
    () => messages.filter((m) => m.type === 'image'),
    [messages]
  );

  return (
    <aside className="contact-info-panel" aria-label="Contact information panel">
      <header className="info-panel-header">
        <button className="icon-btn" onClick={onClose} aria-label="Close contact info" id="close-info-btn">
          <X size={20} />
        </button>
        <h3>Contact Info</h3>
      </header>

      <div className="info-panel-body">
        {/* Profile */}
        <div className="info-profile">
          <div className="info-avatar-wrap">
            <Avatar contact={contact} size="xl" />
            <span className={`online-dot${contact.online ? '' : ' offline'}`} aria-hidden="true" />
          </div>
          <div className="info-name">{contact.name}</div>
          <div className="info-status-badge">
            <span className={`online-dot${contact.online ? '' : ' offline'}`} style={{ position: 'static', border: 'none', width: 8, height: 8 }} />
            {contact.online ? 'Online' : `Last seen ${contact.lastSeen || 'recently'}`}
          </div>
        </div>

        {/* About */}
        <div className="info-section">
          <div className="info-section-title">About</div>
          <div className="info-row">
            <Info size={18} className="info-row-icon" aria-hidden="true" />
            <div className="info-row-content">
              <div className="info-row-label">Status</div>
              <div className="info-row-value">{contact.about}</div>
            </div>
          </div>
          <div className="info-row">
            <Phone size={18} className="info-row-icon" aria-hidden="true" />
            <div className="info-row-content">
              <div className="info-row-label">Phone</div>
              <div className="info-row-value">{contact.phone}</div>
            </div>
          </div>
        </div>

        {/* Shared Media */}
        <div className="info-section">
          <div className="info-section-title">Shared Media</div>
          {sharedImages.length === 0 ? (
            <div className="info-no-media">
              <ImageIcon size={32} color="var(--text-muted)" />
              <span>No shared media yet</span>
            </div>
          ) : (
            <>
              <div className="info-media-grid">
                {sharedImages.slice(0, 6).map((msg) => (
                  <div
                    key={msg.id}
                    className="info-media-item"
                    onClick={() => onImageClick(msg.imageUrl)}
                    role="button"
                    tabIndex={0}
                    aria-label="View shared image"
                    onKeyDown={(e) => e.key === 'Enter' && onImageClick(msg.imageUrl)}
                  >
                    <img src={msg.imageUrl} alt="Shared media" loading="lazy" />
                  </div>
                ))}
              </div>
              <div className="info-media-count">
                {sharedImages.length} photo{sharedImages.length !== 1 ? 's' : ''} shared
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
