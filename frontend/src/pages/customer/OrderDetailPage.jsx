import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '@services/index';
import { LoadingSpinner, Card, Badge } from '@components/common/UI';
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from 'lucide-react';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
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

  const statusSteps = [
    { status: 'pending', label: 'Order Placed', icon: Clock },
    { status: 'processing', label: 'Processing', icon: Package },
    { status: 'shipped', label: 'Shipped', icon: Package },
    { status: 'delivered', label: 'Delivered', icon: Package }
  ];

  const getStatusIndex = (status) => {
    return statusSteps.findIndex(s => s.status === status);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
        <Link to="/customer/orders" className="text-red-600 hover:text-red-700">Back to Orders</Link>
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex(order.status);

  return (
    <div className="p-6">
      <Link to="/customer/orders" className="inline-flex items-center text-red-600 hover:text-red-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Link>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
            <p className="text-gray-600 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <Badge variant={getStatusBadge(order.status)} className="text-lg px-4 py-2">
            {order.status}
          </Badge>
        </div>
      </div>

      {/* Order Status Timeline */}
      {order.status !== 'cancelled' && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => (
              <div key={step.status} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    index <= currentStatusIndex
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <p className={`text-sm mt-2 font-medium ${
                    index <= currentStatusIndex ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    index < currentStatusIndex ? 'bg-red-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <img
                    src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">${Number(item.price).toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${(Number(order.totalAmount) / 1.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${(Number(order.totalAmount) - Number(order.totalAmount) / 1.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                <span>Total</span>
                <span className="text-red-600">${Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {order.shippingAddress && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
              </div>
              <p className="text-gray-700">{order.shippingAddress.street}</p>
              <p className="text-gray-700">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-gray-700">{order.shippingAddress.country}</p>
            </Card>
          )}

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
            </div>
            <p className="text-gray-700 capitalize">{order.paymentMethod || 'Card'}</p>
            <p className="text-sm text-gray-600 mt-1">Paid on {new Date(order.createdAt).toLocaleDateString()}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
