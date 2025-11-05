import React from 'react';
import { FileText, AlertCircle, CheckCircle, XCircle, Scale } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: October 20, 2025</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Agreement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Handmade Hub, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to these Terms of Service, 
              please do not use our platform.
            </p>
          </section>

          {/* Use of Platform */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Use of Platform</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Eligibility</h3>
                <p className="leading-relaxed">
                  You must be at least 18 years old to use this platform. By using Handmade Hub, 
                  you represent and warrant that you meet this requirement.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Account Registration</h3>
                <p className="leading-relaxed mb-2">When creating an account, you agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
            </div>
          </section>

          {/* For Vendors */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vendor Terms</h2>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Vendor Approval</h3>
                <p className="leading-relaxed">
                  All vendor accounts are subject to approval. We reserve the right to reject 
                  or terminate any vendor account at our discretion.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Product Listings</h3>
                <p className="leading-relaxed mb-2">Vendors agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide accurate product descriptions and images</li>
                  <li>List only handmade or artisan products</li>
                  <li>Honor all orders placed through the platform</li>
                  <li>Ship products within the stated processing time</li>
                  <li>Provide customer service for their products</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Commission and Fees</h3>
                <p className="leading-relaxed">
                  Handmade Hub charges a 10% commission on each completed sale. This fee covers 
                  payment processing, platform maintenance, and customer support services.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Processing</h3>
                <p className="leading-relaxed">
                  Payments are processed through Stripe. Vendors must comply with Stripe's 
                  terms of service. Funds are typically released after successful delivery 
                  or customer confirmation.
                </p>
              </div>
            </div>
          </section>

          {/* For Customers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Terms</h2>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Purchases</h3>
                <p className="leading-relaxed">
                  All purchases are binding contracts between you and the vendor. By placing 
                  an order, you agree to pay the listed price plus any applicable shipping costs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment</h3>
                <p className="leading-relaxed">
                  Payment must be made at the time of purchase using our secure payment system. 
                  All payments are processed through Stripe.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Cancellation</h3>
                <p className="leading-relaxed">
                  Orders may be cancelled within 24 hours of purchase if the vendor hasn't 
                  started processing. After this period, cancellations are at the vendor's 
                  discretion.
                </p>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Prohibited Activities</h2>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-3">
              You may not use our platform to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Sell counterfeit or unauthorized products</li>
              <li>Engage in fraudulent or deceptive practices</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Distribute spam or unsolicited messages</li>
              <li>Interfere with platform security or functionality</li>
              <li>Use automated systems to access the platform</li>
              <li>Sell prohibited items (weapons, illegal goods, etc.)</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Platform Content</h3>
                <p className="leading-relaxed">
                  All content on Handmade Hub, including design, logos, text, and software, 
                  is owned by Handmade Hub and protected by copyright and trademark laws.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">User Content</h3>
                <p className="leading-relaxed">
                  You retain ownership of content you upload. By uploading content, you grant 
                  Handmade Hub a license to use, display, and distribute it on our platform.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">Disclaimers and Limitations</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Platform "As Is"</h3>
                <p className="leading-relaxed">
                  Handmade Hub is provided "as is" without warranties of any kind. We do not 
                  guarantee uninterrupted or error-free service.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Vendor Responsibility</h3>
                <p className="leading-relaxed">
                  Handmade Hub is a platform connecting buyers and sellers. We are not responsible 
                  for the quality, safety, or legality of products listed by vendors.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Limitation of Liability</h3>
                <p className="leading-relaxed">
                  Handmade Hub shall not be liable for any indirect, incidental, special, or 
                  consequential damages arising from your use of the platform.
                </p>
              </div>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Dispute Resolution</h2>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              Any disputes arising from these terms or your use of Handmade Hub shall be 
              resolved through binding arbitration in accordance with the rules of the 
              American Arbitration Association. You waive your right to participate in 
              class action lawsuits.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account at any time for violations of these 
              terms or for any other reason at our sole discretion. Upon termination, your 
              right to use the platform will immediately cease.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users 
              of significant changes via email or platform notification. Your continued use 
              of the platform after changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with 
              the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-red-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="text-gray-700 space-y-1">
              <p>Email: legal@handmadehub.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Artisan Street, Craft City, CC 12345</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
