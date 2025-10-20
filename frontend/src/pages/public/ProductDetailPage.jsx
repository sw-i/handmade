import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService, reviewService } from '@services/index';
import { useCartStore } from '@store/cartStore';
import { useAuthStore } from '@store/authStore';
import { LoadingSpinner, Button, Card, Input, Textarea } from '@components/common/UI';
import { ShoppingCart, Star, ArrowLeft, Heart, Share2 } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewService.getProductReviews(id);
      setReviews(response.data || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const handleToggleFavorite = () => {
    if (!user) {
      alert('Please login to add items to your wishlist');
      return;
    }
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const productIndex = favorites.findIndex(fav => fav.id === product.id);
    
    if (productIndex > -1) {
      favorites.splice(productIndex, 1);
      setIsFavorite(false);
      alert('Removed from wishlist!');
    } else {
      favorites.push(product);
      setIsFavorite(true);
      alert('Added to wishlist!');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    if (product && user) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some(fav => fav.id === product.id));
    }
  }, [product, user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to leave a review');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.createReview(id, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      loadReviews();
      loadProduct(); // Reload to update average rating
      alert('Review submitted successfully!');
    } catch (error) {
      alert('Failed to submit review. You may have already reviewed this product.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 font-medium transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Handmade Collection
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 p-6 sm:p-8 lg:p-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-inner" style={{ aspectRatio: '1/1' }}>
                <img
                  src={product.images?.[selectedImage]?.imageUrl ? `http://localhost:5000${product.images[selectedImage].imageUrl}` : '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23f3f4f6%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22system-ui%22 font-size=%2224%22%3EHandmade Item%3C/text%3E%3C/svg%3E';
                  }}
                />
                {/* Limited Edition Badge */}
                {product.displayOrder > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-lg">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Limited Edition
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 justify-center lg:justify-start overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-200 hover:scale-105 ${
                        selectedImage === index 
                          ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-md' 
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <img 
                        src={image?.imageUrl ? `http://localhost:5000${image.imageUrl}` : '/placeholder-product.jpg'} 
                        alt={`View ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23f3f4f6%22/%3E%3C/svg%3E';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Header Section */}
              <div className="space-y-4 border-b border-gray-100 pb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight tracking-tight">{product.name}</h1>
                
                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(product.averageRating || 0)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    {product.reviewCount || 0} {product.reviewCount === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                {/* Price & Stock */}
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="text-5xl font-bold text-indigo-600">${Number(product.price).toFixed(2)}</span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-2xl text-gray-400 line-through">${Number(product.compareAtPrice).toFixed(2)}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {product.stock > 0 ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-700">In Stock • {product.stock} available</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-red-700">Out of Stock</span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-sm sm:prose max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description || '' }}
                  style={{ wordBreak: 'break-word' }}
                />
              </div>

              {/* Product Specifications */}
              {(product.sku || product.metaDescription) && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-4 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Product Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.sku && (
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">SKU</span>
                        <span className="text-sm font-mono bg-white px-3 py-2 rounded-lg border border-gray-200 text-gray-900">{product.sku}</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</span>
                      <span className="inline-flex items-center px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  {product.metaDescription && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 italic">{product.metaDescription}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Artisan Info */}
              {product.vendor && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Handcrafted By</h3>
                  <Link to={`/vendors/${product.vendor.username || product.vendor.id}`} className="inline-flex items-center group">
                    <div className="flex-1">
                      <p className="text-lg font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                        {product.vendor.businessName || `${product.vendor.firstName} ${product.vendor.lastName}`}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">View artisan profile →</p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Quantity Selector & Add to Cart */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-6">
                  <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Quantity</label>
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-bold shadow-sm transition-all hover:shadow"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="w-16 text-center font-bold text-lg text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-bold shadow-sm transition-all hover:shadow"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 text-base rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleToggleFavorite}
                    className={`px-3 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all ${isFavorite ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white border-gray-300'}`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleShare}
                    className="px-3 py-2.5 rounded-lg bg-white border-gray-300 shadow-md hover:shadow-lg transition-all"
                    title="Share Product"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
              <p className="text-gray-600 mb-8">See what other artisan lovers think about this piece</p>

              {/* Review Form */}
              {user && (
                <div className="mb-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
                  <h3 className="text-xl font-bold mb-6 text-gray-900">Share Your Experience</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-10 h-10 transition-colors ${
                                star <= reviewForm.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-300 hover:text-amber-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      label="Your Review"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      rows={5}
                      placeholder="Tell us what you loved about this handmade item..."
                      required
                      className="resize-none"
                    />
                    <Button 
                      type="submit" 
                      variant="primary" 
                      loading={submittingReview} 
                      className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 text-base rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900 mb-2">
                            {review.customer?.firstName} {review.customer?.lastName}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                              {review.rating}.0
                            </span>
                          </div>
                        </div>
                        <time className="text-sm text-gray-500 font-medium whitespace-nowrap">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'Recently'}
                        </time>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                      
                      {/* Vendor Response */}
                      {review.vendorResponse && (
                        <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-l-4 border-indigo-400 rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                            <p className="text-sm font-bold text-indigo-900">Artisan Response</p>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed pl-10">{review.vendorResponse}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium">No reviews yet</p>
                    <p className="text-gray-500 text-sm mt-2">Be the first to share your thoughts about this handmade treasure!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
