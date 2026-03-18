import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, Phone, FileText, 
  MapPin, Camera, Upload, ChevronRight, 
  MessageCircle, Share2, Building2, Clock, 
  Globe, Instagram, Facebook, Twitter
} from 'lucide-react';
import { Business } from '../../types';
import { useAppState } from '../../hooks/useAppState';
import { APP_COLORS, CATEGORIES } from '../../constants';

interface Props {
  business: Business;
  pop: () => void;
}

type Step = 1 | 2 | 3 | 4;

export default function ClaimBusinessScreen({ business, pop }: Props) {
  const { language, t, isRTL } = useAppState();
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);

  const name = language === 'ar' ? business.nameAr : language === 'ku' ? business.nameKu : business.nameEn;

  const nextStep = () => {
    setDirection(1);
    setStep(prev => (prev + 1) as Step);
  };

  const prevStep = () => {
    if (step === 1) {
      pop();
    } else {
      setDirection(-1);
      setStep(prev => (prev - 1) as Step);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 businessName={name} onNext={nextStep} onRefer={() => {}} isRTL={isRTL} language={language} />;
      case 2: return <Step2 onNext={nextStep} isRTL={isRTL} language={language} />;
      case 3: return <Step3 business={business} onNext={nextStep} isRTL={isRTL} language={language} />;
      case 4: return <Step4 onFinish={pop} isRTL={isRTL} language={language} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-border">
        <button onClick={prevStep} className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">
            {language === 'ar' ? 'طلب ملكية عمل تجاري' : 
             language === 'ku' ? 'داواکاری خاوەندارێتی' : 
             'Claim Business'}
          </h1>
          <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
            {language === 'ar' ? `الخطوة ${step} من 4` : 
             language === 'ku' ? `هەنگاوی ${step} لە ٤` : 
             `Step ${step} of 4`}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-surface">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(step / 4) * 100}%` }}
          className="h-full bg-primary"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: direction * 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -direction * 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="p-6"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- STEP 1: Confirm Identity ---
function Step1({ businessName, onNext, onRefer, isRTL, language }: any) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold leading-tight">
          {language === 'ar' ? 'هل أنت صاحب هذا العمل التجاري؟' : 
           language === 'ku' ? 'ئایا تۆ خاوەنی ئەم بازرگانییەیت؟' : 
           'Are you the owner of this business?'}
        </h2>
        <p className="text-sm text-text-secondary">
          {language === 'ar' ? 'يرجى التأكيد قبل المتابعة في عملية التحقق.' : 
           language === 'ku' ? 'تکایە پێش بەردەوامبوون لە پرۆسەی پشتڕاستکردنەوە دڵنیابەرەوە.' : 
           'Please confirm before proceeding with the verification process.'}
        </p>
      </div>

      <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <Building2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-text-primary">{businessName}</h3>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={onNext}
          className="w-full py-5 bg-primary rounded-2xl text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <CheckCircle2 size={20} />
          {language === 'ar' ? 'نعم، أنا المالك' : 
           language === 'ku' ? 'بەڵێ، من خاوەنەکەم' : 
           'Yes, I am the owner'}
        </button>

        <button 
          onClick={onRefer}
          className="w-full py-5 bg-surface border border-border rounded-2xl text-text-primary font-bold text-sm hover:bg-surface-hover transition-all flex items-center justify-center gap-3"
        >
          <Share2 size={20} />
          {language === 'ar' ? 'أعرف المالك، أريد إرسال التطبيق له' : 
           language === 'ku' ? 'خاوەنەکە دەناسم، دەمەوێت ئەپەکەی بۆ بنێرم' : 
           'I know the owner, I want to refer them'}
        </button>
      </div>
    </div>
  );
}

// --- STEP 2: Verification Method ---
function Step2({ onNext, isRTL, language }: any) {
  const methods = [
    {
      id: 'phone',
      icon: <Phone size={24} />,
      title: language === 'ar' ? 'اتصال هاتفي' : language === 'ku' ? 'پەیوەندی تەلەفۆنی' : 'Phone Call',
      desc: language === 'ar' ? 'سنتصل بك على رقم العمل المسجل' : language === 'ku' ? 'پەیوەندیت پێوە دەکەین لەسەر ژمارەی کارە تۆمارکراوەکە' : "We'll call the business number",
      color: 'bg-blue-500'
    },
    {
      id: 'doc',
      icon: <FileText size={24} />,
      title: language === 'ar' ? 'رفع وثائق' : language === 'ku' ? 'بەرزکردنەوەی بەڵگەنامە' : 'Upload Documents',
      desc: language === 'ar' ? 'ارفع إجازة التجارة أو الهوية الضريبية' : language === 'ku' ? 'مۆڵەتی بازرگانی یان ناسنامەی باج بەرز بکەرەوە' : 'Upload trade license or tax ID',
      color: 'bg-green-500'
    },
    {
      id: 'person',
      icon: <MapPin size={24} />,
      title: language === 'ar' ? 'تحقق شخصي' : language === 'ku' ? 'پشکنینی کەسی' : 'In-person Verification',
      desc: language === 'ar' ? 'قم بزيارة مكاتبنا في السليمانية أو بغداد' : language === 'ku' ? 'سەردانی ئۆفیسەکانمان بکە لە سلێمانی یان بەغدا' : 'Visit our offices in Sulaymaniyah or Baghdad',
      color: 'bg-amber-500'
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold leading-tight">
          {language === 'ar' ? 'كيف يمكننا التحقق منك؟' : 
           language === 'ku' ? 'چۆن دەتوانین پشتڕاستیت بکەینەوە؟' : 
           'How can we verify you?'}
        </h2>
        <p className="text-sm text-text-secondary">
          {language === 'ar' ? 'اختر الطريقة الأنسب لك لتأكيد ملكيتك.' : 
           language === 'ku' ? 'گونجاوترین ڕێگا هەڵبژێرە بۆ پشتڕاستکردنەوەی خاوەندارێتیت.' : 
           'Choose the most suitable method for you to confirm ownership.'}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {methods.map(m => (
          <button 
            key={m.id}
            onClick={onNext}
            className="flex items-center gap-4 p-5 bg-surface border border-border rounded-2xl hover:bg-surface-hover transition-all text-left"
          >
            <div className={`w-12 h-12 rounded-xl ${m.color}/20 flex items-center justify-center text-white`}>
              {m.icon}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-sm font-bold text-text-primary">{m.title}</span>
              <span className="text-[10px] text-text-muted leading-tight">{m.desc}</span>
            </div>
            <ChevronRight size={20} className={`text-text-muted ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

// --- STEP 3: Business Details Form ---
function Step3({ business, onNext, isRTL, language }: any) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold leading-tight">
          {language === 'ar' ? 'تحديث بيانات العمل' : 
           language === 'ku' ? 'نوێکردنەوەی زانیارییەکانی کار' : 
           'Update Business Details'}
        </h2>
        <p className="text-sm text-text-secondary">
          {language === 'ar' ? 'تأكد من أن جميع المعلومات دقيقة ليتمكن الزبائن من الوصول إليك.' : 
           language === 'ku' ? 'دڵنیابەرەوە هەموو زانیارییەکان دروستن بۆ ئەوەی کڕیاران بتوانن دەستت پێ بگات.' : 
           'Ensure all info is accurate so customers can reach you.'}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Basic Info */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{language === 'ar' ? 'اسم العمل (عربي)' : 'Business Name (AR)'}</label>
            <input 
              type="text" 
              defaultValue={business.nameAr}
              className="w-full h-14 bg-surface border border-border rounded-2xl px-4 text-sm focus:outline-none focus:border-primary/50 text-text-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{language === 'ar' ? 'اسم العمل (إنجليزي)' : 'Business Name (EN)'}</label>
            <input 
              type="text" 
              defaultValue={business.nameEn}
              className="w-full h-14 bg-surface border border-border rounded-2xl px-4 text-sm focus:outline-none focus:border-primary/50 text-text-primary"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="tel" 
                defaultValue={business.phone}
                className="w-full h-14 bg-surface border border-border rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 text-text-primary"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{language === 'ar' ? 'واتساب (اختياري)' : 'WhatsApp (Optional)'}</label>
            <div className="relative">
              <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="tel" 
                className="w-full h-14 bg-surface border border-border rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 text-text-primary"
              />
            </div>
          </div>
        </div>

        {/* Media Uploads */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{language === 'ar' ? 'الشعار' : 'Logo'}</label>
            <button className="aspect-square bg-surface border border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 text-text-muted hover:text-text-secondary transition-colors">
              <Camera size={24} />
              <span className="text-[10px] font-bold">Upload</span>
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{language === 'ar' ? 'صورة الغلاف' : 'Cover'}</label>
            <button className="aspect-square bg-surface border border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 text-text-muted hover:text-text-secondary transition-colors">
              <Upload size={24} />
              <span className="text-[10px] font-bold">Upload</span>
            </button>
          </div>
        </div>

        <button 
          onClick={onNext}
          className="w-full py-5 bg-primary rounded-2xl text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
        >
          {language === 'ar' ? 'أرسل طلب التحقق' : 
           language === 'ku' ? 'داواکاری تەسدیق بنێرە' : 
           'Submit Verification Request'}
        </button>
      </div>
    </div>
  );
}

// --- STEP 4: Pending Confirmation ---
function Step4({ onFinish, isRTL, language }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center gap-8">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center text-secondary"
      >
        <CheckCircle2 size={48} />
      </motion.div>

      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? 'تم إرسال طلبك بنجاح!' : 
           language === 'ku' ? 'داواکارییەکەت بە سەرکەوتوویی نێردرا!' : 
           'Request Sent Successfully!'}
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed px-6">
          {language === 'ar' ? 'سنقوم بمراجعة طلبك والتحقق من البيانات خلال 24-48 ساعة القادمة. ستتلقى إشعاراً فور الموافقة.' : 
           language === 'ku' ? 'لە ماوەی ٢٤-٤٨ کاتژمێری داهاتوودا پێداچوونەوە بە داواکارییەکەتدا دەکەین و زانیارییەکان پشتڕاست دەکەینەوە. هەر کە پەسەند کرا ئاگادارییەکت پێ دەگات.' : 
           "We'll review your request and verify the details within the next 24-48 hours. You'll receive a notification once approved."}
        </p>
      </div>

      <button 
        onClick={onFinish}
        className="w-full py-5 bg-surface border border-border rounded-2xl text-text-primary font-bold text-sm hover:bg-surface-hover transition-all mt-10"
      >
        {language === 'ar' ? 'العودة للرئيسية' : 
         language === 'ku' ? 'گەڕانەوە بۆ سەرەکی' : 
         'Back to Home'}
      </button>
    </div>
  );
}
