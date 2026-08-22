import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Building2, CheckCircle, Shield, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function SignupPage() {
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'resident' | 'administrator'>('resident');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Please enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await signUp(email, password, fullName.trim(), role);
      showToast('success', 'Account created successfully!');
      navigate(user.role === 'administrator' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Visual Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-animated" />
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="orb orb-teal w-80 h-80 -top-20 -right-20 float-slow" />
        <div className="orb orb-purple w-60 h-60 bottom-20 -left-10 float-effect" />

        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-8 float-slow">
            <Shield className="w-10 h-10 text-teal-300" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Make a difference</h2>
          <p className="text-white/70 max-w-sm leading-relaxed">
            Create an account to start reporting issues and tracking their resolution in your community.
          </p>
          <div className="mt-10 glass rounded-2xl p-6 max-w-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-teal-500/30 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-teal-300" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">100% Transparent</p>
                <p className="text-xs text-white/50">Track every step</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-300" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Private & Secure</p>
                <p className="text-xs text-white/50">Your data is protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-500/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-violet-300" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Real Results</p>
                <p className="text-xs text-white/50">Issues get resolved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                CF
              </div>
              <span className="text-xl font-bold text-navy-900">CivicFix</span>
            </Link>
            <h1 className="text-3xl font-bold text-navy-900">Create your account</h1>
            <p className="text-navy-500 mt-2">Join your community and start reporting issues</p>
          </div>

          {/* Role selection */}
          <div className="mb-6">
            <label className="label-text">I want to</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('resident')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  role === 'resident'
                    ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-100'
                    : 'border-navy-200 hover:border-navy-300 hover:bg-navy-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  role === 'resident' ? 'bg-teal-100 text-teal-600' : 'bg-navy-100 text-navy-400'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-800">Report Issues</p>
                  <p className="text-xs text-navy-500">As a resident</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('administrator')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  role === 'administrator'
                    ? 'border-violet-500 bg-violet-50 shadow-md shadow-violet-100'
                    : 'border-navy-200 hover:border-navy-300 hover:bg-navy-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  role === 'administrator' ? 'bg-violet-100 text-violet-600' : 'bg-navy-100 text-navy-400'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-800">Manage Reports</p>
                  <p className="text-xs text-navy-500">As an administrator</p>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              required
            />

            <Button type="submit" loading={loading} className="w-full" size="lg">
              <UserPlus className="w-4 h-4" />
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-navy-500">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
