import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { useAuthStore } from '../../store/useAuthStore';
import { resendOtpCode } from '../../apis/user.api';
import { Mail, RefreshCw, Ticket } from 'lucide-react';

const VerifyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  
  const { verifyOtp, error, tempEmail } = useAuthStore();
  
  // Local loading states for better control
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Clear form on mount
  useEffect(() => {
    setOtpCode('');
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);
  
  // If no email is provided in URL or store, redirect to register
  useEffect(() => {
    if (!email && !tempEmail) {
      toast.error('No email found for verification. Please register first.');
      navigate('/register');
    }
  }, [email, tempEmail, navigate]);
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP code');
      return;
    }
    
    try {
      setIsVerifying(true);
      toast.loading('Verifying your email...');
      
      const success = await verifyOtp({
        email: email || tempEmail || '',
        otpVerify: otpCode
      });
      
      toast.dismiss();
      
      if (success) {
        toast.success('Email verified successfully! Your account has been created.');
        // Delay navigation to allow the user to see the success message
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (error) {
        toast.error(error);
        // Clear OTP field for retry
        setOtpCode('');
      }
    } finally {
      setIsVerifying(false);
    }
  };    // Function to resend OTP code
  const handleResendOtp = async () => {
    if (!email && !tempEmail) {
      toast.error('Email address is missing');
      return;
    }
    
    if (resendCooldown > 0) {
      toast.error(`Please wait ${resendCooldown} seconds before requesting a new code`);
      return;
    }
    
    const emailToUse = email || tempEmail || '';
    
    try {
      setIsResending(true);
      toast.loading('Sending new verification code...');
      await resendOtpCode(emailToUse);
      toast.dismiss();
      toast.success('New verification code sent to your email');
      setOtpCode(''); // Clear the current OTP input
      setResendCooldown(60); // Set 60-second cooldown
    } catch (error) {
      toast.dismiss();
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification code';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center bg-gray-900"
           style={{ minHeight: 'calc(100vh - 160px)' }}>
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg text-white">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Ticket size={40} className="text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-orange-400">Cinema Connect</h1>
          <p className="mt-2 text-gray-300">Verify your email to complete registration</p>
        </div>
        
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div className="text-center mb-4">
            <div className="flex justify-center mb-3">
              <Mail size={30} className="text-orange-400" />
            </div>
            <h2 className="text-xl font-medium text-orange-400">Verify Your Email</h2>
            <p className="mt-2 text-sm text-gray-300">
              We've sent a 6-digit code to {email || tempEmail || 'your email'}.<br />
              The code is valid for 2 minutes.
            </p>
          </div>
          
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-200">
              Enter Verification Code
            </label>            <input
              type="text"
              id="otp"
              name="otp"
              maxLength={6}
              value={otpCode}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setOtpCode(value);
              }}
              placeholder="000000"
              className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md shadow-sm text-center text-2xl tracking-widest focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-white"
              autoComplete="one-time-code"
            />
          </div>
            <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </Button>
          </div>
            <div className="text-center mt-4 flex items-center justify-center">
            <button 
              type="button"
              onClick={handleResendOtp}
              className={`text-sm flex items-center ${
                resendCooldown > 0 || isResending
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-orange-400 hover:text-orange-300'
              }`}
              disabled={isResending || resendCooldown > 0}
            >
              <RefreshCw size={14} className="mr-1" />
              {resendCooldown > 0 
                ? `Resend in ${resendCooldown}s` 
                : isResending 
                  ? 'Sending...'
                  : 'Resend verification code'
              }
            </button>
          </div>

          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={() => navigate('/register')}
              className="text-gray-400 hover:text-gray-300 text-sm"
            >
              Back to Register
            </button>
          </div></form>
      </div>
    </div>
  );
};

export default VerifyPage;