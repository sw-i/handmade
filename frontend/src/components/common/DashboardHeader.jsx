import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { Button } from '@components/common/UI';
import { LogOut, User, Home } from 'lucide-react';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-4 transition-colors shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || user?.name || 'User'}!</h1>
          <p className="text-sm text-gray-600">Manage your account and activities</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')} 
            className="px-6 py-2.5 text-base font-semibold rounded-lg inline-flex items-center text-indigo-600"
          >
            <Home className="w-4 h-4 mr-2" />
            Homepage
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{user?.firstName || user?.name}</p>
              <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleLogout} className="px-6 py-2.5 text-base font-semibold rounded-lg inline-flex items-center text-indigo-600">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
