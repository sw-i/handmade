import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '@services/index';
import { LoadingSpinner, Card, Button } from '@components/common/UI';
import { ShoppingBag, Users, Award, Shield, ArrowRight, Sparkles } from 'lucide-react';
import ChatWidget from '@components/chat/ChatWidget';

// Helper function to strip HTML tags and get plain text
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return '';
  const plainText = stripHtml(text);
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productService.getProducts({ featured: true, limit: 6 });
      let products = response.data || [];
      
      // If no featured products, fallback to showing any active products
      if (products.length === 0) {
        const fallbackResponse = await productService.getProducts({ limit: 6 });
        products = fallbackResponse.data || [];
      }
      
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Failed to load featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <ShoppingBag className="w-8 h-8 text-indigo-600" />,
      title: 'Unique Products',
      description: 'Discover one-of-a-kind handcrafted items you won\'t find anywhere else.'
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: 'Support Artisans',
      description: 'Directly support talented home-based entrepreneurs and small businesses.'
    },
    {
      icon: <Award className="w-8 h-8 text-indigo-600" />,
      title: 'Quality Guarantee',
      description: 'Every product is carefully crafted with attention to detail and quality.'
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: 'Secure Shopping',
      description: 'Shop with confidence using our secure payment and buyer protection.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/30">
              <Sparkles className="w-4 h-4" />
              <span>Discover Unique Handcrafted Treasures</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">Handmade Hub</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl mb-10 text-indigo-50 max-w-3xl mx-auto leading-relaxed">
              Connect with talented artisans and discover one-of-a-kind handcrafted products made with love
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-row gap-3 justify-center items-center">
              <Link to="/products">
                <Button className="bg-white text-indigo-600 hover:bg-gray-50 border-0 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 font-semibold px-6 py-2.5 text-base rounded-lg inline-flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Shop Now
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-transparent text-white hover:bg-white/10 border-2 border-white backdrop-blur-sm font-semibold px-6 py-2.5 text-base rounded-lg inline-flex items-center">
                  Become a Vendor
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Handmade Hub?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of customers who love unique, handcrafted products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-gray-100">
                <div className="flex justify-center mb-5 bg-indigo-50 w-16 h-16 rounded-2xl mx-auto items-center">
                  <div className="text-indigo-600">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Featured Handmade Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked treasures from our talented artisan community
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.slice(0, 6).map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/products/${product.id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2">
                      {/* Product Image */}
                      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '4/3' }}>
                        <img
                          src={product.images?.[0]?.imageUrl ? `http://localhost:5000${product.images[0].imageUrl}` : '/placeholder-product.jpg'}
                          alt={product.title || product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect width=%22300%22 height=%22300%22 fill=%22%23f3f4f6%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22system-ui%22 font-size=%2218%22%3EHandmade Item%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        {/* Overlay gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-6 space-y-3">
                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {product.title || product.name}
                        </h3>
                        
                        {/* Description - Plain Text */}
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                          {truncateText(product.description, 80)}
                        </p>
                        
                        {/* Price & Button */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <span className="text-2xl font-bold text-indigo-600">
                              ${Number(product.price).toFixed(2)}
                            </span>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <span className="text-sm text-gray-400 line-through ml-2">
                                ${Number(product.compareAtPrice).toFixed(2)}
                              </span>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {featuredProducts.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl font-medium text-gray-600 mb-2">No featured products available yet</p>
                  <Link to="/products" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold mt-4 group">
                    Browse all products 
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}

              {featuredProducts.length > 0 && (
                <div className="flex justify-center mt-16">
                  <Link to="/products">
                    <Button 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 text-base rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center"
                    >
                      View All Products
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/30">
            <Users className="w-4 h-4" />
            <span>Join 500+ Artisans</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to Share Your Craft?
          </h2>
          <p className="text-lg sm:text-xl text-indigo-50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join our thriving community of artisans and reach thousands of customers who appreciate handmade quality
          </p>
          <Link to="/register">
            <Button 
              className="bg-white text-indigo-600 hover:bg-gray-50 font-semibold px-6 py-2.5 text-base rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Become a Vendor Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default HomePage;
