import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">Handmade Hub</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              A platform connecting talented home-based entrepreneurs with customers seeking unique handcrafted products.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white transition-all"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-gray-300 hover:text-red-400 transition-colors text-sm">Shop Products</Link></li>
              <li><Link to="/vendors" className="text-gray-300 hover:text-red-400 transition-colors text-sm">Browse Vendors</Link></li>
              <li><Link to="/register" className="text-gray-300 hover:text-red-400 transition-colors text-sm">Become a Vendor</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-red-400 transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-gray-300 hover:text-red-400 transition-colors text-sm">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-red-400 transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-red-400 transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/chatbot" className="text-gray-300 hover:text-red-400 transition-colors text-sm">Chat Bot</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-300 hover:text-red-400 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-red-400 transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-red-400 transition-colors text-sm">Return Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Handmade Hub. All rights reserved. Made with 'حــب' for artisans in Egypt.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
