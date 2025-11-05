import { useState, useEffect } from 'react';
import { Card, LoadingSpinner } from '@components/common/UI';
import { TrendingUp, Users, Store, ShoppingCart, DollarSign, Package } from 'lucide-react';

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual admin analytics API
    setTimeout(() => {
      setAnalytics({
        totalRevenue: 125430.50,
        totalOrders: 3456,
        totalUsers: 1250,
        totalVendors: 87,
        totalProducts: 5432,
        avgOrderValue: 36.29,
        topCategories: [
          { name: 'Electronics', sales: 1234, revenue: 45230 },
          { name: 'Clothing', sales: 987, revenue: 32100 },
          { name: 'Home & Garden', sales: 756, revenue: 28900 },
          { name: 'Sports', sales: 543, revenue: 19200 }
        ],
        topVendors: [
          { name: 'Tech World', sales: 567, revenue: 23400 },
          { name: 'Fashion Hub', sales: 432, revenue: 18900 },
          { name: 'Home Decor Co', sales: 321, revenue: 15600 },
          { name: 'Sports Zone', sales: 234, revenue: 12300 }
        ]
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Analytics</h1>
        <p className="text-gray-600">Comprehensive platform performance insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${Number(analytics.totalRevenue).toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+15.3% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders.toLocaleString()}</p>
              <p className="text-sm text-red-600 mt-1">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
              <p className="text-3xl font-bold text-gray-900">${analytics.avgOrderValue}</p>
              <p className="text-sm text-red-600 mt-1">Per transaction</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+8% growth</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Vendors</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalVendors}</p>
              <p className="text-sm text-red-600 mt-1">Platform partners</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Store className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalProducts.toLocaleString()}</p>
              <p className="text-sm text-red-600 mt-1">Listed on platform</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend (Last 30 Days)</h2>
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, idx) => {
              const revenue = Math.random() * 5000 + 2000;
              const maxRevenue = 7000;
              const percentage = (revenue / maxRevenue) * 100;
              
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Week {idx + 1}</span>
                    <span className="text-sm font-bold text-gray-900">${revenue.toFixed(0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Categories by Sales</h2>
          <div className="space-y-4">
            {analytics.topCategories.map((category, idx) => (
              <div key={category.name} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{category.name}</p>
                  <p className="text-sm text-gray-600">{category.sales} sales</p>
                </div>
                <p className="font-bold text-red-600">${category.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Vendors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.topVendors.map((vendor, idx) => (
            <div key={vendor.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{vendor.name}</p>
                <p className="text-sm text-gray-600">{vendor.sales} sales</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-600">${vendor.revenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminAnalyticsPage;
