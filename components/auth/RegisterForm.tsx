"use client";
import { useState, useCallback, useRef, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/lib/form/validation";
import {
  formAnimations,
  MAX_RETRIES,
  RETRY_DELAY,
  statusAnimations,
} from "@/lib/constants";
import NavigationProgress from "../ui/NavigationProgress";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface ApiResponse {
  verificationSessionToken?: string;
  error?: string;
}

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
    resolver: zodResolver(registerSchema),
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
      } catch (err) {
        if (
          err instanceof Error &&
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

        const sanitizedData = {
          ...data,
          email: data.email.toLowerCase().trim(),
          name: data.name.trim(),
        };

        const responseData = await registerUser(sanitizedData);

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

  const isLoading = loading;

  return (
    <>
      <motion.div
        {...formAnimations}
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
          aria-label="Registration form"
        >
          <InputField
            label="Full Name"
            disabled={isLoading}
            autoComplete="name"
            aria-required="true"
            {...register("name")}
            error={errors.name?.message}
          />

          <InputField
            label="Email Address"
            type="email"
            disabled={isLoading}
            autoComplete="email"
            aria-required="true"
            {...register("email")}
            error={errors.email?.message}
          />

          <InputField
            label="Password"
            type="password"
            disabled={isLoading}
            autoComplete="new-password"
            aria-required="true"
            {...register("password")}
            error={errors.password?.message}
          />

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                {...statusAnimations}
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
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={handleLoginNavigation}
            disabled={isLoading}
            className="link-btn"
          >
            Sign in
          </button>
        </p>
      </motion.div>
      <LoadingSpinner isPending={isPending} />
    </>
  );
}
