import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarCollapsed(mobile);
    };

    handleResize();
    setIsLoading(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 bg-black z-40 lg:hidden
          transition-opacity duration-300 ease-in-out
          ${sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-60'}
        `}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          transform transition-all duration-300 ease-in-out
          ${sidebarCollapsed && isMobile ? '-translate-x-full' : 'translate-x-0'}
          ${sidebarCollapsed && !isMobile ? 'w-20' : 'w-64'}
          bg-gray-800
        `}
      >
        <Sidebar collapsed={sidebarCollapsed && !isMobile} />
      </div>

      {/* Main Content */}
      <div 
        className={`
          flex-1 flex flex-col min-w-0
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed && !isMobile ? 'lg:pl-20' : 'lg:pl-64'}
          bg-gray-900
        `}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main 
          className="
            flex-1 overflow-x-hidden overflow-y-auto
            bg-gray-900
            p-4 md:p-6 lg:p-8
            transition-all duration-300 ease-in-out
            mt-16
          "
        >
          <div className="max-w-7xl mx-auto animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;