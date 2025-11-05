import { Clock, Mail } from 'lucide-react';
import { Card } from '@components/common/UI';

const PendingApproval = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 p-4 rounded-full">
            <Clock className="w-16 h-16 text-yellow-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Account Pending Approval
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          Thank you for registering as a vendor! Your account is currently under review by our admin team.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-900 mb-3">What happens next?</h2>
          <ul className="text-left space-y-3 text-red-800">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Our team will review your vendor application</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>You'll receive an email notification once approved</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>After approval, you can start adding products and managing orders</span>
            </li>
          </ul>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Mail className="w-5 h-5" />
          <p className="text-sm">
            Questions? Contact us at <a href="mailto:support@handmadehub.com" className="text-red-600 hover:text-red-500 font-medium">support@handmadehub.com</a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PendingApproval;
