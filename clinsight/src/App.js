// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/fonts.css';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './providers/AuthProvider';
import LoginPage from './pages/login/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import StudyDetailPage from './pages/dashboard/StudyDetailPage';  // Import the new StudyDetailPage component
import UnauthorizedPage from './pages/UnauthorizedPage';
import GlobalStyle from './styles/GlobalStyles';
import Layout from './components/Layout';
import UserProfilePage from './pages/UserProfilePage';
import Sources from './pages/source/Sources';
import NIH from './pages/source/NIH';
import Pubmed from './pages/source/Pubmed';
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage';
import AdminUserPage from './pages/User/AdminUserPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <GlobalStyle />
      <Routes>
        {/* Login Page - No Header/Footer */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin-Only Dashboard */}
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminDashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Admin-Only Users */}
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminUserPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Protected Study Detail Page Route */}
        <Route
          path="/study/:studyId"
          element={
            <ProtectedRoute>
              <Layout>
                <StudyDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Profile Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <UserProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sources"
          element={
            <ProtectedRoute>
              <Layout>
                <Sources />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nih"
          element={
            <ProtectedRoute>
              <Layout>
                <NIH />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pubmed"
          element={
            <ProtectedRoute>
              <Layout>
                <Pubmed />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Unauthorized Page */}
        <Route
          path="/unauthorized"
          element={
            <Layout>
              <UnauthorizedPage />
            </Layout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
