import React from 'react';
import { Mail, MessageSquare, Phone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-xl text-gray-600">
            We're here to help you succeed on Handmade Hub
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Email Support */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Email Support</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Send us a detailed message and we'll get back to you within 24 hours.
            </p>
            <a
              href="mailto:support@handmadehub.com"
              className="text-red-600 hover:text-red-700 font-medium"
            >
              support@handmadehub.com
            </a>
          </div>

          {/* Live Chat */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Live Chat</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Chat with our AI assistant for instant answers to common questions.
            </p>
            <Link
              to="/chatbot"
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Start Chat →
            </Link>
          </div>

          {/* Phone Support */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Phone Support</h2>
            </div>
            <p className="text-gray-600 mb-4">
              For urgent matters, call our support team directly.
            </p>
            <p className="text-red-600 font-medium">
              +1 (555) 123-4567
            </p>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Business Hours</h2>
            </div>
            <div className="text-gray-600 space-y-1">
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
              <p className="text-sm text-gray-500 mt-2">All times EST</p>
            </div>
          </div>
        </div>

        {/* Common Support Topics */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Support Topics</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Vendors</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Setting up your vendor profile</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Adding and managing products</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Processing orders and payments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Understanding analytics and reports</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold text-gray-900 mb-2">For Customers</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Placing and tracking orders</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Payment and checkout issues</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Returns and refunds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Account management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-red-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Need Quick Answers?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/help"
              className="bg-white text-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Visit Help Center
            </Link>
            <Link
              to="/faq"
              className="bg-white text-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Read FAQ
            </Link>
            <Link
              to="/chatbot"
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Chat with Bot
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
