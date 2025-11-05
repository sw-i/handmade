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
      icon: <ShoppingBag className="w-8 h-8 text-red-600" />,
      title: 'Unique Products',
      description: 'Discover one-of-a-kind handcrafted items you won\'t find anywhere else.'
    },
    {
      icon: <Users className="w-8 h-8 text-red-600" />,
      title: 'Support Artisans',
      description: 'Directly support talented home-based entrepreneurs and small businesses.'
    },
    {
      icon: <Award className="w-8 h-8 text-red-600" />,
      title: 'Quality Guarantee',
      description: 'Every product is carefully crafted with attention to detail and quality.'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: 'Secure Shopping',
      description: 'Shop with confidence using our secure payment and buyer protection.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Split Layout with Image */}
      <section className="relative bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-soft rounded-full text-sm font-semibold border border-primary-200 hover:shadow-card-hover transition-shadow">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-neutral-800">Handcrafted with Love ✨</span>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight text-neutral-900">
                  Discover <br/>
                  <span className="text-primary-600">Unique</span>{' '}
                  <span className="text-secondary-600">Handmade</span>{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10">Treasures</span>
                    <span className="absolute bottom-2 left-0 w-full h-4 bg-accent-300 -z-0 transform -skew-y-2"></span>
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-neutral-600 leading-relaxed max-w-xl">
                  Connect directly with talented artisans and bring home one-of-a-kind pieces that tell a story
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 py-4">
                <div>
                  <div className="text-3xl font-bold text-primary-600">500+</div>
                  <div className="text-sm text-neutral-600">Artisans</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary-600">2,000+</div>
                  <div className="text-sm text-neutral-600">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent-600">15K+</div>
                  <div className="text-sm text-neutral-600">Happy Customers</div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button className="bg-primary-600 text-white hover:bg-primary-700 border-0 shadow-card hover:shadow-card-hover transition-all transform hover:-translate-y-1 font-semibold px-8 py-4 text-lg rounded-xl inline-flex items-center gap-2 group">
                    <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Explore Marketplace
                  </Button>
                </Link>
                <Link to="/vendors">
                  <Button className="bg-white text-neutral-800 hover:bg-neutral-50 border-2 border-neutral-300 shadow-card hover:shadow-card-hover font-semibold px-8 py-4 text-lg rounded-xl inline-flex items-center gap-2 transition-all group">
                    Meet Artisans
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image Grid */}
            <div className="hidden lg:block relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Main Large Image */}
                <div className="col-span-2 rounded-3xl overflow-hidden shadow-card-hover transform hover:scale-105 transition-all duration-500">
                  <img 
                    src="https://cdn.shopify.com/s/files/1/0070/7032/articles/selling-handmade-goods_2c9996a9-293f-424a-8512-91763c9dec52.png?w=800&q=80" 
                    alt="Handmade crafts"
                    className="w-full h-80 object-cover"
                  />
                </div>
                
                {/* Small Images */}
                <div className="rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transform hover:scale-105 transition-all duration-500">
                  <img 
                    src="https://growingfaith.com.au/images/made/images/uploads/growing-faith-682x341-2022-12-08c_682_341_int_c1_c_c__1.jpg?w=400&q=80" 
                    alt="Pottery"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transform hover:scale-105 transition-all duration-500">
                  <img 
                    src="https://egyptianstreets.com/wp-content/uploads/2020/09/WhatsApp-Image-2020-09-23-at-1.14.02-PM.jpeg?w=400&q=80" 
                    alt="Textiles"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-card-hover p-6 border border-primary-200 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900">Quality Assured</div>
                    <div className="text-sm text-neutral-600">Verified Artisans</div>
                  </div>
                </div>
              </div>
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
                <div className="flex justify-center mb-5 bg-red-50 w-16 h-16 rounded-2xl mx-auto items-center">
                  <div className="text-red-600">{feature.icon}</div>
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
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                          {product.title || product.name}
                        </h3>
                        
                        {/* Description - Plain Text */}
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                          {truncateText(product.description, 80)}
                        </p>
                        
                        {/* Price & Button */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <span className="text-2xl font-bold text-red-600">
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
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
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
                  <Link to="/products" className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold mt-4 group">
                    Browse all products 
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}

              {featuredProducts.length > 0 && (
                <div className="flex justify-center mt-16">
                  <Link to="/products">
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 text-base rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center"
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
      <section className="relative bg-gradient-to-br from-red-600 via-purple-600 to-pink-500 text-white py-20 overflow-hidden">
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
          <p className="text-lg sm:text-xl text-red-50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join our thriving community of artisans and reach thousands of customers who appreciate handmade quality
          </p>
          <Link to="/register">
            <Button 
              className="bg-white text-red-600 hover:bg-gray-50 font-semibold px-6 py-2.5 text-base rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center"
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
