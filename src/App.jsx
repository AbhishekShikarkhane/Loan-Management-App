import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Layouts
import MainLayout from './layouts/MainLayout'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import LogoutPage from './pages/LogoutPage'

// Leader Pages
import DashboardPage from './pages/leader/DashboardPage'
import UsersListPage from './pages/leader/UsersListPage'
import AddUserPage from './pages/leader/AddUserPage'
import EditUserPage from './pages/leader/EditUserPage'
import UserLedgerPage from './pages/leader/UserLedgerPage'
import AddTransactionPage from './pages/leader/AddTransactionPage'
import ReportsPage from './pages/leader/ReportsPage'
import NotificationsPage from './pages/leader/NotificationsPage'
import AlertsPage from './pages/leader/AlertsPage'
import ProfilePage from './pages/leader/ProfilePage'
import HelpPage from './pages/leader/HelpPage'
import SeniorAmountPage from './pages/leader/SeniorAmountPage'
import LoanPage from './pages/leader/LoanPage'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>
    }
    return this.props.children
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken')
    setIsAuthenticated(!!authToken)
  }, [])

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/leader/dashboard" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/logout" element={<LogoutPage setIsAuthenticated={setIsAuthenticated} />} />
          
          {/* Protected Routes */}
          <Route path="/leader" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersListPage />} />
            <Route path="users/add" element={<AddUserPage />} />
            <Route path="users/:id/edit" element={<EditUserPage />} />
            <Route path="users/:id/ledger" element={<UserLedgerPage />} />
            <Route path="transactions/add" element={<AddTransactionPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="senior-amount" element={<SeniorAmountPage />} />
            <Route path="loans" element={<LoanPage />} />
          </Route>
          
          {/* Redirect root to dashboard if authenticated, otherwise to login */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/leader/dashboard" /> : <Navigate to="/login" />} />
          
          {/* Catch all - redirect to dashboard if authenticated, otherwise to login */}
          <Route path="*" element={isAuthenticated ? <Navigate to="/leader/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  )
}

export default App
