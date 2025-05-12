// API Request Retry Configuration
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000; // 1 second

// Form Animations
export const formAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const statusAnimations = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};
