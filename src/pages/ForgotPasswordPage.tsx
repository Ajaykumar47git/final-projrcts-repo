import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showToast('error', 'Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="card">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-navy-900 mb-2">Check your email</h1>
            <p className="text-navy-500 mb-6">
              If an account exists for <strong>{email}</strong>, we've sent a password reset link.
            </p>
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">CF</div>
            <span className="text-xl font-bold text-navy-900">CivicFix</span>
          </Link>
          <h1 className="text-2xl font-bold text-navy-900">Reset your password</h1>
          <p className="text-navy-500 mt-1">Enter your email and we'll send you a reset link</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Send Reset Link
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
