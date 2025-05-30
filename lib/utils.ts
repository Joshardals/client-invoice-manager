import { PhoneNumberUtil } from "google-libphonenumber";

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const phoneUtil = PhoneNumberUtil.getInstance();

export const isPhoneValid = (phone: string) => {
  // Return true if the input is empty or just contains a plus sign
  if (!phone || phone.trim() === "" || phone.trim() === "+") {
    return true;
  }

  // Check if the input is just a country code (starts with + followed by 1-3 digits)
  const countryCodePattern = /^\+\d{1,3}$/;
  if (countryCodePattern.test(phone.trim())) {
    return true;
  }

  try {
    // Parse the phone number
    const phoneNumber = phoneUtil.parseAndKeepRawInput(phone);

    // Get the country code length
    const countryCode = phoneNumber.getCountryCode();
    const countryCodeStr = countryCode ? `+${countryCode}` : "";

    // If the input is just the country code, return true
    if (phone.trim() === countryCodeStr) {
      return true;
    }

    // Otherwise, validate the complete phone number
    return phoneUtil.isValidNumber(phoneNumber);
  } catch (error) {
    return false;
  }
};

// Helper function for title case (good for titles, product names, etc.)
export const toTitleCase = (str: string): string => {
  return (
    str
      .split(" ")
      .map((word) => {
        // List of words to keep lowercase
        const minorWords = [
          "and",
          "or",
          "but",
          "nor",
          "yet",
          "so",
          "at",
          "by",
          "for",
          "in",
          "of",
          "on",
          "to",
          "up",
          "as",
        ];

        // Always capitalize first and last words
        if (word.length === 0) return "";

        return minorWords.includes(word.toLowerCase())
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ")
      // Ensure first word is always capitalized
      .replace(/^\w/, (c) => c.toUpperCase())
  );
};

// Helper function to capitalize each word in a string
export const capitalizeWords = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
