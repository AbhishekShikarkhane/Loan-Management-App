import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FaSearch, FaFilter, FaFilePdf, FaChartPie, FaRegBell, FaUserCircle, FaMoon, FaSun, FaSortAmountDown } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const LoanPage = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFilters, setShowFilters] = useState(false);
  
  // Loan statistics
  const [loanStats, setLoanStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    completedLoans: 0,
    overdueLoans: 0,
    totalAmount: 0,
    recoveredAmount: 0,
    overdueAmount: 0,
    avgCibilScore: 0
  });

  // Charts data
  const [cibilData, setCibilData] = useState({
    labels: [],
    datasets: []
  });
  
  const [loanDistributionData, setLoanDistributionData] = useState({
    labels: [],
    datasets: []
  });

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Initialize theme on component mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch loan data
  useEffect(() => {
    // Simulate API call to fetch loan data
    setTimeout(() => {
      // Mock loan data
      const mockLoans = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        userId: `USER${i + 100}`,
        userName: `User ${i + 1}`,
        amount: Math.floor(Math.random() * 50000) + 20000,
        emi: Math.floor(Math.random() * 2000) + 1000,
        tenure: 12,
        paidInstallments: Math.floor(Math.random() * 12),
        cibilScore: Math.floor(Math.random() * 300) + 400,
        status: ['active', 'completed', 'overdue'][Math.floor(Math.random() * 3)],
        applicationDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lastPaymentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        loanType: ['Personal', 'Business', 'Home', 'Education'][Math.floor(Math.random() * 4)]
      }));

      // Calculate loan statistics
      const activeLoans = mockLoans.filter(loan => loan.status === 'active');
      const completedLoans = mockLoans.filter(loan => loan.status === 'completed');
      const overdueLoans = mockLoans.filter(loan => loan.status === 'overdue');
      
      const stats = {
        totalLoans: mockLoans.length,
        activeLoans: activeLoans.length,
        completedLoans: completedLoans.length,
        overdueLoans: overdueLoans.length,
        totalAmount: mockLoans.reduce((sum, loan) => sum + loan.amount, 0),
        recoveredAmount: mockLoans.reduce((sum, loan) => sum + (loan.paidInstallments * loan.emi), 0),
        overdueAmount: overdueLoans.reduce((sum, loan) => sum + (loan.emi * (loan.tenure - loan.paidInstallments)), 0),
        avgCibilScore: Math.round(mockLoans.reduce((sum, loan) => sum + loan.cibilScore, 0) / mockLoans.length)
      };

      // Generate CIBIL score chart data
      const cibilData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Average CIBIL Score',
          data: [650, 680, 670, 700, 690, 720, 710],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      };
      
      // Generate loan distribution data for pie chart
      const loanDistributionData = {
        labels: ['Personal', 'Business', 'Home', 'Education'],
        datasets: [{
          data: [
            mockLoans.filter(loan => loan.loanType === 'Personal').length,
            mockLoans.filter(loan => loan.loanType === 'Business').length,
            mockLoans.filter(loan => loan.loanType === 'Home').length,
            mockLoans.filter(loan => loan.loanType === 'Education').length
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(139, 92, 246, 0.7)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(139, 92, 246, 1)'
          ],
          borderWidth: 1
        }]
      };

      setLoans(mockLoans);
      setFilteredLoans(mockLoans);
      setLoanStats(stats);
      setCibilData(cibilData);
      setLoanDistributionData(loanDistributionData);
      setIsLoading(false);
    }, 1500);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...loans];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(loan => 
        loan.userName.toLowerCase().includes(term) || 
        loan.userId.toLowerCase().includes(term) ||
        loan.loanType.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(loan => loan.status === statusFilter);
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredLoans(result);
  }, [loans, searchTerm, statusFilter, sortConfig]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle view details
  const handleViewDetails = (loanId) => {
    console.log(`Viewing details for loan ${loanId}`);
    // Navigate to the loan detail page
    window.location.href = `/leader/loans/${loanId}`;
  };

  // Handle record payment
  const handleRecordPayment = (loanId) => {
    console.log(`Recording payment for loan ${loanId}`);
    // Navigate to the payment page
    window.location.href = `/leader/loans/${loanId}/payment`;
  };
  
  // Handle loan approval
  const handleApprove = (loanId) => {
    console.log(`Approving loan ${loanId}`);
    // Navigate to the approval page
    window.location.href = `/leader/loans/${loanId}/approve`;
  };
  
  // Handle loan rejection
  const handleReject = (loanId) => {
    console.log(`Rejecting loan ${loanId}`);
    // Navigate to the rejection page
    window.location.href = `/leader/loans/${loanId}/reject`;
  };

  // PDF styles
  const styles = StyleSheet.create({
    pdfPage: {
      padding: 30,
      backgroundColor: '#FFFFFF'
    },
    pdfHeader: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#112233',
      paddingBottom: 10
    },
    pdfTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#112233'
    },
    pdfDate: {
      fontSize: 12,
      color: '#666666'
    },
    pdfSection: {
      marginBottom: 15
    },
    pdfSectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#112233'
    },
    pdfStats: {
      gap: 8
    }
  });

  // PDF Document component
  const LoanPDF = ({ loanStats }) => (
    <Document>
      <Page size="A4" style={styles.pdfPage}>
        <View style={styles.pdfHeader}>
          <Text style={styles.pdfTitle}>Loan Management Report</Text>
          <Text style={styles.pdfDate}>{new Date().toLocaleDateString()}</Text>
        </View>
        
        <View style={styles.pdfSection}>
          <Text style={styles.pdfSectionTitle}>Loan Statistics</Text>
          <View style={styles.pdfStats}>
            <Text>Total Loans: {loanStats.totalLoans}</Text>
            <Text>Active Loans: {loanStats.activeLoans}</Text>
            <Text>Completed Loans: {loanStats.completedLoans}</Text>
            <Text>Overdue Loans: {loanStats.overdueLoans}</Text>
            <Text>Total Amount: ₹{loanStats.totalAmount.toLocaleString()}</Text>
            <Text>Recovered Amount: ₹{loanStats.recoveredAmount.toLocaleString()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-10 bg-blue-600 rounded w-48"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm h-24">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm h-64">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                {[...Array(7)].map((_, i) => (
                  <th key={i} className="px-6 py-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-t">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <header className="bg-gray-800 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Loan Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              {!isLoading && (
                <PDFDownloadLink
                  document={<LoanPDF loanStats={loanStats} />}
                  fileName="loan-report.pdf"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? 'Generating PDF...' : (
                      <>
                        <FaFilePdf className="mr-2" />
                        Export PDF
                      </>
                    )
                  }
                </PDFDownloadLink>
              )}
              <Link 
                to="/leader/loans/new" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
              >
                <span className="mr-2">+</span> New Loan Application
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-6">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Loans</h3>
                <p className="text-2xl font-bold mt-2">{loanStats.totalLoans}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Loans</h3>
                <p className="text-2xl font-bold mt-2 text-blue-600 dark:text-blue-400">{loanStats.activeLoans}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Loans</h3>
                <p className="text-2xl font-bold mt-2 text-green-600 dark:text-green-400">{loanStats.completedLoans}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue Loans</h3>
                <p className="text-2xl font-bold mt-2 text-red-600 dark:text-red-400">{loanStats.overdueLoans}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</h3>
                <p className="text-2xl font-bold mt-2">₹{loanStats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. CIBIL Score</h3>
                <p className="text-2xl font-bold mt-2">{loanStats.avgCibilScore}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">CIBIL Score Trends</h3>
                <div className="h-64">
                  <Line data={cibilData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">Loan Distribution</h3>
                <div className="h-64">
                  <Pie data={loanDistributionData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            {/* Loans Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-wrap gap-4">
                <h3 className="text-lg font-medium">Loan Applications</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search loans..."
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <FaFilter className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
              
              {showFilters && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Sort By</label>
                      <div className="flex items-center space-x-2">
                        <select
                          className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={sortConfig.key || 'applicationDate'}
                          onChange={(e) => requestSort(e.target.value)}
                        >
                          <option value="applicationDate">Application Date</option>
                          <option value="amount">Amount</option>
                          <option value="cibilScore">CIBIL Score</option>
                        </select>
                        <button
                          onClick={() => setSortConfig({
                            key: sortConfig.key || 'applicationDate',
                            direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
                          })}
                          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <FaSortAmountDown className={`text-gray-500 dark:text-gray-400 transform ${sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CIBIL Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Application Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredLoans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                              {loan.userName.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{loan.userName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{loan.userId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">₹{loan.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">EMI: ₹{loan.emi.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{loan.cibilScore}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${loan.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                            ${loan.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                            ${loan.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                          `}>
                            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{loan.applicationDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{loan.loanType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleViewDetails(loan.id)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              View
                            </button>
                            {loan.status === 'active' && (
                              <button
                                onClick={() => handleRecordPayment(loan.id)}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              >
                                Pay
                              </button>
                            )}
                            {loan.status !== 'completed' && loan.status !== 'active' && (
                              <button
                                onClick={() => handleApprove(loan.id)}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              >
                                Approve
                              </button>
                            )}
                            {loan.status !== 'completed' && loan.status !== 'active' && (
                              <button
                                onClick={() => handleReject(loan.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredLoans.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No loans found matching your criteria.</p>
                </div>
              )}
              
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-medium">{filteredLoans.length}</span> of <span className="font-medium">{loans.length}</span> loans
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoanPage;