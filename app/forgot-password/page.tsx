"use client";

import React, { useState } from "react";
import Link from "next/link";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-md p-8">
        {submitted ? (
          <>
            <h1 className="font-display font-semibold text-2xl mb-2">
              Check your email
            </h1>
            <p className="text-dark/60 text-sm">
              If an account exists for {email}, we've sent a link to reset your password.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display font-semibold text-2xl mb-2">
              Forgot your password?
            </h1>
            <p className="text-dark/60 text-sm mb-6">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-dark/15 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </>
        )}

        <Link
          href="/login"
          className="block text-center text-sm text-secondary mt-6 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;