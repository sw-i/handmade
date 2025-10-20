import { useState, useEffect } from 'react';
import { vendorService } from '@services/index';
import PendingApproval from '@components/vendor/PendingApproval';
import { LoadingSpinner } from '@components/common/UI';

const VendorProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    checkApprovalStatus();
  }, []);

  const checkApprovalStatus = async (retryCount = 0) => {
    try {
      const vendor = await vendorService.getMyProfile();
      setIsApproved(vendor?.isApproved || false);
    } catch (error) {
      // Handle rate limiting with exponential backoff
      if (error?.response?.status === 429 && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => checkApprovalStatus(retryCount + 1), delay);
        return;
      }
      console.error('Failed to check vendor approval status:', error);
      setIsApproved(false);
    } finally {
      if (retryCount === 0) {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isApproved) {
    return <PendingApproval />;
  }

  return children;
};

export default VendorProtectedRoute;
