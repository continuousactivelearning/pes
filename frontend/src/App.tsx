import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard'; 
import TADashboard from './pages/TADashboard'; 
import OtpScreen from './pages/OtpScreen';
import ResetPassword from './pages/ResetPassword';




export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OtpScreen />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} /> 
        <Route path="/ta" element={<TADashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
    

   
      </Routes>
    </Router>
  );
}