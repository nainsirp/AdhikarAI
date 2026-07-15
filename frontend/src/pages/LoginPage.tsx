import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, verifyOtp, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Screen modes: 'login' | 'verify_otp' | 'forgot_password' | 'reset_password'
  const [mode, setMode] = useState<'login' | 'verify_otp' | 'forgot_password' | 'reset_password'>('login');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const showAlert = (message: string, type: 'error' | 'success' = 'error') => {
    setAlert({ message, type });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return showAlert('Please enter both email and password.');
    }
    
    setSubmitting(true);
    setAlert(null);

    try {
      const res = await login(email, password);
      if (res.status === 'pending') {
        showAlert(res.message || 'Verification needed. OTP sent to email.', 'success');
        setMode('verify_otp');
      } else if (res.status === 'success') {
        showAlert('Signed in successfully! Redirecting...', 'success');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err: any) {
      showAlert(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return showAlert('Please enter a valid 6-digit OTP.');
    }

    setSubmitting(true);
    setAlert(null);

    try {
      await verifyOtp(email, otp);
      showAlert('Email verified and signed in! Redirecting...', 'success');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      showAlert(err.response?.data?.message || 'Verification failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return showAlert('Please enter your email address.');
    }

    setSubmitting(true);
    setAlert(null);

    try {
      await forgotPassword(email);
      showAlert('Password reset OTP sent to email.', 'success');
      setMode('reset_password');
    } catch (err: any) {
      showAlert(err.response?.data?.message || 'Failed to process request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      return showAlert('Please enter the OTP and your new password.');
    }

    setSubmitting(true);
    setAlert(null);

    try {
      await resetPassword(email, otp, newPassword);
      showAlert('Password updated successfully! You can now log in.', 'success');
      setMode('login');
      setPassword('');
      setOtp('');
    } catch (err: any) {
      showAlert(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      
      {/* LEFT: FORM CONTAINER */}
      <div className="auth-left" style={{ flex: '0 0 46%', padding: '36px 52px', overflowY: 'auto' }}>
        <Link to="/" className="auth-logo" style={{ display: 'block' }}>
          <span className="logo-adhikar">Adhikar</span>
          <span className="logo-ai">AI</span>
        </Link>

        {mode === 'login' && (
          <>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue your journey toward justice.</p>

            {alert && <div className={`alert-msg ${alert.type}`}>{alert.message}</div>}

            <form onSubmit={handleLogin} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email address</label>
                <input 
                  className="form-input" 
                  type="email" 
                  id="login-email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <div className="input-wrapper">
                  <input 
                    className="form-input" 
                    type={showPassword ? 'text' : 'password'} 
                    id="login-password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <button 
                    type="button" 
                    className="eye-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Show password"
                  >
                    <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              <div className="form-row-end">
                <a href="#forgot" className="forgot-link" onClick={(e) => { e.preventDefault(); setMode('forgot_password'); setAlert(null); }}>Forgot password?</a>
              </div>
              <button type="submit" className="btn-login" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="social-btns">
              <button className="btn-social" onClick={() => showAlert('OAuth sign-in configured for deployment.')}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>

            <p className="auth-switch" style={{ marginTop: '20px' }}>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          </>
        )}

        {mode === 'verify_otp' && (
          <>
            <h1 className="auth-title">Verify Account</h1>
            <p className="auth-subtitle">We have sent a 6-digit OTP code to <strong>{email}</strong>.</p>

            {alert && <div className={`alert-msg ${alert.type}`}>{alert.message}</div>}

            <form onSubmit={handleOtpVerify}>
              <div className="form-group">
                <label className="form-label" htmlFor="otp">Verification Code</label>
                <input 
                  className="form-input" 
                  type="text" 
                  id="otp" 
                  maxLength={6} 
                  placeholder="Enter 6-digit code" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="btn-login" disabled={submitting} style={{ marginTop: '16px' }}>
                {submitting ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button 
                type="button" 
                className="btn-social" 
                onClick={() => { setMode('login'); setAlert(null); }} 
                style={{ marginTop: '10px', width: '100%' }}
              >
                Back to Sign In
              </button>
            </form>
          </>
        )}

        {mode === 'forgot_password' && (
          <>
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">Enter your email and we'll send you an OTP to reset your password.</p>

            {alert && <div className={`alert-msg ${alert.type}`}>{alert.message}</div>}

            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label className="form-label" htmlFor="forgot-email">Email Address</label>
                <input 
                  className="form-input" 
                  type="email" 
                  id="forgot-email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="btn-login" disabled={submitting} style={{ marginTop: '16px' }}>
                {submitting ? 'Sending code...' : 'Send Verification OTP'}
              </button>
              <button 
                type="button" 
                className="btn-social" 
                onClick={() => { setMode('login'); setAlert(null); }} 
                style={{ marginTop: '10px', width: '100%' }}
              >
                Back to Sign In
              </button>
            </form>
          </>
        )}

        {mode === 'reset_password' && (
          <>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">Create a new secure password for your account.</p>

            {alert && <div className={`alert-msg ${alert.type}`}>{alert.message}</div>}

            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label className="form-label" htmlFor="reset-otp">Verification OTP</label>
                <input 
                  className="form-input" 
                  type="text" 
                  id="reset-otp" 
                  maxLength={6} 
                  placeholder="Enter 6-digit code" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="new-password">New Password</label>
                <input 
                  className="form-input" 
                  type="password" 
                  id="new-password" 
                  placeholder="Minimum 6 characters" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="btn-login" disabled={submitting} style={{ marginTop: '16px' }}>
                {submitting ? 'Resetting password...' : 'Update Password'}
              </button>
              <button 
                type="button" 
                className="btn-social" 
                onClick={() => { setMode('login'); setAlert(null); }} 
                style={{ marginTop: '10px', width: '100%' }}
              >
                Cancel
              </button>
            </form>
          </>
        )}
      </div>

      {/* RIGHT: PHOTO PANE */}
      <div className="auth-right" style={{ flex: '1', display: 'flex', padding: '20px' }}>
        <div className="auth-right-inner" style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '18px', overflow: 'hidden' }}>
          <img src="/auth.png" alt="Indian woman in traditional attire" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="auth-quote">
            <p className="quote-text">"You may encounter many defeats,<br />but you must not be defeated."</p>
            <p className="quote-author">— Maya Angelou</p>
          </div>
        </div>
      </div>

    </div>
  );
};
export default LoginPage;
