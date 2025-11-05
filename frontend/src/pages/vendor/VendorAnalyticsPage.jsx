import { useState, useEffect } from 'react';
import { vendorService } from '@services/index';
import { LoadingSpinner, Card } from '@components/common/UI';
import { TrendingUp, DollarSign, Package, ShoppingCart, Star } from 'lucide-react';
import ChatWidget from '@components/chat/ChatWidget';

const VendorAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await vendorService.getAnalytics();
      setAnalytics(response);
    } catch (error) {
      console.error('Failed to load analytics:', error);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics & Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${analytics?.totalRevenue?.toFixed(2) || '0.00'}</p>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.totalOrders || 0}</p>
              <p className="text-sm text-red-600 mt-1">+8% from last month</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Products Listed</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.totalProducts || 0}</p>
              <p className="text-sm text-red-600 mt-1">Active listings</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.averageRating?.toFixed(1) || '0.0'}</p>
              <p className="text-sm text-yellow-600 mt-1">From {analytics?.totalReviews || 0} reviews</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend (Last 7 Days)</h2>
          <div className="space-y-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const revenue = Math.random() * 500 + 100;
              const maxRevenue = 600;
              const percentage = (revenue / maxRevenue) * 100;
              
              return (
                <div key={day}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{day}</span>
                    <span className="text-sm font-bold text-gray-900">${revenue.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
          <div className="space-y-4">
            {analytics?.topProducts?.slice(0, 5).map((product, idx) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales || 0} sales</p>
                  </div>
                </div>
                <p className="font-bold text-red-600">${Number(product.revenue || 0).toFixed(2)}</p>
              </div>
            )) || (
              <p className="text-gray-600 text-center py-8">No sales data yet</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sales by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Electronics', value: 45, color: 'blue' },
            { name: 'Clothing', value: 25, color: 'purple' },
            { name: 'Home & Garden', value: 20, color: 'green' },
            { name: 'Other', value: 10, color: 'gray' }
          ].map((category) => (
            <div key={category.name} className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(category.value / 100) * 351.68} 351.68`}
                    className={`text-${category.color}-600`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{category.value}%</span>
                </div>
              </div>
              <p className="font-semibold text-gray-900">{category.name}</p>
            </div>
          ))}
        </div>
      </Card>
      <ChatWidget />
    </div>
  );
};

export default VendorAnalyticsPage;
