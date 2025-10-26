'use client';

import { useEffect } from 'react';
import { formatUnits } from 'viem';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
  onConfirm: () => void;
  isProcessing: boolean;
  balance?: bigint;
}

export function PaymentModal({
  isOpen,
  onClose,
  planName,
  planPrice,
  onConfirm,
  isProcessing,
  balance,
}: PaymentModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const balanceFormatted = balance
    ? formatUnits(balance, 6)
    : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          disabled={isProcessing}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">💳</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            確認訂閱
          </h3>
          <p className="text-gray-600">使用 PyUSD 安全付款</p>
        </div>

        {/* Plan Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">會員計劃</span>
            <span className="font-semibold text-gray-900">{planName}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">金額</span>
            <span className="text-2xl font-bold text-orange-600">
              ${planPrice} PYUSD
            </span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-gray-600">您的餘額</span>
            <span className="font-semibold text-gray-900">
              {balanceFormatted} PYUSD
            </span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <span className="text-blue-500 text-xl">🔒</span>
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium mb-1">
                安全支付
              </p>
              <p className="text-xs text-blue-700">
                此交易使用 SubPay Protocol 處理，
                您的付款資訊將透過區塊鏈安全加密。
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 py-3 px-6 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 py-3 px-6 rounded-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? '處理中...' : '確認付款'}
          </button>
        </div>
      </div>
    </div>
  );
}

