import React from 'react';
import { Building2, Target, Users, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Handmade Hub</h1>
          <p className="text-xl text-gray-600">
            Empowering artisans and home-based entrepreneurs to thrive in the digital marketplace
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <Target className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                Handmade Hub is dedicated to providing a comprehensive platform where artisans, 
                craftspeople, and home-based entrepreneurs can showcase their unique, handcrafted 
                products to a global audience. We believe in supporting small businesses and 
                celebrating the art of handmade craftsmanship.
              </p>
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <Building2 className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">What We Do</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We provide a complete e-commerce solution specifically designed for artisans 
                and small business owners. Our platform includes:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Product catalog management and inventory tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Secure payment processing and order management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Vendor approval system ensuring quality standards</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Analytics and business insights for vendors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Event management for craft fairs and markets</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Who We Serve */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <Users className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Who We Serve</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Artisans & Craftspeople</h3>
                  <p className="leading-relaxed">
                    From jewelry makers to woodworkers, we provide the tools you need to 
                    sell your handcrafted products online with ease.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Home-Based Entrepreneurs</h3>
                  <p className="leading-relaxed">
                    Start and grow your business from home with our comprehensive 
                    e-commerce platform and business management tools.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Customers</h3>
                  <p className="leading-relaxed">
                    Discover unique, handcrafted products made with care and support 
                    small businesses in your community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-start gap-4 mb-4">
            <Award className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Quality</h3>
                  <p>We maintain high standards for all products on our platform.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Community</h3>
                  <p>Building a supportive network of artisans and customers.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Innovation</h3>
                  <p>Continuously improving our platform with modern technology.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Trust</h3>
                  <p>Secure transactions and reliable service for all users.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Interested in selling on Handmade Hub?
          </p>
          <a
            href="/auth/register"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Become a Vendor
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
