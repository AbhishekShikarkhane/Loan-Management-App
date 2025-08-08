import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  
  const navItems = [
    { path: '/leader/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/leader/users', label: 'Users', icon: 'users' },
    { path: '/leader/transactions/add', label: 'Add Transaction', icon: 'transaction' },
    { path: '/leader/loans', label: 'Loans', icon: 'loan' },
    { path: '/leader/senior-amount', label: 'Senior Amount', icon: 'senior' },
    { path: '/leader/reports', label: 'Reports', icon: 'reports' },
    { path: '/leader/notifications', label: 'Notifications', icon: 'notifications' },
    { path: '/leader/alerts', label: 'Alerts', icon: 'alerts' },
    { path: '/leader/profile', label: 'Profile', icon: 'profile' },
    { path: '/leader/help', label: 'Help & Support', icon: 'help' },
  ];

  const getIcon = (iconName) => {
    const icons = {
      dashboard: '📊',
      users: '👥',
      transaction: '💰',
      loan: '💳',
      senior: '👴',
      reports: '📈',
      notifications: '🔔',
      alerts: '⚠️',
      profile: '👤',
      help: '❓',
    };
    return icons[iconName] || '📄';
  };

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      // Handle left swipe
    } else if (isRightSwipe) {
      // Handle right swipe
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <aside 
      className={`
        fixed lg:relative h-screen bg-gray-800 text-white
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-0 lg:w-20' : 'w-64'}
        flex flex-col shadow-lg z-50
        touch-pan-y overflow-hidden
      `}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`
        p-4 border-b border-gray-700
        flex items-center justify-between
        transition-all duration-300 ease-in-out
        backdrop-blur-sm bg-opacity-90
        sticky top-0 z-10
      `}>
        <h1 className={`
          font-bold text-xl whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${collapsed ? 'lg:opacity-0 lg:w-0 lg:scale-0' : 'opacity-100 w-auto scale-100'}
        `}>
          Leader Panel
        </h1>
        {collapsed && (
          <span className="
            text-xl font-bold mx-auto
            transition-transform duration-300
            hover:scale-110
            hidden lg:block
          ">
            LP
          </span>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => {
            const isActive = activeItem === item.path;
            return (
              <li key={item.path} className="transform transition-transform duration-200 hover:translate-x-1">
                <Link 
                  to={item.path}
                  className={`
                    flex items-center px-3 py-2 rounded-lg
                    transition-all duration-200 ease-in-out
                    hover:bg-gray-700 group relative
                    ${isActive ? 'bg-blue-600 text-white shadow-lg scale-102' : 'text-gray-300 hover:text-white'}
                  `}
                  onClick={() => setActiveItem(item.path)}
                >
                  <span className="
                    text-xl mr-3
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:rotate-3
                  ">
                    {getIcon(item.icon)}
                  </span>
                  <span className={`
                    whitespace-nowrap
                    transition-all duration-300 ease-in-out
                    ${collapsed ? 'lg:opacity-0 lg:w-0 lg:scale-0' : 'opacity-100 w-auto scale-100'}
                  `}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="
                      absolute inset-y-0 left-0 w-1 bg-blue-400
                      rounded-l-lg
                      transition-all duration-300
                    "/>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700 backdrop-blur-sm bg-opacity-90">
        <Link 
          to="/logout" 
          className={`
            flex items-center px-3 py-2 rounded-lg
            text-red-400 hover:text-red-300
            hover:bg-red-900/20 transition-all duration-200
            group transform hover:translate-x-1
          `}
        >
          <span className="
            text-xl mr-3
            transition-transform duration-300
            group-hover:scale-110
            group-hover:rotate-12
          ">
            🚪
          </span>
          <span className={`
            whitespace-nowrap
            transition-all duration-300 ease-in-out
            ${collapsed ? 'opacity-0 w-0 scale-0' : 'opacity-100 w-auto scale-100'}
          `}>
            Logout
          </span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;