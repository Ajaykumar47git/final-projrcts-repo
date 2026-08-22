import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notifications } from '../../services/mockApi';
import { useEffect } from 'react';

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      notifications.unreadCount(user.id).then(setUnreadCount);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore Issues' },
    { to: '/about', label: 'About' },
    { to: '/how-it-works', label: 'How It Works' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-navy-100 sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-navy-900 shrink-0">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white text-sm">
              CF
            </div>
            <span>CivicFix</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-navy-500 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-colors"
                  aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-navy-50 transition-colors"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-navy-600 text-sm font-medium">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-navy-200 flex items-center justify-center">
                          {user.full_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-navy-700 max-w-[120px] truncate">
                      {user.full_name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-navy-400 hidden sm:block" />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-navy-100 py-1 z-50">
                        <div className="px-4 py-3 border-b border-navy-100">
                          <div className="flex items-center gap-3">
                            {user.avatar_url ? (
                              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                              </div>
                            ) : null}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-navy-900 truncate">{user.full_name}</p>
                              <p className="text-xs text-navy-500 truncate">{user.email}</p>
                            </div>
                          </div>
                          <span className="inline-block mt-2 text-[10px] font-medium uppercase tracking-wider bg-navy-100 text-navy-600 px-2 py-0.5 rounded-full">
                            {user.role}
                          </span>
                        </div>
                        <Link
                          to={user.role === 'administrator' ? '/admin' : '/dashboard'}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy-700 hover:bg-navy-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy-700 hover:bg-navy-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Profile & Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="btn-secondary text-sm hidden sm:inline-flex"
                >
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-navy-500 hover:text-navy-700 hover:bg-navy-50 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-navy-100 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.to)
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-navy-600 hover:bg-navy-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="mt-2 pt-2 border-t border-navy-100 flex flex-col gap-2">
                <Link to="/login" className="btn-secondary text-sm text-center" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
