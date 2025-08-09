import dynamic from 'next/dynamic';

// Lazy load các components lớn
export const LazyCareProfileDetailModal = dynamic(
  () => import('../app/profile/patient/components/CareProfileDetailModal'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-64" />,
    ssr: false
  }
);

export const LazyRelativeDetailModal = dynamic(
  () => import('../app/profile/patient/components/RelativeDetailModal'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-48" />,
    ssr: false
  }
);

export const LazyPaymentSuccessModal = dynamic(
  () => import('../app/payment/components/PaymentSuccessModal'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32" />,
    ssr: false
  }
);

export const LazyTransactionDetailModal = dynamic(
  () => import('../app/wallet/components/TransactionDetailModal'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-48" />,
    ssr: false
  }
); 