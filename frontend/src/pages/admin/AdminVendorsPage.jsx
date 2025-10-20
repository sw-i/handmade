import { useState, useEffect } from 'react';
import { vendorService } from '@services/index';
import { Card, LoadingSpinner, Button, Badge, Modal } from '@components/common/UI';
import { Store, Mail, Phone, MapPin, CheckCircle, XCircle, Eye, TrendingUp, Package, DollarSign, Star, Lock, Calendar, User, Clock, Trash2, Unlock } from 'lucide-react';

const AdminVendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadVendors();
  }, [statusFilter]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      // Add timestamp to prevent caching
      const response = await vendorService.getVendors({ 
        status: statusFilter,
        _t: Date.now() // Cache buster
      });
      // Map backend data to include status field
      const vendorsWithStatus = (response.data || []).map(vendor => ({
        ...vendor,
        status: vendor.isApproved ? 'approved' : 'pending',
        isSuspended: vendor.user?.isActive === false,
        email: vendor.user?.email || vendor.businessEmail || 'N/A',
        phone: vendor.user?.phone || vendor.businessPhone || 'N/A'
      }));
      setVendors(vendorsWithStatus);
    } catch (error) {
      console.error('Failed to load vendors:', error);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId) => {
    if (!window.confirm('Are you sure you want to approve this vendor?')) return;
    
    try {
      setLoading(true);
      await vendorService.approveVendor(vendorId);
      
      // Remove vendor from current list immediately for better UX
      setVendors(prev => prev.filter(v => v.id !== vendorId));
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
      notification.innerHTML = '✅ Vendor approved successfully!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      // Reload vendors to get fresh data
      await loadVendors();
    } catch (error) {
      console.error('Failed to approve vendor:', error);
      alert('Failed to approve vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (vendorId) => {
    if (!window.confirm('Are you sure you want to reject this vendor?')) return;
    
    try {
      setLoading(true);
      await vendorService.rejectVendor(vendorId);
      
      // Remove vendor from current list immediately for better UX
      setVendors(prev => prev.filter(v => v.id !== vendorId));
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
      notification.innerHTML = '❌ Vendor rejected';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      // Reload vendors to get fresh data
      await loadVendors();
    } catch (error) {
      console.error('Failed to reject vendor:', error);
      alert('Failed to reject vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (vendorId) => {
    if (!window.confirm('⚠️ Are you sure you want to freeze/suspend this vendor account? The vendor will not be able to login until reactivated.')) return;
    
    try {
      setLoading(true);
      await vendorService.suspendVendor(vendorId);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
      notification.innerHTML = '🔒 Vendor account suspended';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      // Reload vendors to get fresh data
      await loadVendors();
    } catch (error) {
      console.error('Failed to suspend vendor:', error);
      alert('Failed to suspend vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsuspend = async (vendorId) => {
    if (!window.confirm('Are you sure you want to reactivate this vendor account?')) return;
    
    try {
      setLoading(true);
      await vendorService.unsuspendVendor(vendorId);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
      notification.innerHTML = '✅ Vendor account reactivated';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      // Reload vendors to get fresh data
      await loadVendors();
    } catch (error) {
      console.error('Failed to unsuspend vendor:', error);
      alert('Failed to reactivate vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vendorId) => {
    if (!window.confirm('⚠️ WARNING: Are you sure you want to PERMANENTLY DELETE this vendor account? This action cannot be undone and will delete all associated products and data!')) return;
    
    const doubleConfirm = window.prompt('Type "DELETE" to confirm permanent deletion:');
    if (doubleConfirm !== 'DELETE') {
      alert('Deletion cancelled.');
      return;
    }
    
    try {
      setLoading(true);
      await vendorService.deleteVendor(vendorId);
      
      // Remove vendor from list
      setVendors(prev => prev.filter(v => v.id !== vendorId));
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
      notification.innerHTML = '🗑️ Vendor account deleted permanently';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      // Reload vendors to get fresh data
      await loadVendors();
    } catch (error) {
      console.error('Failed to delete vendor:', error);
      alert('Failed to delete vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const viewVendorDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowModal(true);
  };

  const statusTabs = [
    { value: 'pending', label: 'Pending Approval', color: 'orange' },
    { value: 'approved', label: 'Approved', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
    { value: 'all', label: 'All Vendors', color: 'blue' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Store className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
            <p className="text-gray-600">Review and manage vendor applications</p>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {vendors.filter(v => v.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {vendors.filter(v => v.status === 'approved').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-indigo-600">
                  ${vendors.reduce((sum, v) => sum + (Number(v.totalRevenue) || 0), 0).toFixed(0)}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 bg-white rounded-xl p-2 shadow-sm border border-gray-200 inline-flex gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-6 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              statusFilter === tab.value
                ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {vendors.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Header Section with gradient */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Store className="w-10 h-10 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{vendor.businessName}</h3>
                      <p className="text-sm text-indigo-100 mb-2 max-w-md">{vendor.businessDescription || 'No description available'}</p>
                      <div className="inline-flex items-center gap-2">
                        <Badge 
                          variant={vendor.status === 'approved' ? 'success' : vendor.status === 'pending' ? 'warning' : 'danger'}
                          className="text-xs font-semibold"
                        >
                          {vendor.status.toUpperCase()}
                        </Badge>
                        {vendor.approvedAt && (
                          <span className="text-xs text-indigo-100 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Approved {new Date(vendor.approvedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => viewVendorDetails(vendor)}
                    className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{vendor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{vendor.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{vendor.city || vendor.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-blue-700 mb-1">Products</p>
                    <p className="text-2xl font-bold text-blue-900">{vendor.totalProducts || 0}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-sm text-green-700 mb-1">Total Sales</p>
                    <p className="text-2xl font-bold text-green-900">{vendor.totalSales || 0}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-5 h-5 text-indigo-600" />
                      <TrendingUp className="w-4 h-4 text-indigo-500" />
                    </div>
                    <p className="text-sm text-indigo-700 mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-indigo-900">${Number(vendor.totalRevenue || 0).toFixed(0)}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <Star className="w-5 h-5 text-amber-600" />
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </div>
                    <p className="text-sm text-amber-700 mb-1">Rating</p>
                    <p className="text-2xl font-bold text-amber-900">{vendor.rating ? Number(vendor.rating).toFixed(1) : 'N/A'}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {vendor.status === 'pending' ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(vendor.id)}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve Vendor
                      </button>
                      <button
                        onClick={() => handleReject(vendor.id)}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  ) : vendor.status === 'approved' ? (
                    <>
                      <div className="flex gap-3">
                        {vendor.isSuspended ? (
                          <button
                            onClick={() => handleUnsuspend(vendor.id)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          >
                            <Unlock className="w-5 h-5" />
                            Reactivate Account
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSuspend(vendor.id)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          >
                            <Lock className="w-5 h-5" />
                            Suspend Account
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(vendor.id)}
                          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-5 h-5" />
                          Delete
                        </button>
                      </div>
                      {vendor.isSuspended && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <p className="text-sm text-orange-800 font-medium flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            This account is currently suspended
                          </p>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-12 h-12 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Vendors Found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {statusFilter === 'pending' 
              ? 'No pending vendor applications at the moment. New applications will appear here for review.' 
              : statusFilter === 'approved'
              ? 'No approved vendors yet. Approve pending vendors to see them here.'
              : `No ${statusFilter} vendors to display`}
          </p>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedVendor(null);
        }}
        title="Vendor Details"
      >
        {selectedVendor && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Business Information</h3>
              <p className="text-sm text-gray-600"><strong>Name:</strong> {selectedVendor.businessName}</p>
              <p className="text-sm text-gray-600"><strong>Description:</strong> {selectedVendor.description}</p>
              <p className="text-sm text-gray-600"><strong>Status:</strong> {selectedVendor.status}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
              <p className="text-sm text-gray-600"><strong>Email:</strong> {selectedVendor.email}</p>
              <p className="text-sm text-gray-600"><strong>Phone:</strong> {selectedVendor.phone}</p>
              <p className="text-sm text-gray-600"><strong>Address:</strong> {selectedVendor.address}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Banking Information</h3>
              <p className="text-sm text-gray-600"><strong>Bank Account:</strong> {selectedVendor.bankAccount || 'Not provided'}</p>
              <p className="text-sm text-gray-600"><strong>Tax ID:</strong> {selectedVendor.taxId || 'Not provided'}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Performance Metrics</h3>
              <p className="text-sm text-gray-600"><strong>Total Products:</strong> {selectedVendor.totalProducts || 0}</p>
              <p className="text-sm text-gray-600"><strong>Total Sales:</strong> {selectedVendor.totalSales || 0}</p>
              <p className="text-sm text-gray-600"><strong>Total Revenue:</strong> ${Number(selectedVendor.totalRevenue || 0).toFixed(2)}</p>
              <p className="text-sm text-gray-600"><strong>Average Rating:</strong> ⭐ {selectedVendor.rating ? Number(selectedVendor.rating).toFixed(1) : 'N/A'}</p>
            </div>

            {selectedVendor.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={() => {
                  handleApprove(selectedVendor.id);
                  setShowModal(false);
                }} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button variant="danger" onClick={() => {
                  handleReject(selectedVendor.id);
                  setShowModal(false);
                }} className="flex-1">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminVendorsPage;
