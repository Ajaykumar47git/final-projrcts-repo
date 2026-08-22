import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notifications as notificationsApi } from '../services/mockApi';
import type { Notification } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { RequireAuth } from '../components/layout/RequireAuth';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await notificationsApi.list(user.id);
      setNotifications(data);
    } catch {
      console.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    await notificationsApi.markRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await notificationsApi.markAllRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-navy-900">Notifications</h1>
          {notifications.some((n) => !n.is_read) && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4" />
              Mark all read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-8 h-8" />}
            title="No notifications"
            description="You'll receive notifications when there are updates to your reports."
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`card flex items-start gap-3 cursor-pointer transition-colors ${
                  !n.is_read ? 'bg-teal-50/50 border-teal-200' : ''
                }`}
                onClick={() => !n.is_read && markAsRead(n.id)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  n.is_read ? 'bg-navy-100 text-navy-400' : 'bg-teal-100 text-teal-600'
                }`}>
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${n.is_read ? 'text-navy-600' : 'text-navy-900'}`}>
                      {n.title}
                    </p>
                    {!n.is_read && <div className="w-2 h-2 bg-teal-500 rounded-full shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-sm text-navy-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-navy-400 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                {n.report_id && (
                  <Link
                    to={`/issues/${n.report_id}`}
                    className="text-xs text-teal-600 hover:text-teal-700 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
