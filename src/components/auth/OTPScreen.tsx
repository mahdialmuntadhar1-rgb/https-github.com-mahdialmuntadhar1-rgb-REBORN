import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { ChevronLeft, RefreshCw } from 'lucide-react';

interface OTPScreenProps {
  phoneNumber: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const OTPScreen: React.FC<OTPScreenProps> = ({ phoneNumber, onBack, onSuccess }) => {
  const { t, isRTL, language } = useAppState();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    // TODO: Replace with Supabase OTP verification
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(60);
      // TODO: Resend logic
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center mb-12">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={24} className={isRTL ? 'rotate-180' : ''} />
        </button>
      </div>

      {/* Title */}
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white mb-4">
          {language === 'ar' ? 'تحقق من الرمز' : language === 'ku' ? 'کۆدەکە بپشکنە' : 'Verify Code'}
        </h2>
        <p className="text-white/40 text-sm font-medium leading-relaxed">
          {language === 'ar' 
            ? `أدخل الرمز المكون من 6 أرقام المرسل إلى +964 ${phoneNumber}` 
            : language === 'ku' 
            ? `کۆدە ٦ ژمارەییەکە بنووسە کە نێردراوە بۆ +964 ${phoneNumber}` 
            : `Enter the 6-digit code sent to +964 ${phoneNumber}`
          }
        </p>
      </div>

      {/* OTP Inputs (Always LTR) */}
      <div className="flex gap-3 mb-12" dir="ltr">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="tel"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="flex-1 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-white focus:border-emerald-500 transition-colors outline-none"
          />
        ))}
      </div>

      {/* Resend Timer */}
      <div className="mt-auto flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-white/40 text-sm font-bold uppercase tracking-widest">
          <RefreshCw size={16} className={timer > 0 ? 'animate-spin opacity-20' : ''} />
          {timer > 0 ? (
            <span>{timer}s</span>
          ) : (
            <button 
              onClick={handleResend}
              className="text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              {language === 'ar' ? 'إعادة الإرسال' : language === 'ku' ? 'دووبارە ناردنەوە' : 'Resend Code'}
            </button>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
          />
        </div>
      )}
    </div>
  );
};
