import React, { useState, useEffect } from 'react';

const EditExamOverlay = ({ isOpen, exam, onClose, onSubmit }) => {
  const formattedDate = exam.date ? new Date(exam.date).toISOString().split('T')[0] : '';
  const [formData, setFormData] = useState({
    name: exam?.name || '',
    date: formattedDate,
    time: exam?.time || '',
    number_of_questions: exam?.number_of_questions || '',
    duration: exam?.duration || '',
    totalMarks: exam?.totalMarks || '',
    k: exam?.k || '',
    total_students: exam?.total_students || 0,
    solutions: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEditExamSubmit = (e) => {
    e.preventDefault();
    const updatedExam = {
      ...exam,
      ...formData,
    };
    onSubmit(updatedExam);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.overlay-content')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (exam) {
      setFormData((prev) => ({
        ...prev,
        total_students: exam.total_students || 0,
      }));
    }
  }, [exam]);

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
        <h2 style={{ color: '#3f3d56', marginBottom: '1rem' }}>Edit Exam</h2>
        <form onSubmit={handleEditExamSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }}>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000', colorScheme: 'auto' }}
              onFocus={(e) => e.target.style.colorScheme = 'light'}
              onBlur={(e) => e.target.style.colorScheme = 'auto'}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }}>Time (24-hour):</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000', colorScheme: 'auto' }}
              onFocus={(e) => e.target.style.colorScheme = 'light'}
              onBlur={(e) => e.target.style.colorScheme = 'auto'}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }}>Number of Questions:</label>
            <input
              type="number"
              name="number_of_questions"
              value={formData.number_of_questions}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }}>Duration (in mins.):</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }}>Total Marks:</label>
            <input
              type="number"
              name="totalMarks"
              value={formData.totalMarks}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }}>No of Peers (K):</label>
            <input
              type="number"
              name="k"
              value={formData.k}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }}>Total Attendees:</label>
            <input
              type="number"
              name="total_students"
              value={formData.total_students}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }}>Solutions:</label>
            <input
              type="file"
              name="solutions"
              onChange={handleChange}
              accept=".pdf"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#4b3c70', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Save
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

export default EditExamOverlay;