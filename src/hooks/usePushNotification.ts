import { getToken } from 'firebase/messaging';
import { useCallback, useRef } from 'react';
import { messaging } from '../lib/firebase';
import useApi from './useApi';

const VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY;

const usePushNotification = () => {
  const apiClient = useApi();
  const registeredRef = useRef(false);

  const registerPushToken = useCallback(async () => {
    if (registeredRef.current) return;
    if (!messaging || !VAPID_KEY) return;
    if (!('serviceWorker' in navigator) || !('Notification' in window)) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const registration = await navigator.serviceWorker.ready;

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        await apiClient.savePushSubscription(token);
        registeredRef.current = true;
      }
    } catch (error) {
      console.error('[usePushNotification] Failed to register push token:', error);
    }
  }, [apiClient]);

  return { registerPushToken };
};

export default usePushNotification;
