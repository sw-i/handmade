import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useCartStore } from '@store/cartStore';
import { ShoppingCart, User, LogOut, Menu, Search, Heart, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = () => {
      const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(saved);
    };
    loadFavorites();
    
    // Listen for storage changes
    window.addEventListener('storage', loadFavorites);
    const interval = setInterval(loadFavorites, 1000); // Check every second
    
    return () => {
      window.removeEventListener('storage', loadFavorites);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const removeFavorite = (productId) => {
    const newFavorites = favorites.filter(fav => fav.id !== productId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-red-600">Handmade Hub</div>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600">
                <Search size={20} />
              </button>
            </div>
          </form>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-red-600 transition">Products</Link>
            <Link to="/vendors" className="text-gray-700 hover:text-red-600 transition">Vendors</Link>
            <Link to="/events" className="text-gray-700 hover:text-red-600 transition">Events</Link>
            <div className="relative">
              <button
                onClick={() => setWishlistOpen(!wishlistOpen)}
                className="relative text-gray-700 hover:text-red-600 transition"
              >
                <Heart size={24} className={favorites.length > 0 ? 'fill-current text-red-500' : ''} />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
              
              {wishlistOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Wishlist ({favorites.length})</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {favorites.length > 0 ? (
                      favorites.map((product) => (
                        <div key={product.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 flex items-center gap-3">
                          <img
                            src={product.images?.[0]?.imageUrl ? `http://localhost:5000${product.images[0].imageUrl}` : '/placeholder-product.jpg'}
                            alt={product.name || product.title}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%23f3f4f6%22/%3E%3C/svg%3E';
                            }}
                          />
                          <div className="flex-1">
                            <Link
                              to={`/products/${product.id}`}
                              className="font-medium text-gray-900 hover:text-red-600 line-clamp-1"
                              onClick={() => setWishlistOpen(false)}
                            >
                              {product.name || product.title}
                            </Link>
                            <p className="text-sm text-red-600 font-semibold">${Number(product.price).toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => removeFavorite(product.id)}
                            className="text-gray-400 hover:text-red-500 transition"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Heart size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Your wishlist is empty</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link to="/cart" className="relative text-gray-700 hover:text-red-600 transition">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/customer'} className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition">
                  <User size={20} />
                  <span>{user.firstName}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-red-600 transition">Login</Link>
                <Link to="/register" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">Sign Up</Link>
              </div>
            )}
          </nav>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-700 hover:text-red-600">
            <Menu size={24} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSearch} className="mb-4">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </form>
            <nav className="flex flex-col space-y-3">
              <Link to="/products" className="text-gray-700 hover:text-red-600" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link to="/vendors" className="text-gray-700 hover:text-red-600" onClick={() => setMobileMenuOpen(false)}>Vendors</Link>
              <Link to="/events" className="text-gray-700 hover:text-red-600" onClick={() => setMobileMenuOpen(false)}>Events</Link>
              <Link to="/cart" className="text-gray-700 hover:text-red-600 flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart size={20} className="mr-2" />
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
              {user ? (
                <>
                  <Link to={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/customer'} className="text-gray-700 hover:text-red-600" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} className="text-left text-gray-700 hover:text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-red-600" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="text-gray-700 hover:text-red-600" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
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
