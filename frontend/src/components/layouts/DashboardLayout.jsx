import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import Sidebar from '@components/common/Sidebar';
import DashboardHeader from '@components/common/DashboardHeader';

const DashboardLayout = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 transition-colors">
      {/* Fixed Header */}
      <DashboardHeader />
      
      {/* Main Content with Fixed Sidebar */}
      <div className="flex pt-[73px]"> {/* pt-[73px] accounts for fixed header height */}
        <Sidebar role={user?.role} />
        <main className="flex-1 p-6 lg:p-8 ml-64 bg-gray-50 min-h-[calc(100vh-73px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
