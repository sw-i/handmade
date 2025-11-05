import { useState, useEffect } from 'react';
import { Card, Button, LoadingSpinner, Input } from '@components/common/UI';
import { DollarSign, Search, CreditCard, TrendingUp, Calendar, Eye, RefreshCw } from 'lucide-react';
import { adminService } from '@services/index';
import { format } from 'date-fns';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50 });

  useEffect(() => {
    loadPayments();
  }, [searchTerm, statusFilter, pagination.page]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPayments({
        search: searchTerm,
        status: statusFilter,
        page: pagination.page,
        limit: pagination.limit
      });
      setPayments(response.data.payments);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (orderId) => {
    if (!window.confirm('Are you sure you want to process this refund? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await adminService.processRefund(orderId);
      
      // Show success message
      alert('Refund processed successfully!');
      
      // Reload payments to show updated data
      await loadPayments();
    } catch (error) {
      console.error('Failed to process refund:', error);
      alert(`Failed to process refund: ${error.response?.data?.message || error.message}`);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      (payment.orderId && payment.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.customer && payment.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.vendor && payment.vendor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
    platformFees: payments.reduce((sum, p) => sum + p.platformFee, 0),
    pendingPayouts: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.vendorPayout, 0),
    completedToday: payments.filter(p => p.status === 'completed' && p.date.includes('2024-03-16')).length
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Track all transactions and platform revenue</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Platform Fees</p>
              <p className="text-3xl font-bold text-red-600">${stats.platformFees.toFixed(2)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-red-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payouts</p>
              <p className="text-3xl font-bold text-orange-600">${stats.pendingPayouts.toFixed(2)}</p>
            </div>
            <RefreshCw className="w-10 h-10 text-orange-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Today</p>
              <p className="text-3xl font-bold text-red-600">{stats.completedToday}</p>
            </div>
            <CreditCard className="w-10 h-10 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID, customer, or vendor..."
              className="w-full pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'completed', 'pending', 'refunded'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2.5 text-base font-semibold rounded-lg whitespace-nowrap transition ${
                  statusFilter === status
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vendor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Platform Fee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vendor Payout</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{payment.orderId}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(payment.date), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{payment.customer}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{payment.vendor}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-lg font-bold text-gray-900">${payment.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{payment.paymentMethod}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-lg font-bold text-red-600">${payment.platformFee.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">10% fee</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-lg font-bold text-green-600">${payment.vendorPayout.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      payment.status === 'pending' ? 'bg-orange-100 text-orange-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                      {payment.status === 'completed' && (
                        <Button 
                          variant="danger" 
                          className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                          onClick={() => handleRefund(payment.id)}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Refund
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminPaymentsPage;
