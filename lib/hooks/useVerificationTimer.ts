import { useState, useCallback, useEffect, useRef } from "react";

export function useVerificationTimer(initialExpiry?: string | null) {
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (!initialExpiry) return 0;
    const expiry = new Date(initialExpiry).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((expiry - now) / 1000));
  });

  const [isExpired, setIsExpired] = useState(() => {
    if (!initialExpiry) return false;
    return new Date(initialExpiry).getTime() <= Date.now();
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const expiryRef = useRef<Date | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (expiryTime: string) => {
      clearTimer();

      const expiry = new Date(expiryTime);
      expiryRef.current = expiry;

      // Calculate initial remaining time
      const now = new Date();
      const initialRemaining = Math.max(
        0,
        Math.floor((expiry.getTime() - now.getTime()) / 1000)
      );

      setTimeRemaining(initialRemaining);
      setIsExpired(initialRemaining <= 0);

      if (initialRemaining <= 0) {
        return;
      }

      // Start the countdown
      timerRef.current = setInterval(() => {
        const now = new Date();
        const remaining = Math.max(
          0,
          Math.floor((expiry.getTime() - now.getTime()) / 1000)
        );

        setTimeRemaining(remaining);

        if (remaining <= 0) {
          setIsExpired(true);
          clearTimer();
        }
      }, 1000);
    },
    [clearTimer]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  // Initialize timer with initial expiry if provided
  useEffect(() => {
    if (initialExpiry) {
      startTimer(initialExpiry);
    }
  }, [initialExpiry, startTimer]);

  return {
    timeRemaining,
    isExpired,
    startTimer,
    clearTimer,
  };
}
