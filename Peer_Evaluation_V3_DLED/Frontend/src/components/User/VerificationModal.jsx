import React, { useState, useEffect } from 'react';
import { showMessage } from '../../utils/Message';
import '../../styles/User/VerificationModal.css';

const VerificationModal = ({ email, onSuccess, onClose }) => {
  const [verificationCode, setVerificationCode] = useState('');
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
    
    if (verificationCode.length !== 4) {
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
          code: verificationCode
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
          // Optionally redirect to register page
          window.location.href = '/register';
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
        setVerificationCode(''); // Clear current code
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

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 4) {
      setVerificationCode(value);
    }
  };

  return (
    <div className="verification-modal-overlay">
      <div className="verification-modal">
        <div className="verification-modal-header">
          <h2>Email Verification</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="verification-modal-body">
          <div className="verification-info">
            <p>We've sent a 4-digit verification code to:</p>
            <strong>{email}</strong>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="code-input-group">
              <label htmlFor="verificationCode">Enter Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder="Enter 4-digit code"
                maxLength="4"
                className="code-input"
                required
              />
            </div>

            <div className="timer-info">
              <p>Code expires in: <span className="timer">{formatTime(timeLeft)}</span></p>
            </div>

            <button 
              type="submit" 
              className="verify-btn"
              disabled={loading || verificationCode.length !== 4}
            >
              {loading ? 'Verifying...' : 'Verify & Complete Registration'}
            </button>
          </form>

          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button 
              type="button"
              className="resend-btn"
              onClick={handleResendCode}
              disabled={resendLoading}
            >
              {resendLoading ? 'Resending...' : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;