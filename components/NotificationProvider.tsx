'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  Bell, 
  Sparkles, 
  Flame, 
  Zap, 
  CheckCircle2, 
  ShieldAlert, 
  ShoppingBag, 
  Wallet, 
  X,
  Store
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  type: string;
  title?: string;
  message: string;
  createdAt?: number;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  emitNotification: (type: string, title: string, message: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  emitNotification: () => {},
  removeNotification: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const emitNotification = useCallback((type: string, title: string, message: string) => {
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      title,
      message,
      createdAt: Date.now(),
    };

    setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5500);
  }, [removeNotification]);

  // Connect to SSE stream
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/notifications/stream');

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'SYSTEM') return; // Suppress initial connection ping from toast
          emitNotification(data.type, data.title || data.type.replace(/_/g, ' '), data.message);
        } catch (error) {
          console.error('Error parsing notification event', error);
        }
      };
    } catch (err) {
      console.warn('Notification SSE not supported or unavailable:', err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [emitNotification]);

  const getNotificationIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'OFFER_ALERT':
      case 'FLASH_DROP':
        return <Flame className="w-5 h-5 text-orange-400 animate-pulse" />;
      case 'BOOST':
      case 'CHEF':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'ORDER_CONFIRMED':
      case 'CHECKOUT':
        return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
      case 'WALLET_CREDIT':
      case 'PAYOUT':
        return <Wallet className="w-5 h-5 text-emerald-300" />;
      case 'MARKDOWN':
        return <Zap className="w-5 h-5 text-teal-400" />;
      case 'SECURITY':
      case 'DISPUTE':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      default:
        return <Bell className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, emitNotification, removeNotification }}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="pointer-events-auto flex items-start gap-3 w-full p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl text-slate-100 transform transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in"
          >
            <div className="p-2 bg-slate-800 rounded-xl border border-slate-700 shrink-0">
              {getNotificationIcon(notif.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-black tracking-wide text-slate-100 capitalize truncate">
                  {notif.title || notif.type.replace(/_/g, ' ')}
                </h4>
                <button
                  onClick={() => removeNotification(notif.id)}
                  className="text-slate-400 hover:text-white p-0.5 rounded transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300/90 leading-relaxed mt-0.5">
                {notif.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);

