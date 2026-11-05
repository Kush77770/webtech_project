import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

export default function AttachmentPreview({ file, previewUrl, onRemove }) {
  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="attachment-preview" role="region" aria-label="Image attachment preview">
      {previewUrl ? (
        <img className="attachment-thumb" src={previewUrl} alt="Preview" />
      ) : (
        <ImageIcon size={40} color="var(--icon-color)" />
      )}
      <div className="attachment-info">
        <div className="attachment-name">{file.name}</div>
        <div className="attachment-size">{formatBytes(file.size)}</div>
      </div>
      <button
        className="attachment-remove"
        onClick={onRemove}
        aria-label="Remove attachment"
        id="remove-attachment-btn"
      >
        <X size={18} />
      </button>
    </div>
  );
}
