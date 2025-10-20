import { useState, useEffect } from 'react';
import { Card, Button, LoadingSpinner, Input } from '@components/common/UI';
import { Users, Search, Mail, Phone, Calendar, Ban, CheckCircle, Eye } from 'lucide-react';
import { adminService } from '@services/index';
import { format } from 'date-fns';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50 });

  useEffect(() => {
    loadCustomers();
  }, [searchTerm, statusFilter, pagination.page]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCustomers({
        search: searchTerm,
        status: statusFilter,
        page: pagination.page,
        limit: pagination.limit
      });
      setCustomers(response.data.customers);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (customerId, newStatus) => {
    try {
      // Confirmation for suspending accounts
      if (newStatus === 'suspended') {
        if (!window.confirm('Are you sure you want to suspend this customer account?')) {
          return;
        }
      }

      const response = await adminService.updateCustomerStatus(customerId, newStatus);
      
      // Show success message
      alert(`Customer account ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully!`);
      
      // Reload customers to show updated data
      await loadCustomers();
    } catch (error) {
      console.error('Failed to update customer status:', error);
      alert(`Failed to update customer status: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleViewCustomer = (customerId) => {
    // For now, show customer details in alert
    // TODO: Create a customer detail modal or page
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      alert(`Customer Details:\n\nName: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone}\nTotal Orders: ${customer.totalOrders}\nTotal Spent: $${customer.totalSpent.toFixed(2)}\nJoined: ${format(new Date(customer.joinedDate), 'PPP')}\nStatus: ${customer.status}`);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage and monitor all platform customers</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Customers</p>
            <p className="text-2xl font-bold text-indigo-600">{customers.length}</p>
          </div>
        </div>
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
              placeholder="Search customers by name or email..."
              className="w-full pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'suspended'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2.5 text-base font-semibold rounded-lg whitespace-nowrap transition ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Orders</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Spent</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{customer.name}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Calendar className="w-3 h-3" />
                        Joined {format(new Date(customer.joinedDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{customer.totalOrders}</p>
                      <p className="text-xs text-gray-500">orders</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-lg font-bold text-green-600">${customer.totalSpent.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Last active: {format(new Date(customer.lastActive), 'MMM dd, yyyy')}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      customer.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status === 'active' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                        onClick={() => handleViewCustomer(customer.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {customer.status === 'active' ? (
                        <Button 
                          variant="danger" 
                          className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                          onClick={() => handleStatusChange(customer.id, 'suspended')}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      ) : (
                        <Button 
                          variant="primary" 
                          className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                          onClick={() => handleStatusChange(customer.id, 'active')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Activate
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

export default AdminCustomersPage;
