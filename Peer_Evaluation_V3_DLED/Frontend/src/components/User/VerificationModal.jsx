import React, { useState, useEffect } from 'react';
import { showMessage } from '../../utils/Message';
import '../../styles/User/VerificationModal.css';

const VerificationModal = ({ email, onSuccess, onClose }) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          showMessage('Verification code expired. Please start registration again.', 'error');
          onClose();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
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
      console.log('Verification response:', data);

      if (response.ok) {
        showMessage('Email verified successfully!', 'success');
        onSuccess(data);
      } else {
        console.error('Verification failed:', data);
        if (data.redirectToRegister) {
          showMessage(data.message, 'error');
          onClose();
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
      console.log('Resend response:', data);

      if (response.ok) {
        showMessage(data.message || 'New verification code sent!', 'success');
        setTimeLeft(600); // Reset timer to 10 minutes
        setVerificationCode(['', '', '', '']); // Clear current code
      } else {
        console.error('Resend failed:', data);
        if (data.redirectToRegister) {
          showMessage(data.message, 'error');
          onClose();
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
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
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
    
    // Focus the next empty input or the last input
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
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="header-text">
              <h2>Email Verification</h2>
              <p>Complete your registration</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <svg width="50" height="50" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="verification-modal-body">
          <div className="verification-info">
            <div className="info-content">
              <h3>Check your email</h3>
              <p>We've sent a 4-digit verification code to:</p>
              <div className="email-display">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                    fill="currentColor"
                  />
                </svg>
                <strong>{email}</strong>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="verification-form">
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                </svg>
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Verify & Complete Registration</span>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M1 4V10H7M23 20V14H17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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