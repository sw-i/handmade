import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productService } from '@services/index';
import { LoadingSpinner, Card, Button, Pagination, Input } from '@components/common/UI';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useCartStore } from '@store/cartStore';

// Helper function to strip HTML tags
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

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCartStore();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchParams]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        sort: `${filters.sortOrder === 'desc' ? '-' : ''}${filters.sortBy}`
      };
      
      const response = await productService.getProducts(params);
      setProducts(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) params[key] = filters[key];
    });
    setSearchParams(params);
    setCurrentPage(1);
    loadProducts();
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const categories = [
    'Jewelry', 'Home Decor', 'Clothing', 'Art', 'Accessories', 
    'Pottery', 'Woodwork', 'Textiles', 'Leather', 'Other'
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Products</h1>
          <p className="text-gray-600">Discover unique handcrafted items from talented artisans</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <Button type="submit" variant="primary" className="px-6 py-2.5 text-base font-semibold rounded-lg">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              className="px-6 py-2.5 text-base font-semibold rounded-lg inline-flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="$0"
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="$1000"
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="createdAt">Newest</option>
                  <option value="price">Price</option>
                  <option value="averageRating">Rating</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={applyFilters} variant="primary">Apply Filters</Button>
              <Button
                onClick={() => {
                  setFilters({
                    search: '',
                    category: '',
                    minPrice: '',
                    maxPrice: '',
                    sortBy: 'createdAt',
                    sortOrder: 'desc'
                  });
                  setSearchParams({});
                  loadProducts();
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <Card key={product.id} hover className="overflow-hidden">
                  <Link to={`/products/${product.id}`}>
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                      <img
                        src={product.images?.[0]?.imageUrl ? `http://localhost:5000${product.images[0].imageUrl}` : '/placeholder-product.jpg'}
                        alt={product.name}
                        className="h-48 w-full object-cover object-center group-hover:opacity-90 transition-opacity"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect width=%22200%22 height=%22200%22 fill=%22%23f3f4f6%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22system-ui%22 font-size=%2216%22%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                        {stripHtml(product.name || product.title)}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {truncateText(product.description, 100)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-red-600">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        {product.averageRating > 0 && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="text-yellow-400 mr-1">★</span>
                            {product.averageRating.toFixed(1)}
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="primary"
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            addItem(product);
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <Button onClick={() => {
              setFilters({
                search: '',
                category: '',
                minPrice: '',
                maxPrice: '',
                sortBy: 'createdAt',
                sortOrder: 'desc'
              });
              setSearchParams({});
              loadProducts();
            }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
