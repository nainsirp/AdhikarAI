import React from 'react';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <main className="how-it-works-section" style={{ padding: '120px 0 80px' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header */}
          <div className="steps-header" style={{ maxWidth: '650px', margin: '0 auto 70px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.6rem', color: 'var(--crimson)', marginBottom: '18px', fontWeight: 700 }}>
              How It Works
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--mid-gray)', lineHeight: '1.6' }}>
              AdhikarAI makes legal support accessible and simple. Here's how we help you every step of the way.
            </p>
          </div>

          {/* Process Steps Container */}
          <div className="steps-container" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: '20px', padding: '20px 0' }}>
            <div className="steps-connecting-line"></div>

            {/* Step 1 */}
            <div className="step-card">
              <div className="step-badge">1</div>
              <div className="step-icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h3>Tell Us Your Problem</h3>
              <p>Share your legal issue in simple words in your local language through our easy-to-use platform.</p>
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-badge">2</div>
              <div className="step-icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8.5" r="4"/>
                  <path d="M6 19.5c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5"/>
                  <path d="M8 8.5c0-2.2 1.8-4 4-4s4 1.8 4 4"/>
                </svg>
              </div>
              <h3>Get AI Guidance</h3>
              <p>Our AI analyzes your issue and provides step-by-step guidance, legal information, and possible solutions.</p>
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-badge">3</div>
              <div className="step-icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18"/>
                  <path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/>
                  <path d="M15 5l4-1v18h-4"/>
                  <circle cx="10" cy="13" r="1"/>
                </svg>
              </div>
              <h3>Connect with a Lawyer</h3>
              <p>If needed, get matched with a verified pro-bono lawyer specializing in your type of case.</p>
            </div>

            {/* Step 4 */}
            <div className="step-card">
              <div className="step-badge">4</div>
              <div className="step-icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h3>Get the Support You Deserve</h3>
              <p>Receive the legal help and support you need to move forward with confidence.</p>
            </div>
          </div>

          {/* Safety Banner */}
          <div className="safety-banner" style={{ margin: '80px auto 0' }}>
            <div className="safety-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 11 11 13 15 9"/>
              </svg>
            </div>
            <div className="safety-text">
              <strong>Safe. Private. Trustworthy.</strong><br/>
              Your information is secure and confidential. We're here to empower you with justice.
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Company Info</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/how-it-works">How It Works</Link></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal Info</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} AdhikarAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};
export default HowItWorks;
