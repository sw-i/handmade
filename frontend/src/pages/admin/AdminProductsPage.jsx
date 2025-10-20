import { useState, useEffect } from 'react';
import { Card, Button, LoadingSpinner, Input } from '@components/common/UI';
import { Package, Search, CheckCircle, XCircle, Flag, Eye, Ban } from 'lucide-react';
import { adminService } from '@services/index';
import { format } from 'date-fns';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50 });

  useEffect(() => {
    loadProducts();
  }, [searchTerm, statusFilter, pagination.page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllProducts({
        search: searchTerm,
        status: statusFilter,
        page: pagination.page,
        limit: pagination.limit
      });
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductAction = async (productId, action) => {
    try {
      // Confirmation for critical actions
      if (action === 'disable' || action === 'reject') {
        const confirmMessage = action === 'disable' 
          ? 'Are you sure you want to disable this product? It will be marked as rejected.'
          : 'Are you sure you want to reject this product?';
        
        if (!window.confirm(confirmMessage)) {
          return;
        }
      }

      let updateData = {};
      if (action === 'approve') {
        updateData = { status: 'approved' };
      } else if (action === 'reject') {
        updateData = { status: 'rejected' };
      } else if (action === 'flag') {
        updateData = { flagged: true };
      } else if (action === 'unflag') {
        updateData = { flagged: false };
      } else if (action === 'disable') {
        updateData = { status: 'rejected' };
      } else if (action === 'enable') {
        updateData = { status: 'approved' };
      }
      
      const response = await adminService.updateProductStatus(productId, updateData);
      
      // Show success message
      alert(`Product ${action}d successfully!`);
      
      // Reload products to show updated data
      await loadProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
      alert(`Failed to ${action} product: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleViewProduct = (productId) => {
    // Navigate to product detail page or open modal
    window.open(`/products/${productId}`, '_blank');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.vendor && product.vendor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: products.length,
    pending: products.filter(p => p.status === 'pending').length,
    flagged: products.filter(p => p.flagged).length,
    outOfStock: products.filter(p => p.stock === 0).length
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
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Oversee and moderate all platform products</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="w-10 h-10 text-indigo-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-orange-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Flagged Items</p>
              <p className="text-3xl font-bold text-red-600">{stats.flagged}</p>
            </div>
            <Flag className="w-10 h-10 text-red-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-3xl font-bold text-gray-600">{stats.outOfStock}</p>
            </div>
            <XCircle className="w-10 h-10 text-gray-600" />
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
              placeholder="Search products by name or vendor..."
              className="w-full pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
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

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vendor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} sales</p>
                        {product.flagged && (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600 mt-1">
                            <Flag className="w-3 h-3" />
                            Flagged for review
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{product.vendor}</p>
                    <p className="text-xs text-gray-500">ID: {product.vendorId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${
                      product.stock === 0 ? 'text-red-600' : 
                      product.stock < 10 ? 'text-orange-600' : 
                      'text-green-600'
                    }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      product.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      product.status === 'pending' ? 'bg-orange-100 text-orange-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                      {product.status === 'pending' && <Flag className="w-4 h-4" />}
                      {product.status === 'rejected' && <XCircle className="w-4 h-4" />}
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {product.status === 'pending' && (
                        <>
                          <Button 
                            variant="primary" 
                            className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                            onClick={() => handleProductAction(product.id, 'approve')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="danger" 
                            className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                            onClick={() => handleProductAction(product.id, 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {product.status === 'approved' && !product.flagged && (
                        <Button 
                          variant="danger" 
                          className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                          onClick={() => handleProductAction(product.id, 'flag')}
                        >
                          <Flag className="w-4 h-4 mr-1" />
                          Flag
                        </Button>
                      )}
                      {product.status === 'approved' && product.flagged && (
                        <Button 
                          variant="primary" 
                          className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                          onClick={() => handleProductAction(product.id, 'unflag')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Unflag
                        </Button>
                      )}
                      {product.status === 'approved' && (
                        <Button 
                          variant="danger" 
                          className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                          onClick={() => handleProductAction(product.id, 'disable')}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          Disable
                        </Button>
                      )}
                      {product.status === 'rejected' && (
                        <Button 
                          variant="primary" 
                          className="px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center"
                          onClick={() => handleProductAction(product.id, 'enable')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Enable
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

export default AdminProductsPage;
