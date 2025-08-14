import React, { useState, useEffect } from 'react';

const EnrollStudentsOverlay = ({ isOpen, onClose, onSubmit, course, batch, closeOnOutsideClick }) => {
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!csvFile) {
      alert('Please upload a CSV file.');
      return;
    }
    if (!course || !batch) {
      alert('Course and batch are required.');
      return;
    }
    onSubmit({ csvFile, course, batch });
  };

  useEffect(() => {
    if (closeOnOutsideClick && isOpen) {
      const handleClickOutside = (event) => {
        if (isOpen && !event.target.closest('.overlay-content')) {
          onClose();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose, closeOnOutsideClick]);

  if (!isOpen) return null;

  return (
    <div className="overlay" style={{
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
    }}>
      <div className="overlay-content" style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        width: '400px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
      }}>
        <h2 style={{ color: '#3f3d56', marginBottom: '1rem' }}>Enroll Students</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }}>Upload CSV:</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
            />
          </div>

          {/* Show course and batch info, not as input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }}>Course:</label>
            <span style={{ color: '#3f3d56' }}>{course.name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }}>Batch:</label>
            <span style={{ color: '#3f3d56' }}>{batch.name}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#4b3c70', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Submit
            </button>
            <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#ccc', color: '#000', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollStudentsOverlay;