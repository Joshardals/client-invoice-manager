import { useCallback, useEffect, useRef, useState } from "react";

const COOLDOWN_STORAGE_KEY = "resend_cooldown_end";

export const useResendCooldown = (initialCooldown: number) => {
  const [cooldownTime, setCooldownTime] = useState<number>(() => {
    // Check localStorage for existing cooldown
    const storedEndTime = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (storedEndTime) {
      const remainingTime = Math.ceil(
        (parseInt(storedEndTime) - Date.now()) / 1000
      );
      return remainingTime > 0 ? remainingTime : 0;
    }
    return 0;
  });

  const [canResend, setCanResend] = useState(() => {
    const storedEndTime = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    return !storedEndTime || parseInt(storedEndTime) <= Date.now();
  });

  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  const startCooldown = useCallback(() => {
    setCanResend(false);
    setCooldownTime(initialCooldown);

    // Store end time in localStorage
    const endTime = Date.now() + initialCooldown * 1000;
    localStorage.setItem(COOLDOWN_STORAGE_KEY, endTime.toString());

    if (cooldownRef.current) {
      clearInterval(cooldownRef.current);
    }

    cooldownRef.current = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          localStorage.removeItem(COOLDOWN_STORAGE_KEY);
          if (cooldownRef.current) {
            clearInterval(cooldownRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initialCooldown]);

  // Initialize timer if there's an existing cooldown
  useEffect(() => {
    const storedEndTime = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime);
      const now = Date.now();

      if (endTime > now) {
        const remainingSeconds = Math.ceil((endTime - now) / 1000);
        setCooldownTime(remainingSeconds);
        setCanResend(false);

        cooldownRef.current = setInterval(() => {
          setCooldownTime((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              localStorage.removeItem(COOLDOWN_STORAGE_KEY);
              if (cooldownRef.current) {
                clearInterval(cooldownRef.current);
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        localStorage.removeItem(COOLDOWN_STORAGE_KEY);
      }
    }

    return () => {
      if (cooldownRef.current) {
        clearInterval(cooldownRef.current);
      }
    };
  }, []);

  return {
    cooldownTime,
    canResend,
    startCooldown,
  };
};
