import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, LogIn, Eye, EyeOff, MapPin, CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function LoginPage() {
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Please enter a valid email';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await signIn(email, password);
      showToast('success', `Welcome back, ${user.full_name}!`);
      navigate(from || (user.role === 'administrator' ? '/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setLoading(true);
    try {
      const user = await signIn(demoEmail, 'demo123');
      showToast('success', `Welcome back, ${user.full_name}!`);
      navigate(from || (user.role === 'administrator' ? '/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                CF
              </div>
              <span className="text-xl font-bold text-navy-900">CivicFix</span>
            </Link>
            <h1 className="text-3xl font-bold text-navy-900">Welcome back</h1>
            <p className="text-navy-500 mt-2">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-navy-400 hover:text-navy-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-navy-300 text-teal-600 focus:ring-teal-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-navy-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-semibold">
              Sign up
            </Link>
          </div>

          {/* Quick login */}
          <div className="mt-8 card bg-navy-50/50 border-navy-100">
            <p className="text-sm font-semibold text-navy-700 mb-3">Quick demo login</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => quickLogin('demo@resident.com')}
                className="w-full text-left px-4 py-3 rounded-xl border border-navy-200 hover:bg-white hover:border-teal-300 hover:shadow-md transition-all duration-200 group"
                disabled={loading}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                    <MapPin className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-800">Resident Account</p>
                    <p className="text-xs text-navy-500">demo@resident.com</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => quickLogin('demo@admin.com')}
                className="w-full text-left px-4 py-3 rounded-xl border border-navy-200 hover:bg-white hover:border-violet-300 hover:shadow-md transition-all duration-200 group"
                disabled={loading}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                    <Zap className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-800">Administrator Account</p>
                    <p className="text-xs text-navy-500">demo@admin.com</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Visual Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 dot-pattern opacity-20" />

        {/* Floating orbs */}
        <div className="orb orb-teal w-80 h-80 -top-20 -right-20 float-slow" />
        <div className="orb orb-blue w-60 h-60 bottom-20 -left-10 float-effect" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-8 float-slow">
            <CheckCircle className="w-10 h-10 text-teal-300" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Join your community</h2>
          <p className="text-white/70 max-w-sm leading-relaxed">
            Report local problems, track resolutions, and help make your neighborhood a better place to live.
          </p>
          <div className="mt-10 space-y-3">
            {['Fast issue reporting', 'Real-time status updates', 'Community transparency'].map((f) => (
              <div key={f} className="flex items-center gap-3 text-white/60 text-sm">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
