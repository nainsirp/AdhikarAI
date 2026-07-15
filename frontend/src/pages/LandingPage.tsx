import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;

  // Counter States
  const [stats, setStats] = useState({ state24: 0, state17: 0, state95: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const [countersRun, setCountersRun] = useState(false);

  // Newsletter Form State
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorInput, setErrorInput] = useState(false);

  // Carousel auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Stats Counters
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !countersRun) {
          setCountersRun(true);
          
          const duration = 1800;
          const stepsCount = duration / 16;
          
          let cur24 = 0;
          let cur17 = 0;
          let cur95 = 0;

          const step24 = 24 / stepsCount;
          const step17 = 17 / stepsCount;
          const step95 = 95 / stepsCount;

          const timer = setInterval(() => {
            cur24 += step24;
            cur17 += step17;
            cur95 += step95;

            setStats({
              state24: Math.min(24, Math.floor(cur24)),
              state17: Math.min(17, Math.floor(cur17)),
              state95: Math.min(95, Math.floor(cur95))
            });

            if (cur95 >= 95) {
              clearInterval(timer);
              setStats({ state24: 24, state17: 17, state95: 95 });
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [countersRun]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorInput(true);
      setTimeout(() => setErrorInput(false), 2000);
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="landing-wrapper">
      {/* HERO */}
      <div className="hero-wrapper">
        <section className="hero" id="home">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">AdhikarAI</h1>
            <p className="hero-tagline">Ek Nari, Anek Adhikar, Ek Saathi.</p>
            <p className="hero-desc">
              Designed for the complexities of the Indian legal system, AdhikarAI helps women to move with less. From
              simplifying intimidating legal jargon to securing evidence in regional languages — It's your AI-powered partner in
              every step toward justice.
            </p>
            <Link to="/features" className="btn-hero" id="btn-get-started">
              Get Started <span className="arrow">→</span>
            </Link>
          </div>
        </section>
      </div>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-card">
            <div className="trust-item">
              <div className="trust-icon">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="trust-text">
                <h3>20+ Partner NGOs</h3>
                <p>Instantly locate and contact over 20 verified NGOs and shelters near you for emergency support and safety.</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12" y2="18" />
                </svg>
              </div>
              <div className="trust-text">
                <h3>Pro-Bono Lawyers Available</h3>
                <p>A direct gateway to 324 dedicated lawyers across India, specializing in women's rights and gender-based issues.</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12" y2="20" />
                </svg>
              </div>
              <div className="trust-text">
                <h3>100% Digital First</h3>
                <p>Our AI provides instant legal aid even in areas with low infrastructure, ensuring justice is never offline.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-card">
            <div className="about-grid">
              <div className="about-text">
                <h2 className="section-heading">About Us</h2>
                <p className="about-desc">
                  <strong>AdhikarAI</strong> is a voice-enabled AI assistant that helps women navigate the legal system by simplifying jargon, securing evidence, and answering legal queries in local languages, instantly and effortlessly.
                </p>
              </div>
              <div className="about-image">
                <img src="/about.png" alt="Indian court building representing legal access" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number-row">
                <span className="stat-number">{stats.state24}</span>
                <span className="stat-suffix">+</span>
              </div>
              <p className="stat-label">Blisses across the country</p>
            </div>
            <div className="stat-item">
              <div className="stat-number-row">
                <span className="stat-number">{stats.state17}</span>
                <span className="stat-suffix">K</span>
              </div>
              <p className="stat-label">Ways to reduce workload.</p>
            </div>
            <div className="stat-item">
              <div className="stat-number-row">
                <span className="stat-prefix">+</span>
                <span className="stat-number">{stats.state95}</span>
                <span className="stat-suffix">%</span>
              </div>
              <p className="stat-label">Accurate analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT THEM */}
      <section className="about-them-section">
        <div className="container">
          <div className="about-them-card">
            <div className="about-them-grid">
              <div className="about-them-text">
                <h2 className="about-them-heading">It's about<br />them.</h2>
                <p className="about-them-desc">
                  In over <strong>75%</strong> of legal cases involving women in India, the path to justice is blocked by high costs, complex jargon, and a lack of immediate guidance. Many women lack the resources or safety to take the first step toward reclaiming their rights. <strong>AdhikarAI</strong> addresses this gap.
                </p>
              </div>
              <div className="about-them-images">
                <div className="img-card img-card-1">
                  <img src="/community.png" alt="Indian woman speaking at community event" loading="lazy" />
                </div>
                <div className="img-card img-card-2">
                  <img src="/audience.png" alt="Group of women attending a workshop" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="container">
          <h2 className="section-heading center-heading">Features</h2>
          <div className="features-carousel-wrapper">
            <button 
              className="carousel-btn carousel-prev" 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
              aria-label="Previous features"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            
            <div className="features-track-outer">
              <div 
                className="features-track" 
                style={{ 
                  transform: `translateX(-${currentSlide * 100}%)`,
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Slide 1 */}
                <div className="features-slide">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                    <h3>Navigate Legal Paths</h3>
                    <p>Identify if a situation is legally actionable and determine exactly which laws offer protection.</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    </div>
                    <h3>Simplify Legal Jargon</h3>
                    <p>Convert complex legal documents into plain, easy-to-understand language and regional dialects.</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <h3>Ask AI (Student Doubt Help)</h3>
                    <p>Get instant answers to student questions on legal rights, safety, and support resources.</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <h3>Blackboard Drawing Generator</h3>
                    <p>Create visual aids and diagrams to understand complex legal processes step by step.</p>
                  </div>
                </div>

                {/* Slide 2 */}
                <div className="features-slide">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h3>Access Support Networks</h3>
                    <p>Instantly connect with government helplines and nearby NGOs for immediate emergency aid.</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                    <h3>Find Verified Counsel</h3>
                    <p>Bridge the gap to legal experts through a marketplace of trustworthy, verified lawyers.</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.23h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <h3>Emergency Helpline Access</h3>
                    <p>One-tap access to national emergency numbers — 181, 1091, Police, and Women's Helpline.</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                    <h3>Multilingual Support</h3>
                    <p>Communicate in Hindi, Bengali, Tamil, Telugu, Marathi and 10+ regional languages.</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              className="carousel-btn carousel-next" 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}
              aria-label="Next features"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </div>

          <div className="carousel-dots">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                className={`dot ${currentSlide === idx ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section" id="newsletter">
        <div className="container">
          <div className="newsletter-card">
            <div className="newsletter-badge">Newsletter</div>
            <h2 className="newsletter-title">Contribute to our Cause</h2>
            <p className="newsletter-sub">Built for Bharat. Ready for Every Nari.</p>
            
            {!success ? (
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit} noValidate>
                <input 
                  type="email" 
                  className="newsletter-input" 
                  placeholder="Enter Email..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderColor: errorInput ? '#E74C3C' : '' }}
                  aria-label="Email address" 
                  required 
                />
                <button type="submit" className="newsletter-btn">Submit →</button>
              </form>
            ) : (
              <p className="newsletter-success show">🎉 Thank you for subscribing!</p>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Company Info</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">We are hiring</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal Features</h4>
              <ul>
                <li><Link to="/ask-ai">Ask AI Assistant</Link></li>
                <li><Link to="/draft-notices">Notice Drafter</Link></li>
                <li><Link to="/evidence-vault">Evidence Vault</Link></li>
                <li><Link to="/how-it-works">How It Works</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Social</h4>
              <ul>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} AdhikarAI. All rights reserved. Empowering Indian Women with Justice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
