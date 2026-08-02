"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-md p-8">
        {success ? (
          <>
            <h1 className="font-display font-semibold text-2xl mb-2">
              Password updated
            </h1>
            <p className="text-dark/60 text-sm">
              Redirecting you to sign in...
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display font-semibold text-2xl mb-2">
              Set a new password
            </h1>
            <p className="text-dark/60 text-sm mb-6">
              Enter a new password for your account.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                required
                minLength={6}
                className="w-full border border-dark/15 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;