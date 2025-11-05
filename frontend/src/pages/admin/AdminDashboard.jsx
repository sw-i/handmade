import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, LoadingSpinner } from '@components/common/UI';
import { Users, Store, ShoppingCart, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { adminService } from '@services/index';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={loadStats} className="px-6 py-2.5 text-base font-semibold rounded-lg bg-red-600 text-white">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-green-600 mt-1">+8% this month</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Vendors</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalVendors}</p>
              <p className="text-sm text-red-600 mt-1">{stats.pendingVendors} pending approval</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Store className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className="text-sm text-green-600 mt-1">+12% this month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Platform Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${Number(stats.totalRevenue).toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+{stats.revenueGrowth}% growth</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
              <p className="text-3xl font-bold text-gray-900">
                ${stats.totalOrders > 0 ? (Number(stats.totalRevenue) / Number(stats.totalOrders)).toFixed(2) : '0.00'}
              </p>
              <p className="text-sm text-red-600 mt-1">Per transaction</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Link to="/admin/vendors">
          <Card className="p-6 h-full hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingVendors}</p>
                <p className="text-sm text-orange-600 mt-1">Requires attention</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/vendors">
              <button className="w-full p-3 bg-red-50 hover:bg-red-100 rounded-lg text-left transition">
                <p className="font-semibold text-red-900 text-base">Manage Vendors</p>
                <p className="text-sm text-red-600">Approve or review vendor applications</p>
              </button>
            </Link>
            <Link to="/admin/customers">
              <button className="w-full p-3 bg-red-50 hover:bg-red-100 rounded-lg text-left transition">
                <p className="font-semibold text-red-900 text-base">Manage Customers</p>
                <p className="text-sm text-red-600">View and manage all platform customers</p>
              </button>
            </Link>
            <Link to="/admin/products">
              <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition">
                <p className="font-semibold text-purple-900 text-base">Manage Products</p>
                <p className="text-sm text-purple-600">Moderate and oversee all products</p>
              </button>
            </Link>
            <Link to="/admin/payments">
              <button className="w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition">
                <p className="font-semibold text-green-900 text-base">View Payments</p>
                <p className="text-sm text-green-600">Track transactions and platform revenue</p>
              </button>
            </Link>
            <Link to="/admin/support">
              <button className="w-full p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition">
                <p className="font-semibold text-orange-900 text-base">Support Tickets</p>
                <p className="text-sm text-orange-600">Manage customer and vendor inquiries</p>
              </button>
            </Link>
            <Link to="/admin/analytics">
              <button className="w-full p-3 bg-teal-50 hover:bg-teal-100 rounded-lg text-left transition">
                <p className="font-semibold text-teal-900 text-base">View Analytics</p>
                <p className="text-sm text-teal-600">Platform performance and insights</p>
              </button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New vendor registration', vendor: 'Artisan Crafts', time: '5 min ago', type: 'vendor' },
              { action: 'Order completed', order: '#3456', time: '15 min ago', type: 'order' },
              { action: 'New user signup', user: 'john@example.com', time: '1 hour ago', type: 'user' },
              { action: 'Vendor approved', vendor: 'Home Decor Co', time: '2 hours ago', type: 'approval' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">
                    {activity.vendor || activity.order || activity.user}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
