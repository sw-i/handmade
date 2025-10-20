import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useCartStore } from '@store/cartStore';
import { ShoppingCart, User, LogOut, Menu, Search } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-indigo-600">Handmade Hub</div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-indigo-600 transition">Products</Link>
            <Link to="/vendors" className="text-gray-700 hover:text-indigo-600 transition">Vendors</Link>
            
            {/* Cart */}
            <Link to="/cart" className="relative text-gray-700 hover:text-indigo-600 transition">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/customer'}
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition"
                >
                  <User size={20} />
                  <span>{user.firstName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Sign Up</Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-indigo-600"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </form>
            <nav className="flex flex-col space-y-3">
              <Link to="/products" className="text-gray-700 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link to="/vendors" className="text-gray-700 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Vendors</Link>
              <Link to="/cart" className="text-gray-700 hover:text-indigo-600 flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart size={20} className="mr-2" />
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
              {user ? (
                <>
                  <Link to={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/customer'} className="text-gray-700 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-left text-gray-700 hover:text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="text-gray-700 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
