import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

export const AskAI: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // States
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // UI States
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [recording, setRecording] = useState(false);

  // Suggestions
  const suggestions = [
    'What are my rights in domestic abuse?',
    'How do I file a police report?',
    'What is the Domestic Violence Act?',
    'Explain child custody rights in India'
  ];

  // Speech Recognition setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for web speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN'; // Default to Indian English/Hindi compatibility

      rec.onstart = () => setRecording(true);
      rec.onend = () => setRecording(false);
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMsg((prev) => prev + ' ' + transcript);
      };
      recognitionRef.current = rec;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (recording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Load user sessions list
  const fetchSessions = async () => {
    try {
      const res = await apiClient.get('/ai/chat/sessions');
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Load active session history from URL param
  const loadActiveSession = async (sessionId: string) => {
    try {
      setLoadingHistory(true);
      const res = await apiClient.get(`/ai/chat/history/${sessionId}`);
      setMessages(res.data.messages || []);
      setCurrentSessionId(sessionId);
    } catch (err) {
      console.error('Failed to load chat history:', err);
      // Remove bad session param
      setSearchParams({});
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    const sessionParam = searchParams.get('session');
    if (sessionParam) {
      loadActiveSession(sessionParam);
    } else {
      setMessages([]);
      setCurrentSessionId(null);
    }
  }, [searchParams]);

  // Scroll to bottom when message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message to UI immediately
    const userMsg: Message = {
      sender: 'user',
      text: text,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setLoading(true);

    try {
      const res = await apiClient.post('/ai/chat', {
        message: text,
        sessionId: currentSessionId
      });

      if (res.data.status === 'success') {
        const aiMsg: Message = {
          sender: 'ai',
          text: res.data.reply,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, aiMsg]);

        // If it was a new session, sync session ID
        if (!currentSessionId) {
          const newId = res.data.sessionId;
          setCurrentSessionId(newId);
          setSearchParams({ session: newId });
          fetchSessions(); // Refresh list
        }
      }
    } catch (err) {
      console.error('Failed to fetch AI reply:', err);
      const errMsg: Message = {
        sender: 'ai',
        text: 'Sorry, I encountered an issue while generating a reply. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setSearchParams({});
    setMessages([]);
    setCurrentSessionId(null);
  };

  const getInitials = (name: string) => {
    return (name || 'U')[0].toUpperCase();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--warm-gray)', overflow: 'hidden' }}>
      
      {/* LEFT CHAT SESSIONS DRAWER */}
      <aside className="sidebar" style={{ position: 'relative', height: '100%', borderRight: '1px solid var(--border)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
          <Link to="/dashboard" className="btn-social" style={{ padding: '8px 12px', flex: 'none' }}>
            ← Back
          </Link>
          <button 
            className="btn-upload" 
            onClick={startNewChat}
            style={{ flex: 1, justifySelf: 'stretch', padding: '8px 12px', fontSize: '0.78rem' }}
          >
            + New Chat
          </button>
        </div>

        <div className="sidebar-nav" style={{ overflowY: 'auto', flex: 1, padding: '12px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--light-gray)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', paddingLeft: '12px' }}>
            Past Consultations
          </p>
          {sessions.length === 0 ? (
            <p style={{ fontSize: '0.75rem', color: 'var(--mid-gray)', textAlign: 'center', marginTop: '16px' }}>
              No past sessions
            </p>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                className={`nav-item ${currentSessionId === s.id ? 'active' : ''}`}
                onClick={() => setSearchParams({ session: s.id })}
                style={{ fontSize: '0.78rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', width: '100%' }}
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                {s.title}
              </button>
            ))
          )}
        </div>
      </aside>

      {/* CHAT WINDOW */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', marginLeft: '240px' }}>
        
        {/* HEADER */}
        <header className="navbar" style={{ position: 'relative', borderBottom: '1px solid var(--border)', background: '#fff', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>AI Legal Companion</h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--mid-gray)' }}>Empathetic Q&A backed by BNS / IPC references</p>
          </div>
          {user && (
            <div className="user-chip">
              <div className="user-chip-avatar" style={{ background: 'var(--crimson)', color: '#fff' }}>{getInitials(user.name)}</div>
              <span>{user.name}</span>
            </div>
          )}
        </header>

        {/* MESSAGES LIST */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: '#FDFDFD', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loadingHistory ? (
            <div className="files-loading" style={{ display: 'block', margin: 'auto' }}>
              <span className="spinner"></span>Loading consultation history...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '400px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#FFF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--crimson)' }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '8px' }}>Ask AdhikarAI</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--mid-gray)', lineHeight: '1.5' }}>
                Ask questions about your legal standing, police complaint filing processes, domestic abuse protection, or child custody rules.
              </p>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div key={idx} className={`msg-wrap ${m.sender === 'user' ? 'user' : 'ai'}`} style={{ display: 'flex', flexDirection: 'column', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                <div className="msg-bubble" style={{ 
                  padding: '12px 16px', 
                  borderRadius: '12px', 
                  fontSize: '0.85rem', 
                  lineHeight: '1.5',
                  background: m.sender === 'user' ? 'var(--crimson)' : '#fff',
                  color: m.sender === 'user' ? '#fff' : 'var(--charcoal)',
                  border: m.sender === 'user' ? 'none' : '1.5px solid var(--border)',
                  borderTopRightRadius: m.sender === 'user' ? '2px' : '12px',
                  borderTopLeftRadius: m.sender === 'ai' ? '2px' : '12px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {m.text}
                </div>
                <span className="msg-time" style={{ fontSize: '0.65rem', color: 'var(--light-gray)', marginTop: '4px', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
          {loading && (
            <div className="msg-wrap ai" style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start' }}>
              <div className="msg-bubble" style={{ padding: '12px 16px', borderRadius: '12px', background: '#fff', border: '1.5px solid var(--border)', borderTopLeftRadius: '2px' }}>
                <span className="spinner" style={{ width: '14px', height: '14px', marginRight: '6px' }}></span>Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* SUGGESTED PILLS */}
        {messages.length === 0 && (
          <div className="suggestions-container">
            <p className="suggestions-title">Common Enquiries</p>
            <div className="suggestions-list">
              {suggestions.map((s, idx) => (
                <button key={idx} className="suggestion-pill" onClick={() => handleSendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* INPUT FORM */}
        <div className="chat-input-area">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputMsg); }}
            className="chat-input-container"
          >
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Describe your query in English, Hindi, or regional languages..." 
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              disabled={loading}
            />
            
            {/* MIC BUTTON */}
            <button 
              type="button" 
              className="input-action-btn"
              onClick={toggleRecording}
              style={{ color: recording ? 'var(--crimson)' : 'var(--mid-gray)', background: recording ? '#FFF0F0' : '' }}
              title="Speak to type"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>

            {/* SEND BUTTON */}
            <button 
              type="submit" 
              className="input-action-btn"
              disabled={!inputMsg.trim() || loading}
              style={{ color: inputMsg.trim() ? 'var(--crimson)' : 'var(--light-gray)' }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
export default AskAI;
