"use client";
import { useState, useCallback, useRef, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import InputField from "../ui/InputField";
import Button from "../ui/Button";

// Types
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

interface ApiResponse {
  verificationSessionToken?: string;
  error?: string;
}

// Constants
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/,
  message: "Include at least 1 letter, 1 number, and 1 special character",
};

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const submitAttemptRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<RegisterFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Cleanup function for pending requests
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Error handler
  const handleError = useCallback((message: string) => {
    setError(message);
    setLoading(false);
  }, []);

  // Success handler
  const handleSuccess = useCallback(
    (token: string) => {
      reset();
      startTransition(() => {
        router.push(`/verify?session=${token}`);
      });
    },
    [router, reset]
  );

  // API call with retry logic
  const registerUser = useCallback(
    async (data: RegisterFormData, retryCount = 0): Promise<ApiResponse> => {
      cleanup();
      abortControllerRef.current = new AbortController();

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "X-CSRF-Token":
            //   typeof window !== "undefined" ? getCsrfToken?.() : "",
          },
          credentials: "include",
          body: JSON.stringify(data),
          signal: abortControllerRef.current.signal,
        });

        const responseData: ApiResponse = await res.json();

        if (!res.ok) {
          throw new Error(responseData.error || "Registration failed");
        }

        return responseData;
      } catch (err: any) {
        if (
          retryCount < MAX_RETRIES &&
          (err instanceof TypeError || err.name === "AbortError")
        ) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return registerUser(data, retryCount + 1);
        }
        throw err;
      }
    },
    [cleanup]
  );

  // Submit handler
  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      if (submitAttemptRef.current) return;
      submitAttemptRef.current = true;

      try {
        setLoading(true);
        setError("");

        const responseData = await registerUser(data);

        if (responseData.verificationSessionToken) {
          handleSuccess(responseData.verificationSessionToken);
        } else {
          throw new Error("Invalid server response");
        }
      } catch (err) {
        console.error("Registration error:", err);
        handleError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        submitAttemptRef.current = false;
        setLoading(false);
      }
    },
    [registerUser, handleSuccess, handleError]
  );

  // Navigation handler
  const handleLoginNavigation = useCallback(() => {
    startTransition(() => {
      router.push("/login");
    });
  }, [router]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const isLoading = loading || isPending;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600">
            Start managing your clients and invoices efficiently
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <InputField
            label="Full Name"
            disabled={isLoading}
            autoComplete="name"
            {...register("name", {
              required: "Name is required",
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: "Only letters and spaces allowed",
              },
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            error={errors.name?.message}
          />

          <InputField
            label="Email Address"
            type="email"
            disabled={isLoading}
            autoComplete="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
            error={errors.email?.message}
          />

          <InputField
            label="Password"
            type="password"
            disabled={isLoading}
            autoComplete="new-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: PASSWORD_REQUIREMENTS.minLength,
                message: `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`,
              },
              pattern: {
                value: PASSWORD_REQUIREMENTS.pattern,
                message: PASSWORD_REQUIREMENTS.message,
              },
            })}
            error={errors.password?.message}
          />

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 rounded-lg bg-red-50 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            loading={isLoading}
            disabled={!isValid || isLoading}
            className="w-full"
          >
            {loading
              ? "Creating Account..."
              : isPending
                ? "Redirecting..."
                : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={handleLoginNavigation}
            disabled={isLoading}
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign in
          </button>
        </p>

        {/* Optional loading bar for navigation */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 w-full h-1 bg-blue-500"
            >
              <motion.div
                className="h-full bg-blue-600"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
