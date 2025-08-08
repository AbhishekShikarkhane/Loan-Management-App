import { useState, useEffect } from 'react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    autoReminders: true,
    preferredChannel: 'sms',
    reminderFrequency: 'weekly'
  });
  const [newReminder, setNewReminder] = useState({
    userId: '',
    message: '',
    channel: 'sms'
  });
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Simulate API call to fetch notifications
    setTimeout(() => {
      // Generate mock notifications
      const mockNotifications = Array.from({ length: 15 }, (_, i) => ({
        id: (i + 1).toString(),
        userId: Math.floor(Math.random() * 100) + 1,
        userName: `User ${Math.floor(Math.random() * 100) + 1}`,
        message: i % 3 === 0 
          ? 'Payment reminder: Your credit balance is due' 
          : i % 3 === 1 
            ? 'New transaction added to your account' 
            : 'Thank you for your recent payment',
        channel: i % 2 === 0 ? 'sms' : 'whatsapp',
        status: i % 4 === 0 ? 'pending' : i % 4 === 1 ? 'sent' : i % 4 === 2 ? 'delivered' : 'failed',
        sentAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      }));
      
      // Sort by date (newest first)
      mockNotifications.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
      
      setNotifications(mockNotifications);
      setIsLoading(false);
      
      // Generate mock users for the dropdown
      const mockUsers = Array.from({ length: 20 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `User ${i + 1}`,
        mobile: `+91 9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      }));
      
      setUsers(mockUsers);
    }, 1000);
  }, []);

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNewReminderChange = (e) => {
    const { name, value } = e.target;
    setNewReminder({
      ...newReminder,
      [name]: value
    });
  };

  const handleSendReminder = (e) => {
    e.preventDefault();
    
    if (!newReminder.userId || !newReminder.message) {
      setToastMessage('Please select a user and enter a message');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    setIsSending(true);
    
    // Simulate API call to send reminder
    setTimeout(() => {
      const user = users.find(u => u.id === newReminder.userId);
      const newNotification = {
        id: (notifications.length + 1).toString(),
        userId: newReminder.userId,
        userName: user ? user.name : `User ${newReminder.userId}`,
        message: newReminder.message,
        channel: newReminder.channel,
        status: 'pending',
        sentAt: new Date().toISOString(),
      };
      
      setNotifications([newNotification, ...notifications]);
      setNewReminder({
        userId: '',
        message: '',
        channel: 'sms'
      });
      setIsSending(false);
      setShowAddForm(false);
      setToastMessage('Reminder sent successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const handleResend = (notificationId) => {
    // Find the notification to resend
    const notificationToResend = notifications.find(n => n.id === notificationId);
    if (!notificationToResend) return;
    
    // Update status to pending
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, status: 'pending', sentAt: new Date().toISOString() } : n
    );
    
    setNotifications(updatedNotifications);
    
    // Simulate API call to resend
    setTimeout(() => {
      const finalNotifications = notifications.map(n => 
        n.id === notificationId ? { ...n, status: 'sent' } : n
      );
      
      setNotifications(finalNotifications);
      setToastMessage('Notification resent successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Reminder
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-md shadow-md bg-green-500 text-white">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Add Reminder Form */}
      {showAddForm && (
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Send New Reminder</h2>
          <form onSubmit={handleSendReminder} className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                Select User *
              </label>
              <select
                id="userId"
                name="userId"
                value={newReminder.userId}
                onChange={handleNewReminderChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name} - {user.mobile}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows="3"
                value={newReminder.message}
                onChange={handleNewReminderChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter reminder message"
                required
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Channel
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="channel"
                    value="sms"
                    checked={newReminder.channel === 'sms'}
                    onChange={handleNewReminderChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">SMS</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="channel"
                    value="whatsapp"
                    checked={newReminder.channel === 'whatsapp'}
                    onChange={handleNewReminderChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">WhatsApp</span>
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Reminder'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Automatic Reminders</h3>
              <p className="text-sm text-gray-500">Send automatic reminders to users with pending credits</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="autoReminders"
                checked={settings.autoReminders} 
                onChange={handleSettingsChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Preferred Channel</h3>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="preferredChannel"
                  value="sms"
                  checked={settings.preferredChannel === 'sms'}
                  onChange={handleSettingsChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">SMS</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="preferredChannel"
                  value="whatsapp"
                  checked={settings.preferredChannel === 'whatsapp'}
                  onChange={handleSettingsChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">WhatsApp</span>
              </label>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Reminder Frequency</h3>
            <select
              name="reminderFrequency"
              value={settings.reminderFrequency}
              onChange={handleSettingsChange}
              className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div className="pt-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-md shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 p-4 border-b">Sent Notifications</h2>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{notification.userName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{notification.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{notification.channel}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(notification.status)}`}>
                        {notification.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(notification.sentAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {notification.status === 'failed' && (
                        <button 
                          onClick={() => handleResend(notification.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Resend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No notifications sent yet
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;