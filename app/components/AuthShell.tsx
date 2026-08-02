"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SplitText from "./SplitText";

const sampleCards = [
  { number: "01", question: "What is the powerhouse of the cell?" },
  { number: "02", question: "What year did WWII end?" },
  { number: "03", question: "What is 7 × 8?" },
];

const AuthShell = ({
  heading,
  subheading,
  mode,
}: {
  heading: string;
  subheading: string;
  mode: "login" | "signup";
}) => {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % sampleCards.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const current = sampleCards[index];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        // Create the account via our own API route
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Something went wrong.");
          setLoading(false);
          return;
        }

        // Account created — now sign them straight in
        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/dashboard",
        });
      } else {
        // Login mode — sign in directly with credentials
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password.");
          setLoading(false);
          return;
        }

        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT: brand panel — unchanged */}
      <div className="hidden md:flex flex-col justify-between bg-dark p-12">
        <span className="font-display font-semibold text-lg text-bg">
          Recall
        </span>

        <div>
          <p className="font-mono text-xs text-accent tracking-wide uppercase mb-3">
            Card {current.number} / 08
          </p>
          <SplitText
            key={index}
            text={current.question}
            className="font-display text-3xl text-bg leading-snug"
            delay={30}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0}
            rootMargin="0px"
            tag="p"
            textAlign="left"
          />
        </div>

        <p className="text-bg/40 text-sm">
          Built for students who'd rather study than make study cards.
        </p>
      </div>

      {/* RIGHT: form panel */}
      <div className="flex items-center justify-center p-6">
        <div className="max-w-sm w-full">
          <h1 className="font-display font-semibold text-3xl mb-2">
            {heading}
          </h1>
          <p className="text-dark/60 mb-8">{subheading}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-dark/70 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-dark/15 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-dark/70">
                  Password
                </label>
                {mode === "login" && (
                  <Link
                    href="/forgot-password"
                    className="text-xs text-secondary hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-dark/15 rounded-lg px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark/70"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-medium py-3.5 rounded-lg hover:opacity-90 disabled:opacity-50 mt-2"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign in"
                : "Create account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-dark/10" />
            <span className="text-xs text-dark/40 uppercase tracking-wide">
              or
            </span>
            <div className="flex-1 h-px bg-dark/10" />
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 border border-dark/15 bg-white rounded-lg py-3.5 font-medium hover:bg-bg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-xs text-dark/40 mt-6 text-center">
            By continuing, you agree to Recall's Terms and Privacy Policy.
          </p>

          {/* NEW: link to the opposite auth page */}
          <p className="text-sm text-dark/70 mt-6 text-center">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <Link href="/signup" className="text-secondary font-medium hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="text-secondary font-medium hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;