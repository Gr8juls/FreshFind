'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  message: string;
}

const NotificationContext = createContext<{ notifications: Notification[] }>({
  notifications: [],
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newNotification = {
          id: Date.now().toString(),
          type: data.type,
          message: data.message,
        };

        setNotifications((prev) => [...prev, newNotification]);

        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
        }, 5000);
      } catch (error) {
        console.error('Error parsing notification', error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="pointer-events-auto flex items-start gap-3 w-80 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-white transform transition-all duration-300 animate-in slide-in-from-right-4 fade-in"
          >
            <div className="p-2 bg-emerald-500/20 rounded-full shrink-0">
              <Bell className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold capitalize mb-1">{notif.type.replace(/_/g, ' ')}</h4>
              <p className="text-xs opacity-80 leading-relaxed">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
