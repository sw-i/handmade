import React from 'react';
import { RotateCcw, Package, Clock, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';

const ReturnPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <RotateCcw className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Return & Refund Policy</h1>
          <p className="text-gray-600">Last updated: October 20, 2025</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              At Handmade Hub, we want you to be completely satisfied with your purchase. Since 
              our platform connects you directly with independent vendors who create unique, 
              handmade products, return policies may vary by vendor. This page outlines our 
              general return and refund guidelines.
            </p>
          </section>

          {/* Important Notice */}
          <section className="bg-amber-50 border-l-4 border-amber-500 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Important Notice</h3>
                <p className="text-gray-700 leading-relaxed">
                  Each vendor on Handmade Hub may have their own specific return policy. Always 
                  check the vendor's profile and product listing for their individual return 
                  terms before making a purchase.
                </p>
              </div>
            </div>
          </section>

          {/* General Return Policy */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">General Return Guidelines</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Return Window</h3>
                <p className="leading-relaxed">
                  Most vendors accept returns within 30 days of delivery. Custom or personalized 
                  items may not be eligible for return unless defective or damaged.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Item Condition</h3>
                <p className="leading-relaxed mb-2">For items to be eligible for return, they must be:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>In original condition (unused and unworn)</li>
                  <li>In original packaging when applicable</li>
                  <li>Include all tags and accessories</li>
                  <li>Free from any damage or alterations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Eligible Returns */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Eligible for Return</h2>
            </div>
            
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Items received damaged or defective</li>
              <li>Items significantly different from description</li>
              <li>Wrong item shipped</li>
              <li>Unused items within return window (vendor-specific)</li>
              <li>Items that arrived late (case-by-case basis)</li>
            </ul>
          </section>

          {/* Non-Returnable Items */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Non-Returnable Items</h2>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-3">
              The following items are typically not eligible for return:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Custom or personalized items (unless defective)</li>
              <li>Digital downloads</li>
              <li>Perishable goods (food, flowers, plants)</li>
              <li>Health and personal care items</li>
              <li>Items marked as final sale</li>
              <li>Gift cards</li>
              <li>Items damaged due to misuse or negligence</li>
            </ul>
          </section>

          {/* Return Process */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">How to Return an Item</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Contact the Vendor</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Message the vendor through your order page within the return window. Explain 
                    the reason for return and provide photos if the item is damaged or defective.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Await Approval</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The vendor will review your request and respond within 2-3 business days. 
                    They may request additional information or photos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Ship the Return</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Once approved, pack the item securely and ship it back using the vendor's 
                    provided instructions. Keep your tracking number for reference.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Receive Refund</h3>
                  <p className="text-gray-700 leading-relaxed">
                    After the vendor receives and inspects the return, your refund will be 
                    processed within 5-7 business days to your original payment method.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Information</h2>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Refund Method</h3>
                <p className="leading-relaxed">
                  Refunds are processed to the original payment method used for purchase. 
                  Depending on your payment provider, it may take 5-10 business days for 
                  the refund to appear in your account.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Shipping Costs</h3>
                <p className="leading-relaxed">
                  Original shipping costs are generally non-refundable unless the item was 
                  defective, damaged, or incorrect. Return shipping costs are typically the 
                  buyer's responsibility unless otherwise stated by the vendor.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Partial Refunds</h3>
                <p className="leading-relaxed">
                  Partial refunds may be issued for items returned in less than perfect 
                  condition or outside the return window, at the vendor's discretion.
                </p>
              </div>
            </div>
          </section>

          {/* Exchange Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchanges</h2>
            <p className="text-gray-700 leading-relaxed">
              Exchanges are handled on a case-by-case basis by individual vendors. If you'd 
              like to exchange an item for a different size, color, or style, contact the 
              vendor directly through your order page. Availability and exchange policies 
              vary by vendor.
            </p>
          </section>

          {/* Damaged or Defective Items */}
          <section className="bg-red-50 border-l-4 border-red-500 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Damaged or Defective Items</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you receive a damaged or defective item:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Take photos of the damage immediately</li>
              <li>Contact the vendor within 48 hours of delivery</li>
              <li>Do not discard packaging or damaged items until resolved</li>
              <li>Provide tracking and delivery confirmation</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Vendors are required to replace or refund damaged/defective items at no cost to you.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you cannot reach an agreement with the vendor regarding a return or refund:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>Document all communication with the vendor</li>
              <li>Contact Handmade Hub Support at support@handmadehub.com</li>
              <li>Provide order details, photos, and communication history</li>
              <li>Our team will mediate and help resolve the issue</li>
            </ol>
          </section>

          {/* Platform Guarantee */}
          <section className="bg-green-50 border-l-4 border-green-500 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Handmade Hub Guarantee</h2>
            <p className="text-gray-700 leading-relaxed">
              If a vendor fails to honor their stated return policy or refuses to respond to 
              a legitimate return request, Handmade Hub may step in to facilitate a resolution. 
              We're committed to ensuring fair treatment for both buyers and vendors.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-indigo-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with a Return?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our support team is here to assist with any return or refund questions.
            </p>
            <div className="text-gray-700 space-y-1 mb-4">
              <p>Email: returns@handmadehub.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Hours: Monday-Friday, 9am-6pm EST</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/contact"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/help"
                className="bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-600"
              >
                Help Center
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
