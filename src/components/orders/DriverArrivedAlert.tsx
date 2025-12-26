import React, { useEffect, useRef } from 'react';
import { Car, Bell, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface DriverArrivedAlertProps {
  order: {
    id: string;
    order_number: string;
  };
  onDismiss: () => void;
}

// Base64 encoded simple notification sound (short beep pattern)
const NOTIFICATION_SOUND_DATA = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleDoAHIj';

const DriverArrivedAlert: React.FC<DriverArrivedAlertProps> = ({ order, onDismiss }) => {
  const { language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();
    
    // Use Web Audio API for generating a simple beep
    const playBeep = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.log('Audio playback not supported');
      }
    };

    // Play sound immediately and then every 3 seconds
    playBeep();
    intervalRef.current = setInterval(playBeep, 3000);

    // Request notification permission and show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        language === 'ar' ? 'السائق وصل!' : 'Driver Arrived!',
        {
          body: language === 'ar' 
            ? `طلبك رقم ${order.order_number} - السائق في الانتظار`
            : `Order ${order.order_number} - Driver is waiting`,
          icon: '/favicon.ico',
          tag: `driver-arrived-${order.id}`,
          requireInteraction: true,
        }
      );
    } else if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Vibrate if supported (mobile)
    if ('vibrate' in navigator) {
      // Vibrate pattern: vibrate 500ms, pause 500ms, repeat
      const vibratePattern = () => {
        navigator.vibrate([500, 500, 500, 500, 500]);
      };
      vibratePattern();
      const vibrateInterval = setInterval(vibratePattern, 3000);
      
      return () => {
        clearInterval(vibrateInterval);
        if (intervalRef.current) clearInterval(intervalRef.current);
        navigator.vibrate(0);
      };
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [order, language]);

  const handleDismiss = () => {
    // Stop all sounds and vibrations
    if (intervalRef.current) clearInterval(intervalRef.current);
    if ('vibrate' in navigator) navigator.vibrate(0);
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md">
        {/* Pulsing rings animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-64 h-64 rounded-full bg-purple-500/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute w-48 h-48 rounded-full bg-purple-500/30 animate-ping" style={{ animationDuration: '1.5s' }} />
          <div className="absolute w-32 h-32 rounded-full bg-purple-500/40 animate-ping" style={{ animationDuration: '1s' }} />
        </div>

        {/* Main content */}
        <div className="relative bg-gradient-to-b from-purple-900 to-background border-2 border-purple-500 rounded-2xl p-8 text-center shadow-2xl shadow-purple-500/30">
          {/* Icon */}
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-purple-500 rounded-full animate-pulse" />
            <div className="relative flex items-center justify-center w-full h-full">
              <Car className="h-12 w-12 text-white" />
            </div>
            <Bell className="absolute -top-1 -right-1 h-8 w-8 text-yellow-400 animate-bounce" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-2">
            {language === 'ar' ? 'السائق وصل!' : 'Driver Arrived!'}
          </h2>

          {/* Order Number */}
          <p className="text-purple-300 text-lg mb-6">
            {language === 'ar' ? 'طلب رقم' : 'Order'} #{order.order_number}
          </p>

          {/* Message */}
          <p className="text-white/80 mb-8">
            {language === 'ar' 
              ? 'السائق في انتظارك. يرجى التوجه لاستلام طلبك.'
              : 'The driver is waiting for you. Please proceed to collect your order.'}
          </p>

          {/* Dismiss Button */}
          <Button
            onClick={handleDismiss}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold text-lg py-6 rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <Phone className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'أنا قادم!' : "I'm Coming!"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverArrivedAlert;