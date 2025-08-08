import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate logout process
    const performLogout = async () => {
      // 1. Clear any authentication tokens from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Update authentication state
      setIsAuthenticated(false);
      
      // 2. Show a brief message or spinner
      // This is handled by the JSX below
      
      // 3. Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Logging Out</h2>
        <p className="text-gray-600">Thank you for using Leader Admin Panel</p>
      </div>
      
      {/* Optional feedback form */}
      <div className="mt-12 max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Feedback</h3>
        <p className="text-sm text-gray-600 mb-4">We'd love to hear about your experience today!</p>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-3 6a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-3.536 4.464a1 1 0 001.414 0 3 3 0 004.242 0 1 1 0 001.414 1.414 5 5 0 01-7.07 0 1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <textarea 
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" 
          rows="2"
          placeholder="Any additional comments? (optional)"
        ></textarea>
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default LogoutPage;