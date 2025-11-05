import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '@services/index';
import { LoadingSpinner, Card, Badge, Pagination } from '@components/common/UI';
import { Package, Eye } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [currentPage, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        ...(statusFilter !== 'all' && { status: statusFilter })
      };
      const response = await orderService.getOrders(params);
      setOrders(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      processing: 'info',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'danger'
    };
    return variants[status] || 'default';
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Orders</h1>
        
        <div className="flex gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === status
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : orders.length > 0 ? (
        <>
          <div className="space-y-4 mb-8">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                      <Badge variant={getStatusBadge(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">${Number(order.totalAmount).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <img
                        key={index}
                        src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-600">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {order.shippingAddress && (
                      <span>Shipping to: {order.shippingAddress.city}, {order.shippingAddress.state}</span>
                    )}
                  </div>
                  <Link to={`/customer/orders/${order.id}`}>
                    <button className="inline-flex items-center px-6 py-2.5 text-base font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
          <Link to="/products">
            <button className="px-6 py-2.5 text-base font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Start Shopping
            </button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default OrdersPage;
