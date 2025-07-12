/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Wallet,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useCreatePayment } from "../../hooks/usePayment";
import type { PaymentMethod } from "../../types/Payment.type";
import { formatCurrency } from "../../utils/format";
import { PAYMENT_METHOD_ICONS } from "../../constants/paymentFeedback";

interface CheckoutPaymentStepProps {
  bookingId: string;
  totalAmount: number;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

const CheckoutPaymentStep: React.FC<CheckoutPaymentStepProps> = ({
  bookingId,
  totalAmount,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("vnpay");
  const [isProcessing, setIsProcessing] = useState(false);

  const createPaymentMutation = useCreatePayment();

  const paymentMethods = [
    {
      id: "vnpay" as PaymentMethod,
      name: "VNPay",
      description: "Secure payment via VNPay gateway",
      icon: Smartphone,
      color: "from-blue-500 to-blue-600",
      popular: true,
    },
    {
      id: "credit_card" as PaymentMethod,
      name: "Credit Card",
      description: "Visa, Mastercard, JCB",
      icon: CreditCard,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "wallet" as PaymentMethod,
      name: "Digital Wallet",
      description: "MoMo, ZaloPay, ShopeePay",
      icon: Wallet,
      color: "from-green-500 to-green-600",
    },
  ];

  const handlePayment = async () => {
    if (!bookingId) {
      onPaymentError?.("Booking ID is required");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await createPaymentMutation.mutateAsync({
        booking_id: bookingId,
        payment_method: selectedPaymentMethod,
      });

      if (selectedPaymentMethod === "vnpay" && response.data.payment_url) {
        // Redirect to VNPay
        window.location.href = response.data.payment_url;
      } else {
        // For other payment methods, simulate success
        onPaymentSuccess?.();
        navigate(
          `/payment/success?bookingId=${bookingId}&orderId=${response.data.order_id}`
        );
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Payment failed";
      onPaymentError?.(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-400" />
          Select Payment Method
        </h3>

        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPaymentMethod === method.id
                    ? "border-purple-400 bg-purple-500/20"
                    : "border-white/20 bg-white/5 hover:border-white/40"
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                {method.popular && (
                  <span
                    className="absolute -top-2 left-4 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 
                                 text-white text-xs font-semibold rounded-full"
                  >
                    POPULAR
                  </span>
                )}

                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-r ${method.color}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      {method.name}
                      {method.id === "vnpay" && (
                        <span className="text-lg">
                          {PAYMENT_METHOD_ICONS[method.id]}
                        </span>
                      )}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {method.description}
                    </p>
                  </div>

                  {selectedPaymentMethod === method.id && (
                    <CheckCircle className="h-6 w-6 text-purple-400" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold text-white mb-4">
          Payment Summary
        </h4>

        <div className="space-y-3">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Service Fee</span>
            <span>{formatCurrency(0)}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Taxes</span>
            <span>{formatCurrency(0)}</span>
          </div>

          <div className="border-t border-white/20 pt-3">
            <div className="flex justify-between text-white font-semibold text-xl">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-green-400" />
          <div>
            <p className="text-green-300 font-medium">Secure Payment</p>
            <p className="text-green-400/80 text-sm">
              Your payment information is encrypted and processed securely
            </p>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <motion.button
        onClick={handlePayment}
        disabled={isProcessing || createPaymentMutation.isPending}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl 
                 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 
                 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing || createPaymentMutation.isPending ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            Processing Payment...
          </>
        ) : (
          <>
            <span>Pay {formatCurrency(totalAmount)}</span>
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </motion.button>

      {/* Terms */}
      <p className="text-center text-gray-400 text-sm">
        By proceeding with payment, you agree to our{" "}
        <a
          href="/terms"
          className="text-purple-400 hover:text-purple-300 underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="text-purple-400 hover:text-purple-300 underline"
        >
          Privacy Policy
        </a>
      </p>
    </div>
  );
};

export default CheckoutPaymentStep;
