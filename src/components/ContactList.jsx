import React from 'react';
import { Search, X, Users } from 'lucide-react';
import ContactItem from './ContactItem';

export default function ContactList({
  contacts,
  conversations,
  unreadCounts,
  activeContactId,
  searchQuery,
  onSearch,
  onSelectContact,
}) {
  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLastMsg = (contactId) => {
    const msgs = conversations[contactId];
    if (!msgs || msgs.length === 0) return null;
    return msgs[msgs.length - 1];
  };

  // Sort by last message timestamp (most recent first)
  const sorted = [...filtered].sort((a, b) => {
    const aMsg = getLastMsg(a.id);
    const bMsg = getLastMsg(b.id);
    const aT = aMsg ? aMsg.timestamp : 0;
    const bT = bMsg ? bMsg.timestamp : 0;
    return bT - aT;
  });

  return (
    <>
      <div className="search-bar">
        <div className="search-input-wrap">
          <Search size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search contacts"
            id="contact-search"
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => onSearch('')} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="contact-list" role="list" aria-label="Contact list">
        {sorted.length === 0 ? (
          <div className="contact-list-empty">
            <Users size={40} aria-hidden="true" />
            <p>No contacts found</p>
          </div>
        ) : (
          sorted.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              lastMessage={getLastMsg(contact.id)}
              unreadCount={unreadCounts[contact.id] || 0}
              isActive={activeContactId === contact.id}
              onClick={() => onSelectContact(contact.id)}
            />
          ))
        )}
      </div>
    </>
  );
}
