import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(true); // Set to true for demo purposes
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authForm, setAuthForm] = useState({
    username: '',
    password: ''
  });
  const [authError, setAuthError] = useState('');

  // Mock data for reports
  const creditVsRecoveryData = [
    { name: 'Week 1', credit: 12500, recovery: 8200 },
    { name: 'Week 2', credit: 14800, recovery: 9600 },
    { name: 'Week 3', credit: 10300, recovery: 7800 },
    { name: 'Week 4', credit: 15600, recovery: 11200 },
  ];

  const topUsers = [
    { name: 'Rahul Sharma', credit: 12500 },
    { name: 'Priya Patel', credit: 9800 },
    { name: 'Amit Kumar', credit: 8700 },
    { name: 'Neha Singh', credit: 7200 },
    { name: 'Vikram Mehta', credit: 6500 },
    { name: 'Ananya Gupta', credit: 5900 },
    { name: 'Rajesh Verma', credit: 5200 },
    { name: 'Sunita Rao', credit: 4800 },
    { name: 'Kiran Joshi', credit: 4300 },
    { name: 'Deepak Malhotra', credit: 3900 },
  ];

  const weeklySummary = [
    { week: 'Week 1', newUsers: 12, totalCredit: 12500, totalRecovery: 8200 },
    { week: 'Week 2', newUsers: 8, totalCredit: 14800, totalRecovery: 9600 },
    { week: 'Week 3', newUsers: 15, totalCredit: 10300, totalRecovery: 7800 },
    { week: 'Week 4', newUsers: 10, totalCredit: 15600, totalRecovery: 11200 },
  ];

  // Data for pie chart
  const statusDistributionData = [
    { name: 'Active Users', value: 645 },
    { name: 'Inactive Users', value: 144 },
  ];

  const COLORS = ['#4ade80', '#94a3b8'];

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    
    // Simulate API call to generate report
    setTimeout(() => {
      setIsGeneratingReport(false);
      setReportGenerated(true);
    }, 1500);
  };

  const handleExport = (format) => {
    // In a real app, this would generate and download a file
    alert(`Exporting report as ${format}...`);
  };

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthForm({
      ...authForm,
      [name]: value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Check credentials (in a real app, this would be a secure API call)
    if (authForm.username === 'a' && authForm.password === 'a') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid username or password');
    }
  };

  return (
    <div className="space-y-6">
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reports Authentication</h1>
          
          {authError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {authError}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={authForm.username}
                  onChange={handleAuthChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={authForm.password}
                  onChange={handleAuthChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Access Reports
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('PDF')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
                disabled={!reportGenerated}
              >
                <span className="mr-2">📄</span> Export PDF
              </button>
              <button
                onClick={() => handleExport('CSV')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                disabled={!reportGenerated}
              >
                <span className="mr-2">📊</span> Export CSV
              </button>
            </div>
          </div>

          {/* Date Filter */}
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Date Range</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleGenerateReport}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full flex items-center justify-center"
                  disabled={isGeneratingReport}
                >
                  {isGeneratingReport ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    'Generate Report'
                  )}
                </button>
              </div>
            </div>
          </div>

          {reportGenerated && (
            <div className="space-y-6">
              {/* Credit vs Recovery Chart */}
              <div className="stats-card h-80">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Credit vs Recovery</h2>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={creditVsRecoveryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="credit" fill="#4ade80" name="Credit Given" />
                    <Bar dataKey="recovery" fill="#a855f7" name="Amount Recovered" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top 10 Users */}
                <div className="stats-card">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Top 10 Users by Credit</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {topUsers.map((user, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <div className="text-sm font-medium text-gray-900">₹{user.credit.toLocaleString()}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* User Status Distribution */}
                <div className="stats-card">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">User Status Distribution</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Weekly Summary */}
              <div className="stats-card">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Weekly Summary</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Users</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Credit</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Recovery</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Recovery Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {weeklySummary.map((week, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{week.week}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{week.newUsers}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm text-gray-900">₹{week.totalCredit.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm text-gray-900">₹{week.totalRecovery.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm text-gray-900">
                              {((week.totalRecovery / week.totalCredit) * 100).toFixed(1)}%
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;