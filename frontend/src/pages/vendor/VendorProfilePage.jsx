import { useState, useEffect } from 'react';
import { vendorService } from '@services/index';
import { LoadingSpinner, Card, Button, Input, Textarea, SuccessMessage, ErrorMessage } from '@components/common/UI';
import { Store, MapPin, Phone, Mail, CreditCard, Globe, Share2, Facebook, Instagram, Twitter, Linkedin, User, Copy, Check } from 'lucide-react';
import ChatWidget from '@components/chat/ChatWidget';

const VendorProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    address: '',
    businessPhone: '',
    businessEmail: '',
    bankAccount: '',
    taxId: '',
    username: '',
    website: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const vendor = await vendorService.getMyProfile();
      setProfile(vendor);
      
      // Map all fields correctly from backend
      setFormData({
        businessName: vendor?.businessName || '',
        businessDescription: vendor?.businessDescription || '',
        address: vendor?.address || '',
        businessPhone: vendor?.businessPhone || '',
        businessEmail: vendor?.businessEmail || '',
        bankAccount: vendor?.bankAccount || '',
        taxId: vendor?.taxId || '',
        username: vendor?.username || '',
        website: vendor?.website || '',
        facebookUrl: vendor?.facebookUrl || '',
        instagramUrl: vendor?.instagramUrl || '',
        twitterUrl: vendor?.twitterUrl || '',
        linkedinUrl: vendor?.linkedinUrl || ''
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Send all form data with correct field names
      await vendorService.updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      await loadProfile(); // Reload to get fresh data
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const copyProfileLink = () => {
    const profileUrl = formData.username 
      ? `${window.location.origin}/vendors/${formData.username}`
      : `${window.location.origin}/vendors/${profile?.id}`;
    
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vendor Profile</h1>

      {message.text && (
        <div className="mb-6">
          {message.type === 'success' ? (
            <SuccessMessage>{message.text}</SuccessMessage>
          ) : (
            <ErrorMessage>{message.text}</ErrorMessage>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Profile Share Section */}
        {profile && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Share2 className="w-6 h-6 text-indigo-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Share Your Profile</h3>
                  <p className="text-sm text-gray-600">
                    {formData.username 
                      ? `localhost:3000/vendors/${formData.username}`
                      : 'Set a username to get a custom profile URL'}
                  </p>
                </div>
              </div>
              {formData.username && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyProfileLink}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Username & Basic Info */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Profile Identity</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Username (Unique Profile URL)
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., mystore123"
                pattern="[a-zA-Z0-9_-]+"
                minLength={3}
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">
                Your profile will be accessible at: localhost:3000/vendors/{formData.username || 'your-username'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Business Name"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
            />

            <Textarea
              label="Business Description"
              value={formData.businessDescription}
              onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
              rows={4}
              placeholder="Tell customers about your business..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Business Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.businessPhone}
                  onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Business Email
                </label>
                <input
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4" />
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Social Media Links */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Share2 className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Social Media Links</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Facebook className="w-4 h-4 text-blue-600" />
                Facebook Page URL
              </label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Instagram className="w-4 h-4 text-pink-600" />
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://instagram.com/yourprofile"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Twitter className="w-4 h-4 text-blue-400" />
                Twitter/X Profile URL
              </label>
              <input
                type="url"
                value={formData.twitterUrl}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Linkedin className="w-4 h-4 text-blue-700" />
                LinkedIn Company URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Banking & Tax Information</h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Bank Account Number"
              value={formData.bankAccount}
              onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
              placeholder="For receiving payments"
            />

            <Input
              label="Tax ID / EIN"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              placeholder="Your business tax identification number"
            />

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This information is required for tax compliance and payment processing. 
                All data is securely encrypted.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="flex-1 px-6 py-2.5 text-base font-semibold rounded-lg">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={loadProfile} className="px-6 py-2.5 text-base font-semibold rounded-lg">
            Cancel
          </Button>
        </div>
      </form>

      <Card className="p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Account Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-semibold text-gray-900">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="font-semibold text-gray-900">{profile?.totalProducts || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="font-semibold text-gray-900">{profile?.totalSales || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rating</p>
            <p className="font-semibold text-gray-900">
              ⭐ {profile?.rating && typeof profile.rating === 'number' ? profile.rating.toFixed(1) : 'N/A'}
            </p>
          </div>
        </div>
      </Card>
      <ChatWidget />
    </div>
  );
};

export default VendorProfilePage;
