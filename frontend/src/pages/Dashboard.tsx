import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

interface VaultFile {
  id: string;
  fileName: string;
  fileSize: number;
  category: string;
  downloadUrl: string;
  uploadedAt: string;
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab State: 'overview' | 'chats' | 'documents'
  const [activeTab, setActiveTab] = useState<'overview' | 'chats' | 'documents'>('overview');

  // Backend Data States
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [docs, setDocs] = useState<VaultFile[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [chatsRes, docsRes] = await Promise.all([
        apiClient.get('/ai/chat/sessions'),
        apiClient.get('/evidence')
      ]);
      setChats(chatsRes.data.sessions || []);
      setDocs(docsRes.data.files || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadPercent(10);

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadPercent(40);
      await apiClient.post('/evidence/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadPercent(100);
      setTimeout(() => {
        setUploading(false);
        setUploadPercent(0);
        fetchDashboardData(); // Refresh list
      }, 500);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload file. Please try again.');
      setUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return (name || 'U')[0].toUpperCase();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--warm-gray)' }}>
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo">
          <span className="logo-adhikar">Adhikar</span>
          <span className="logo-ai">AI</span>
        </Link>

        {user && (
          <div className="sidebar-user">
            <div className="user-avatar">{getInitials(user.name)}</div>
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
        )}

        <div className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Overview
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            Chats
          </button>

          <button 
            className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Documents
          </button>

          <div style={{ margin: '24px 0', borderTop: '1px solid var(--border)' }}></div>

          <Link to="/ask-ai" className="nav-item">
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            Open Legal AI
          </Link>
          
          <Link to="/draft-notices" className="nav-item">
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Draft legal notice
          </Link>
        </div>

        <div className="sidebar-bottom">
          <button className="btn-logout" onClick={handleSignOut}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="main" style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>
        
        {loading ? (
          <div className="files-loading" style={{ display: 'block' }}>
            <span className="spinner"></span>Syncing dashboard activity...
          </div>
        ) : (
          <>
            {/* OVERVIEW PANEL */}
            {activeTab === 'overview' && (
              <div>
                <div className="page-header">
                  <h1 className="page-title">Welcome back, {user?.name.split(' ')[0]}!</h1>
                  <p className="page-subtitle">Here's a summary of your AdhikarAI activity.</p>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="stat-value">{chats.length}</div>
                      <div className="stat-label">AI Conversations</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div>
                      <div className="stat-value">{docs.length}</div>
                      <div className="stat-label">Documents Uploaded</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <div className="stat-value">✓</div>
                      <div className="stat-label">Account Secured</div>
                    </div>
                  </div>
                </div>

                <div className="section-card">
                  <div className="card-header">
                    <span className="card-title">Recent Chats</span>
                    <button className="card-action" onClick={() => setActiveTab('chats')}>View all →</button>
                  </div>
                  
                  {chats.length === 0 ? (
                    <div className="empty-state">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p>No conversations yet</p>
                      <span>Get started with our AI legal companion.</span>
                    </div>
                  ) : (
                    <div className="chat-list">
                      {chats.slice(0, 3).map((chat) => (
                        <div key={chat.id} className="chat-item" onClick={() => navigate(`/ask-ai?session=${chat.id}`)}>
                          <div className="chat-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <div>
                            <div className="chat-title">{chat.title}</div>
                            <div className="chat-preview">Click to resume this legal chat session.</div>
                          </div>
                          <div className="chat-time">{formatDate(chat.createdAt)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="section-card">
                  <div className="card-header">
                    <span className="card-title">Recent Documents</span>
                    <button className="card-action" onClick={() => setActiveTab('documents')}>View all →</button>
                  </div>
                  
                  {docs.length === 0 ? (
                    <div className="empty-state">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                      <p>No documents uploaded</p>
                      <span>Upload files to your secure evidence vault.</span>
                    </div>
                  ) : (
                    <div className="doc-grid">
                      {docs.slice(0, 4).map((doc) => (
                        <a key={doc.id} href={doc.downloadUrl} target="_blank" rel="noopener noreferrer" className="doc-card" style={{ textDecoration: 'none' }}>
                          <svg className="doc-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <div className="doc-name">{doc.fileName}</div>
                          <div className="doc-size">{formatSize(doc.fileSize)}</div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CHATS PANEL */}
            {activeTab === 'chats' && (
              <div>
                <div className="page-header">
                  <h1 className="page-title">Chat History</h1>
                  <p className="page-subtitle">All your past AI legal consultations, saved securely.</p>
                </div>
                <div className="section-card">
                  {chats.length === 0 ? (
                    <div className="empty-state">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p>No chat history found</p>
                      <span>Ask AI something to start a new chat.</span>
                    </div>
                  ) : (
                    <div className="chat-list">
                      {chats.map((chat) => (
                        <div key={chat.id} className="chat-item" onClick={() => navigate(`/ask-ai?session=${chat.id}`)}>
                          <div className="chat-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <div>
                            <div className="chat-title">{chat.title}</div>
                            <div className="chat-preview">Resume conversation from {formatDate(chat.createdAt)}.</div>
                          </div>
                          <div className="chat-time">{formatDate(chat.createdAt)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DOCUMENTS PANEL */}
            {activeTab === 'documents' && (
              <div>
                <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h1 className="page-title">My Documents</h1>
                    <p className="page-subtitle">Securely stored evidence, notices, and legal files.</p>
                  </div>
                  <button className="btn-upload" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    {uploading ? `Uploading (${uploadPercent}%)` : 'Upload Document'}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    style={{ display: 'none' }} 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt" 
                  />
                </div>

                {uploading && (
                  <div className="upload-progress" style={{ background: '#fff', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid var(--border)' }}>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${uploadPercent}%`, height: '4px', background: 'var(--crimson)' }}></div>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--mid-gray)', marginTop: '8px' }}>Encrypting and securing upload in transit...</p>
                  </div>
                )}

                <div className="section-card">
                  {docs.length === 0 ? (
                    <div className="empty-state">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                      <p>Your vault is empty</p>
                      <span>Upload files to keep them safe and encryption-backed.</span>
                    </div>
                  ) : (
                    <div className="doc-grid">
                      {docs.map((doc) => (
                        <div key={doc.id} style={{ position: 'relative' }}>
                          <a href={doc.downloadUrl} target="_blank" rel="noopener noreferrer" className="doc-card" style={{ textDecoration: 'none', display: 'flex' }}>
                            <svg className="doc-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <div className="doc-name">{doc.fileName}</div>
                            <div className="doc-size">{formatSize(doc.fileSize)}</div>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

    </div>
  );
};
export default Dashboard;
