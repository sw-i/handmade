import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vendorService } from '@services/index';
import { LoadingSpinner, Card, Input } from '@components/common/UI';
import { Search, Store, Star, MapPin } from 'lucide-react';

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const response = await vendorService.getVendors({ status: 'approved' });
      setVendors(response.data || []);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.businessName?.toLowerCase().includes(search.toLowerCase()) ||
    `${vendor.firstName} ${vendor.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Vendors</h1>
          <p className="text-gray-600">Connect with talented artisans and craftspeople</p>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <Link key={vendor.id} to={`/vendors/${vendor.username || vendor.id}`}>
                <Card hover className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Store className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {vendor.businessName || `${vendor.user?.firstName} ${vendor.user?.lastName}`}
                      </h3>
                      {vendor.rating > 0 && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          {vendor.rating.toFixed(1)}
                        </div>
                      )}
                      {vendor.location && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {vendor.location}
                        </div>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {vendor.businessDescription || 'Handcrafted products with love'}
                      </p>
                      <div className="mt-3 text-sm font-medium text-red-600">
                        {vendor.totalProducts || 0} Products
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsPage;
