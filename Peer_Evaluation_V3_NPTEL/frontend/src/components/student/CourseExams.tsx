// frontend/src/components/student/CourseExams.tsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';

const PORT = import.meta.env.VITE_BACKEND_PORT || 5000;

type Exam = {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  batch: { name: string };
  questions: {
    questionText: string;
    maxMarks: number;
  }[];
};

type Props = {
  courseId: string;
  onBack: () => void;
};

const fetchExams = async (courseId: string): Promise<Exam[]> => {
  const { data } = await axios.get(
    `http://localhost:${PORT}/api/student/courses/${courseId}/exams`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }
  );
  return data.exams;
};

const formatIST = (utcDate: string) =>
  new Date(utcDate).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

const getCountdown = (target: string) => {
  const now = new Date();
  const diff = new Date(target).getTime() - now.getTime();
  if (diff <= 0) return null;

  const totalSecs = Math.floor(diff / 1000);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const CourseExams = ({ courseId, onBack }: Props) => {
  const { data: exams, isLoading, error } = useQuery({
    queryKey: ['courseExams', courseId],
    queryFn: () => fetchExams(courseId),
  });

  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [viewingExam, setViewingExam] = useState<Exam | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = (examId: string) => {
    setActiveExamId(examId);
    setUploadMsg(null);
    setSelectedFile(null);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (examId: string) => {
    if (!selectedFile) {
      setUploadMsg('Please select a PDF file.');
      return;
    }
    setUploadMsg('Uploading...');
    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      formData.append('examId', examId);
      await axios.post(
        `http://localhost:${PORT}/api/student/submit-answer`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUploadMsg('Submission successful!');
      setActiveExamId(null);
      setSelectedFile(null);
    } catch (err: any) {
      setUploadMsg(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Submission failed.'
      );
    }
  };

  const handleViewExam = async (exam: Exam) => {
    setViewingExam(exam);
    setPdfUrl(null);
    // Collapse the navbar if present
    const collapseBtn = document.querySelector('button:has(svg.text-2xl)') as HTMLButtonElement;
    if (collapseBtn) collapseBtn.click();
    try {
      const res = await axios.get(`http://localhost:${PORT}/api/student/question-paper/${exam._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });
      const blobUrl = URL.createObjectURL(res.data);
      setPdfUrl(blobUrl);
    } catch {
      setPdfUrl(null);
    }
  };

  const handleCloseModal = () => {
    setViewingExam(null);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    // Open the navbar if it was collapsed
    const collapseBtn = document.querySelector('button:has(svg.text-2xl)') as HTMLButtonElement;
    if (collapseBtn) collapseBtn.click();
  };

  if (isLoading) return <div className="text-center p-4 text-gray-700">Loading exams...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Failed to load exams.</div>;

  return (
    <div className="grid grid-cols-fill-minmax-300 gap-8 relative z-10 sm:grid-cols-1 sm:gap-5">
      <button
        className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow mb-4 w-fit"
        onClick={onBack}
      >
        ← Back to Courses
      </button>

      {exams && exams.map((exam) => {
        const isStarted = new Date(exam.startTime) <= now;
        const isEnded = new Date(exam.endTime) < now;
        const canSubmit = isStarted && !isEnded;
        const countdownText = !isStarted
          ? `Starts in ${getCountdown(exam.startTime)}`
          : !isEnded
            ? `Ends in ${getCountdown(exam.endTime)}`
            : null;

        return (
          <div
            key={exam._id}
            className="bg-white rounded-2xl p-6 shadow hover:shadow-xl border border-gray-200 transition-all relative"
          >
            <h3 className="text-xl font-bold mb-2 text-gray-800">{exam.title}</h3>
            <p className="text-sm text-gray-600 mb-1">Batch: {exam.batch?.name}</p>
            <p className="text-sm text-gray-600 mb-2">
              ⏰ {formatIST(exam.startTime)} → {formatIST(exam.endTime)}
            </p>
            {countdownText && (
              <p className="text-xs italic text-indigo-600 mb-3">{countdownText}</p>
            )}

            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm mr-2 hover:bg-indigo-700 transition"
              onClick={() => handleViewExam(exam)}
              disabled={!isStarted}
            >
              {isStarted ? "View Questions" : "Locked"}
            </button>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-green-700 transition"
              onClick={() => handleButtonClick(exam._id)}
              disabled={!canSubmit}
            >
              {isEnded ? "Closed" : isStarted ? "Submit Answers" : "Not Started"}
            </button>

            {activeExamId === exam._id && canSubmit && (
              <div className="mt-3 space-y-2">
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-900 transition"
                  onClick={() => handleSubmit(exam._id)}
                >
                  {selectedFile ? "Upload PDF" : "Choose PDF"}
                </button>
                {selectedFile && (
                  <span className="text-xs text-gray-500 ml-2">{selectedFile.name}</span>
                )}
                {uploadMsg && (
                  <div className="text-sm text-gray-700 mt-1">{uploadMsg}</div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {viewingExam && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-white/30 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-[90vw] h-[90vh] p-6 flex flex-col overflow-auto relative">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">
              {viewingExam.title} – Questions
            </h3>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="Question Paper PDF"
                className="w-full h-full rounded-lg shadow-md border border-gray-300"
              />
            ) : (
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {viewingExam.questions.map((q, idx) => (
                  <li key={idx} className="mb-2">
                    {q.questionText} <em className="text-gray-500">({q.maxMarks} marks)</em>
                  </li>
                ))}
              </ol>
            )}
            <button
              className="absolute top-4 right-4 text-sm text-gray-600 hover:text-red-600"
              onClick={handleCloseModal}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseExams;
