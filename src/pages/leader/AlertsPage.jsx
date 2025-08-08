import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AlertsPage = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    overdueThreshold: 30, // days
    highRiskThreshold: 5000, // amount
    enableAutoAlerts: true
  });
  const [showSettingsForm, setShowSettingsForm] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch alerts
    setTimeout(() => {
      // Generate mock alerts
      const mockAlerts = [
        {
          id: '1',
          type: 'overdue',
          userId: '101',
          userName: 'Rahul Sharma',
          amount: 8500,
          lastPaymentDays: 45,
          riskLevel: 'high'
        },
        {
          id: '2',
          type: 'overdue',
          userId: '102',
          userName: 'Priya Patel',
          amount: 6200,
          lastPaymentDays: 38,
          riskLevel: 'medium'
        },
        {
          id: '3',
          type: 'high_balance',
          userId: '103',
          userName: 'Amit Kumar',
          amount: 12500,
          lastPaymentDays: 15,
          riskLevel: 'high'
        },
        {
          id: '4',
          type: 'inactive',
          userId: '104',
          userName: 'Neha Singh',
          amount: 3200,
          lastPaymentDays: 60,
          riskLevel: 'medium'
        },
        {
          id: '5',
          type: 'overdue',
          userId: '105',
          userName: 'Vikram Mehta',
          amount: 7800,
          lastPaymentDays: 32,
          riskLevel: 'medium'
        },
        {
          id: '6',
          type: 'high_balance',
          userId: '106',
          userName: 'Ananya Gupta',
          amount: 9500,
          lastPaymentDays: 25,
          riskLevel: 'high'
        },
        {
          id: '7',
          type: 'inactive',
          userId: '107',
          userName: 'Rajesh Verma',
          amount: 4200,
          lastPaymentDays: 55,
          riskLevel: 'low'
        }
      ];
      
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : parseInt(value, 10)
    });
  };

  const handleSaveSettings = () => {
    // Simulate API call to save settings
    setTimeout(() => {
      setShowSettingsForm(false);
      // In a real app, we would refresh alerts based on new settings
    }, 500);
  };

  const handleSendReminder = (userId, userName) => {
    // Navigate to add transaction page with user prefilled
    navigate(`/leader/notifications?userId=${userId}&userName=${encodeURIComponent(userName)}`);
  };

  const handleViewLedger = (userId) => {
    navigate(`/leader/users/${userId}/ledger`);
  };

  const getAlertTypeLabel = (type) => {
    switch (type) {
      case 'overdue':
        return 'Payment Overdue';
      case 'high_balance':
        return 'High Balance';
      case 'inactive':
        return 'Inactive User';
      default:
        return 'Alert';
    }
  };

  const getAlertTypeIcon = (type) => {
    switch (type) {
      case 'overdue':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'high_balance':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'inactive':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Alerts</h1>
        <button
          onClick={() => setShowSettingsForm(!showSettingsForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Alert Settings
        </button>
      </div>

      {/* Alert Settings Form */}
      {showSettingsForm && (
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Alert Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="overdueThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                Overdue Threshold (days)
              </label>
              <input
                type="number"
                id="overdueThreshold"
                name="overdueThreshold"
                value={settings.overdueThreshold}
                onChange={handleSettingsChange}
                className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              <p className="text-sm text-gray-500 mt-1">Flag users who haven't made a payment in this many days</p>
            </div>
            
            <div>
              <label htmlFor="highRiskThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                High Risk Threshold (₹)
              </label>
              <input
                type="number"
                id="highRiskThreshold"
                name="highRiskThreshold"
                value={settings.highRiskThreshold}
                onChange={handleSettingsChange}
                className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              <p className="text-sm text-gray-500 mt-1">Flag users with credit balance above this amount</p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableAutoAlerts"
                name="enableAutoAlerts"
                checked={settings.enableAutoAlerts}
                onChange={handleSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableAutoAlerts" className="ml-2 block text-sm text-gray-700">
                Enable automatic alerts
              </label>
            </div>
            
            <div className="pt-2 flex space-x-3">
              <button
                onClick={handleSaveSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Save Settings
              </button>
              <button
                onClick={() => setShowSettingsForm(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="bg-white rounded-md shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 p-4 border-b">Active Alerts</h2>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading alerts...</p>
          </div>
        ) : alerts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Last Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getAlertTypeIcon(alert.type)}
                        <span className="ml-2 text-sm font-medium text-gray-900">{getAlertTypeLabel(alert.type)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{alert.userName}</div>
                      <div className="text-sm text-gray-500">ID: {alert.userId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">₹{alert.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">{alert.lastPaymentDays} days ago</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskBadgeClass(alert.riskLevel)}`}>
                        {alert.riskLevel.charAt(0).toUpperCase() + alert.riskLevel.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => handleSendReminder(alert.userId, alert.userName)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Send Reminder
                        </button>
                        <button 
                          onClick={() => handleViewLedger(alert.userId)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View Ledger
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No active alerts at this time
          </div>
        )}
      </div>

      {/* Suggested Actions */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Suggested Actions</h2>
        <div className="space-y-3">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-medium text-yellow-800">Send Payment Reminders</h3>
            <p className="text-sm text-yellow-700 mt-1">5 users have overdue payments. Consider sending them a reminder.</p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
              Send Bulk Reminders
            </button>
          </div>
          
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <h3 className="font-medium text-red-800">High Risk Users</h3>
            <p className="text-sm text-red-700 mt-1">3 users have high credit balances and are at risk of default.</p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
              View High Risk Users
            </button>
          </div>
          
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-medium text-gray-800">Inactive Users</h3>
            <p className="text-sm text-gray-700 mt-1">2 users have been inactive for over 50 days.</p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
              Contact Inactive Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;