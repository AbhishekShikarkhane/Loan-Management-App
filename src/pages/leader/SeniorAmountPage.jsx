import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';

const SeniorAmountPage = () => {
  const [seniorData, setSeniorData] = useState([]);
  const [filteredSeniorData, setFilteredSeniorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStats, setPaymentStats] = useState({
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    seniorCount: 0
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: []
  });
  const [systemStatus, setSystemStatus] = useState({
    server: 'operational',
    database: 'operational',
    api: 'operational',
    lastChecked: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    // Simulate API call to fetch senior payment data
    setTimeout(() => {
      // Mock senior data
      const mockSeniorData = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: `Senior Member ${i + 1}`,
        totalAmount: Math.floor(Math.random() * 50000) + 30000,
        paidAmount: Math.floor(Math.random() * 30000) + 20000,
        lastPaymentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentHistory: Array.from({ length: 6 }, (_, j) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][j],
          amount: Math.floor(Math.random() * 5000) + 3000
        })),
        status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'pending' : 'inactive'
      }));

      // Calculate payment statistics
      const stats = {
        totalAmount: mockSeniorData.reduce((sum, senior) => sum + senior.totalAmount, 0),
        paidAmount: mockSeniorData.reduce((sum, senior) => sum + senior.paidAmount, 0),
        pendingAmount: mockSeniorData.reduce((sum, senior) => sum + (senior.totalAmount - senior.paidAmount), 0),
        seniorCount: mockSeniorData.length
      };

      // Generate bar chart data
      const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Monthly Payments',
          data: [35000, 42000, 38000, 45000, 40000, 43000],
          backgroundColor: '#3B82F6'
        }]
      };

      // Generate pie chart data
      const pieData = {
        labels: ['Paid Amount', 'Pending Amount'],
        datasets: [{
          data: [stats.paidAmount, stats.pendingAmount],
          backgroundColor: ['#10B981', '#F59E0B'],
          borderWidth: 0
        }]
      };

      setSeniorData(mockSeniorData);
      setFilteredSeniorData(mockSeniorData);
      setPaymentStats(stats);
      setChartData(chartData);
      setPieData(pieData);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter senior data based on search query
    if (searchQuery.trim() === '') {
      setFilteredSeniorData(seniorData);
    } else {
      const filtered = seniorData.filter(senior => 
        senior.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        senior.id.toString().includes(searchQuery)
      );
      setFilteredSeniorData(filtered);
    }
  }, [searchQuery, seniorData]);

  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF report
    alert('PDF report generated and downloaded!');
  };

  const handleLogout = () => {
    // In a real app, this would clear session and redirect
    alert('You have been logged out successfully!');
  };

  const statusIndicator = (status) => {
    switch (status) {
      case 'operational': return <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Operational</span>;
      case 'degraded': return <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>Degraded</span>;
      case 'down': return <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>Down</span>;
      default: return status;
    }
  };

  const memberStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
      case 'pending': return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'inactive': return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Inactive</span>;
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-16">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold mr-2">SM</div>
                <span className="font-bold text-xl text-blue-600">SeniorManager</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm">
                <div className="mr-3">
                  <div className="font-medium">Admin User</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Financial Leader</div>
                </div>
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              </div>
              <button 
                onClick={handleLogout}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Senior Amount Management</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Track and manage senior member payments and financials</p>
          </div>
          <Link to="/leader/senior-amount/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Record Payment
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-500 transform transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹{paymentStats.totalAmount.toLocaleString()}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{paymentStats.seniorCount} senior members</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-green-500 transform transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Paid Amount</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹{paymentStats.paidAmount.toLocaleString()}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{((paymentStats.paidAmount / paymentStats.totalAmount) * 100).toFixed(1)}% completed</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 transform transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending Amount</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹{(paymentStats.totalAmount - paymentStats.paidAmount).toLocaleString()}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Remaining balance</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-purple-500 transform transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Senior Members</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{paymentStats.seniorCount}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Active members</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Trends</h2>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="h-72">
              <Bar 
                data={chartData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: '#6B7280'
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        color: 'rgba(209, 213, 219, 0.3)'
                      },
                      ticks: {
                        color: '#6B7280'
                      }
                    },
                    y: {
                      grid: {
                        color: 'rgba(209, 213, 219, 0.3)'
                      },
                      ticks: {
                        color: '#6B7280',
                        callback: (value) => `₹${value.toLocaleString()}`
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Distribution</h2>
              <button 
                onClick={handleExportPDF}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-lg flex items-center text-sm transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export PDF
              </button>
            </div>
            <div className="h-72 flex items-center justify-center">
              <Pie 
                data={pieData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: '#6B7280',
                        font: {
                          size: 14
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ₹${context.raw.toLocaleString()}`;
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 dark:text-white">Server</h3>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  {statusIndicator(systemStatus.server)}
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Application server status</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 dark:text-white">Database</h3>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  {statusIndicator(systemStatus.database)}
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Database connection status</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 dark:text-white">API Services</h3>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  {statusIndicator(systemStatus.api)}
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">External API services</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Last checked: {systemStatus.lastChecked}
          </div>
        </div>

        {/* Senior Members Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Senior Members</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search members..."
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-lg flex items-center text-sm transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paid Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Payment</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                      <p className="mt-2 text-gray-500 dark:text-gray-400">Loading senior data...</p>
                    </td>
                  </tr>
                ) : filteredSeniorData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-2 text-gray-500 dark:text-gray-400">No senior members found matching your search</p>
                    </td>
                  </tr>
                ) : (
                  filteredSeniorData.map((senior) => (
                    <tr key={senior.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{senior.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">ID: {senior.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {memberStatusBadge(senior.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">₹{senior.totalAmount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">₹{senior.paidAmount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${(senior.paidAmount / senior.totalAmount) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {((senior.paidAmount / senior.totalAmount) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{senior.lastPaymentDate}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">2 days ago</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">View History</button>
                        <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">Add Payment</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2023 SeniorManager. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm">Help Center</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm">Contact Us</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SeniorAmountPage;