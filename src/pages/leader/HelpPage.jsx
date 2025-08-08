import { useState } from 'react';

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState('faqs');
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketData, setTicketData] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // FAQ data
  const faqs = [
    {
      id: 1,
      question: 'How do I add a new user?',
      answer: 'To add a new user, navigate to the "Users" section and click on the "Add User" button. Fill in the required details like name, mobile number, and initial credit amount if applicable.'
    },
    {
      id: 2,
      question: 'How do I record a transaction?',
      answer: 'To record a transaction, go to the "Add Transaction" page or navigate to a specific user\'s ledger and click on "Add Credit" or "Add Debit" button. Enter the amount, select the transaction type, add an optional note, and submit.'
    },
    {
      id: 3,
      question: 'How can I send payment reminders to users?',
      answer: 'You can send payment reminders from the "Notifications" page. Select the user, write your message, choose the channel (SMS or WhatsApp), and click "Send Reminder". You can also enable automatic reminders in the settings.'
    },
    {
      id: 4,
      question: 'How do I generate reports?',
      answer: 'Go to the "Reports" page, select your desired date range, and click "Generate Report". You can view various metrics like credit vs recovery, top users, and weekly summaries. Reports can be exported as PDF or CSV.'
    },
    {
      id: 5,
      question: 'What are alerts and how do they work?',
      answer: 'Alerts are automatic notifications about potential issues like overdue payments, high credit balances, or inactive users. You can configure alert thresholds in the "Alerts" page settings.'
    },
    {
      id: 6,
      question: 'How do I change my password?',
      answer: 'To change your password, go to the "Profile" page, scroll down to the "Change Password" section, enter your current password and new password, then click "Change Password".'
    },
    {
      id: 7,
      question: 'Can I export a user\'s ledger?',
      answer: 'Yes, you can export a user\'s ledger as a PDF. Navigate to the user\'s ledger page and click on the "Export PDF" button in the top right corner.'
    },
    {
      id: 8,
      question: 'How do I delete a user?',
      answer: 'To delete a user, go to the "Users" page, find the user you want to delete, click on the three dots menu, and select "Delete". You will be asked to confirm before the user is permanently deleted.'
    },
    {
      id: 9,
      question: 'Is there a limit to how many users I can add?',
      answer: 'The system is designed to handle up to 999 users efficiently. If you need to manage more users, please contact our support team.'
    },
    {
      id: 10,
      question: 'How secure is my data?',
      answer: 'We take data security very seriously. All data is encrypted both in transit and at rest. We implement industry-standard security practices and regular backups to ensure your data is safe.'
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData({
      ...ticketData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setTicketData({
        ...ticketData,
        attachments: [...ticketData.attachments, ...newFiles]
      });
    }
  };

  const removeAttachment = (index) => {
    const updatedAttachments = [...ticketData.attachments];
    updatedAttachments.splice(index, 1);
    setTicketData({
      ...ticketData,
      attachments: updatedAttachments
    });
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    
    if (!ticketData.subject || !ticketData.description) {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to submit ticket
    setTimeout(() => {
      setIsSubmitting(false);
      setTicketData({
        subject: '',
        description: '',
        priority: 'medium',
        attachments: []
      });
      setToastMessage('Support ticket submitted successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>

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

      {/* Tabs */}
      <div className="bg-white rounded-md shadow-sm">
        <div className="border-b">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('faqs')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'faqs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              FAQs
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'contact' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Contact Support
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'ticket' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Raise a Ticket
            </button>
          </nav>
        </div>

        <div className="p-4">
          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <details key={faq.id} className="group bg-gray-50 p-4 rounded-md">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                        <span className="text-gray-800">{faq.question}</span>
                        <span className="transition group-open:rotate-180">
                          <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                            <path d="M6 9l6 6 6-6"></path>
                          </svg>
                        </span>
                      </summary>
                      <p className="text-gray-600 mt-3 group-open:animate-fadeIn">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No FAQs found matching your search.</p>
                </div>
              )}
            </div>
          )}

          {/* Contact Support Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Support</h3>
                  <p className="text-gray-600 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
                  <a href="mailto:support@leaderadmin.com" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    support@leaderadmin.com
                  </a>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Phone Support</h3>
                  <p className="text-gray-600 mb-4">Available Monday to Friday, 9 AM to 6 PM IST.</p>
                  <a href="tel:+919876543210" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    +91 9876 543 210
                  </a>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Chat with our support team in real-time.</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  Start Live Chat
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Visit Our Help Center</h3>
                <p className="text-gray-600 mb-4">Browse our comprehensive knowledge base for detailed guides and tutorials.</p>
                <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  Visit Help Center
                </a>
              </div>
            </div>
          )}

          {/* Raise a Ticket Tab */}
          {activeTab === 'ticket' && (
            <div>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={ticketData.subject}
                    onChange={handleTicketInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={ticketData.description}
                    onChange={handleTicketInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please provide details about your issue"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={ticketData.priority}
                    onChange={handleTicketInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachments
                  </label>
                  <div className="flex items-center">
                    <label className="cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50">
                      <span className="text-gray-700">Add Files</span>
                      <input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        onChange={handleFileChange} 
                      />
                    </label>
                    <span className="ml-3 text-sm text-gray-500">
                      {ticketData.attachments.length > 0 
                        ? `${ticketData.attachments.length} file(s) selected` 
                        : 'No files selected'}
                    </span>
                  </div>
                  
                  {ticketData.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {ticketData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Ticket'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;