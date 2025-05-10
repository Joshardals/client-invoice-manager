"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { formatTime } from "@/lib/utils";

export function VerifyEmailForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 1 minute cooldown

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
    try {
      setResendLoading(true);
      setError("");

      const response = await fetch("/api/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setCanResend(false);
        setTimer(600); // Reset main timer
        setResendTimer(60); // Reset resend cooldown
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Network error. Please try again.");
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
          <p className="text-gray-600">
            Please enter the verification code sent to your email
          </p>
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
            disabled={loading || success}
            error={error}
          />

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-green-50 text-green-700 text-sm"
            >
              Email verified successfully! Redirecting to login...
            </motion.div>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              loading={loading}
              disabled={loading || success || code.length !== 6 || timer === 0}
            >
              Verify Email
            </Button>

            <Button
              type="button"
              loading={resendLoading}
              disabled={!canResend || resendLoading}
              onClick={handleResendCode}
              className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
            >
              {canResend
                ? "Resend Code"
                : `Resend Code (${formatTime(resendTimer)})`}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
