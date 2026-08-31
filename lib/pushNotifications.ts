/**
 * Web Push & In-App Notification Manager for FreshFind
 */

export interface DropAlertSubscription {
  id: string;
  offerId?: string;
  businessId: string;
  businessName: string;
  subscribedAt: string;
  active: boolean;
}

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

/**
 * Check browser notification support & permission
 */
export function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission as NotificationPermissionState;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Trigger an instant browser notification (or fallback if supported)
 */
export function showAppNotification(title: string, options?: NotificationOptions): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      return true;
    } catch (e) {
      console.warn('Native notification failed, falling back to service worker or toast', e);
      return false;
    }
  }
  return false;
}

/**
 * Simulate a fresh drop alert for a subscribed store
 */
export function triggerDropAlert(businessName: string, offerTitle: string, discountedPrice: number): void {
  const title = `🚨 Flash Food Drop: ${businessName}!`;
  const body = `New surprise bags just dropped: "${offerTitle}" for only ${discountedPrice.toLocaleString()} RWF. Hurry before they sell out!`;

  showAppNotification(title, {
    body,
    tag: 'drop-alert',
  });
}
