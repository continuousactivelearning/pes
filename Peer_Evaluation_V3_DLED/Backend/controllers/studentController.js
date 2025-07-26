import { User } from '../models/User.js';
import { Enrollment } from '../models/Enrollment.js';
import { Examination } from '../models/Examination.js';
import { Document } from '../models/Document.js';
import { Batch } from '../models/Batch.js';
import { Course } from '../models/Course.js';
import { UIDMap } from '../models/UIDMap.js';
import { PeerEvaluation } from '../models/PeerEvaluation.js';
import { TA } from '../models/TA.js';
import { Ticket } from '../models/Ticket.js';
import fs from 'fs';

export const getStudentDashboardStats = async (req, res) => {
//   console.log('Fetching student dashboard stats for user:', req.user._id);
  try {
    const studentId = req.user._id;

    const coursesEnrolled = await Enrollment.countDocuments({ student: studentId , status: 'active' });

    const evaluations = await PeerEvaluation.find({
      evaluator: studentId,
      eval_status: 'pending'
    }).populate('exam', 'flags');

    const pendingEvaluations = evaluations.filter(evaluation =>  evaluation.exam && evaluation.exam.flags === false).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Get all not-completed exams for today
    const todaysExams = await Examination.find({
      completed: false,
      date: { $gte: today, $lt: tomorrow }
    });

    let activeExams = 0;
    const now = new Date();

    todaysExams.forEach(exam => {
      // exam.time is "HH:MM"
      const [startHour, startMinute] = exam.time.split(':').map(Number);
      const examStart = new Date(exam.date);
      examStart.setHours(startHour, startMinute, 0, 0);

      const examEnd = new Date(examStart.getTime() + exam.duration * 60000);

      if (now >= examStart && now < examEnd) {
        activeExams += 1;
      }
    });

    res.json({
      coursesEnrolled,
      pendingEvaluations,
      activeExams
    });
  } catch (error) {
    console.error('Error fetching student dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

export const getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({ student: studentId, status: 'active' })
      .populate({
        path: 'course',
        select: 'courseName'
      })
      .populate({
        path: 'batch',
        select: 'batchId'
      });

    // Format the response
    const result = enrollments.map(enrollment => ({
      courseName: enrollment.course?.courseName || 'Unknown Course',
      batchName: enrollment.batch?.batchId || 'Unknown Batch'
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
};

export const getAvailableCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    console.error('Error fetching available courses:', error);
    res.status(500).json({ message: 'Failed to fetch available courses' });
  }
};

export const getBatchesForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const batches = await Batch.find({ course: courseId });
    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches for course:', error);
    res.status(500).json({ message: 'Failed to fetch batches for course' });
  }
};

export const requestEnrollment = async (req, res) => {
  try {
    const { courseId, batchId } = req.body;
    const studentId = req.user._id;

    const existingTA = await TA.findOne({
      batch: batchId,
      userId: studentId
    });

    if (existingTA) {
      return res.status(400).json({ message: 'You are already a TA for this batch and cannot enroll as a student!' });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      batch: batchId,
      course: courseId,
      status: { $in: ['pending', 'active', 'dropped'] }
    });

    if (existingEnrollment && existingEnrollment.status === 'active') {
      return res.status(400).json({ message: 'Already enrolled in this batch!' });
    }
    else if (existingEnrollment && existingEnrollment.status === 'pending') {
      return res.status(400).json({ message: 'You have a pending enrollment request for this batch!' });
    }
    else if (existingEnrollment && existingEnrollment.status === 'dropped') {
      return res.status(400).json({ message: 'You have been dropped from this batch!' });
    }

    const newEnrollment = new Enrollment({
      student: studentId,
      course: courseId,
      batch: batchId,
      status: 'pending'
    });

    await newEnrollment.save();
    res.status(200).json({ message: 'Enrollment request submitted successfully!' });
  } catch (error) {
    console.error('Error requesting enrollment:', error);
    res.status(500).json({ message: 'Failed to request enrollment!' });
  }
};

export const getEnrolledBatches = async (req, res) => {
  try {
    const studentId = req.user._id;
    const enrollments = await Enrollment.find({ student: studentId, status: 'active' })
      .populate('batch')
      .populate('course');
    const result = enrollments.map(e => ({
      _id: e.batch._id,
      batchId: e.batch.batchId,
      courseName: e.course.courseName,
      courseId: e.course._id,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch batches' });
  }
};

export const getAllExamsForStudent = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { batchId } = req.query;
    let batchFilter = {};
    if (batchId) batchFilter = { batch: batchId };
    const enrollments = await Enrollment.find({ student: studentId, status: 'active' });
    const batchIds = enrollments.map(e => e.batch);
    const filter = batchId ? { batch: batchId } : { batch: { $in: batchIds } };
    filter.completed = false;
    const exams = await Examination.find(filter);
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
};

export const getCompletedExams = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({ 
      student: studentId, 
      status: 'active' 
    }).populate('batch');

    if (!enrollments.length) {
      return res.status(200).json([]);
    }

    const batchIds = enrollments.map(enrollment => enrollment.batch._id);

    const completedExams = await Examination.find({
      batch: { $in: batchIds },
      completed: true
    })
    .populate({
      path: 'batch',
      populate: {
        path: 'course',
        select: 'courseName'
      }
    })
    .sort({ date: -1 });

    res.status(200).json(completedExams);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch completed exams' });
  }
};

export const uploadExamDocument = async (req, res) => {
  let messages = '';
  try {
    const { examId } = req.body;
    const studentId = req.user._id;
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file found for Upload!' });

    // Find the uniqueId from UIDMap
    let uidMap = await UIDMap.findOne({ userId: studentId, examId });
    if (!uidMap) {
      // const uniqueId = await extractUserIdFromQR(file.path);
      // if (!uniqueId) {
      //   uniqueId = studentId;
      // }
      uidMap = await UIDMap.create({ uniqueId: studentId, userId: studentId, examId });
    }

    const existingDoc = await Document.findOne({
      uniqueId: uidMap.uniqueId,
      examId: examId
    });

    if (existingDoc && existingDoc.uploadedBy.toString() === studentId.toString()) {
      if (existingDoc.documentPath && fs.existsSync(existingDoc.documentPath)) {
        try {
          fs.unlinkSync(existingDoc.documentPath);
        } catch (err) {
          console.warn('Failed to delete old document file:', err);
        }
      }
      existingDoc.documentPath = file.path;
      existingDoc.uploadedBy = studentId;
      existingDoc.uploadedOn = new Date();
      await existingDoc.save();
      return res.status(200).json({ message: 'Existing document updated successfully!' });
    }
    else if (existingDoc && existingDoc.uploadedBy.toString() !== studentId.toString()) {
      const uploadedByUser = await User.findById(existingDoc.uploadedBy);
      if (uploadedByUser && uploadedByUser.role === 'teacher') {
        messages = `Teacher ${uploadedByUser.name} has already uploaded a document for this exam.`;
      }
      else {
        messages = `${uploadedByUser.name} has already uploaded a document for you for this exam.`;
      }
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.warn('Failed to delete new document file:', err);
      }
      return res.status(409).json({ message: messages });
    }
    else {
      await Document.create({
        uniqueId: uidMap.uniqueId,
        examId,
        documentPath: file.path,
        uploadedBy: studentId,
        uploadedOn: new Date(),
      });
      // await newDoc.save();
    }
    res.status(200).json({ message: 'File uploaded successfully!' });
  } catch (err) {
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.warn('Failed to delete new document file:', err);
    }
    res.status(500).json({ message: 'Failed to upload document!' });
  }
};

export const getEvaluationsByBatchAndExam = async (req, res) => {
  try {
    const { examId } = req.query;
    const studentId = req.user._id;

    const query = { evaluator: studentId };
    if (examId) query.exam = examId;

    const evaluations = await PeerEvaluation.find(query)
      .populate({
        path: 'exam',
        match: { flags: false }
      })//, 'name date time duration totalMarks batch') // Include batch in exam population
      .populate('document')//, 'uniqueId documentPath uploadedOn');

    const batchCourseMap = {};

    for (const evaluation of evaluations) {
      const exam = evaluation.exam;
      if (exam && exam.batch && !batchCourseMap[exam._id]) {
        const batch = await Batch.findOne({ _id: exam.batch }).populate('course', 'courseName');
        if (batch) {
          batchCourseMap[exam._id] = {
            batchId: batch.batchId,
            courseName: batch.course ? batch.course.courseName : 'Unknown Course',
          };
        }
      }
    }

    const formattedEvaluations = evaluations.map(evaluation => {
      const exam = evaluation.exam;
      const document = evaluation.document;

      return {
        evaluationId: evaluation._id,
        examId: exam._id,
        examName: exam.name,
        examDate: exam.date,
        examTime: exam.time,
        examDuration: exam.duration,
        examTotalMarks: exam.totalMarks,
        exam_number_of_Questions: exam.number_of_questions,
        exam_solutions: exam.solutions,
        batchId: batchCourseMap[exam._id]?.batchId,
        courseName: batchCourseMap[exam._id]?.courseName,
        documentId: document._id,
        documentUniqueId: document.uniqueId,
        documentPath: document.documentPath,
        documentUploadedOn: document.uploadedOn,
        feedback: evaluation.feedback,
        score: evaluation.score,
        ticket: evaluation.ticket,
        deadline: evaluation.deadline,
        status: evaluation.eval_status,
      };
    });

    res.status(200).json(formattedEvaluations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch evaluations.' });
  }
};

export const submitEvaluation = async (req, res) => {
  try {
    const { evaluationId, examId, marks, feedback } = req.body;

    if (!examId || !Array.isArray(marks) || !Array.isArray(feedback)) {
      return res.status(400).json({ message: "Invalid input data." });
    }

    if (marks.length !== feedback.length) {
      return res.status(400).json({ message: "Marks and feedback arrays must have the same length." });
    }

    const totalMarks = marks.reduce((sum, mark) => sum + mark, 0);

    const exam = await Examination.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found!" });
    }

    if (totalMarks > exam.totalMarks) {
      return res.status(400).json({ message: `Total marks (${totalMarks}) exceed the allowed maximum (${exam.totalMarks}).` });
    }

    const evaluation = await PeerEvaluation.findById({
      _id: evaluationId,
    });

    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found!" });
    }

    evaluation.score = marks;
    evaluation.feedback = feedback;
    evaluation.evaluated_on = new Date();
    evaluation.eval_status = 'completed';
    evaluation.evaluated_by = req.user._id;

    await evaluation.save();

    res.status(200).json({ message: "Evaluation submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit evaluation!" });
  }
};

export const getResultsBatches = async (req, res) => {
  try {
    const userId = req.user._id;
    const enrollments = await Enrollment.find({ student: userId, status: 'active' })
      .populate({
        path: 'batch',
        populate: { path: 'course', select: 'courseName' }
      });
    
    const batches = enrollments.map(enrollment => ({
      batch_id: enrollment.batch._id,
      batchId: enrollment.batch.batchId,
      courseName: enrollment.batch.course?.courseName || 'Unknown Course'
    }));
    
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch batches!' });
  }
};

export const getResultsBatchExams = async (req, res) => {
  try {
    const { batchId } = req.params;
    const userId = req.user._id;

    const batch = await Batch.findById({ _id: batchId });
    if (!batch) return res.status(404).json({ message: 'Batch not found!' });
    
    const enrollment = await Enrollment.findOne({ 
      student: userId, 
      batch: batchId, 
      status: 'active' 
    });
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this batch!' });
    
    const exams = await Examination.find({ 
      batch: batchId, 
      evaluations_sent: true,
      flags: true,
      completed: false
    });
    
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch exams!' });
  }
};

export const getPeerResultsEvaluations = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user._id;
    
    const peerEvaluations = await PeerEvaluation.find({
      exam: examId,
      student: userId
    }).populate('document')
    .populate('evaluator')
    .populate('student')
    .populate('evaluated_by');

    const evaluationIds = peerEvaluations.map(evaluation => evaluation._id);

    const tickets = await Ticket.find({ evaluation: { $in: evaluationIds } });

    const ticketMap = {};
    tickets.forEach(ticket => {
      ticketMap[ticket.evaluation.toString()] = ticket;
    });

    const evaluationsWithTickets = peerEvaluations.map(evaluation => {
      const evalObj = evaluation.toObject();
      const userTicket = ticketMap[evaluation._id.toString()];
      
      evalObj.userHasRaisedTicket = !!userTicket;
      evalObj.userTicket = userTicket || null;
      
      return evalObj;
    });

    res.json(evaluationsWithTickets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch peer evaluations.' });
  }
};

export const raiseTicket = async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const userId = req.user._id;

    const evaluation = await PeerEvaluation.findById(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found!' });
    }

    if (evaluation.ticket === 1) {
      return res.status(400).json({ message: 'Ticket already raised for this evaluation!' });
    }

    const existingTicket = await Ticket.findOne({
      evaluation: evaluationId,
      raisedBy: userId
    });

    if (existingTicket) {
      return res.status(409).json({ message: 'You have already raised a ticket for this evaluation and has been resolved!' }); 
    }

    const newTicket = new Ticket({
      evaluation: evaluationId,
      evaluatedBy: evaluation.evaluated_by || evaluation.evaluator,
      raisedBy: userId
    });
    
    await newTicket.save();
    
    evaluation.ticket = 1;    
    await evaluation.save();

    res.status(200).json({ message: 'Ticket raised successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to raise ticket.' });
  }
};