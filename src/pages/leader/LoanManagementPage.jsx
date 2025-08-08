import { useState, useEffect, useMemo } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { PDFDownloadLink } from '@react-pdf/renderer';
import LoanReportPDF from './LoanReportPDF'; // You'll need to create this component

const LoanManagementPage = () => {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Generate more comprehensive mock data
  const generateMockLoans = () => {
    const statuses = ['active', 'completed', 'overdue'];
    const mockLoans = Array.from({ length: 25 }, (_, i) => {
      const amount = Math.floor(Math.random() * 50000) + 10000;
      const interestRate = (Math.random() * 5 + 10).toFixed(2);
      const tenure = Math.floor(Math.random() * 12) + 6;
      const emiAmount = Math.floor((amount * (1 + interestRate/100)) / tenure);
      const civilScore = Math.floor(Math.random() * 300) + 500;
      const status = statuses[Math.floor(Math.random() * 3)];
      const startDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
      const completionDate = new Date(startDate.getTime() + tenure * 30 * 24 * 60 * 60 * 1000);
      const paidInstallments = Math.floor(Math.random() * tenure);
      const overdueDays = status === 'overdue' ? Math.floor(Math.random() * 30) + 1 : 0;
      
      return {
        id: i + 1,
        userId: `UID${Math.floor(Math.random() * 1000) + 1000}`,
        userName: `User ${Math.floor(Math.random() * 100) + 1}`,
        userEmail: `user${i+1}@example.com`,
        amount,
        interestRate,
        tenure,
        emiAmount: Math.round(emiAmount),
        civilScore,
        status,
        startDate: startDate.toISOString().split('T')[0],
        completionDate: completionDate.toISOString().split('T')[0],
        paidInstallments,
        totalInstallments: tenure,
        overdueDays,
        lastPaymentDate: new Date(startDate.getTime() + paidInstallments * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        collateral: ['Property', 'Vehicle', 'Jewelry', 'None'][Math.floor(Math.random() * 4)],
        purpose: ['Home Renovation', 'Education', 'Medical', 'Business', 'Personal'][Math.floor(Math.random() * 5)]
      };
    });
    return mockLoans;
  };

  useEffect(() => {
    // Check for dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedMode = localStorage.getItem('darkMode');
    setDarkMode(storedMode ? JSON.parse(storedMode) : prefersDark);

    // Simulate API call with more realistic delay
    setTimeout(() => {
      const mockLoans = generateMockLoans();
      setLoans(mockLoans);
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Calculate loan statistics
  const loanStats = useMemo(() => {
    const filteredLoans = loans.filter(loan => {
      const matchesSearch = loan.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          loan.userId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === 'all' || loan.status === activeTab;
      return matchesSearch && matchesTab;
    });

    return {
      totalLoans: filteredLoans.length,
      activeLoans: filteredLoans.filter(loan => loan.status === 'active').length,
      completedLoans: filteredLoans.filter(loan => loan.status === 'completed').length,
      overdueLoans: filteredLoans.filter(loan => loan.status === 'overdue').length,
      totalAmount: filteredLoans.reduce((sum, loan) => sum + loan.amount, 0),
      recoveredAmount: filteredLoans.reduce((sum, loan) => {
        const recoveredPercentage = loan.paidInstallments / loan.totalInstallments;
        return sum + (loan.amount * recoveredPercentage);
      }, 0),
      overdueAmount: filteredLoans.filter(loan => loan.status === 'overdue')
        .reduce((sum, loan) => sum + (loan.emiAmount * (loan.overdueDays/30)), 0)
    };
  }, [loans, searchTerm, activeTab]);

  // Generate chart data
  const civilScoreData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Average Civil Score',
      data: [650, 680, 670, 690, 710, 700, 720],
      borderColor: darkMode ? '#93C5FD' : '#3B82F6',
      backgroundColor: darkMode ? '#1E3A8A' : '#EFF6FF',
      tension: 0.4,
      fill: true
    }]
  }), [darkMode]);

  const loanDistributionData = useMemo(() => ({
    labels: ['Active', 'Completed', 'Overdue'],
    datasets: [{
      data: [loanStats.activeLoans, loanStats.completedLoans, loanStats.overdueLoans],
      backgroundColor: [
        darkMode ? '#10B981' : '#059669',
        darkMode ? '#3B82F6' : '#2563EB',
        darkMode ? '#EF4444' : '#DC2626'
      ],
      borderColor: darkMode ? '#1F2937' : '#F3F4F6',
      borderWidth: 1
    }]
  }), [loanStats, darkMode]);

  const handleViewDetails = (loanId) => {
    // In a real app, this would navigate to a details page
    console.log(`Viewing details for loan ${loanId}`);
    alert(`Viewing details for loan ${loanId}`);
  };

  const handleNewLoan = () => {
    // In a real app, this would open a new loan form
    console.log('Opening new loan application');
    alert('Opening new loan application form');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading loan data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Loan Management Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={handleNewLoan}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Loan Application
            </button>
          </div>
        </header>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search loans by user name or ID..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'} transition-colors`}
            >
              All Loans
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-md ${activeTab === 'active' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'} transition-colors`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-md ${activeTab === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'} transition-colors`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`px-4 py-2 rounded-md ${activeTab === 'overdue' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'} transition-colors`}
            >
              Overdue
            </button>
          </div>
        </div>

        {/* Loan Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-l-4 border-blue-500 transition-transform hover:scale-[1.02]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Loans</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{loanStats.totalLoans}</h3>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Total amount: <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(loanStats.totalAmount)}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-l-4 border-green-500 transition-transform hover:scale-[1.02]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Loans</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{loanStats.activeLoans}</h3>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              In progress
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-l-4 border-blue-500 transition-transform hover:scale-[1.02]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed Loans</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{loanStats.completedLoans}</h3>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Recovered: <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(loanStats.recoveredAmount)}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-l-4 border-red-500 transition-transform hover:scale-[1.02]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overdue Loans</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{loanStats.overdueLoans}</h3>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Overdue amount: <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(loanStats.overdueAmount)}</span>
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Civil Score Trends</h2>
              <div className="flex items-center gap-2">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <PDFDownloadLink 
                  document={<LoanReportPDF loanStats={loanStats} />} 
                  fileName="loan-management-report.pdf"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {({ loading }) => (
                    loading ? 'Preparing...' : 
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                </PDFDownloadLink>
              </div>
            </div>
            <div className="h-64">
              <Line 
                data={civilScoreData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: darkMode ? '#E5E7EB' : '#374151'
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        color: darkMode ? '#374151' : '#E5E7EB'
                      },
                      ticks: {
                        color: darkMode ? '#9CA3AF' : '#6B7280'
                      }
                    },
                    y: {
                      grid: {
                        color: darkMode ? '#374151' : '#E5E7EB'
                      },
                      ticks: {
                        color: darkMode ? '#9CA3AF' : '#6B7280'
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Loan Distribution</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total: {loanStats.totalLoans}
              </div>
            </div>
            <div className="h-64">
              <Pie 
                data={loanDistributionData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: darkMode ? '#E5E7EB' : '#374151'
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Loan Applications</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {loans.filter(loan => {
                const matchesSearch = loan.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    loan.userId.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesTab = activeTab === 'all' || loan.status === activeTab;
                return matchesSearch && matchesTab;
              }).length} of {loans.length} loans
            </div>
          </div>
          
          {loans.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No loans found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new loan application to get started.</p>
              <button 
                onClick={handleNewLoan}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Loan Application
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Loan Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Civil Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {loans.filter(loan => {
                    const matchesSearch = loan.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                        loan.userId.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesTab = activeTab === 'all' || loan.status === activeTab;
                    return matchesSearch && matchesTab;
                  }).map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {loan.userName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{loan.userName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{loan.userId}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{loan.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{formatCurrency(loan.amount)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {loan.interestRate}% interest · {loan.tenure} months
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          EMI: {formatCurrency(loan.emiAmount)} · {loan.purpose}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              loan.status === 'overdue' ? 'bg-red-600' : 
                              loan.status === 'completed' ? 'bg-blue-600' : 'bg-green-600'
                            }`}
                            style={{ width: `${(loan.paidInstallments / loan.totalInstallments) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {loan.paidInstallments}/{loan.totalInstallments} EMIs paid
                        </div>
                        {loan.status === 'overdue' && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {loan.overdueDays} days overdue
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            loan.civilScore >= 750 ? 'bg-green-500' : 
                            loan.civilScore >= 650 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></span>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{loan.civilScore}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {loan.civilScore >= 750 ? 'Excellent' : 
                               loan.civilScore >= 650 ? 'Good' : 'Fair'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            loan.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : loan.status === 'completed'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {loan.startDate} to {loan.completionDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewDetails(loan.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Loan Management System. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">Contact Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoanManagementPage;