import { useState, useEffect } from 'react';
import { Card, Button, LoadingSpinner, Input } from '@components/common/UI';
import { MessageSquare, Search, Clock, CheckCircle, AlertCircle, User, Mail } from 'lucide-react';

const AdminSupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      // NOTE: Support ticket system requires database model implementation
      // This is currently showing sample data for UI demonstration
      // TODO: Create Ticket model and API endpoints for production use
      setTimeout(() => {
        setTickets([
          {
            id: 1,
            ticketNumber: 'TKT-2024-001',
            subject: 'Order not received',
            userName: 'John Doe',
            userEmail: 'john@example.com',
            userType: 'Customer',
            priority: 'high',
            status: 'open',
            category: 'Order Issue',
            createdDate: '2024-03-16 10:30',
            lastUpdate: '2024-03-16 14:20',
            messages: 3
          },
          {
            id: 2,
            ticketNumber: 'TKT-2024-002',
            subject: 'Payment not received for order',
            userName: 'Artisan Pottery Co.',
            userEmail: 'vendor@pottery.com',
            userType: 'Vendor',
            priority: 'high',
            status: 'open',
            category: 'Payment',
            createdDate: '2024-03-16 09:15',
            lastUpdate: '2024-03-16 12:30',
            messages: 5
          },
          {
            id: 3,
            ticketNumber: 'TKT-2024-003',
            subject: 'How to add more products?',
            userName: 'Jane Smith',
            userEmail: 'jane@leather.com',
            userType: 'Vendor',
            priority: 'low',
            status: 'resolved',
            category: 'General Inquiry',
            createdDate: '2024-03-15 14:00',
            lastUpdate: '2024-03-15 16:45',
            messages: 2
          },
          {
            id: 4,
            ticketNumber: 'TKT-2024-004',
            subject: 'Refund request for damaged item',
            userName: 'Mike Johnson',
            userEmail: 'mike@example.com',
            userType: 'Customer',
            priority: 'medium',
            status: 'in_progress',
            category: 'Refund',
            createdDate: '2024-03-16 08:20',
            lastUpdate: '2024-03-16 11:10',
            messages: 4
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load tickets:', error);
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    highPriority: tickets.filter(t => t.priority === 'high' && t.status !== 'resolved').length
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
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600">Manage customer and vendor support requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-3xl font-bold text-orange-600">{stats.open}</p>
            </div>
            <MessageSquare className="w-10 h-10 text-orange-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Clock className="w-10 h-10 text-blue-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </Card>
        <Card className="p-6 border-2 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-800 font-semibold">High Priority</p>
              <p className="text-3xl font-bold text-red-600">{stats.highPriority}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-600" />
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
              placeholder="Search tickets by subject, user, or ticket number..."
              className="w-full pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['open', 'in_progress', 'resolved', 'all'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2.5 text-base font-semibold rounded-lg whitespace-nowrap transition ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Tickets Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ticket</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{ticket.ticketNumber}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Clock className="w-3 h-3" />
                        {ticket.createdDate}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{ticket.messages} messages</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{ticket.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">Last update: {ticket.lastUpdate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{ticket.userName}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Mail className="w-3 h-3" />
                          {ticket.userEmail}
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {ticket.userType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {ticket.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      ticket.priority === 'high' ? 'bg-red-100 text-red-800' : 
                      ticket.priority === 'medium' ? 'bg-orange-100 text-orange-800' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {ticket.priority === 'high' && <AlertCircle className="w-4 h-4" />}
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      ticket.status === 'open' ? 'bg-orange-100 text-orange-800' : 
                      ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status === 'open' && <MessageSquare className="w-4 h-4" />}
                      {ticket.status === 'in_progress' && <Clock className="w-4 h-4" />}
                      {ticket.status === 'resolved' && <CheckCircle className="w-4 h-4" />}
                      {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="primary" 
                        className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        View & Respond
                      </Button>
                      {ticket.status !== 'resolved' && (
                        <Button 
                          variant="outline" 
                          className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
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

export default AdminSupportPage;
