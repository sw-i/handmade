import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vendorService, orderService } from '@services/index';
import { LoadingSpinner, Card } from '@components/common/UI';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import ChatWidget from '@components/chat/ChatWidget';

const VendorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [analyticsRes, ordersRes] = await Promise.all([
        vendorService.getAnalytics(),
        orderService.getVendorOrders({ limit: 5 })
      ]);
      
      setStats(analyticsRes);
      setRecentOrders(ordersRes.data || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vendor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.averageRating?.toFixed(1) || '0.0'}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link to="/vendor/orders" className="text-red-600 hover:text-red-700 text-sm font-medium">
              View All
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.status}</p>
                  </div>
                  <p className="font-bold text-red-600">${Number(order.totalAmount).toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No recent orders</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/vendor/products">
              <button className="w-full p-3 bg-red-50 hover:bg-red-100 rounded-lg text-left transition">
                <p className="font-semibold text-red-900 text-base">Manage Products</p>
                <p className="text-sm text-red-600">Add, edit, or remove products</p>
              </button>
            </Link>
            <Link to="/vendor/orders">
              <button className="w-full p-3 bg-red-50 hover:bg-red-100 rounded-lg text-left transition">
                <p className="font-semibold text-red-900 text-base">View Orders</p>
                <p className="text-sm text-red-600">Manage customer orders</p>
              </button>
            </Link>
            <Link to="/vendor/analytics">
              <button className="w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition">
                <p className="font-semibold text-green-900 text-base">Analytics</p>
                <p className="text-sm text-green-600">View sales and performance</p>
              </button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default VendorDashboard;
