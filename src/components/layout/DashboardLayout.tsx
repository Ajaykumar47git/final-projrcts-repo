import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { RequireAuth } from './RequireAuth';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-navy-50">
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 min-w-0">
            <div className="lg:hidden sticky top-16 z-20 bg-white border-b border-navy-100 px-4 py-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-navy-600"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
                Menu
              </button>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}
