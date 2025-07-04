import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiXCircle, FiUsers, FiClipboard } from 'react-icons/fi';
import type { CSSProperties } from 'react';

type Palette = {
  [key: string]: string;
};

interface Enrollment {
  _id: string;
  studentId: { name: string; email: string };
  courseId: { name: string; code: string };
  batchId: { _id: string; name: string };
  notes?: string;
}

interface CourseBatch {
  course: { name: string; code: string };
  batch: { _id: string; name: string };
}

interface Props {
  currentPalette: Palette;
  getCardStyles: () => CSSProperties;
  getButtonStyles: (colorKey: string, textColorKey?: string) => CSSProperties;
}

const ManageEnrollments: React.FC<Props> = ({ currentPalette, getCardStyles, getButtonStyles }) => {
  const [taFor, setTaFor] = useState<CourseBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/ta/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setTaFor(res.data.taFor))
      .catch(err => console.error('Error loading TA profile:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/ta/enrollments/pending', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setEnrollments(res.data))
      .catch(err => console.error('Error loading enrollments:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = (id: string, action: 'accept' | 'reject') => {
    axios.post(`http://localhost:5000/api/ta/enrollments/respond/${id}`, { action }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(() => setEnrollments(e => e.filter(en => en._id !== id)))
      .catch(err => console.error(`Failed to ${action}:`, err));
  };

  const filtered = selectedBatchId ? enrollments.filter(e => e.batchId._id === selectedBatchId) : enrollments;

  return (
    <div className="w-full py-6 px-4 flex flex-col items-center">
      <div style={getCardStyles()} className="w-full max-w-4xl p-6 rounded-2xl mb-6">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: currentPalette['accent-purple'] }}>
          Manage Enrollment Requests
        </h2>
        <div className="flex items-center gap-3 mb-4">
          <FiClipboard size={20} style={{ color: currentPalette['text-muted'] }} />
          <select
            className="p-2 rounded-md shadow-sm"
            value={selectedBatchId}
            onChange={e => setSelectedBatchId(e.target.value)}
          >
            <option value="">All Batches</option>
            {taFor.map((t, i) => (
              <option key={i} value={t.batch._id}>
                {t.course.name} – {t.batch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-10">
          <div
            className="animate-spin h-10 w-10 rounded-full border-2 border-b-2"
            style={{ borderColor: currentPalette['accent-purple'] }}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div style={getCardStyles()} className="w-full max-w-4xl p-6 rounded-2xl text-center">
          <FiUsers size={48} style={{ color: currentPalette['accent-purple'] + '30' }} />
          <p className="mt-4" style={{ color: currentPalette['text-muted'] }}>No pending enrollment requests.</p>
        </div>
      ) : (
        <div className="space-y-4 w-full max-w-4xl">
          {filtered.map((e) => (
            <div key={e._id} style={getCardStyles()} className="p-5 rounded-2xl flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <p><strong>Student:</strong> {e.studentId.name} ({e.studentId.email})</p>
                  <p><strong>Course:</strong> {e.courseId.name} ({e.courseId.code})</p>
                  <p><strong>Batch:</strong> {e.batchId.name}</p>
                  {e.notes && <p><strong>Notes:</strong> {e.notes}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    style={getButtonStyles('accent-purple', 'white')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                    onClick={() => handleAction(e._id, 'accept')}
                  >
                    <FiCheckCircle /> Accept
                  </button>
                  <button
                    style={getButtonStyles('accent-pink', 'white')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                    onClick={() => handleAction(e._id, 'reject')}
                  >
                    <FiXCircle /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEnrollments;
