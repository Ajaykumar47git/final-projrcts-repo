import { useState, type FormEvent } from 'react';
import {
  User,
  Mail,
  Phone,
  Bell,
  Shield,
  Trash2,
  Save,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { RequireAuth } from '../components/layout/RequireAuth';
import { NEIGHBORHOODS } from '../types';

export default function ProfilePage() {
  const { user, updateProfile, signOut } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [neighborhood, setNeighborhood] = useState(user?.neighborhood || '');
  const [emailNotifications, setEmailNotifications] = useState(user?.notification_preferences?.email_notifications ?? true);
  const [inAppNotifications, setInAppNotifications] = useState(user?.notification_preferences?.in_app_notifications ?? true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('error', 'Name is required');
      return;
    }
    setLoading(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        neighborhood,
        notification_preferences: {
          email_notifications: emailNotifications,
          in_app_notifications: inAppNotifications,
        },
      });
      showToast('success', 'Profile updated successfully');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('error', 'Current password is required');
      return;
    }
    if (newPassword.length < 6) {
      showToast('error', 'New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('success', 'Password changed successfully');
    } catch (err) {
      showToast('error', 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      showToast('error', 'Type DELETE to confirm');
      return;
    }
    await signOut();
    showToast('success', 'Account deleted');
    navigate('/');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header with Image */}
        <div className="card">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg ring-4 ring-teal-100">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile photo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.full_name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy-900">{user?.full_name}</h1>
              <p className="text-navy-500">{user?.email}</p>
              <span className="inline-block mt-1 text-xs font-medium uppercase tracking-wider bg-teal-100 text-teal-700 px-2.5 py-0.5 rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Profile */}
        <form onSubmit={handleSaveProfile} className="card space-y-4">
          <h2 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </h2>
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Email"
            value={user?.email || ''}
            disabled
            icon={<Mail className="w-4 h-4" />}
          />
          <Input
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
            icon={<Phone className="w-4 h-4" />}
          />
          <Select
            label="Neighborhood"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            options={[
              { value: '', label: 'Select your neighborhood' },
              ...NEIGHBORHOODS.map((n) => ({ value: n, label: n })),
            ]}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={loading}>
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </form>

        {/* Notifications */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </h2>
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-50 cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-4 h-4 rounded border-navy-300"
            />
            <div>
              <p className="text-sm font-medium text-navy-800">Email notifications</p>
              <p className="text-xs text-navy-500">Receive status updates via email</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-50 cursor-pointer">
            <input
              type="checkbox"
              checked={inAppNotifications}
              onChange={(e) => setInAppNotifications(e.target.checked)}
              className="w-4 h-4 rounded border-navy-300"
            />
            <div>
              <p className="text-sm font-medium text-navy-800">In-app notifications</p>
              <p className="text-xs text-navy-500">Receive notifications within CivicFix</p>
            </div>
          </label>
        </div>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="card space-y-4">
          <h2 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Change Password
          </h2>
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={loading} variant="secondary">
              <Shield className="w-4 h-4" />
              Change Password
            </Button>
          </div>
        </form>

        {/* Privacy & Account */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-navy-900">Privacy & Account</h2>
          <div className="p-4 bg-navy-50 rounded-lg text-sm text-navy-600">
            <p className="font-medium text-navy-800 mb-1">Privacy Information</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Your personal information is protected and not shared publicly.</li>
              <li>Only your name and report details are visible to administrators.</li>
              <li>Your email and phone are never displayed on public pages.</li>
              <li>You can request data deletion at any time.</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </div>

        {/* Delete Modal */}
        <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setDeleteConfirm(''); }} title="Delete Account">
          <div className="space-y-4">
            <p className="text-sm text-navy-600">
              This action is permanent and cannot be undone. All your data, reports, and history will be deleted.
            </p>
            <Input
              label='Type "DELETE" to confirm'
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE'}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </RequireAuth>
  );
}
