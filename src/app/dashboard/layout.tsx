'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-md border-b-2 border-yellow-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Dashboard
                </h2>
                {user && (
                  <div className="hidden md:block">
                    <span className="text-sm text-gray-600">
                      Bem-vindo, <span className="font-semibold text-red-600">{user.name}</span>
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="md:hidden">
                    <span className="text-sm text-gray-600">
                      <span className="font-semibold text-red-600">{user.name}</span>
                    </span>
                  </div>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                >
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
