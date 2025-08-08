import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar, Line, Pie } from 'react-chartjs-2';
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
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DashboardPDF from './DashboardPDF';

// Register ChartJS components
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

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [stats, setStats] = useState(null);
  
  const defaultStats = {
    totalCredit: 0,
    totalDebit: 0,
    balance: 0,
    transactionCount: 0,
    userCount: 0,
    pendingLoans: 0,
    overdueEMIs: 0,
    negativeBalanceUsers: 0,
    inactiveUsers: 0,
    newUsers: 0,
    topUser: { name: '', balance: 0 },
    loanDistribution: [],
    transactionTrends: [],
    userGrowth: []
  };
  
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [],
  });
  
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [chartType, setChartType] = useState('bar');
  const [dashboardFilter, setDashboardFilter] = useState('all');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionInfo] = useState({
    lastLogin: new Date().toISOString(),
    location: 'Mumbai, IN',
    device: 'Chrome on Windows'
  });

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Apply theme on component mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from your API
        // const response = await axios.get('/api/dashboard');
        // setStats(response.data);
        
        // Using mock data
        setMockData();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeFilter, dashboardFilter]);

  const setMockData = () => {
    // Generate more realistic mock data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
    
    const labels = timeFilter === 'weekly' ? weeks : timeFilter === 'monthly' ? months : years;
    
    // Mock stats data with more realistic values
    const mockStats = {
      totalCredit: 1250000,
      totalDebit: 750000,
      balance: 500000,
      transactionCount: 1245,
      userCount: 245,
      pendingLoans: 18,
      overdueEMIs: 32,
      negativeBalanceUsers: 15,
      inactiveUsers: 27,
      newUsers: 13,
      topUser: { name: 'Raj Sharma', balance: 125000 },
      loanDistribution: [
        { type: 'Personal', count: 45, amount: 4500000 },
        { type: 'Business', count: 28, amount: 8400000 },
        { type: 'Education', count: 32, amount: 3200000 },
        { type: 'Home', count: 15, amount: 7500000 }
      ],
      transactionTrends: labels.map((_, i) => ({
        month: labels[i],
        credit: Math.floor(Math.random() * 200000) + 50000,
        debit: Math.floor(Math.random() * 150000) + 30000
      })),
      userGrowth: labels.map((_, i) => ({
        period: labels[i],
        count: Math.floor(Math.random() * 50) + 10
      }))
    };
    
    setStats(mockStats);

    // Main chart data
    setChartData({
      labels,
      datasets: [
        {
          label: 'Credit',
          data: mockStats.transactionTrends.map(t => t.credit),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          tension: 0.3
        },
        {
          label: 'Debit',
          data: mockStats.transactionTrends.map(t => t.debit),
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          tension: 0.3
        },
      ],
    });
    
    // Pie chart data for loan distribution
    setPieData({
      labels: mockStats.loanDistribution.map(l => l.type),
      datasets: [
        {
          data: mockStats.loanDistribution.map(l => l.count),
          backgroundColor: [
            'rgba(99, 102, 241, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)'
          ],
          borderColor: [
            'rgba(99, 102, 241, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)'
          ],
          borderWidth: 1,
        },
      ],
    });

    // Mock recent transactions
    const mockTransactions = [
      { _id: '1', user: { name: 'John Doe', email: 'john@example.com' }, amount: 50000, type: 'credit', description: 'Loan repayment', createdAt: new Date().toISOString() },
      { _id: '2', user: { name: 'Jane Smith', email: 'jane@example.com' }, amount: 25000, type: 'debit', description: 'Withdrawal', createdAt: new Date(Date.now() - 86400000).toISOString() },
      { _id: '3', user: { name: 'Mike Johnson', email: 'mike@example.com' }, amount: 75000, type: 'credit', description: 'Deposit', createdAt: new Date(Date.now() - 172800000).toISOString() },
      { _id: '4', user: { name: 'Sarah Williams', email: 'sarah@example.com' }, amount: 10000, type: 'debit', description: 'Service fee', createdAt: new Date(Date.now() - 259200000).toISOString() },
      { _id: '5', user: { name: 'Robert Brown', email: 'robert@example.com' }, amount: 35000, type: 'credit', description: 'Investment return', createdAt: new Date(Date.now() - 345600000).toISOString() },
      { _id: '6', user: { name: 'Priya Patel', email: 'priya@example.com' }, amount: 42000, type: 'debit', description: 'Loan EMI', createdAt: new Date(Date.now() - 432000000).toISOString() },
      { _id: '7', user: { name: 'Amit Kumar', email: 'amit@example.com' }, amount: 18000, type: 'credit', description: 'Salary credit', createdAt: new Date(Date.now() - 518400000).toISOString() },
    ];
    
    setRecentTransactions(mockTransactions);

    // Mock recent activities
    setRecentActivities([
      { _id: 'a1', user: 'Raj Sharma', action: 'credited ₹50,000', description: 'Loan repayment', timestamp: new Date().toISOString(), icon: 'credit' },
      { _id: 'a2', user: 'Priya Patel', action: 'missed EMI payment', description: 'Overdue by 5 days', timestamp: new Date(Date.now() - 3600000).toISOString(), icon: 'warning' },
      { _id: 'a3', user: 'System', action: 'created new loan', description: 'For Amit Kumar (₹250,000)', timestamp: new Date(Date.now() - 7200000).toISOString(), icon: 'loan' },
      { _id: 'a4', user: 'Neha Gupta', action: 'registered', description: 'New user account', timestamp: new Date(Date.now() - 10800000).toISOString(), icon: 'user' },
      { _id: 'a5', user: 'Vikram Singh', action: 'withdrew ₹120,000', description: 'ATM withdrawal', timestamp: new Date(Date.now() - 14400000).toISOString(), icon: 'debit' },
      { _id: 'a6', user: 'System', action: 'interest calculated', description: 'For all savings accounts', timestamp: new Date(Date.now() - 18000000).toISOString(), icon: 'interest' },
    ]);

    // Mock alerts
    setAlerts([
      { _id: 'n1', type: 'warning', title: 'Overdue Payment', message: 'Amit Kumar has overdue EMI of ₹25,000', timestamp: new Date().toISOString(), read: false },
      { _id: 'n2', type: 'danger', title: 'Low Balance', message: '15 users have negative balance', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
      { _id: 'n3', type: 'info', title: 'New User', message: 'Neha Gupta registered today', timestamp: new Date(Date.now() - 7200000).toISOString(), read: true },
      { _id: 'n4', type: 'warning', title: 'Loan Approval', message: '18 loans pending approval', timestamp: new Date(Date.now() - 10800000).toISOString(), read: true },
      { _id: 'n5', type: 'info', title: 'System Update', message: 'Scheduled maintenance tonight at 2 AM', timestamp: new Date(Date.now() - 14400000).toISOString(), read: false },
    ]);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time ago
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    
    return formatDate(dateString);
  };

  // Filter transactions based on search
  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return recentTransactions;
    
    return recentTransactions.filter(transaction => 
      transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatCurrency(transaction.amount).includes(searchTerm)
    );
  }, [recentTransactions, searchTerm]);

  // Mark alert as read
  const markAlertAsRead = (id) => {
    setAlerts(alerts.map(alert => 
      alert._id === id ? { ...alert, read: true } : alert
    ));
  };

  // Mark all alerts as read
  const markAllAlertsAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  // Refresh dashboard data
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setMockData();
      setLoading(false);
    }, 1000);
  };

  // Handle view details for different sections
  const handleViewDetails = (section) => {
    switch(section) {
      case 'transactions':
        navigate('/transactions');
        break;
      case 'users':
        navigate('/users');
        break;
      case 'loans':
        navigate('/loans');
        break;
      case 'alerts':
        navigate('/alerts');
        break;
      default:
        break;
    }
  };

  // Handle logout
  const handleLogout = () => {
    // In a real app, you would call your logout API
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-200">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Project Leader Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            <button
              onClick={refreshData}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
              title="Refresh data"
            >
              🔄
            </button>
            
            <PDFDownloadLink 
              document={<DashboardPDF stats={stats} />} 
              fileName="dashboard-report.pdf"
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
              title="Export to PDF"
            >
              {({ loading }) => loading ? 'Generating...' : '📑'}
            </PDFDownloadLink>
            
            <div className="relative">
              <button 
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => navigate('/profile')}
                title="User profile"
              >
                👤
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform hover:scale-105 transition-transform duration-200 cursor-pointer"
          onClick={() => handleViewDetails('transactions')}
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Credit</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalCredit)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+12.5% from last month</p>
        </div>
        
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform hover:scale-105 transition-transform duration-200 cursor-pointer"
          onClick={() => handleViewDetails('transactions')}
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Debit</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalDebit)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+8.3% from last month</p>
        </div>
        
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform hover:scale-105 transition-transform duration-200 cursor-pointer"
          onClick={() => handleViewDetails('loans')}
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Pending Loans</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingLoans}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stats.overdueEMIs} overdue EMIs</p>
        </div>
        
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform hover:scale-105 transition-transform duration-200 cursor-pointer"
          onClick={() => handleViewDetails('users')}
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Senior Amount</h3>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.balance)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overall net balance</p>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <main className="pt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Dashboard Header and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {timeFilter === 'weekly' ? 'Weekly' : timeFilter === 'monthly' ? 'Monthly' : 'Yearly'} summary | Last updated: {formatDate(new Date().toISOString())}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setTimeFilter('weekly')}
                className={`px-3 py-1.5 text-sm rounded-l-md ${timeFilter === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeFilter('monthly')}
                className={`px-3 py-1.5 text-sm border-l border-r border-gray-300 dark:border-gray-600 ${timeFilter === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeFilter('yearly')}
                className={`px-3 py-1.5 text-sm rounded-r-md ${timeFilter === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                Yearly
              </button>
            </div>
            
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setDashboardFilter('all')}
                className={`px-3 py-1.5 text-sm rounded-l-md ${dashboardFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                All Users
              </button>
              <button
                onClick={() => setDashboardFilter('active')}
                className={`px-3 py-1.5 text-sm border-l border-r border-gray-300 dark:border-gray-600 ${dashboardFilter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                Active Only
              </button>
              <button
                onClick={() => setDashboardFilter('negative')}
                className={`px-3 py-1.5 text-sm rounded-r-md ${dashboardFilter === 'negative' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                Negative Balance
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Users */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleViewDetails('users')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.userCount}</h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <span className="text-xl">👥</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-500 text-sm font-medium">+{stats.newUsers} new </span>
              <span className="text-gray-400 dark:text-gray-500 text-sm">this month</span>
            </div>
          </div>

          {/* Total Credit */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleViewDetails('transactions')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Credit</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(stats.totalCredit)}</h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <span className="text-xl">💰</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-500 text-sm font-medium">+12.5% </span>
              <span className="text-gray-400 dark:text-gray-500 text-sm">from last month</span>
            </div>
          </div>

          {/* Total Debit */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-red-500 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleViewDetails('transactions')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Debit</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(stats.totalDebit)}</h3>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <span className="text-xl">💸</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-red-500 text-sm font-medium">+8.3% </span>
              <span className="text-gray-400 dark:text-gray-500 text-sm">from last month</span>
            </div>
          </div>

          {/* Net Balance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Net Balance</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(stats.balance)}</h3>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <span className="text-xl">💵</span>
              </div>
            </div>
            <div className="mt-2">
              <span className={`text-sm font-medium ${stats.balance > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.balance > 0 ? 'Positive' : 'Negative'} 
              </span>
              <span className="text-gray-400 dark:text-gray-500 text-sm"> overall balance</span>
            </div>
          </div>
        </div>

        {/* Charts and Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Chart Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Credit/Debit Overview</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 text-sm rounded-md ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
                >
                  Bar
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 text-sm rounded-md ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
                >
                  Line
                </button>
              </div>
            </div>
            <div className="h-80">
              {chartType === 'bar' ? (
                <Bar 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: theme === 'dark' ? '#E5E7EB' : '#374151'
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                          color: theme === 'dark' ? '#9CA3AF' : '#6B7280'
                        }
                      },
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                          callback: (value) => formatCurrency(value),
                        },
                      },
                    },
                  }} 
                />
              ) : (
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: theme === 'dark' ? '#E5E7EB' : '#374151'
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                          color: theme === 'dark' ? '#9CA3AF' : '#6B7280'
                        }
                      },
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                          callback: (value) => formatCurrency(value),
                        },
                      },
                    },
                  }} 
                />
              )}
            </div>
          </div>

          {/* Loan Distribution Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Loan Distribution</h2>
              <button 
                onClick={() => handleViewDetails('loans')}
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                View Details
              </button>
            </div>
            
            <div className="h-64">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: theme === 'dark' ? '#E5E7EB' : '#374151'
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} loans (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              {stats.loanDistribution.map((loan, index) => (
                <div key={index} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{loan.type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{loan.count} loans</p>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(loan.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity and Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Transactions</h2>
              <button 
                onClick={() => handleViewDetails('transactions')}
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-750">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTransactions.map((transaction) => (
                    <tr 
                      key={transaction._id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => navigate(`/transactions/${transaction._id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center">
                              {transaction.user.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${transaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatCurrency(transaction.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'credit' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(transaction.createdAt)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No transactions found matching your search
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity and Alerts */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
                <button 
                  onClick={() => navigate('/activities')}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div 
                    key={activity._id} 
                    className="flex items-start p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate(`/activities/${activity._id}`)}
                  >
                    <div className="mr-3 mt-1">
                      {activity.icon === 'credit' ? (
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                          <span className="text-green-600 dark:text-green-400">💰</span>
                        </div>
                      ) : activity.icon === 'warning' ? (
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                          <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
                        </div>
                      ) : activity.icon === 'loan' ? (
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                          <span className="text-blue-600 dark:text-blue-400">🏦</span>
                        </div>
                      ) : activity.icon === 'interest' ? (
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                          <span className="text-purple-600 dark:text-purple-400">📈</span>
                        </div>
                      ) : (
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                          <span className="text-gray-600 dark:text-gray-300">👤</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        <span className="font-bold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{timeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Alerts</h2>
                <div>
                  <button 
                    onClick={markAllAlertsAsRead}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-4"
                  >
                    Mark All Read
                  </button>
                  <button 
                    onClick={() => handleViewDetails('alerts')}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert._id} 
                    className={`p-3 rounded-md border-l-4 ${alert.type === 'danger' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'} ${!alert.read ? 'ring-1 ring-blue-500' : ''}`}
                    onClick={() => {
                      markAlertAsRead(alert._id);
                      navigate('/alerts');
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">{alert.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{alert.message}</p>
                      </div>
                      {!alert.read && (
                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          !
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{timeAgo(alert.timestamp)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Session Info and System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Session Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Last Login</span>
                <span className="text-gray-800 dark:text-white">{formatDate(sessionInfo.lastLogin)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Location</span>
                <span className="text-gray-800 dark:text-white">{sessionInfo.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Device</span>
                <span className="text-gray-800 dark:text-white">{sessionInfo.device}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Session Duration</span>
                <span className="text-gray-800 dark:text-white">2 hours 15 minutes</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Database</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">API Service</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Backup Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Last backup: Today 2:00 AM
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">System Load</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Moderate (45%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Project Leader Dashboard. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;