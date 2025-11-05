import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vendorService, productService } from '@services/index';
import { LoadingSpinner, Card } from '@components/common/UI';
import { Store, Star, MapPin, Mail, Phone, ArrowLeft, Globe, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const VendorDetailPage = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendor();
  }, [id]);

  const loadVendor = async () => {
    try {
      const data = await vendorService.getVendor(id);
      setVendor(data);
      // Load products after vendor is loaded using the vendor's ID
      if (data && data.id) {
        loadVendorProducts(data.id);
      }
    } catch (error) {
      console.error('Failed to load vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVendorProducts = async (vendorId) => {
    try {
      const response = await productService.getProducts({ vendor: vendorId });
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vendor not found</h2>
          <Link to="/vendors" className="text-red-600 hover:text-red-700">Back to Vendors</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/vendors" className="inline-flex items-center text-red-600 hover:text-red-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vendors
        </Link>

        <Card className="p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Store className="w-12 h-12 text-red-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {vendor.businessName || `${vendor.user?.firstName} ${vendor.user?.lastName}`}
              </h1>
              
              {vendor.rating && vendor.rating > 0 && (
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(vendor.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {vendor.rating.toFixed(1)} rating
                  </span>
                </div>
              )}

              <div 
                className="text-gray-700 mb-4 html-content"
                dangerouslySetInnerHTML={{ __html: vendor.businessDescription || '<p>No description available</p>' }}
              />

              <div className="space-y-2 text-sm text-gray-600">
                {vendor.address && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{vendor.address}</span>
                  </div>
                )}
                {vendor.businessEmail && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <a href={`mailto:${vendor.businessEmail}`} className="text-red-600 hover:text-red-700">
                      {vendor.businessEmail}
                    </a>
                  </div>
                )}
                {vendor.businessPhone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <a href={`tel:${vendor.businessPhone}`} className="text-red-600 hover:text-red-700">
                      {vendor.businessPhone}
                    </a>
                  </div>
                )}
                {vendor.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-gray-500" />
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              {(vendor.facebookUrl || vendor.instagramUrl || vendor.twitterUrl || vendor.linkedinUrl) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 uppercase mb-2">Connect With Us</p>
                  <div className="flex gap-3">
                    {vendor.facebookUrl && (
                      <a href={vendor.facebookUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-red-600 hover:text-red-700 transition-colors">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {vendor.instagramUrl && (
                      <a href={vendor.instagramUrl} target="_blank" rel="noopener noreferrer"
                         className="text-pink-600 hover:text-pink-700 transition-colors">
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {vendor.twitterUrl && (
                      <a href={vendor.twitterUrl} target="_blank" rel="noopener noreferrer"
                         className="text-red-400 hover:text-blue-500 transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {vendor.linkedinUrl && (
                      <a href={vendor.linkedinUrl} target="_blank" rel="noopener noreferrer"
                         className="text-red-700 hover:text-red-800 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Vendor Statistics */}
              {(vendor.totalProducts || vendor.totalSales || vendor.createdAt) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4">
                    {vendor.totalProducts !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Products</p>
                        <p className="text-lg font-semibold text-gray-900">{vendor.totalProducts}</p>
                      </div>
                    )}
                    {vendor.totalSales !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Sales</p>
                        <p className="text-lg font-semibold text-gray-900">{vendor.totalSales}</p>
                      </div>
                    )}
                    {vendor.createdAt && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Member Since</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(vendor.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Products by this Vendor</h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card hover className="overflow-hidden">
                  <img
                    src={product.images?.[0]?.imageUrl ? `http://localhost:5000${product.images[0].imageUrl}` : '/placeholder-product.jpg'}
                    alt={product.name}
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect width=%22200%22 height=%22200%22 fill=%22%23f3f4f6%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22system-ui%22 font-size=%2216%22%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <div 
                      className="text-sm text-gray-600 mb-2 line-clamp-2 html-content"
                      dangerouslySetInnerHTML={{ __html: product.description || '' }}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-red-600">${Number(product.price).toFixed(2)}</span>
                      {product.averageRating > 0 && (
                        <div className="flex items-center text-sm">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          {product.averageRating.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600 bg-white rounded-lg shadow">
            This vendor hasn't listed any products yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDetailPage;
