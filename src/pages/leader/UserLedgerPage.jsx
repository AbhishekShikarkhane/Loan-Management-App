import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const UserLedgerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [balance, setBalance] = useState({
    total: 0,
    credit: 0,
    debit: 0
  });

  useEffect(() => {
    // Simulate API call to fetch user data and transactions
    setTimeout(() => {
      // Mock user data
      const mockUser = {
        id,
        name: `User ${id}`,
        mobile: `+91 9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      };
      
      // Generate mock transactions
      const mockTransactions = Array.from({ length: 20 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const isCredit = Math.random() > 0.4;
        const amount = Math.floor(Math.random() * 5000) + 100;
        
        return {
          id: i + 1,
          date: date.toISOString().split('T')[0],
          amount,
          type: isCredit ? 'credit' : 'debit',
          note: isCredit ? 'Credit added' : 'Payment received',
        };
      });
      
      // Calculate balance
      const totalCredit = mockTransactions
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalDebit = mockTransactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + t.amount, 0);
      
      setUser(mockUser);
      setTransactions(mockTransactions);
      setBalance({
        total: totalCredit - totalDebit,
        credit: totalCredit,
        debit: totalDebit
      });
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  const handleFilterByDate = () => {
    // In a real app, this would filter transactions from the API
    // For demo, we'll just filter the existing transactions
    if (!dateRange.startDate && !dateRange.endDate) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        let matchesStart = true;
        let matchesEnd = true;
        
        if (dateRange.startDate) {
          const startDate = new Date(dateRange.startDate);
          matchesStart = transactionDate >= startDate;
        }
        
        if (dateRange.endDate) {
          const endDate = new Date(dateRange.endDate);
          matchesEnd = transactionDate <= endDate;
        }
        
        return matchesStart && matchesEnd;
      });
      
      setTransactions(filteredTransactions);
      setIsLoading(false);
    }, 500);
  };

  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF export functionality would be implemented here');
  };

  const handleAddTransaction = (type) => {
    // Navigate to add transaction page with user ID and type pre-filled
    navigate(`/leader/transactions/add?userId=${id}&type=${type}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isLoading ? 'Loading...' : `${user?.name}'s Ledger`}
          </h1>
          {!isLoading && user && (
            <p className="text-gray-600">{user.mobile}</p>
          )}
        </div>
        <button
          onClick={() => navigate('/leader/users')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Users
        </button>
      </div>

      {/* Balance Summary */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stats-card bg-blue-500 text-white">
            <p className="text-sm font-medium opacity-80">Current Balance</p>
            <p className="text-2xl font-bold mt-1">₹{balance.total.toLocaleString()}</p>
          </div>
          <div className="stats-card bg-green-500 text-white">
            <p className="text-sm font-medium opacity-80">Total Credit</p>
            <p className="text-2xl font-bold mt-1">₹{balance.credit.toLocaleString()}</p>
          </div>
          <div className="stats-card bg-purple-500 text-white">
            <p className="text-sm font-medium opacity-80">Total Recovered</p>
            <p className="text-2xl font-bold mt-1">₹{balance.debit.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleAddTransaction('credit')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-2">+</span> Add Credit
        </button>
        <button
          onClick={() => handleAddTransaction('debit')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-2">-</span> Add Debit
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center ml-auto"
        >
          <span className="mr-2">📄</span> Export PDF
        </button>
      </div>

      {/* Date Filter */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Filter by Date</h2>
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
              onClick={handleFilterByDate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-700 p-4 border-b">Transaction History</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{transaction.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                        {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{transaction.note}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No transactions found for the selected period.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLedgerPage;