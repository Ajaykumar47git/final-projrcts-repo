import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Map,
  Settings,
  Users,
  BarChart3,
  Building2,
  Home,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'administrator';

  const residentLinks = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/report', icon: <PlusCircle className="w-5 h-5" />, label: 'Report Issue' },
    { to: '/my-reports', icon: <FileText className="w-5 h-5" />, label: 'My Reports' },
    { to: '/explore', icon: <Map className="w-5 h-5" />, label: 'Explore Issues' },
    { to: '/profile', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/admin/reports', icon: <FileText className="w-5 h-5" />, label: 'All Reports' },
    { to: '/admin/departments', icon: <Building2 className="w-5 h-5" />, label: 'Departments' },
    { to: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
    { to: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
    { to: '/explore', icon: <Map className="w-5 h-5" />, label: 'Explore Issues' },
    { to: '/profile', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  const links = isAdmin ? adminLinks : residentLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy-900/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-navy-100 transform transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-navy-100">
            <NavLink to="/" className="flex items-center gap-2 text-sm text-navy-500 hover:text-navy-700">
              <Home className="w-4 h-4" />
              Back to Home
            </NavLink>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin' || link.to === '/dashboard'}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link-active' : 'sidebar-link'
                }
                onClick={onClose}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-navy-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-navy-600 text-sm font-medium">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-navy-200 flex items-center justify-center">
                    {user?.full_name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-navy-800 truncate">{user?.full_name}</p>
                <p className="text-xs text-navy-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
