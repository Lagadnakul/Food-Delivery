import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PaymentOptions = ({ selectedMethod, onMethodSelect, disabled }) => {
  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Pay Online',
      description: 'Credit/Debit Card, UPI, Net Banking',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 10h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10zm0-4a2 2 0 012-2h14a2 2 0 012 2v2H3V6zm4 8h2v2H7v-2zm4 0h6v2h-6v-2z" />
        </svg>
      ),
      recommended: true,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when your order arrives',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
        </svg>
      ),
      recommended: false,
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800 mb-4">Payment Method</h3>
      
      {paymentMethods.map((method) => (
        <motion.button
          key={method.id}
          onClick={() => !disabled && onMethodSelect(method.id)}
          disabled={disabled}
          whileHover={{ scale: disabled ? 1 : 1.01 }}
          whileTap={{ scale: disabled ? 1 : 0.99 }}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
            selectedMethod === method.id
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {/* Radio Button */}
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === method.id
                ? 'border-orange-500'
                : 'border-gray-300'
            }`}
          >
            {selectedMethod === method.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 rounded-full bg-orange-500"
              />
            )}
          </div>

          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              selectedMethod === method.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {method.icon}
          </div>

          {/* Text */}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">{method.name}</span>
              {method.recommended && (
                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                  Recommended
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{method.description}</p>
          </div>

          {/* Checkmark */}
          {selectedMethod === method.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          )}
        </motion.button>
      ))}

      {/* Security Note */}
      <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 rounded-lg">
        <svg
          className="w-5 h-5 text-green-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <p className="text-sm text-gray-600">
          Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default PaymentOptions;
