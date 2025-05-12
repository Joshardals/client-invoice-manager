"use client";
import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import InputField from "../ui/InputField";
import type { RegisterFormData } from "@/typings";
import Button from "../ui/Button";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition(); // 👈 For route transitions
  const submitAttemptRef = useRef(false); // 👈 Prevent duplicate submissions

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<RegisterFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Memoized error handler
  const handleError = useCallback((message: string) => {
    setError(message);
    setLoading(false);
  }, []);

  // Memoized success handler
  const handleSuccess = useCallback(
    (token: string) => {
      reset();
      startTransition(() => {
        router.push(`/verify?session=${token}`);
      });
    },
    [router, reset]
  );

  // Memoized API call
  const registerUser = useCallback(async (data: RegisterFormData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add CSRF protection
        // "X-CSRF-Token": getCsrfToken?.() || "",
      },
      credentials: "include", // Important for security
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error || "Registration failed");
    }

    return responseData;
  }, []);

  // Memoized submit handler with retry logic
  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      // Prevent duplicate submissions
      if (submitAttemptRef.current) return;
      submitAttemptRef.current = true;

      try {
        setLoading(true);
        setError("");

        // Implement retry logic
        const attempt = async (retries: number): Promise<any> => {
          try {
            return await registerUser(data);
          } catch (err) {
            if (retries > 0 && err instanceof TypeError) {
              // Network error
              await new Promise((resolve) => setTimeout(resolve, 1000));
              return attempt(retries - 1);
            }
            throw err;
          }
        };

        const responseData = await attempt(2); // Try up to 3 times
        handleSuccess(responseData.verificationSessionToken);
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

  // Memoized navigation handler
  const handleLoginNavigation = useCallback(() => {
    startTransition(() => {
      router.push("/login");
    });
  }, [router]);

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            label="Full Name"
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
            hintText="Must be at least 8 characters"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/,
                message:
                  "Include at least 1 letter, 1 number, and 1 special character",
              },
            })}
            error={errors.password?.message}
          />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 rounded-lg bg-red-50 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <Button type="submit" loading={loading} disabled={!isValid}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={handleLoginNavigation}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
