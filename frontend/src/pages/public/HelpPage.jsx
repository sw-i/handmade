import React, { useState } from 'react';
import { Search, BookOpen, ShoppingBag, Package, CreditCard, Users, Settings } from 'lucide-react';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      icon: ShoppingBag,
      title: 'Getting Started',
      description: 'Learn the basics of using Handmade Hub',
      articles: [
        'How to create an account',
        'Setting up your profile',
        'Understanding user roles',
        'Platform navigation guide'
      ]
    },
    {
      icon: Package,
      title: 'For Vendors',
      description: 'Everything you need to sell successfully',
      articles: [
        'Becoming a vendor',
        'Adding your first product',
        'Managing inventory',
        'Processing orders',
        'Understanding vendor analytics'
      ]
    },
    {
      icon: CreditCard,
      title: 'Orders & Payments',
      description: 'Managing transactions and orders',
      articles: [
        'How to place an order',
        'Payment methods accepted',
        'Tracking your order',
        'Order history and invoices',
        'Vendor payment processing'
      ]
    },
    {
      icon: Users,
      title: 'Account Management',
      description: 'Managing your account settings',
      articles: [
        'Updating profile information',
        'Changing your password',
        'Email preferences',
        'Privacy settings',
        'Account security'
      ]
    },
    {
      icon: BookOpen,
      title: 'Policies & Guidelines',
      description: 'Rules and best practices',
      articles: [
        'Vendor guidelines',
        'Product listing requirements',
        'Community standards',
        'Prohibited items',
        'Quality expectations'
      ]
    },
    {
      icon: Settings,
      title: 'Technical Support',
      description: 'Troubleshooting common issues',
      articles: [
        'Login problems',
        'Image upload issues',
        'Browser compatibility',
        'Mobile app usage',
        'Reporting bugs'
      ]
    }
  ];

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      searchQuery === '' || article.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers and learn how to get the most out of Handmade Hub
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchQuery === '' ? helpCategories : filteredCategories).map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <category.icon className="w-8 h-8 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
              </div>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.articles.map((article, articleIndex) => (
                  <li key={articleIndex}>
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-700 text-sm block py-1"
                      onClick={(e) => e.preventDefault()}
                    >
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No help articles found for "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Still Need Help */}
        <div className="mt-12 bg-indigo-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to assist you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/support"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/chatbot"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-600"
            >
              Chat with Bot
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
