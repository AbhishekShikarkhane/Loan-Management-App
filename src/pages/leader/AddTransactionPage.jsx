import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AddTransactionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const prefilledUserId = queryParams.get('userId');
  const prefilledType = queryParams.get('type');

  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [formData, setFormData] = useState({
    userId: prefilledUserId || '',
    amount: '',
    type: prefilledType || 'credit',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call to fetch users
    setTimeout(() => {
      // Generate mock users
      const mockUsers = Array.from({ length: 20 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `User ${i + 1}`,
        mobile: `+91 9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      }));
      
      setUsers(mockUsers);
      setIsLoadingUsers(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.userId || !formData.amount || parseFloat(formData.amount) <= 0) {
      setToastMessage('Please select a user and enter a valid amount');
      setToastType('error');
      setShowToast(true);
      setIsSubmitting(false);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Simulate API call to add transaction
    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage('Transaction added successfully');
      setToastType('success');
      setShowToast(true);
      
      // Reset form or navigate based on context
      setTimeout(() => {
        setShowToast(false);
        if (prefilledUserId) {
          navigate(`/leader/users/${prefilledUserId}/ledger`);
        } else {
          // Reset form
          setFormData({
            userId: '',
            amount: '',
            type: 'credit',
            date: new Date().toISOString().split('T')[0],
            note: ''
          });
        }
      }, 2000);
    }, 1500);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.mobile.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Add Transaction</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          <div className="flex items-center">
            {toastType === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Add Transaction Form */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* User Selection */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                Select User *
              </label>
              {prefilledUserId ? (
                <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
                  {users.find(u => u.id === prefilledUserId)?.name || `User ${prefilledUserId}`}
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search by name or mobile"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  <div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                    {isLoadingUsers ? (
                      <div className="p-4 text-center text-gray-500">
                        Loading users...
                      </div>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <div 
                          key={user.id}
                          className={`p-2 cursor-pointer hover:bg-gray-100 ${formData.userId === user.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                          onClick={() => setFormData({...formData, userId: user.id})}
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.mobile}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No users found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type *
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="credit"
                    checked={formData.type === 'credit'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Credit (Give)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="debit"
                    checked={formData.type === 'debit'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Debit (Receive)</span>
                </label>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                min="1"
                step="1"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Note */}
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                id="note"
                name="note"
                rows="2"
                value={formData.note}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add an optional note"
              ></textarea>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Add Transaction'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionPage;