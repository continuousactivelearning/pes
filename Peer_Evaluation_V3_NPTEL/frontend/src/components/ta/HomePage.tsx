import React, { useEffect, useState } from 'react';
import { FiEdit, FiSend, FiUser, FiBookOpen, FiUsers, FiAward } from 'react-icons/fi';

interface FlaggedEvaluation {
  _id: string;
  evaluation: any;
  reason?: string;
}

interface TAProfile {
  name: string;
  email: string;
  taFor: {
    course: { name: string; code: string };
    batch: { _id: string; name: string };
  }[];
}

interface Props {
  flaggedEvaluations: FlaggedEvaluation[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  currentPalette: any;
  getCardStyles: () => any;
  handleUpdateMarks: (id: string) => void;
  handleSendToTeacher: (id: string) => void;
  setActivePage: (page: string) => void;
}

const HomePage: React.FC<Props> = ({
  flaggedEvaluations,
  loading,
  error,
  successMessage,
  currentPalette,
  getCardStyles,
  handleUpdateMarks,
  handleSendToTeacher,
  setActivePage,
}) => {
  const [taProfile, setTAProfile] = useState<TAProfile | null>(null);

  useEffect(() => {
    const fetchTAProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('http://localhost:5000/api/ta/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch TA profile:", await res.text());
          return;
        }

        const data = await res.json();
        setTAProfile(data);
      } catch (err) {
        console.error('Failed to fetch TA profile:', err);
      }
    };

    fetchTAProfile();
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full px-4 sm:px-6 lg:px-8 pt-8 pb-6 overflow-hidden">
      {/* Hero Section with Profile */}
      <div className="w-full max-w-4xl mb-8">
        {taProfile ? (
          <div 
            className="relative overflow-hidden rounded-3xl p-8 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${currentPalette['accent-purple']}15 0%, ${currentPalette['accent-light-purple']}10 100%)`,
              border: `1px solid ${currentPalette['accent-purple']}20`
            }}
          >
            {/* Background Pattern */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 80%, ${currentPalette['accent-purple']} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${currentPalette['accent-light-purple']} 0%, transparent 50%)`
              }}
            />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                  style={{ 
                    backgroundColor: currentPalette['accent-purple'],
                    boxShadow: `0 8px 25px ${currentPalette['accent-purple']}30`
                  }}
                >
                  <FiAward size={28} color="white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1" style={{ color: currentPalette['accent-purple'] }}>
                    Welcome back, {taProfile.name}!
                  </h1>
                  <p className="text-lg" style={{ color: currentPalette['text-muted'] }}>
                    Ready to manage your teaching assignments
                  </p>
                </div>
              </div>

              {/* Courses Grid */}
              {taProfile.taFor.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: currentPalette['text-dark'] }}>
                    <FiBookOpen size={20} style={{ color: currentPalette['accent-purple'] }} />
                    Your Courses
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {taProfile.taFor.map((entry, index) => (
                      <div
                        key={index}
                        className="group relative rounded-2xl p-4 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-2 cursor-pointer"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${currentPalette['accent-purple']}20`,
                          boxShadow: `0 4px 20px ${currentPalette['shadow-light']}`
                        }}
                      >
                        {/* More prominent hover overlay */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${currentPalette['accent-purple']}15 0%, ${currentPalette['accent-light-purple']}10 100%)`
                          }}
                        />
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:rotate-6"
                                style={{ backgroundColor: currentPalette['accent-light-purple'] + '20' }}
                              >
                                <FiBookOpen size={16} style={{ color: currentPalette['accent-purple'] }} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-base transition-all duration-300 group-hover:scale-105" style={{ color: currentPalette['text-dark'] }}>
                                  {entry.course.name}
                                </h4>
                                <div className="flex items-center gap-3 mt-2">
                                  <span 
                                    className="text-sm px-3 py-1 rounded-full font-medium transition-all duration-300 group-hover:scale-110 group-hover:px-4"
                                    style={{ 
                                      backgroundColor: currentPalette['accent-purple'] + '15',
                                      color: currentPalette['accent-purple']
                                    }}
                                  >
                                    {entry.course.code}
                                  </span>
                                  <div className="flex items-center gap-1 transition-all duration-300 group-hover:scale-105">
                                    <FiUsers size={16} style={{ color: currentPalette['text-muted'] }} />
                                    <span className="text-sm font-medium" style={{ color: currentPalette['text-muted'] }}>
                                      {entry.batch.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-4" style={{ color: currentPalette['accent-purple'] }}>
              Welcome to TA Dashboard
            </h1>
          </div>
        )}
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div
          className="border px-4 py-3 rounded-lg mb-4 w-full max-w-4xl text-sm font-medium"
          style={{
            backgroundColor: currentPalette['accent-pink'] + '10',
            borderColor: currentPalette['accent-pink'] + '40',
            color: currentPalette['accent-pink'] + '90'
          }}
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          className="border px-4 py-3 rounded-lg mb-4 w-full max-w-4xl text-sm font-medium"
          style={{
            backgroundColor: currentPalette['accent-light-purple'] + '10',
            borderColor: currentPalette['accent-light-purple'] + '40',
            color: currentPalette['accent-purple'] + '90'
          }}
        >
          {successMessage}
        </div>
      )}

      {/* Flagged Evaluations Section */}
      <div className="w-full max-w-4xl">
        <div className="border rounded-2xl p-6 sm:p-8 shadow-md" style={getCardStyles()}>
          <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: currentPalette['accent-purple'] }}>
            Flagged Evaluations
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2" style={{ borderColor: currentPalette['accent-purple'] }} />
            </div>
          ) : flaggedEvaluations.length === 0 ? (
            <div className="text-center py-8">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: currentPalette['accent-purple'] + '15' }}
              >
                <FiBookOpen size={24} style={{ color: currentPalette['accent-purple'] }} />
              </div>
              <p className="text-base font-medium mb-1" style={{ color: currentPalette['text-dark'] }}>
                No flagged evaluations at the moment
              </p>
              <p className="text-sm" style={{ color: currentPalette['text-muted'] }}>
                Great job keeping things on track!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {flaggedEvaluations.slice(0, 3).map(flag => (
                <div
                  key={flag._id}
                  className="p-5 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: currentPalette['bg-primary'],
                    color: currentPalette['text-dark'],
                    borderColor: currentPalette['accent-purple'] + '10'
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{flag.evaluation.evaluatee.name}</h3>
                      <p className="text-sm mt-1" style={{ color: currentPalette['text-muted'] }}>
                        {flag.reason || 'No reason provided'}
                      </p>
                    </div>
                    <span 
                      className="text-sm px-3 py-1 rounded-full font-medium"
                      style={{ 
                        backgroundColor: currentPalette['accent-pink'] + '15',
                        color: currentPalette['accent-pink'] 
                      }}
                    >
                      {flag.evaluation.exam.title}
                    </span>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => handleUpdateMarks(flag._id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-opacity-80"
                      style={{ 
                        backgroundColor: currentPalette['accent-lilac'] + '15',
                        color: currentPalette['accent-lilac']
                      }}
                    >
                      <FiEdit size={14} /> Update
                    </button>
                    <button
                      onClick={() => handleSendToTeacher(flag._id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-opacity-80"
                      style={{ 
                        backgroundColor: currentPalette['accent-purple'] + '15',
                        color: currentPalette['accent-purple']
                      }}
                    >
                      <FiSend size={14} /> Escalate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {flaggedEvaluations.length > 3 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setActivePage('flagged')}
                className="hover:underline text-base font-medium transition-colors"
                style={{ color: currentPalette['accent-purple'] }}
              >
                View all {flaggedEvaluations.length} flagged evaluations →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;