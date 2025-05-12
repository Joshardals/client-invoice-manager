"use client";
import { useState, useCallback, useRef, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { LoginFormData, loginSchema } from "@/lib/form/validation";
import {
  formAnimations,
  MAX_RETRIES,
  RETRY_DELAY,
  statusAnimations,
} from "@/lib/constants";
import NavigationProgress from "../ui/NavigationProgress";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export function LoginForm() {
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
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const handleError = useCallback((message: string) => {
    setError(message);
    setLoading(false);
  }, []);

  const handleSuccess = useCallback(() => {
    reset();
    startTransition(() => {
      router.push("/dashboard");
    });
  }, [router, reset]);

  const handleVerifyNavigation = useCallback(
    (sessionToken: string) => {
      startTransition(() => {
        router.push(`/verify?session=${sessionToken}`);
      });
    },
    [router]
  );

  const handleForgotPasswordNavigation = useCallback(() => {
    startTransition(() => {
      router.push("/forgot-password");
    });
  }, [router]);

  const attemptLogin = useCallback(
    async (data: LoginFormData, retryCount = 0) => {
      cleanup();
      abortControllerRef.current = new AbortController();

      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: data.email.toLowerCase().trim(),
          password: data.password,
        });

        if (result?.error) {
          if (result.error.startsWith("unverified:")) {
            const sessionToken = result.error.split(":")[1];
            handleVerifyNavigation(sessionToken);
            return { success: false };
          }
          throw new Error(result.error);
        }

        return { success: true };
      } catch (err) {
        if (err instanceof Error && retryCount < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return attemptLogin(data, retryCount + 1);
        }
        throw err;
      }
    },
    [cleanup, router]
  );

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      if (submitAttemptRef.current) return;
      submitAttemptRef.current = true;

      try {
        setLoading(true);
        setError("");

        const result = await attemptLogin(data);

        if (result.success) {
          handleSuccess();
        }
      } catch (err) {
        console.error("Login error:", err);
        const errorMessage =
          err instanceof Error
            ? err.message === "CredentialsSignin"
              ? "Invalid email or password"
              : err.message
            : "An unexpected error occurred";
        handleError(errorMessage);
      } finally {
        submitAttemptRef.current = false;
        setLoading(false);
      }
    },
    [attemptLogin, handleSuccess, handleError]
  );

  const handleRegisterNavigation = useCallback(() => {
    startTransition(() => {
      router.push("/register");
    });
  }, [router]);

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
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">
            Sign in to continue managing your business
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
          aria-label="Login form"
        >
          <InputField
            label="Email Address"
            type="email"
            disabled={isLoading}
            autoComplete="email"
            aria-required="true"
            {...register("email")}
            error={errors.email?.message}
          />

          <div className="space-y-1">
            <InputField
              label="Password"
              type="password"
              disabled={isLoading}
              autoComplete="current-password"
              aria-required="true"
              {...register("password")}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={handleForgotPasswordNavigation}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-500 float-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>

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
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={handleRegisterNavigation}
            disabled={isLoading}
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Create an account
          </button>
        </p>
      </motion.div>

      <LoadingSpinner isPending={isPending} />
    </>
  );
}
