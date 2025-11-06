import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { Input, Button, ErrorMessage } from '@components/common/UI';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login({ email: formData.email, password: formData.password });
      
      // Role-based redirect
      if (from !== '/') {
        navigate(from, { replace: true });
      } else {
        const role = result?.user?.role;
        if (role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (role === 'vendor') {
          navigate('/vendor', { replace: true });
        } else {
          navigate('/customer/dashboard', { replace: true });
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="hidden md:block space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-display font-bold text-neutral-900">
              Welcome Back
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              Sign in to discover unique handcrafted treasures from talented artisans
            </p>
          </div>
          
          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-neutral-800">Discover Unique Items</h3>
                <p className="text-sm text-neutral-600">One-of-a-kind handmade products</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-neutral-800">Support Local Artists</h3>
                <p className="text-sm text-neutral-600">Direct connection with creators</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-accent-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-neutral-800">Quality Craftsmanship</h3>
                <p className="text-sm text-neutral-600">Every piece tells a story</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-3xl shadow-soft p-8 md:p-10 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex p-3 bg-primary-100 rounded-2xl">
              <LogIn className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-neutral-900">
              Sign In
            </h2>
            <p className="text-neutral-600">
              New here?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 underline decoration-2 underline-offset-2">
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <ErrorMessage message={error} onClose={() => setError('')} />

            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded transition"
                />
                <span className="text-neutral-700 group-hover:text-neutral-900">Remember me</span>
              </label>

              <Link 
                to="/forgot-password" 
                className="font-medium text-primary-600 hover:text-primary-700 underline decoration-2 underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!formData.email || !formData.password}
              className="w-full py-3 text-base font-semibold"
            >
              Sign In
            </Button>
          </form>

          {/* Test Credentials */}
          <div className="pt-6 border-t border-neutral-200">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-neutral-600 hover:text-neutral-900 flex items-center justify-between">
                <span>🧪 Test Credentials</span>
                <span className="text-xs text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 space-y-2 text-xs font-mono bg-neutral-50 rounded-xl p-4">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Admin:</span>
                  <span className="text-neutral-800">admin@test.com / Test123!</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Vendor:</span>
                  <span className="text-neutral-800">vendor@test.com / Test123!</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Customer:</span>
                  <span className="text-neutral-800">customer@test.com / Test123!</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Pending:</span>
                  <span className="text-neutral-800">pending@test.com / Test123!</span>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
