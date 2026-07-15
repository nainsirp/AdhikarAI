import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const SignupPage: React.FC = () => {
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  // Screen modes: 'signup' | 'verify_otp'
  const [mode, setMode] = useState<'signup' | 'verify_otp'>('signup');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'LAWYER'>('USER');
  const [otp, setOtp] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const showAlert = (message: string, type: 'error' | 'success' = 'error') => {
    setAlert({ message, type });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return showAlert('Please fill out all fields.');
    }
    if (password.length < 6) {
      return showAlert('Password must be at least 6 characters.');
    }

    setSubmitting(true);
    setAlert(null);

    try {
      await register(email, password, name, role);
      showAlert('Account registered! OTP verification code sent to your email.', 'success');
      setMode('verify_otp');
    } catch (err: any) {
      showAlert(err.response?.data?.message || 'Registration failed. Please check details.');
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
      showAlert('Email verified successfully! Redirecting to dashboard...', 'success');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      showAlert(err.response?.data?.message || 'Verification failed. Try again.');
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

        {mode === 'signup' && (
          <>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join us to access legal assistance instantly.</p>

            {alert && <div className={`alert-msg ${alert.type}`}>{alert.message}</div>}

            <form onSubmit={handleSignup} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input 
                  className="form-input" 
                  type="text" 
                  id="name" 
                  placeholder="Enter your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email address</label>
                <input 
                  className="form-input" 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input 
                    className="form-input" 
                    type={showPassword ? 'text' : 'password'} 
                    id="password" 
                    placeholder="Minimum 6 characters" 
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

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">I want to join as a</label>
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                  <label style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '6px', cursor: 'pointer', background: role === 'USER' ? '#fbf8f8' : '#ffffff', borderColor: role === 'USER' ? 'var(--crimson)' : 'var(--border)' }}>
                    <input 
                      type="radio" 
                      name="role" 
                      checked={role === 'USER'} 
                      onChange={() => setRole('USER')} 
                      style={{ accentColor: 'var(--crimson)' }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Standard User</span>
                  </label>
                  <label style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '6px', cursor: 'pointer', background: role === 'LAWYER' ? '#fbf8f8' : '#ffffff', borderColor: role === 'LAWYER' ? 'var(--crimson)' : 'var(--border)' }}>
                    <input 
                      type="radio" 
                      name="role" 
                      checked={role === 'LAWYER'} 
                      onChange={() => setRole('LAWYER')} 
                      style={{ accentColor: 'var(--crimson)' }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Pro-bono Lawyer</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-login" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch" style={{ marginTop: '20px' }}>Already have an account? <Link to="/login">Sign In</Link></p>
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
                onClick={() => { setMode('signup'); setAlert(null); }} 
                style={{ marginTop: '10px', width: '100%' }}
              >
                Back to Signup
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
export default SignupPage;
