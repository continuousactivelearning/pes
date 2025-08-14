import React, { useState } from 'react';

const BulkUploadOverlay = ({ examId, onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = () => {
    if (selectedFiles.length) {
      onUpload(selectedFiles);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'overlay') {
      onClose();
    }
  };

  return (
    <div
      className="overlay"
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="modal"
        style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          width: '400px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          position: 'relative',
        }}
      >
        <div className="modal-header" style={{ marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#3f3d56' }}>
            Bulk Upload
          </h2>
        </div>

        <div className="modal-body" style={{ marginBottom: '1.5rem' }}>
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileChange}
            style={{
              display: 'block',
              marginBottom: '1rem',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '100%',
            }}
          />
          {selectedFiles.length > 0 && (
            <ul style={{ marginTop: 10, paddingLeft: '1rem' }}>
              {selectedFiles.map((file, i) => (
                <li key={i} style={{ fontSize: '0.9rem', color: '#555' }}>
                  {file.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!selectedFiles.length}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: ' #4b3c70',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedFiles.length ? 'pointer' : 'not-allowed',
              marginRight: '0.5rem',
            }}
          >
            Upload
          </button>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: ' #585a5c', 
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadOverlay;