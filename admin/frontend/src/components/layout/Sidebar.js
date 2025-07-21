import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  BarChart3,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user, logout, canManageContent, isSuperAdmin } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin', 'content_manager', 'examiner'],
    },
    {
      name: 'Tests Management',
      href: '/tests',
      icon: FileText,
      roles: ['super_admin', 'content_manager'],
    },
    {
      name: 'Reading Tests',
      href: '/tests/reading',
      icon: BookOpen,
      roles: ['super_admin', 'content_manager'],
    },
    {
      name: 'Listening Tests',
      href: '/tests/listening',
      icon: Headphones,
      roles: ['super_admin', 'content_manager'],
    },
    {
      name: 'Writing Tests',
      href: '/tests/writing',
      icon: PenTool,
      roles: ['super_admin', 'content_manager'],
    },
    {
      name: 'Speaking Tests',
      href: '/tests/speaking',
      icon: Mic,
      roles: ['super_admin', 'content_manager'],
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      roles: ['super_admin', 'content_manager'],
    },
    {
      name: 'User Management',
      href: '/users',
      icon: Users,
      roles: ['super_admin'],
    },
    {
      name: 'Examiner Panel',
      href: '/examiner',
      icon: UserCheck,
      roles: ['examiner'],
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['super_admin', 'content_manager', 'examiner'],
    },
  ];

  const isActiveRoute = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const canAccessRoute = (roles) => {
    return roles.includes(user?.role);
  };

  const filteredNavItems = navigationItems.filter(item => canAccessRoute(item.roles));

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={`bg-white border-r border-secondary-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-full`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-secondary-200">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-lg font-semibold text-secondary-900">
              IELTS Admin
            </span>
          </div>
        )}
        
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-secondary-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-secondary-500" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-secondary-500" />
          )}
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-secondary-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-600">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-secondary-500 capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.name : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 truncate">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-secondary-200">
        <button
          onClick={handleLogout}
          className={`sidebar-item-inactive w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="ml-3">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 