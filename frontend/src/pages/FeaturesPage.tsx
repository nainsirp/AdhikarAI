import React from 'react';
import { Link } from 'react-router-dom';

interface FeatureItem {
  title: string;
  desc: string;
  path: string;
  icon: React.ReactNode;
}

export const FeaturesPage: React.FC = () => {
  const tools: FeatureItem[] = [
    {
      title: 'Ask AI Companion',
      desc: 'Get instant legal Q&A advice in regional languages, structured under modern Indian Penal Codes.',
      path: '/ask-ai',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    {
      title: 'Draft Legal Notices',
      desc: 'Prepare formal notice sheets to send to employers, family members, or dispute opponents in HTML.',
      path: '/draft-notices',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      )
    },
    {
      title: 'Secure Evidence Vault',
      desc: 'Encrypt and store screenshots, voice memos, files, and chats safely to back your legal actions.',
      path: '/evidence-vault',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      )
    }
  ];

  return (
    <div style={{ background: 'var(--warm-gray)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div className="page-content" style={{ maxWidth: '1060px', margin: '80px auto', padding: '40px 24px 64px', width: '100%' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '10px', textAlign: 'center' }}>
          Explore AdhikarAI Legal Tools
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--mid-gray)', marginBottom: '40px', textAlign: 'center' }}>
          Choose a helper utility below to begin preparing your case.
        </p>

        <div className="features-grid">
          {tools.map((t, idx) => (
            <Link key={idx} to={t.path} className="feature-card" style={{ textDecoration: 'none', display: 'flex' }}>
              <div className="feature-icon">
                {t.icon}
              </div>
              <h3 className="feature-title">{t.title}</h3>
              <p className="feature-desc">{t.desc}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};
export default FeaturesPage;
