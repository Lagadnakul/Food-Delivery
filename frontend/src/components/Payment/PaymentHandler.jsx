import React, { useState, useCallback } from 'react';
import PaymentService from '../../services/paymentService';
import { showToast } from '../../utils/toastUtils';
import LoadingSpinner from '../UI/LoadingSpinner';

const PaymentHandler = ({
  orderData,
  onSuccess,
  onFailure,
  children,
}) => {
  const [processing, setProcessing] = useState(false);

  const handlePayment = useCallback(async () => {
    if (!orderData || processing) return;

    try {
      setProcessing(true);
      showToast.info('Initializing payment...');

      // Create Razorpay order on backend
      const orderResult = await PaymentService.createOrder({
        amount: orderData.amount,
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          orderId: orderData.orderId,
          customerName: orderData.customerName,
        },
      });

      if (!orderResult.success) {
        throw new Error(orderResult.message || 'Failed to create payment order');
      }

      // Open Razorpay checkout
      await PaymentService.openCheckout(
        {
          razorpayOrderId: orderResult.order.id,
          amount: orderResult.order.amount,
          currency: orderResult.order.currency,
          orderId: orderData.orderId,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone,
        },
        // Success callback
        (result) => {
          setProcessing(false);
          showToast.success('Payment successful!');
          if (onSuccess) {
            onSuccess(result);
          }
        },
        // Failure callback
        (error) => {
          setProcessing(false);
          showToast.error(error.message || 'Payment failed');
          if (onFailure) {
            onFailure(error);
          }
        }
      );
    } catch (error) {
      setProcessing(false);
      console.error('Payment error:', error);
      showToast.error(error.message || 'Payment initialization failed');
      if (onFailure) {
        onFailure(error);
      }
    }
  }, [orderData, processing, onSuccess, onFailure]);

  // If children is a function, pass the handler
  if (typeof children === 'function') {
    return children({ handlePayment, processing });
  }

  // Otherwise, wrap children with click handler
  return (
    <div onClick={handlePayment} className={processing ? 'pointer-events-none' : ''}>
      {processing ? (
        <div className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default PaymentHandler;
