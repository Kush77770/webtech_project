import React from 'react';

const EMOJIS = [
  '😀','😂','😍','🥰','😎','😊','🤗','😜',
  '🥹','😢','😭','😤','😡','🤔','🤯','🥳',
  '👍','👎','👋','🤝','✌️','🙏','💪','🎉',
  '❤️','🧡','💛','💚','💙','💜','🖤','🤍',
  '🔥','⭐','✨','💫','🌈','🎊','🎈','🎁',
  '🍕','🍔','🍜','☕','🍺','🎵','🎮','📱',
  '🚀','✈️','🌍','🏖️','🏋️','💻','📚','🎨',
  '🌸','🌻','🌿','🍀','🦋','🐶','🐱','🦁',
];

export default function EmojiPicker({ onSelect, onClose }) {
  return (
    <div className="emoji-picker-wrap" role="dialog" aria-label="Emoji picker">
      <div className="emoji-panel">
        <div className="emoji-header">
          <h4>Emojis</h4>
        </div>
        <div className="emoji-grid" role="listbox" aria-label="Emoji options">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              className="emoji-btn"
              onClick={() => onSelect(emoji)}
              aria-label={`Insert emoji ${emoji}`}
              role="option"
              type="button"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
