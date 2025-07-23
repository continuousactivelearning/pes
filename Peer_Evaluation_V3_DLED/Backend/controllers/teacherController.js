import { Batch } from '../models/Batch.js';
import { Course } from '../models/Course.js';
import { User } from '../models/User.js';
import { Enrollment } from '../models/Enrollment.js';
import { Examination } from '../models/Examination.js';
import { Document } from '../models/Document.js';
import { UIDMap } from '../models/UIDMap.js';
import { TA } from '../models/TA.js';
import { PeerEvaluation } from '../models/PeerEvaluation.js';
import { Statistics } from '../models/Statistics.js';
import { Incentivization } from '../models/Incentivization.js';
import csv from 'csv-parser';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail.js';
import extractUserIdFromQR from '../utils/extractUserIdFromQR.js'; 
import emailExistence from 'email-existence';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import mongoose from 'mongoose';


export const assignTA = async (req, res) => {
  try {
    const { email, batchId } = req.body;

    if (!email || !batchId) {
      return res.status(400).json({ message: 'Email and batchId are required.' });
    }

    const user = await User.findOne({ email, role: 'student' });
    if (!user) {
      return res.status(404).json({ message: 'Student with this email not found.' });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    const isEnrolled = await Enrollment.exists({ student: user._id, batch: batch._id });
    if (isEnrolled) {
      return res.status(400).json({ message: 'Student is enrolled in this batch and cannot be assigned as TA.' });
    }

    const isAlreadyTA = await TA.exists({ userId: user._id, batch: batch._id });
    if (isAlreadyTA) {
      return res.status(409).json({ message: 'This user is already assigned as TA for the selected batch.' });
    }

    user.isTA = true;
    await user.save();

    await TA.create({
      userId: user._id,
      batch: batch._id
    });

    return res.status(200).json({ message: 'TA assigned to batch successfully.' });
  } catch (err) {
    console.error('Error assigning TA:', err);
    return res.status(500).json({ message: 'Failed to assign TA.', error: err.message });
  }
};

export const deassignTA = async (req, res) => {
  try {
    const { email, batchId } = req.body;

    if (!email || !batchId) {
      return res.status(400).json({ message: 'Email and batchId are required.' });
    }

    const user = await User.findOne({ email, role: 'student', isTA: true });
    if (!user) {
      return res.status(404).json({ message: 'TA not found with this email.' });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    const taAssignment = await TA.findOne({ userId: user._id, batch: batch._id });
    if (!taAssignment) {
      return res.status(409).json({ message: 'TA is not assigned to this batch.' });
    }

    await TA.deleteOne({ _id: taAssignment._id });

    const stillTA = await TA.exists({ userId: user._id });
    if (!stillTA) {
      user.isTA = false;
      await user.save();
    }

    return res.status(200).json({ message: 'TA deassigned from batch successfully.' });
  } catch (err) {
    console.error('Error deassigning TA:', err);
    return res.status(500).json({ message: 'Failed to deassign TA.', error: err.message });
  }
};

function generateStrongPassword() {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const all = upper + lower + numbers + special;

  let password = '';
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  for (let i = 4; i < 8; i++) {
  password += all[Math.floor(Math.random() * all.length)];
  }

  // Shuffle password to avoid predictable order
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

export const getTeacherCoursesAndBatches = async (req, res) => {
  try {
    const teacherId = req.user._id; // Assuming authentication middleware sets req.user
    // console.log('Fetching batches and courses for teacher ID:', teacherId);

    // Find all batches assigned to this teacher and populate the course field
    const batches = await Batch.find({ instructor: teacherId }).populate('course');

    if (!batches || batches.length === 0) {
      return res.status(404).json({ message: 'No batches found for this teacher.' });
    }

    // Structure: courseId => { name, batches: [] }
    const courseMap = {};

    batches.forEach(batch => {
      const course = batch.course;
      if (!courseMap[course._id]) {
        courseMap[course._id] = {
          id: course._id,
          name: course.courseName,
          batches: [],
        };
      }
      courseMap[course._id].batches.push({
        id: batch._id,
        name: batch.batchId, // You can also use `batchName` if available
      });
    });

    const result = Object.values(courseMap);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching batches and courses for teacher:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const studentsEnroll = async (req, res) => {
  let enrolled = 0, pending_enrollment = 0, new_enrollment = 0;
  try {
    const { course, batch } = req.body;
    const csvFile = req.file.path;

    if (!course || !batch || !csvFile) {
      return res.status(400).json({ message: 'Course, batch, and CSV file are required.' });
    }

    const students = [];

    fs.createReadStream(csvFile)
    .pipe(csv({
      mapHeaders: ({ header }) => header.trim().toLowerCase(), // normalize
    }))
    .on('data', (row) => {
      if (!row.name || !row.email) {
        console.error('Missing name or email in row:', row);
        return; // Skip rows with missing data
      }
      students.push({
        name: row.name,
        email: row.email.trim(), // Normalize email
      });
    })
    .on('end', async () => {
        for (const student of students) {
          if (!student.name || !student.email) {
            return res.status(400).json({ message: `Missing name or email for one of the student.` });
          }

          const emailIsValid = await new Promise((resolve) => {
            emailExistence.check(student.email, (err, exists) => {
              if (err) resolve(false);
              else resolve(exists);
            });
          });
      
          if (!emailIsValid) {
            return res.status(400).json({ message: 'Email address does not exist or is invalid for one of the student.' });
          }

          let user = await User.findOne({ email: student.email });

          if (!user) {
            const randomPassword = generateStrongPassword();
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = new User({
              name: student.name,
              email: student.email,
              password: hashedPassword,
              role: 'student',
            });

            // await user.save();

            // Send welcome email
            const htmlcontent = `
            <div style="font-family:Arial,sans-serif; padding:20px;">
              <h2>Welcome to the Peer Evaluation System</h2>
              <p>Hello ${student.name},</p>
              <p>Your account has been successfully created with the following details:</p>
              <ul>
                <li><strong>Email:</strong> ${student.email}</li>
                <li><strong>Password:</strong> ${randomPassword}</li>
              </ul>
              <p>We're excited to have you onboard!</p>
              <p>Please log in and change your password.</p>
              <br/>
              <p>Best regards,<br/>PES Team</p>
            </div>
            `;
            await sendEmail(
              student.email,
              'Welcome to Peer Evaluation System',
              htmlcontent
            );
            await user.save();
          }

          // Check if the student is already enrolled in the course and batch
          const existingEnrollment = await Enrollment.findOne({ student: user._id, course, batch });
          if (existingEnrollment && existingEnrollment.status === 'active') {
            // Fetch batch and course details to get their names/ids
            const batchDoc = await Batch.findById(batch);
            const courseDoc = await Course.findById(course);
            const batchName = batchDoc ? batchDoc.batchId : batch;
            const courseName = courseDoc ? courseDoc.courseName : course;
            enrolled++;
            // console.error(`Student ${student.name} is already enrolled in the batch ${batchName} of course ${courseName}.`);
            // return res.status(409).json({ message: `Student ${student.name} is already enrolled in the batch ${batchName} of course ${courseName}.` });
            continue;
          }
          else if (existingEnrollment && existingEnrollment.status === 'pending') {
            existingEnrollment.status = 'active';
            await existingEnrollment.save();
            pending_enrollment++;
            // return res.status(409).json({message: 'Students enrolled by accepting the pending enrollment request.'});
            // console.log(`Student ${student.name} already has a pending enrollment request, now activated.`);
          }
          else{
            const enrollment = new Enrollment({
              student: user._id,
              course,
              batch,
            });

            await enrollment.save();
            new_enrollment++;
          }
        }

        fs.unlink(csvFile, (err) => {
          if (err) {
            console.error('Error deleting uploaded CSV file:', err);
          }
        });

        res.status(200).json({ message: 'Students enrolled successfully', statistics: { enrolled, pending_enrollment, new_enrollment } });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while enrolling students.' });
  }
};

export const getEnrolledStudents = async (req, res) => {
  try {
    const { courseId, batchId } = req.query;

    if (!courseId || !batchId) {
      return res.status(400).json({ message: 'Course ID and Batch ID are required.' });
    }

    const enrollments = await Enrollment.find({ course: courseId, batch: batchId, status: 'active' }).populate('student').populate('course').populate('batch');

    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({ message: 'No students found for the specified batch and course.' });
    }

    const students = enrollments.map(enrollment => ({
      name: enrollment.student.name,
      email: enrollment.student.email,
      enrollmentDate: enrollment.enrollmentDate ? new Date(enrollment.enrollmentDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A',
      batchName: enrollment.batch.batchId, // Assuming batchId is the identifier for the batch
      courseName: enrollment.course.courseName, // Assuming courseName is the identifier for the course
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(students);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=students_${batchId}_${courseId}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    res.status(500).json({ message: 'An error occurred while fetching enrolled students.' });
  }
};

export const scheduleExam = async (req, res) => {
  try {
    const { name, batch, date, time, number_of_questions, duration, totalMarks, k } = req.body;
    const solutions = req.file ? req.file.path : null;

    if (!name || !batch || !date || !time || !number_of_questions || !duration || !totalMarks || !k) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const exam = new Examination({
      name,
      batch,
      date,
      time,
      number_of_questions,
      duration,
      totalMarks,
      k,
      solutions: solutions || '', // Optional field, can be empty
      total_students: 0, // This will be updated later
      createdBy: req.user._id, // Assuming req.user is set by auth middleware
    });

    await exam.save();

    res.status(201).json({ message: 'Exam scheduled successfully.', exam });
  } catch (error) {
    console.error('Error scheduling exam:', error);
    res.status(500).json({ message: 'An error occurred while scheduling the exam.' });
  }
};

export const getExamsForTeacher = async (req, res) => {
  try {
    const teacherId = req.user._id; // Assuming req.user contains the authenticated teacher's info
    const examss = await Examination.find({ createdBy: teacherId, completed: false })
      .populate({
      path: 'batch',
      select: 'batchId'
      })
      .lean();

    // Map exams to include only batchId in batch field
    const exams = examss.map(exam => ({
      ...exam,
      batch: exam.batch ? exam.batch.batchId : null
    }));

    res.status(200).json({ exams });
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
};

export const updateExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const { name, date, time, number_of_questions, duration, totalMarks, k, total_students } = req.body;
    const solutions = req.file ? req.file.path : null;

    // Find the exam first
    const exam = await Examination.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Update exam details
    exam.name = name || exam.name;
    exam.date = date || exam.date;
    exam.time = time || exam.time;
    exam.number_of_questions = number_of_questions || exam.number_of_questions;
    exam.duration = duration || exam.duration;
    exam.totalMarks = totalMarks || exam.totalMarks;
    exam.k = k || exam.k;
    exam.total_students = total_students || exam.total_students;

    // Update solutions file if provided
    if (solutions) {
      // Delete old solutions file if it exists
      if (exam.solutions && typeof exam.solutions === 'string' && exam.solutions.trim() !== '') {
        fs.unlink(exam.solutions, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting old solutions file:', err);
          }
        });
      }
      exam.solutions = solutions;
    }

    await exam.save();

    res.status(200).json({ message: 'Exam updated successfully', exam });
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).json({ message: 'Failed to update exam' });
  }
};

export const completeExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Examination.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (exam.completed) {
      return res.status(400).json({ message: 'Exam is already completed!' });
    }

    exam.completed = true;
    await exam.save();

    const incentiveResult = await calculateIncentivesForBatch(exam.batch, examId);

    if (incentiveResult.success) {
      res.status(200).json({ message: 'Exam marked as completed successfully and incentives updated!' });
    } else {
      res.status(200).json({ message: 'Exam marked as completed successfully, but failed to update incentives.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark exam as completed!' });
  }
};

export const deleteExam = async (req, res) => {
  try {
    const examId = req.params.id;

    // Find the exam first
    const exam = await Examination.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    

    // Delete the associated file if it exists
    if (exam.solutions && typeof exam.solutions === 'string' && exam.solutions.trim() !== '') {
      fs.unlink(exam.solutions, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Error deleting solutions file:', err);
        }
      });
    }

    // Delete associated uploaded documents
    const documents = await Document.find({ examId });
    for (const doc of documents) {
      if (doc.documentPath && typeof doc.documentPath === 'string') {
        fs.unlink(doc.documentPath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting uploaded document:', err);
          }
        });
      }
    }
    await PeerEvaluation.deleteMany({ exam: examId });

    await Document.deleteMany({ examId });

    await UIDMap.deleteMany({ examId });

    // Delete the exam document
    await Examination.findByIdAndDelete(examId);

    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ message: 'Failed to delete exam' });
  }
};

export const downloadPDF = async (req, res) => {
  const { examId } = req.params;

  try {
    const exam = await Examination.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found.' });
    }
    const batchId = exam.batch;

    const enrollments = await Enrollment.find({ batch: batchId }).populate('student');
    if (!enrollments.length) {
      return res.status(404).json({ message: 'No students enrolled for this batch.' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Exam_${examId}_QR_Codes.pdf`);

    doc.pipe(res);

    for (const enrollment of enrollments) {
      const userId = enrollment.student._id; 

      let uidMapEntry = await UIDMap.findOne({ userId, examId });
      let uniqueId;

      if (uidMapEntry) {
        uniqueId = uidMapEntry.uniqueId;
      } else {
        uniqueId = new mongoose.Types.ObjectId().toString(); 

        try {
          uidMapEntry = await UIDMap.create({ uniqueId, userId, examId });
        } catch (error) {
          if (error.code === 11000) {
            continue; 
          } else {
            return res.status(500).json({ message: 'Failed to create UIDMap entry.' });
          }
        }
      }

      // Generate QR code
      const qrCodeData = await QRCode.toDataURL(uniqueId);

      // Add a new page to the PDF
      // doc.addPage();
      doc.image(qrCodeData, { fit: [100, 100], align: 'center' });
      doc.text(`User ID: ${enrollment.student.email}`, { align: 'center' });
      doc.text(`User Name: ${enrollment.student.name}`, { align: 'center' });
      doc.addPage();
      doc.image(qrCodeData, { fit: [100, 100], align: 'center' });
      doc.addPage();
      
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error generating PDF' });

    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate PDF' });
    }
  }
};

export const bulkUploadDocuments = async (req, res) => {
  try {
    const { examId } = req.body; 
    const uploadedBy = req.user._id;
    const files = req.files;

    let added = 0;
    let updated = 0;

    for (const file of files) {
      const uniqueId = await extractUserIdFromQR(file.path);
      if (!uniqueId) continue;
      const isUIDValid = await UIDMap.exists({ uniqueId, examId });
      if (!isUIDValid) {
        // console.warn(`Unique ID ${uniqueId} not found for exam ${examId}. Skipping file: ${file.originalname}`);
        continue;
      }
      const existingDoc = await Document.findOne({ uniqueId, examId });
      if (existingDoc) {
        if (existingDoc.documentPath && fs.existsSync(existingDoc.documentPath)) {
          try {
            fs.unlinkSync(existingDoc.documentPath);
          } catch (err) {
            console.warn('Failed to delete old document file:', err);
          }
        }
        existingDoc.documentPath = file.path;
        existingDoc.uploadedBy = uploadedBy;
        existingDoc.uploadedOn = new Date();
        await existingDoc.save();
        updated++;
      } else {
        // Create a new document
        await Document.create({
          uniqueId,
          examId,
          uploadedBy,
          documentPath: file.path,
        });
        added++;
      }
    }

    res.status(200).json({ message: 'Documents processed successfully', added, updated });
  } catch (error) {
    // console.error('Error during bulk upload:', error);
    res.status(500).json({ message: 'Failed to upload documents' });
  }
};

export const sendEvaluation = async (req, res) => {
  const { examId } = req.params;

  if (!examId) {
    return res.status(400).json({ message: 'Exam ID is required' });
  }

  const exam = await Examination.findById(examId);
  if (!exam) {
    return res.status(404).json({ message: 'Exam not found' });
  }

  try {
    const documentsWithoutUserId = await Document.find({ examId });
    const uidMaps = await UIDMap.find({ examId });
    const students = await Enrollment.find({ batch: exam.batch, status: 'active' }).populate('student');
    const documents = documentsWithoutUserId.map((doc) => {
      const matchingUidMap = uidMaps.find((uidMap) => uidMap.uniqueId === doc.uniqueId);
      return {
        ...doc.toObject(), // Convert Mongoose document to plain object
        userId: matchingUidMap ? matchingUidMap.userId : null, // Map userId if found
      };
    });

    if (!documents.length || !students.length) {
      return res.status(404).json({ message: 'No documents or students found for this exam.' });
    }

    const studentMap = new Map(); // Map to track evaluations assigned to each student

    // Initialize studentMap with empty arrays for evaluations
    students.forEach((enrollment) => {
      studentMap.set(enrollment.student._id.toString(), []);
    });

    // Ensure each student evaluates exactly `k` documents
    for (const document of documents) {
      const eligibleEvaluators = students.filter(
        (enrollment) =>
          document.uniqueId && // Check if document.uniqueId exists
          document.userId && // Check if document.userId exists
          enrollment.student._id.toString() !== document.userId.toString() &&
          studentMap.get(enrollment.student._id.toString()).length < exam.k
      );

      if (eligibleEvaluators.length < exam.k) {
        return res.status(400).json({
          message: `Not enough eligible evaluators for document ${document._id}. Constraints cannot be satisfied.`,
        });
      }

      // Randomly assign `k` evaluators to the document
      const assignedEvaluators = eligibleEvaluators
        .sort(() => Math.random() - 0.5)
        .slice(0, exam.k);

      for (const evaluator of assignedEvaluators) {
        const evaluatorId = evaluator.student._id.toString();
        studentMap.get(evaluatorId).push(document._id);
      
        await PeerEvaluation.create({
          evaluator: evaluator.student._id,
          uid: document.uniqueId,
          student: document.userId,
          exam: examId,
          document: document._id,
        });
      }
    }

    exam.evaluations_sent = true;
    await exam.save();

    res.status(200).json({ message: 'Evaluation sent successfully!' });
  } catch (error) {
    console.error('Error sending evaluations:', error);
    res.status(500).json({ message: 'Failed to send evaluation!' });
  }
};

// TODO: Test the logic to flag evaluations on large number of evaluations
export const flagEvaluations = async (req, res) => {
  const { examId } = req.params; 

  if (!examId) {
    return res.status(400).json({ message: 'Exam ID is required!' });
  }

  const exam = await Examination.findById(examId);
  if (!exam) {
    return res.status(404).json({ message: 'Exam not found!' });
  }

  try {
    const evaluations = await PeerEvaluation.find({ 
      exam: examId, 
      eval_status: 'completed' 
    }).populate('student');

    if (!evaluations.length) {
      return res.status(400).json({ message: 'No completed evaluations found for this exam!' });
    }
    console.log(`Found ${evaluations.length} completed evaluations for exam ID: ${examId}`);

    const enrolledStudents = await Enrollment.find({ 
      batch: exam.batch, 
      status: 'active' 
    }).populate('student');
    console.log(`Found ${enrolledStudents.length} enrolled students for exam ID: ${examId}`);

    const studentAverages = new Map();
    
    enrolledStudents.forEach(enrollment => {
      const studentId = enrollment.student._id.toString();
      const studentEvaluations = evaluations.filter(evaluation => evaluation.student._id.toString() === studentId);

      if (studentEvaluations.length > 0) {
        const totalScore = studentEvaluations.reduce((sum, evaluation) => {
          const evalScore = Array.isArray(evaluation.score) 
            ? evaluation.score.reduce((a, b) => a + b, 0) 
            : evaluation.score;
          return sum + evalScore;
        }, 0);
        
        const avgScore = totalScore / studentEvaluations.length;
        studentAverages.set(studentId, avgScore);
      }
    });

    const classAverage = Array.from(studentAverages.values()).reduce((sum, avg) => sum + avg, 0) / studentAverages.size;
    console.log('Class average score:', classAverage);

    const variance = Array.from(studentAverages.values()).reduce((sum, avg) => {
      return sum + Math.pow(avg - classAverage, 2);
    }, 0) / studentAverages.size;
    
    const classStdDev = Math.sqrt(variance);
    console.log('Class standard deviation:', classStdDev);

    await Statistics.findOneAndUpdate(
      { exam_id: examId },
      { 
        exam_id: examId,
        avg_score: classAverage,
        std_dev: classStdDev 
      },
      { upsert: true, new: true }
    );
    console.log('Statistics updated in the database:', { exam_id: examId, avg_score: classAverage, std_dev: classStdDev });

    if (exam.k <= 3) {
      console.log('Case 1: k <= 3 - Checking evaluations against class standard deviation');
      for (const evaluation of evaluations) {
        const evalScore = Array.isArray(evaluation.score) 
          ? evaluation.score.reduce((a, b) => a + b, 0) 
          : evaluation.score;
        
        const deviation = Math.abs(evalScore - classAverage);
        
        if (deviation > 2 * classStdDev) {
          await PeerEvaluation.findByIdAndUpdate(evaluation._id, { ticket: 1 });
        }
      }
    } else {
      console.log('Case 2: k > 3 - Checking evaluations against individual student standard deviations');
      for (const [studentId, studentAvg] of studentAverages) {
        const studentEvaluations = evaluations.filter(evaluation => evaluation.student._id.toString() === studentId);

        if (studentEvaluations.length > 1) {
          const studentVariance = studentEvaluations.reduce((sum, evaluation) => {
            const evalScore = Array.isArray(evaluation.score) 
              ? evaluation.score.reduce((a, b) => a + b, 0) 
              : evaluation.score;
            return sum + Math.pow(evalScore - studentAvg, 2);
          }, 0) / studentEvaluations.length;
          
          const studentStdDev = Math.sqrt(studentVariance);
          
          for (const evaluation of studentEvaluations) {
            const evalScore = Array.isArray(evaluation.score) 
              ? evaluation.score.reduce((a, b) => a + b, 0) 
              : evaluation.score;
            
            const deviation = Math.abs(evalScore - studentAvg);
            
            if (deviation > 1.5 * studentStdDev) {
              await PeerEvaluation.findByIdAndUpdate(evaluation._id, { ticket: 1 });
            }
          }
        }
      }
    }
    console.log('All evaluations processed and flagged where necessary and I have updated the database.');

    exam.flags = true;
    await exam.save();
    console.log('Exam marked as flagged successfully.');

    res.status(200).json({ message: 'Evaluations flagged successfully!' });
  } catch (error) {
    console.error('Error flagging evaluations:', error);
    res.status(500).json({ message: 'Failed to flag evaluations!' });
  }
};

export const getFlaggedEvaluationsForExam = async (req, res) => {
  const { examId } = req.params;

  try {
    const flaggedEvaluations = await PeerEvaluation.find({
      exam: examId,
      ticket: 2
    }).populate('exam student evaluator document');

    res.status(200).json(flaggedEvaluations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch flagged evaluations!' });
  }
};

export const updateEvaluation = async (req, res) => {
  const { evaluationId } = req.params;
  const updateData = req.body;

  try {
    const updatedFields = {
      ...updateData,
      evaluated_on: new Date(),
      evaluated_by: req.user._id,
    };
    
    const updatedEvaluation = await PeerEvaluation.findByIdAndUpdate(evaluationId, updatedFields, { new: true });

    if (!updatedEvaluation) {
      return res.status(404).json({ message: 'Evaluation not found!' });
    }

    res.status(200).json({message: 'Evaluation updated/resolved successfully!'});
  } catch (error) {
    res.status(500).json({ message: 'Failed to update evaluation!' });
  }
};

export const removeTicket = async (req, res) => {
  const { evaluationId } = req.params;

  try {
    const evaluation = await PeerEvaluation.findById(evaluationId);
    
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found!' });
    }

    evaluation.ticket = 0;
    await evaluation.save();

    res.status(200).json({ message: 'Ticket removed successfully!' });
  } catch (error) {
    console.error('Error removing ticket:', error);
    res.status(500).json({ message: 'Failed to remove ticket!' });
  }
};

export const downloadResultsCSV = async (req, res) => {
  const { examId } = req.params;

  try {
    const exam = await Examination.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found!' });
    }

    const evaluations = await PeerEvaluation.find({ exam: examId, eval_status: 'completed' }).populate('student');

    const studentTotals = {};
    evaluations.forEach(ev => {
      const studentId = ev.student?._id?.toString();
      if (!studentId) return;

      let totalMarks = 0;
      if (Array.isArray(ev.score)) {
        totalMarks = ev.score.reduce((a, b) => a + b, 0);
      } else if (typeof ev.score === 'number') {
        totalMarks = ev.score;
      }

      if (!studentTotals[studentId]) {
        studentTotals[studentId] = {
          name: ev.student.name,
          email: ev.student.email,
          totals: [],
        };
      }
      studentTotals[studentId].totals.push(totalMarks);
    });

    const csvData = Object.values(studentTotals).map(entry => ({
      Name: entry.name,
      Email: entry.email,
      Avg_Score: (entry.totals.reduce((a, b) => a + b, 0) / entry.totals.length).toFixed(2),
    }));

    const parser = new Parser({ fields: ['Name', 'Email', 'Avg_Score'] });
    const csv = parser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment(`Exam_${examId}_results.csv`);
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate results CSV!' });
  }
};

export const getResultsAnalytics = async (req, res) => {
  const { examId } = req.params;
  try {
    const evaluations = await PeerEvaluation.find({ exam: examId }).populate('student');

    // Leaderboard (top 3)
    const studentTotals = {};
    evaluations.forEach(ev => {
      const studentId = ev.student?._id?.toString();
      if (!studentId) return;
      let totalMarks = 0;
      if (Array.isArray(ev.score)) totalMarks = ev.score.reduce((a, b) => a + b, 0);
      else if (typeof ev.score === 'number') totalMarks = ev.score;
      if (!studentTotals[studentId]) {
        studentTotals[studentId] = {
          name: ev.student.name,
          email: ev.student.email,
          totals: [],
        };
      }
      studentTotals[studentId].totals.push(totalMarks);
    });
    const averages = Object.values(studentTotals).map(entry => ({
      name: entry.name,
      email: entry.email,
      avg: entry.totals.reduce((a, b) => a + b, 0) / entry.totals.length,
    }));
    const sortedAverages = [...averages].sort((a, b) => b.avg - a.avg);
    const leaderboard = sortedAverages.slice(0, 3);

    // Histogram
    const avgScores = averages.map(a => a.avg);
    const minScore = Math.min(...avgScores, 0);
    const maxScore = Math.max(...avgScores, 0);
    const binCount = 6;
    const binSize = Math.ceil((maxScore - minScore) / binCount) || 1;
    const bins = [];
    for (let i = 0; i < binCount; i++) {
      const start = minScore + i * binSize;
      const end = i === binCount - 1 ? maxScore : start + binSize - 1;
      bins.push({
        label: `${start} - ${end}`,
        count: 0,
        range: [start, end],
      });
    }
    avgScores.forEach(score => {
      for (let i = 0; i < bins.length; i++) {
        const [start, end] = bins[i].range;
        if (score >= start && (i === bins.length - 1 ? score <= end : score < end + 1)) {
          bins[i].count += 1;
          break;
        }
      }
    });

    // Question-wise averages
    let maxQuestions = 0;
    evaluations.forEach(ev => {
      if (Array.isArray(ev.score)) maxQuestions = Math.max(maxQuestions, ev.score.length);
    });
    const questionSums = Array(maxQuestions).fill(0);
    const questionCounts = Array(maxQuestions).fill(0);
    evaluations.forEach(ev => {
      if (Array.isArray(ev.score)) {
        ev.score.forEach((val, idx) => {
          questionSums[idx] += val;
          questionCounts[idx] += 1;
        });
      }
    });
    const questionAverages = questionSums.map((sum, idx) =>
      questionCounts[idx] ? sum / questionCounts[idx] : 0
    );

    // Scatter plot: Student averages vs. number of evaluations
    const studentEvalCount = {};
    evaluations.forEach(ev => {
      const sid = ev.student?._id?.toString();
      if (!sid) return;
      if (!studentEvalCount[sid]) studentEvalCount[sid] = { count: 0, total: 0, name: ev.student?.name || "-" };
      let totalMarks = 0;
      if (Array.isArray(ev.score)) totalMarks = ev.score.reduce((a, b) => a + b, 0);
      else if (typeof ev.score === "number") totalMarks = ev.score;
      studentEvalCount[sid].count += 1;
      studentEvalCount[sid].total += totalMarks;
    });
    const scatterData = Object.values(studentEvalCount).map(s => ({
      x: s.count,
      y: s.total / s.count,
      label: s.name,
    }));

    // Stacked bar: Evaluation status per student
    let completed = 0, pending = 0, flagged = 0;
    evaluations.forEach(ev => {
      if (ev.eval_status === "completed") completed += 1;
      else if (ev.eval_status === "pending") pending += 1;
      if (ev.ticket === 1 || ev.ticket === 2) flagged += 1;
    });
    const evalStatus = { completed, pending, flagged };

    res.json({
      leaderboard,
      histogram: bins.map(b => ({ label: b.label, count: b.count })),
      questionAverages,
      scatterData,
      evalStatus,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get analytics!' });
  }
};

export const getCompletedExamsForTeacher = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const exams = await Examination.find({ createdBy: teacherId, completed: true })
      .populate({
        path: 'batch',
        populate: {
          path: 'course'
        }
      });
    res.status(200).json({ exams });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get completed exams!' });
  }
};

const calculateIncentivesForBatch = async (batchId, examId) => {
  const PARTICIPATION_REWARD = 1;
  const CORRECT_EVALUATION_REWARD = 5;

  try {
    const enrolledStudents = await Enrollment.find({ 
      batch: batchId, 
      status: 'active' 
    }).populate('student');

    const evaluations = await PeerEvaluation.find({ exam: examId })
      .populate('student evaluator');

    for (const enrollment of enrolledStudents) {
      const studentId = enrollment.student._id;
      
      const studentParticipated = evaluations.some(evals => 
        evals.student._id.toString() === studentId.toString()
      );

      const evaluationsByStudent = evaluations.filter(evals => 
        evals.evaluator && 
        evals.evaluator._id.toString() === studentId.toString() &&
        evals.eval_status === 'completed'
      );

      const correctEvaluations = evaluationsByStudent.filter(evals => 
        evals.ticket === 0 &&
        evals.evaluated_by &&
        evals.evaluated_by.toString() === studentId.toString()
      );

      let examRewards = 0;
      if (studentParticipated) {
        examRewards += PARTICIPATION_REWARD;
      }
      examRewards += correctEvaluations.length * CORRECT_EVALUATION_REWARD;

      if (studentParticipated || evaluationsByStudent.length > 0) {
        const incentiveRecord = await Incentivization.findOne({
          batch: batchId,
          student: studentId
        });

        if (incentiveRecord) {
          incentiveRecord.total_rewards += examRewards;
          incentiveRecord.exam_count += 1;
          incentiveRecord.total_evaluations += evaluationsByStudent.length;
          incentiveRecord.correct_evaluations += correctEvaluations.length;
          incentiveRecord.last_updated = new Date();
          await incentiveRecord.save();
          
          console.log(`Updated incentives for student ${enrollment.student.name}: +${examRewards} points (Total: ${incentiveRecord.total_rewards})`);
        } else {
          const newIncentive = await Incentivization.create({
            batch: batchId,
            student: studentId,
            total_rewards: examRewards,
            exam_count: 1,
            total_evaluations: evaluationsByStudent.length,
            correct_evaluations: correctEvaluations.length
          });
        }
      }
    }
    return {
      success: true,
      message: 'Incentives calculated successfully!'
    }

  } catch (error) {
    return {
      success: false,
      message: 'Failed to calculate incentives!'
    };
  }
};

// const calculateIncentivesForBatch = async (batchId, examId) => {
//   const PARTICIPATION_REWARD = 1;
//   const BASE_EVALUATION_REWARD = 2; // Base reward for completing an evaluation
//   const ACCURACY_BONUS_MULTIPLIER = 3; // Multiplier for accuracy bonus
//   const MAX_ACCURACY_BONUS = 5; // Maximum bonus points for perfect accuracy

//   try {
//     // Get exam statistics
//     const examStats = await Statistics.findOne({ exam_id: examId });
//     if (!examStats) {
//       console.log('No statistics found for exam, using basic reward system');
//       return calculateBasicIncentives(batchId, examId);
//     }

//     const enrolledStudents = await Enrollment.find({ 
//       batch: batchId, 
//       status: 'active' 
//     }).populate('student');

//     const evaluations = await PeerEvaluation.find({ exam: examId })
//       .populate('student evaluator');

//     // Calculate student averages for comparison
//     const studentAverages = calculateStudentAverages(evaluations);

//     for (const enrollment of enrolledStudents) {
//       const studentId = enrollment.student._id;
      
//       const studentParticipated = evaluations.some(evals => 
//         evals.student._id.toString() === studentId.toString()
//       );

//       const evaluationsByStudent = evaluations.filter(evals => 
//         evals.evaluator && 
//         evals.evaluator._id.toString() === studentId.toString() &&
//         evals.eval_status === 'completed'
//       );

//       let examRewards = 0;
      
//       // Participation reward
//       if (studentParticipated) {
//         examRewards += PARTICIPATION_REWARD;
//       }

//       // Calculate accuracy-based rewards for evaluations
//       let totalAccuracyScore = 0;
//       let validEvaluations = 0;

//       for (const evaluation of evaluationsByStudent) {
//         // Skip flagged evaluations or those overridden by teacher/TA
//         if (evaluation.ticket !== 0 || 
//             !evaluation.evaluated_by || 
//             evaluation.evaluated_by.toString() !== studentId.toString()) {
//           continue;
//         }

//         const accuracyScore = calculateEvaluationAccuracy(
//           evaluation, 
//           studentAverages, 
//           examStats
//         );

//         if (accuracyScore !== null) {
//           totalAccuracyScore += accuracyScore;
//           validEvaluations++;
          
//           // Base reward for completing evaluation
//           examRewards += BASE_EVALUATION_REWARD;
          
//           // Accuracy bonus (0 to MAX_ACCURACY_BONUS based on how accurate the evaluation was)
//           const accuracyBonus = accuracyScore * MAX_ACCURACY_BONUS;
//           examRewards += accuracyBonus;
//         }
//       }

//       // Only process if student has some activity
//       if (studentParticipated || evaluationsByStudent.length > 0) {
//         const incentiveRecord = await Incentivization.findOne({
//           batch: batchId,
//           student: studentId
//         });

//         if (incentiveRecord) {
//           incentiveRecord.total_rewards += examRewards;
//           incentiveRecord.exam_count += 1;
//           incentiveRecord.total_evaluations += evaluationsByStudent.length;
//           incentiveRecord.correct_evaluations += validEvaluations;
          
//           // Add new field for tracking accuracy
//           if (!incentiveRecord.average_accuracy) {
//             incentiveRecord.average_accuracy = 0;
//           }
          
//           if (validEvaluations > 0) {
//             const currentAccuracy = totalAccuracyScore / validEvaluations;
//             incentiveRecord.average_accuracy = 
//               ((incentiveRecord.average_accuracy * (incentiveRecord.exam_count - 1)) + currentAccuracy) / 
//               incentiveRecord.exam_count;
//           }
          
//           incentiveRecord.last_updated = new Date();
//           await incentiveRecord.save();
          
//           console.log(`Updated incentives for student ${enrollment.student.name}: +${examRewards.toFixed(2)} points (Total: ${incentiveRecord.total_rewards.toFixed(2)}, Avg Accuracy: ${(incentiveRecord.average_accuracy * 100).toFixed(1)}%)`);
//         } else {
//           const avgAccuracy = validEvaluations > 0 ? totalAccuracyScore / validEvaluations : 0;
          
//           await Incentivization.create({
//             batch: batchId,
//             student: studentId,
//             total_rewards: examRewards,
//             exam_count: 1,
//             total_evaluations: evaluationsByStudent.length,
//             correct_evaluations: validEvaluations,
//             average_accuracy: avgAccuracy
//           });
          
//           console.log(`Created incentive record for student ${enrollment.student.name}: ${examRewards.toFixed(2)} points (Accuracy: ${(avgAccuracy * 100).toFixed(1)}%)`);
//         }
//       }
//     }

//     return {
//       success: true,
//       message: 'Incentives calculated successfully with accuracy-based rewards!'
//     };

//   } catch (error) {
//     console.error('Error calculating accuracy-based incentives:', error);
//     return {
//       success: false,
//       message: 'Failed to calculate incentives!'
//     };
//   }
// };

// const calculateStudentAverages = (evaluations) => {
//   const studentTotals = {};
  
//   evaluations.forEach(evaluation => {
//     if (evaluation.eval_status !== 'completed') return;
    
//     const studentId = evaluation.student._id.toString();
//     const score = Array.isArray(evaluation.score) 
//       ? evaluation.score.reduce((a, b) => a + b, 0) 
//       : evaluation.score;
    
//     if (!studentTotals[studentId]) {
//       studentTotals[studentId] = { total: 0, count: 0 };
//     }
    
//     studentTotals[studentId].total += score;
//     studentTotals[studentId].count += 1;
//   });
  
//   const studentAverages = {};
//   Object.keys(studentTotals).forEach(studentId => {
//     studentAverages[studentId] = studentTotals[studentId].total / studentTotals[studentId].count;
//   });
  
//   return studentAverages;
// };

// const calculateEvaluationAccuracy = (evaluation, studentAverages, examStats) => {
//   try {
//     const evaluatedStudentId = evaluation.student._id.toString();
//     const evaluatedStudentAverage = studentAverages[evaluatedStudentId];
    
//     if (!evaluatedStudentAverage) return null;
    
//     const evaluationScore = Array.isArray(evaluation.score) 
//       ? evaluation.score.reduce((a, b) => a + b, 0) 
//       : evaluation.score;
    
//     const deviation = Math.abs(evaluationScore - evaluatedStudentAverage);
    
//     const normalizedDeviation = examStats.std_dev > 0 ? deviation / examStats.std_dev : 0;
    
//     const accuracyScore = Math.exp(-normalizedDeviation);
    
//     return Math.max(0, Math.min(1, accuracyScore));
//   } catch (error) {
//     console.error('Error calculating evaluation accuracy:', error);
//     return null;
//   }
// };

export const downloadIncentivesCSV = async (req, res) => {
  const { batchId } = req.params;

  try {
    const incentives = await Incentivization.find({ batch: batchId })
      .populate('student', 'name email')
      .populate('batch', 'batchId');

    if (!incentives.length) {
      return res.status(404).json({ message: 'No incentive data found for this batch!' });
    }

    const csvData = incentives.map(incentive => ({
      Student_Name: incentive.student.name,
      Student_Email: incentive.student.email,
      Batch_ID: incentive.batch.batchId,
      Total_Rewards: incentive.total_rewards,
      Exams_Completed: incentive.exam_count,
      Total_Evaluations: incentive.total_evaluations,
      Correct_Evaluations: incentive.correct_evaluations,
      Accuracy_Percentage: incentive.total_evaluations > 0 ? 
        ((incentive.correct_evaluations / incentive.total_evaluations) * 100).toFixed(2) : 0,
      Last_Updated: incentive.last_updated.toLocaleDateString()
    }));

    const parser = new Parser({ 
      fields: [
        'Student_Name', 'Student_Email', 'Batch_ID', 'Total_Rewards', 
        'Exams_Completed', 'Total_Evaluations', 'Correct_Evaluations', 
        'Accuracy_Percentage', 'Last_Updated'
      ] 
    });
    const csv = parser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment(`Batch_${batchId}_Incentives.csv`);
    return res.send(csv);

  } catch (error) {
    res.status(500).json({ message: 'Failed to generate incentives CSV!' });
  }
};