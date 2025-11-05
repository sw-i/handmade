import { useState, useEffect } from 'react';
import { productService } from '@services/index';
import { LoadingSpinner, Card, Button, Modal, Input, Textarea } from '@components/common/UI';
import RichTextEditor from '@components/common/RichTextEditor';
import { Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import ChatWidget from '@components/chat/ChatWidget';

// Helper function to strip HTML tags and get plain text
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const VendorProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    metaDescription: '',
    description: '',
    price: '',
    compareAtPrice: '',
    costPerItem: '',
    stock: '',
    displayOrder: '',
    category: 'Electronics',
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products for vendor...');
      const response = await productService.getProducts({ vendor: 'me' });
      console.log('Products response:', response);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.name || !formData.name.trim()) {
        alert('Product name is required');
        return;
      }
      
      if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        alert('Valid price is required (must be greater than 0)');
        return;
      }

      // Validate slug
      if (!formData.slug || !formData.slug.trim()) {
        alert('Product slug is required');
        return;
      }

      // Map form data to backend expected fields
      const productData = {
        title: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description?.trim() || '',
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stock) || 0
      };
      
      // Add optional fields only if they have values
      if (formData.sku && formData.sku.trim()) {
        productData.sku = formData.sku.trim();
      }
      
      if (formData.metaDescription && formData.metaDescription.trim()) {
        productData.metaDescription = formData.metaDescription.trim();
        productData.metaTitle = formData.name.trim(); // Use product name as meta title
      }
      
      if (formData.compareAtPrice && parseFloat(formData.compareAtPrice) > 0) {
        productData.compareAtPrice = parseFloat(formData.compareAtPrice);
      }
      
      if (formData.costPerItem && parseFloat(formData.costPerItem) > 0) {
        productData.costPerItem = parseFloat(formData.costPerItem);
      }
      
      if (formData.displayOrder && parseInt(formData.displayOrder) > 0) {
        productData.displayOrder = parseInt(formData.displayOrder);
      }
      
      // Only include categoryId if it's not null/undefined
      if (formData.category && formData.category !== 'Electronics') {
        // We can add actual category mapping later
        // For now, skip categoryId entirely
      }

      let product;
      if (editingProduct) {
        product = await productService.updateProduct(editingProduct.id, productData);
      } else {
        product = await productService.createProduct(productData);
      }
      
      // If there are image files to upload
      if (imageFiles.length > 0 && product?.data?.id) {
        try {
          const imageFormData = new FormData();
          imageFiles.forEach((file) => {
            imageFormData.append('images', file);
          });
          const uploadResult = await productService.uploadImages(product.data.id, imageFormData);
        } catch (uploadError) {
          console.error('Failed to upload images:', uploadError);
          console.error('Upload error response:', uploadError.response?.data);
          alert('Product created but images failed to upload: ' + (uploadError.response?.data?.message || uploadError.message));
        }
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', slug: '', sku: '', metaDescription: '', description: '', price: '', compareAtPrice: '', costPerItem: '', stock: '', displayOrder: '', category: 'Electronics', images: [] });
      setImageFiles([]);
      loadProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to save product. Please try again.';
      alert(errorMessage);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    // Map existing images to preview format with backend URL
    const existingImages = (product.images || []).map(img => ({
      url: `http://localhost:5000${img.imageUrl}`,
      isExisting: true,
      id: img.id
    }));
    
    setFormData({
      name: product.title || product.name || '',
      slug: product.slug || '',
      sku: product.sku || '',
      metaDescription: product.metaDescription || '',
      description: product.description || '',
      price: product.price || '',
      compareAtPrice: product.compareAtPrice || '',
      costPerItem: product.costPerItem || '',
      stock: product.stockQuantity || product.stock || 0,
      displayOrder: product.displayOrder || '',
      category: product.category || 'Electronics',
      images: existingImages
    });
    setImageFiles([]);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productService.deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);
    
    // Create preview URLs for new files
    const newImagePreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      isExisting: false
    }));
    
    // Append new images to existing ones
    setFormData({ ...formData, images: [...formData.images, ...newImagePreviews] });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
        <Button onClick={() => {
          setEditingProduct(null);
          setFormData({ name: '', slug: '', sku: '', metaDescription: '', description: '', price: '', compareAtPrice: '', costPerItem: '', stock: '', displayOrder: '', category: 'Electronics', images: [] });
          setImageFiles([]);
          setShowModal(true);
        }} className="px-6 py-2.5 text-base font-semibold rounded-lg inline-flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  {product.images?.[0]?.imageUrl ? (
                    <img 
                      src={`http://localhost:5000${product.images[0].imageUrl}`} 
                      alt={product.title || product.name} 
                      className="w-full h-full object-cover rounded-lg" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title || product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{stripHtml(product.description)}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-semibold text-gray-900">${Number(product.price).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Stock</p>
                      <p className="font-semibold text-gray-900">{product.stockQuantity || product.stock || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-semibold text-gray-900">{product.isActive ? '✅ Active' : '❌ Inactive'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sales</p>
                      <p className="font-semibold text-gray-900">{product.salesCount || 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => handleEdit(product)} className="px-6 py-2.5 text-base font-semibold rounded-lg inline-flex items-center">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(product.id)} className="px-6 py-2.5 text-base font-semibold rounded-lg inline-flex items-center">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first product</p>
          <Button onClick={() => setShowModal(true)} className="px-6 py-2.5 text-base font-semibold rounded-lg inline-flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Card>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            
            <Input
              label="Product Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Clear, descriptive name (supports Arabic or English)"
              required
            />
            
            <Input
              label="Product Link (Slug) *"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              placeholder="product-name (English only, no spaces)"
              helperText="SEO-friendly URL slug"
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="SKU ID"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Optional stock keeping unit"
              />
              
              <Input
                label="Priority in Appearance"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                placeholder="Higher = appears first (e.g., 9 before 7)"
                helperText="Controls order in listings"
              />
            </div>
            
            <Textarea
              label="Meta Description"
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              rows={2}
              placeholder="Short SEO-optimized summary for search engines"
              helperText="Helps with Google indexing"
            />
          </div>
          
          {/* Pricing */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Product Price *"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
              
              <Input
                label="Discount Price"
                type="number"
                step="0.01"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                placeholder="0.00"
                helperText="Leave blank if no discount"
              />
              
              <Input
                label="Product Cost"
                type="number"
                step="0.01"
                value={formData.costPerItem}
                onChange={(e) => setFormData({ ...formData, costPerItem: e.target.value })}
                placeholder="0.00"
                helperText="Internal cost (not shown to customers)"
              />
            </div>
          </div>
          
          {/* Inventory */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h3>
            
            <Input
              label="Stock Quantity *"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="0"
              required
            />
          </div>
          
          {/* Description */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
            
            <RichTextEditor
              label="Full Description"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Write full product overview, features, benefits, specifications..."
              helperText="✅ Full HTML support | Insert images, links, emojis | Use formatting toolbar | Supports RTL/LTR text direction"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Home & Garden</option>
              <option>Sports</option>
              <option>Books</option>
              <option>Toys</option>
              <option>Food & Beverage</option>
              <option>Beauty</option>
              <option>Automotive</option>
              <option>Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">Upload up to 5 images</p>
            
            {/* Image Preview */}
            {formData.images && formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={typeof img === 'string' ? img : img.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14"%3EError%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const imgObj = typeof img === 'string' ? { url: img, isExisting: false } : img;
                        const newImages = formData.images.filter((_, i) => i !== index);
                        
                        // Only update imageFiles if it's a new upload (not existing DB image)
                        let newFiles = imageFiles;
                        if (!imgObj.isExisting) {
                          const newFileIndex = formData.images.slice(0, index).filter(im => !(typeof im === 'object' && im.isExisting)).length;
                          newFiles = imageFiles.filter((_, i) => i !== newFileIndex);
                        }
                        
                        setFormData({ ...formData, images: newImages });
                        setImageFiles(newFiles);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {typeof img === 'object' && img.isExisting && (
                      <span className="absolute bottom-1 left-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded">Existing</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 px-6 py-2.5 text-base font-semibold rounded-lg">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="px-6 py-2.5 text-base font-semibold rounded-lg"
              onClick={() => {
                setShowModal(false);
                setEditingProduct(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      <ChatWidget />
    </div>
  );
};

export default VendorProductsPage;
