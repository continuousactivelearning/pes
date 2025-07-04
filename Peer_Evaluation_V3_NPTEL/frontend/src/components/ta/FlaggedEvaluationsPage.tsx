import React from 'react';
import { FiDownload, FiEdit, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface FlaggedEvaluation {
  _id: string;
  evaluation: any;
  flaggedBy: any;
  reason?: string;
  resolutionStatus: 'pending' | 'resolved' | 'escalated';
}

interface Props {
  flaggedEvaluations: FlaggedEvaluation[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  currentPalette: any;
  commonCardClasses: string;
  getCardStyles: () => any;
  handleDownloadTranscript: (id: string) => void;
  handleUpdateMarks: (id: string) => void;
  handleSendToTeacher: (id: string) => void;
}

const FlaggedEvaluationsPage: React.FC<Props> = ({
  flaggedEvaluations,
  loading,
  error,
  successMessage,
  currentPalette,
  commonCardClasses,
  getCardStyles,
  handleDownloadTranscript,
  handleUpdateMarks,
  handleSendToTeacher,
}) => (
  <div className="flex flex-col items-center justify-start w-full h-full pt-10 pb-4">
    <h2 className="text-3xl font-bold text-center mb-8" style={{ color: currentPalette['accent-purple'] }}>Flagged Evaluations</h2>
    {error && (
      <div className="border px-4 py-3 rounded-lg mb-4 w-full max-w-4xl"
        style={{ backgroundColor: currentPalette['accent-pink'] + '10', borderColor: currentPalette['accent-pink'] + '40', color: currentPalette['accent-pink'] + '90' }}>{error}</div>
    )}
    {successMessage && (
      <div className="border px-4 py-3 rounded-lg mb-4 w-full max-w-4xl"
        style={{ backgroundColor: currentPalette['accent-light-purple'] + '10', borderColor: currentPalette['accent-light-purple'] + '40', color: currentPalette['accent-purple'] + '90' }}>{successMessage}</div>
    )}
    <div className="w-full max-w-4xl">
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: currentPalette['accent-purple'] }}></div>
        </div>
      ) : flaggedEvaluations.length === 0 ? (
        <p className="text-center" style={{ color: currentPalette['text-muted'] }}>No flagged evaluations at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {flaggedEvaluations.map(flag => (
            <li key={flag._id} className={`${commonCardClasses}`} style={getCardStyles()}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p style={{ color: currentPalette['text-muted'] }}>Student:</p>
                  <p className="font-semibold" style={{ color: currentPalette['text-dark'] }}>{flag.evaluation.evaluatee.name}</p>
                  <p className="text-sm" style={{ color: currentPalette['text-muted'] }}>{flag.evaluation.evaluatee.email}</p>
                </div>
                <div>
                  <p style={{ color: currentPalette['text-muted'] }}>Evaluator:</p>
                  <p className="font-semibold" style={{ color: currentPalette['text-dark'] }}>{flag.evaluation.evaluator.name}</p>
                  <p className="text-sm" style={{ color: currentPalette['text-muted'] }}>{flag.evaluation.evaluator.email}</p>
                </div>
                <div>
                  <p style={{ color: currentPalette['text-muted'] }}>Course:</p>
                  <p className="font-semibold" style={{ color: currentPalette['text-dark'] }}>{flag.evaluation.exam.course?.name || 'N/A'}</p>
                  <p className="text-sm" style={{ color: currentPalette['text-muted'] }}>
                    Code: {flag.evaluation.exam.course?.code || 'N/A'}
                  </p>
                </div>
                <div>
                  <p style={{ color: currentPalette['text-muted'] }}>Exam:</p>
                  <p className="font-semibold" style={{ color: currentPalette['text-dark'] }}>{flag.evaluation.exam.title}</p>
                  <p className="text-sm" style={{ color: currentPalette['text-muted'] }}>
                    Questions: {flag.evaluation.exam.numQuestions || 'N/A'}
                  </p>
                  {flag.evaluation.exam.startTime && (
                    <p className="text-sm" style={{ color: currentPalette['text-muted'] }}>
                      Start: {new Date(flag.evaluation.exam.startTime).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div>
                  <p style={{ color: currentPalette['text-muted'] }}>Current Marks:</p>
                  <div className="mt-1 grid grid-cols-5 gap-1">
                    {flag.evaluation.marks.map((mark: number, idx: number) => (
                      <div key={idx} className="rounded-lg p-2 text-center" style={{ backgroundColor: currentPalette['bg-primary'], color: currentPalette['text-dark'] }}>
                        <div className="text-xs" style={{ color: currentPalette['text-muted'] }}>Q{idx+1}</div>
                        <div className="font-semibold">{mark}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right font-semibold" style={{ color: currentPalette['text-dark'] }}>
                    Total: {Math.round(flag.evaluation.marks.reduce((sum: number, mark: number) => sum + mark, 0))}
                    /{flag.evaluation.marks.length * 20}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p style={{ color: currentPalette['text-muted'] }}>Flag Reason:</p>
                <p className="italic p-3 rounded-lg mt-1" style={{ backgroundColor: currentPalette['accent-pink'] + '10', color: currentPalette['text-dark'] }}>{flag.reason || "No reason provided"}</p>
              </div>
              {flag.evaluation.feedback && (
                <div className="mt-4">
                  <p style={{ color: currentPalette['text-muted'] }}>Feedback:</p>
                  <p className="italic p-3 rounded-lg mt-1" style={{ backgroundColor: currentPalette['accent-light-purple'] + '10', color: currentPalette['text-dark'] }}>{flag.evaluation.feedback}</p>
                </div>
              )}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => handleDownloadTranscript(flag.evaluation._id)}
                  className="flex items-center gap-2 hover:underline"
                  style={{ color: currentPalette['accent-lilac'] }}
                >
                  <FiDownload /> Download Submission
                </button>
                <button
                  onClick={() => handleUpdateMarks(flag._id)}
                  className="flex items-center gap-2 hover:underline"
                  style={{ color: currentPalette['accent-purple'] }}
                >
                  <FiEdit /> Update Marks
                </button>
                <button
                  onClick={() => handleSendToTeacher(flag._id)}
                  className="flex items-center gap-2 hover:underline"
                  style={{ color: currentPalette['accent-pink'] }}
                >
                  <FiSend /> Send to Teacher
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default FlaggedEvaluationsPage;
