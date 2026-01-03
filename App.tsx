import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import VerificationPage from './pages/VerificationPage';
import VerificationStatusPage from './pages/VerificationStatusPage';
import ConstituencyDashboard from './pages/ConstituencyDashboard';
import PreElectionPage from './pages/PreElectionPage';
import PostElectionPage from './pages/PostElectionPage';
import CandidateApplyPage from './pages/CandidateApplyPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './services/authService';
import { LanguageProvider } from './contexts/LanguageContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HashRouter>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Verification Routes */}
              <Route path="/verify" element={
                <ProtectedRoute allowedRoles={['citizen', 'candidate', 'mp']}>
                  <VerificationPage />
                </ProtectedRoute>
              } />
              <Route path="/verification-status" element={
                <ProtectedRoute allowedRoles={['citizen', 'candidate', 'mp']}>
                  <VerificationStatusPage />
                </ProtectedRoute>
              } />

              {/* Constituency Routes - Protected by Verification */}
              <Route path="/constituency/:id" element={
                <ProtectedRoute allowedRoles={['citizen', 'candidate', 'mp']} requireVerification={true}>
                  <ConstituencyDashboard />
                </ProtectedRoute>
              } />
              <Route path="/constituency/:id/pre-election" element={
                <ProtectedRoute allowedRoles={['citizen', 'candidate', 'mp']} requireVerification={true}>
                  <PreElectionPage />
                </ProtectedRoute>
              } />
              <Route path="/constituency/:id/post-election" element={
                <ProtectedRoute allowedRoles={['citizen', 'candidate', 'mp']} requireVerification={true}>
                  <PostElectionPage />
                </ProtectedRoute>
              } />
              <Route path="/constituency/:id/apply" element={
                <ProtectedRoute allowedRoles={['citizen']} requireVerification={true}>
                  <CandidateApplyPage />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;