import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaTimes, FaEnvelope, FaClock, FaCheck, FaRedo } from 'react-icons/fa';
import { showMessage } from '../../utils/Message';
import '../../styles/User/VerificationModal.css';

const VerificationModal = ({ email, handleVerificationSuccess, handleVerificationClose }) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          showMessage('Verification code expired. Please start registration again.', 'error');
          handleVerificationClose();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleVerificationClose]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    
    const codeString = verificationCode.join('');
    if (codeString.length !== 4) {
      showMessage('Please enter a valid 4-digit verification code', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: codeString
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Email verified successfully!', 'success');
        handleVerificationSuccess(data);
      } else {
        console.error('Verification failed:', data);
        if (data.redirectToRegister) {
          showMessage(data.message, 'error');
          handleVerificationClose();
          window.location.href = '/login';
        } else {
          showMessage(data.message || 'Invalid verification code', 'error');
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      showMessage('Verification failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(data.message || 'New verification code sent!', 'success');
        setTimeLeft(600);
        setVerificationCode(['', '', '', '']);
      } else {
        console.error('Resend failed:', data);
        if (data.redirectToRegister) {
          showMessage(data.message, 'error');
          handleVerificationClose();
          window.location.href = '/register';
        } else {
          showMessage(data.message || 'Failed to resend code', 'error');
        }
      }
    } catch (error) {
      console.error('Resend error:', error);
      showMessage('Failed to resend verification code. Please try again.', 'error');
    } finally {
      setResendLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 4).split('');
    
    const newCode = ['', '', '', ''];
    digits.forEach((digit, index) => {
      if (index < 4) newCode[index] = digit;
    });
    
    setVerificationCode(newCode);
    
    const nextEmptyIndex = newCode.findIndex(code => !code);
    const targetIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 3;
    const targetInput = document.getElementById(`code-${targetIndex}`);
    if (targetInput) targetInput.focus();
  };

  return (
    <div className="verification-modal-overlay">
      <div className="verification-modal">
        <div className="verification-modal-header">
          <div className="header-content">
            <div className="icon-wrapper">
              <FaEnvelope />
            </div>
            <div className="header-text">
              <h2>Email Verification</h2>
              <p>Complete your registration</p>
            </div>
          </div>
          <button className="close-btn" onClick={handleVerificationClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <div className="verification-modal-body">
          <div className="verification-info">
            <div className="info-content">
              <h3>Check your email</h3>
              <p>We've sent a 4-digit verification code to:</p>
              <div className="email-display">
                <FaEnvelope />
                <strong>{email}</strong>
              </div>
            </div>
          </div>

          <form onSubmit={handleVerification} className="verification-form">
            <div className="code-input-section">
              <label className="code-label">Enter Verification Code</label>
              <div className="code-inputs-container">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    maxLength="1"
                    className="code-digit-input"
                    autoComplete="off"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <div className="timer-section">
              <div className="timer-info">
                <FaClock />
                <span>Code expires in: <strong className="timer">{formatTime(timeLeft)}</strong></span>
              </div>
            </div>

            <button 
              type="submit" 
              className="verify-btn"
              disabled={loading || verificationCode.join('').length !== 4}
            >
              {loading ? (
                <div className="loading-content">
                  <div className="spinner"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="button-content">
                  <FaCheck />
                  <span>Verify Registration</span>
                </div>
              )}
            </button>
          </form>

          <div className="resend-section">
            <div className="resend-content">
              <p>Didn't receive the code?</p>
              <button 
                type="button"
                className="resend-btn"
                onClick={handleResendCode}
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <div className="loading-content">
                    <div className="spinner small"></div>
                    <span>Resending...</span>
                  </div>
                ) : (
                  <div className="button-content">
                    <FaRedo />
                    <span>Resend Code</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;