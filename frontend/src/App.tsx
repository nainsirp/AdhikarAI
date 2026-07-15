import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './layouts/Layout';
import { AuthGuard, GuestGuard } from './routes/guards';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import AskAI from './pages/AskAI';
import DraftNotices from './pages/DraftNotices';
import FeaturesPage from './pages/FeaturesPage';
import HowItWorks from './pages/HowItWorks';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Layout Routes */}
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
            <Route path="/features" element={<Layout><FeaturesPage /></Layout>} />

            {/* Guest Guard Routes (Only accessible when logged out) */}
            <Route path="/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
            <Route path="/signup" element={<GuestGuard><SignupPage /></GuestGuard>} />

            {/* Auth Guard Protected Routes */}
            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/ask-ai" element={<AuthGuard><AskAI /></AuthGuard>} />
            <Route path="/draft-notices" element={<AuthGuard><DraftNotices /></AuthGuard>} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
