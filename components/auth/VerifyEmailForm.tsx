"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { formatTime } from "@/lib/utils";

export function VerifyEmailForm({ sessionToken }: { sessionToken: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 1 minute cooldown
  const [userEmail, setUserEmail] = useState<string>("");

  const [status, setStatus] = useState<{
    type: "success" | "error" | "info" | "loading" | null;
    message: string;
  }>({ type: null, message: "" });

  // Verify session and get user email on mount
  useEffect(() => {
    const verifySession = async () => {
      if (!sessionToken) {
        router.replace("/register");
        return;
      }

      try {
        const res = await fetch("/api/auth/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionToken }),
        });

        if (!res.ok) {
          setStatus({
            type: "error",
            message: "Invalid session. Redirecting to registration...",
          });
          setTimeout(() => router.replace("/register"), 2000);
          return;
        }

        const data = await res.json();
        setUserEmail(data.email);
      } catch (error) {
        setStatus({
          type: "error",
          message: "Failed to verify session. Redirecting to registration...",
        });
        setTimeout(() => router.replace("/register"), 2000);
      }
    };

    verifySession();
  }, [sessionToken, router]);

  // Timer effects remain the same...
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [canResend]);

  const handleResendCode = async () => {
    if (!sessionToken || !canResend) return;

    try {
      setResendLoading(true);
      setStatus({
        type: "loading",
        message: "Sending new verification code...",
      });

      const response = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setCanResend(false);
        setTimer(600);
        setResendTimer(60);
        setCode("");
        setStatus({
          type: "info",
          message: "New verification code sent to your email",
        });
      } else {
        if (response.status === 401) {
          setStatus({
            type: "error",
            message: "Your session has expired. Please register again.",
          });
          setTimeout(() => router.replace("/register"), 2000);
        } else {
          setStatus({
            type: "error",
            message: data.error || "Failed to resend code",
          });
        }
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to resend code. Please try again.",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "loading", message: "Verifying code..." });

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, sessionToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Email verified successfully! Redirecting to login...",
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setStatus({
          type: "error",
          message: data.error || "Invalid verification code",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Verify Your Email
          </h1>
          {userEmail && (
            <p className="text-sm text-gray-600">
              We sent a verification code to {userEmail}
            </p>
          )}
          {timer > 0 && (
            <p className="text-sm text-gray-500">
              Code expires in: {formatTime(timer)}
            </p>
          )}
          {timer === 0 && (
            <p className="text-sm text-red-500">
              Code has expired. Please request a new one.
            </p>
          )}
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <InputField
            label="Verification Code"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            disabled={loading || status.type === "success"}
          />

          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg flex items-center ${
                status.type === "success"
                  ? "bg-green-50 text-green-700"
                  : status.type === "error"
                    ? "bg-red-50 text-red-700"
                    : status.type === "info"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-gray-50 text-gray-700"
              } text-sm`}
            >
              {status.type === "success" && (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {status.type === "error" && (
                <AlertCircle className="w-4 h-4 mr-2" />
              )}
              {status.message}
            </motion.div>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              loading={loading}
              disabled={
                loading ||
                status.type === "success" ||
                code.length !== 6 ||
                timer === 0
              }
              className="w-full"
            >
              Verify Email
            </Button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={!canResend || resendLoading}
              className="w-full text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canResend
                ? "Resend Code"
                : `Resend Code (${formatTime(resendTimer)})`}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
