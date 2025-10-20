import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, Package, Users, BarChart3, User, Settings, DollarSign, MessageSquare, Calendar, Bot } from 'lucide-react';

const Sidebar = ({ role }) => {
  const getMenuItems = () => {
    switch (role) {
      case 'customer':
        return [
          { icon: Home, label: 'Dashboard', path: '/customer/dashboard' },
          { icon: ShoppingCart, label: 'My Orders', path: '/customer/orders' },
          { icon: User, label: 'Profile', path: '/customer/profile' }
        ];
      
      case 'vendor':
        return [
          { icon: Home, label: 'Dashboard', path: '/vendor' },
          { icon: Package, label: 'Products', path: '/vendor/products' },
          { icon: ShoppingCart, label: 'Orders', path: '/vendor/orders' },
          { icon: Calendar, label: 'Events', path: '/vendor/events' },
          { icon: BarChart3, label: 'Analytics', path: '/vendor/analytics' },
          { icon: Settings, label: 'Profile', path: '/vendor/profile' },
          { icon: Bot, label: 'Bot', path: '/chatbot' }
        ];
      
      case 'admin':
        return [
          { icon: Home, label: 'Dashboard', path: '/admin' },
          { icon: Users, label: 'Vendors', path: '/admin/vendors' },
          { icon: User, label: 'Customers', path: '/admin/customers' },
          { icon: Package, label: 'Products', path: '/admin/products' },
          { icon: Calendar, label: 'Events', path: '/admin/events' },
          { icon: DollarSign, label: 'Payments', path: '/admin/payments' },
          { icon: MessageSquare, label: 'Support', path: '/admin/support' },
          { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' }
        ];
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="fixed left-0 top-[73px] w-64 h-[calc(100vh-73px)] bg-white border-r border-gray-200 p-4 transition-colors overflow-y-auto z-40">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-indigo-600 px-4">
          {role === 'customer' ? 'Customer Portal' : role === 'vendor' ? 'Vendor Portal' : 'Admin Portal'}
        </h2>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.label === 'Dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
