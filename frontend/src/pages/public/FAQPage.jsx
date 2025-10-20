import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      category: 'General Questions',
      questions: [
        {
          question: 'What is Handmade Hub?',
          answer: 'Handmade Hub is an e-commerce platform designed specifically for artisans and home-based entrepreneurs to sell their handcrafted products. We provide all the tools needed to manage your online business, from product listings to payment processing.'
        },
        {
          question: 'How do I create an account?',
          answer: 'Click the "Register" button in the top right corner, fill in your details, and choose your account type (Customer or Vendor). You\'ll receive a confirmation email to activate your account.'
        },
        {
          question: 'Is Handmade Hub free to use?',
          answer: 'Creating an account is free. We charge a small commission on completed sales to maintain and improve the platform. There are no monthly fees or hidden charges.'
        }
      ]
    },
    {
      category: 'For Vendors',
      questions: [
        {
          question: 'How do I become a vendor?',
          answer: 'Register for a vendor account, complete your profile with business information, and submit it for approval. Our team will review your application within 2-3 business days.'
        },
        {
          question: 'How do I list products?',
          answer: 'Once approved as a vendor, go to your vendor dashboard, click "Add Product," fill in the product details, upload images, and set your price. Products are published immediately after creation.'
        },
        {
          question: 'How do I receive payments?',
          answer: 'Payments are processed through Stripe and deposited directly into your linked bank account. You\'ll receive payment after the customer confirms receipt or after the automatic confirmation period.'
        },
        {
          question: 'What commission does Handmade Hub charge?',
          answer: 'We charge a 10% commission on each completed sale. This covers payment processing, hosting, and platform maintenance costs.'
        }
      ]
    },
    {
      category: 'For Customers',
      questions: [
        {
          question: 'How do I place an order?',
          answer: 'Browse products, add items to your cart, proceed to checkout, enter your shipping information, and complete payment using our secure Stripe payment system.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) and debit cards through our secure Stripe payment gateway.'
        },
        {
          question: 'How can I track my order?',
          answer: 'After placing an order, you can track its status from your account dashboard under "Orders." You\'ll also receive email updates when the order status changes.'
        },
        {
          question: 'What is your return policy?',
          answer: 'Returns are handled individually by each vendor. Please review the vendor\'s return policy on their profile page before making a purchase. Generally, items must be returned within 30 days in original condition.'
        }
      ]
    },
    {
      category: 'Orders & Shipping',
      questions: [
        {
          question: 'How long does shipping take?',
          answer: 'Shipping times vary by vendor and location. Each vendor sets their own processing time, which is displayed on the product page. Delivery typically takes 3-7 business days after processing.'
        },
        {
          question: 'Can I cancel my order?',
          answer: 'Orders can be cancelled within 24 hours of placement if the vendor hasn\'t started processing. Contact the vendor directly through our messaging system for cancellation requests.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'International shipping availability depends on individual vendors. Check the product page or vendor profile for their shipping policies and supported countries.'
        }
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions in the password reset email sent to you.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, all payment processing is handled by Stripe, a PCI-compliant payment processor. We never store your complete credit card information on our servers.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'Contact our support team at support@handmadehub.com to request account deletion. Please note that this action is permanent and cannot be undone.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          question: 'I can\'t upload images. What should I do?',
          answer: 'Ensure your images are in JPG or PNG format and under 5MB each. Clear your browser cache and try again. If the problem persists, contact our support team.'
        },
        {
          question: 'The website isn\'t loading properly. Help!',
          answer: 'Try clearing your browser cache, using a different browser, or checking your internet connection. If issues persist, contact support with details about your browser and operating system.'
        },
        {
          question: 'I\'m not receiving email notifications',
          answer: 'Check your spam folder first. Ensure your email address is correct in your account settings. Add support@handmadehub.com to your contacts to prevent emails from going to spam.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find quick answers to common questions about Handmade Hub
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((item, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === index;

                  return (
                    <div key={questionIndex} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full flex items-center justify-between text-left py-2 hover:text-indigo-600 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">{item.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="mt-2 text-gray-600 leading-relaxed">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 bg-indigo-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is ready to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/chatbot"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-600"
            >
              Chat with Bot
            </a>
            <a
              href="/help"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-600"
            >
              Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
