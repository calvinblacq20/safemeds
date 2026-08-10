/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, ShieldPlus } from "lucide-react";
import { LEGAL_VERSION } from "@/lib/legal";
import ThemeToggle from "@/components/Common/ThemeToggle";
import { Button, TextField } from "@/components/ui";
import { cn } from "@/lib/cn";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  pharmacyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

type Role = "CLIENT" | "PHARMACY" | "ADMIN";

const ROLES: { value: Role; label: string }[] = [
  { value: "CLIENT", label: "Student" },
  { value: "PHARMACY", label: "Pharmacist" },
  { value: "ADMIN", label: "Admin" },
];

const EMPTY: FormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  phone: "",
  licenseNumber: "",
  pharmacyName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userType, setUserType] = useState<Role>("CLIENT");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [isLicenseChecking, setIsLicenseChecking] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const dashboardPath =
        session.user.role === "ADMIN"
          ? "/admin"
          : session.user.role === "PHARMACY"
            ? "/pharmacy-dashboard"
            : "/client-dashboard";
      router.replace(dashboardPath);
    }
  }, [status, session, router]);

  // Debounced availability checks. These live in effects so the timer is
  // actually cancelled between keystrokes — returning a cleanup from the
  // change handler did nothing, so every character hit the API.
  useEffect(() => {
    const email = formData.email;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    const timer = setTimeout(async () => {
      setIsEmailChecking(true);
      try {
        const response = await fetch(
          `/api/auth/signup?email=${encodeURIComponent(email)}`,
        );
        const data = await response.json();
        setErrors((prev) => ({
          ...prev,
          email: data.exists ? "This email is already registered." : "",
        }));
      } catch {
        setErrors((prev) => ({
          ...prev,
          email: "Unable to verify email availability.",
        }));
      } finally {
        setIsEmailChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);

  useEffect(() => {
    const licenseNumber = formData.licenseNumber;
    if (!licenseNumber || userType !== "PHARMACY") return;

    const timer = setTimeout(async () => {
      setIsLicenseChecking(true);
      try {
        const response = await fetch(
          `/api/auth/verify-license?licenseNumber=${encodeURIComponent(licenseNumber)}`,
        );
        const data = await response.json();
        setErrors((prev) => ({
          ...prev,
          licenseNumber: data.isValid
            ? ""
            : data.error || "Invalid license number.",
        }));
      } catch {
        setErrors((prev) => ({
          ...prev,
          licenseNumber: "Unable to verify license number.",
        }));
      } finally {
        setIsLicenseChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.licenseNumber, userType]);

  const validateForm = (): boolean => {
    const next: Record<string, string> = {};

    if (!formData.username.trim()) {
      next.username = "Username is required.";
    } else if (formData.username.length < 3) {
      next.username = "Username must be at least 3 characters.";
    } else if (formData.username.length > 50) {
      next.username = "Username must be fewer than 50 characters.";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      next.username = "Only letters, numbers, hyphens, and underscores allowed.";
    }

    if (!formData.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      next.password = "Password is required.";
    } else if (formData.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      next.password = "Include uppercase, lowercase, and a number.";
    }

    if (formData.password !== formData.confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }

    if (!formData.firstName.trim()) next.firstName = "First name is required.";
    if (!formData.lastName.trim()) next.lastName = "Last name is required.";

    if (userType === "PHARMACY") {
      if (!formData.licenseNumber.trim()) {
        next.licenseNumber = "License number is required.";
      }
      if (!formData.phone.trim()) {
        next.phone = "Phone number is required.";
      } else if (
        !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-()]/g, ""))
      ) {
        next.phone = "Enter a valid phone number.";
      }
      if (!formData.pharmacyName.trim()) {
        next.pharmacyName = "Pharmacy name is required.";
      }
    }

    if (!agreeToTerms) {
      next.agreeToTerms = "You must agree to the terms to continue.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: userType,
          termsAccepted: agreeToTerms,
          termsVersion: LEGAL_VERSION,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || "Signup failed. Please try again." });
        return;
      }

      const loginParams =
        userType === "PHARMACY"
          ? {
              email: formData.email,
              password: formData.password,
              licenseNumber: formData.licenseNumber,
              role: userType,
            }
          : {
              username: formData.username,
              password: formData.password,
              role: userType,
            };

      const result = await signIn("credentials", {
        ...loginParams,
        redirect: false,
      });

      if (result?.error) {
        setErrors({
          general:
            "Account created. Auto-login failed — please sign in manually.",
        });
      } else if (result?.ok) {
        setIsSuccess(true);
      } else {
        setErrors({
          general: "Account created. Please sign in to continue.",
        });
      }
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const isPharmacy = userType === "PHARMACY";

  return (
    <div className="relative min-h-screen bg-slate-950 lg:bg-bg lg:flex">
      {/* Mobile background image layer */}
      <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none z-0">
        <img
          src="/images/pexels-artempodrez-5726696.jpg"
          alt="Pharmacy Research Lab background"
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/85 to-slate-950/95" />
      </div>

      <aside className="relative hidden lg:flex lg:w-[42%] xl:w-2/5 flex-col justify-between overflow-hidden p-10 text-white bg-slate-950">
        <img
          src="/images/pexels-artempodrez-5726696.jpg"
          alt="Pharmacy Research Lab"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950/60" />

        <div className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-brand-ink shadow-lg">
            <ShieldPlus className="h-6 w-6" aria-hidden />
          </span>
          <span className="text-2xl font-bold tracking-tight text-white">SafeMeds</span>
        </div>

        <div className="relative z-10 my-auto backdrop-blur-md bg-white/10 p-6 rounded-3xl border border-white/20 text-white shadow-2xl">
          <h2 className="text-2xl font-medium text-white mb-2">Anonymous, Safe & Verified Care</h2>
          <p className="text-sm leading-relaxed text-white/80">
            Create an account to consult with pharmacists, order prescriptions discreetly, and manage your health safely from your phone.
          </p>
        </div>

        <p className="relative z-10 text-xs text-white/60">
          &copy; {new Date().getFullYear()} SafeMeds. All rights reserved.
        </p>
      </aside>

      <main className="relative z-10 flex flex-1 flex-col justify-center px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <span className="flex items-center gap-2.5 text-white lg:text-ink">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
                <ShieldPlus className="h-5 w-5 text-brand-ink" aria-hidden />
              </span>
              <span className="text-lg tracking-tight font-bold">SafeMeds</span>
            </span>
            <ThemeToggle variant="icon" size="md" />
          </div>

          <div className="rounded-card bg-surface/95 dark:bg-surface/90 backdrop-blur-xl p-6 shadow-2xl border border-line/40 sm:p-8">
            <header className="mb-6">
              <h1 className="text-2xl text-ink">Create an account</h1>
              <p className="mt-1 text-sm text-ink-muted">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/auth")}
                  className="cursor-pointer font-semibold text-brand transition-colors hover:text-brand-hover"
                >
                  Sign in
                </button>
              </p>
            </header>

            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-ink">Account type</p>
              <div
                role="tablist"
                aria-label="Account type"
                className="flex gap-1 rounded-2xl bg-surface-muted p-1"
              >
                {ROLES.map((role) => {
                  const selected = userType === role.value;
                  return (
                    <button
                      key={role.value}
                      role="tab"
                      type="button"
                      aria-selected={selected}
                      onClick={() => {
                        setUserType(role.value);
                        setErrors({});
                      }}
                      className={cn(
                        "h-11 flex-1 cursor-pointer rounded-xl text-sm font-medium",
                        "transition-colors duration-200",
                        selected
                          ? "bg-brand text-brand-ink"
                          : "text-ink-muted hover:text-ink",
                      )}
                    >
                      {role.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="First name"
                  required
                  autoComplete="given-name"
                  value={formData.firstName}
                  error={errors.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
                <TextField
                  label="Last name"
                  required
                  autoComplete="family-name"
                  value={formData.lastName}
                  error={errors.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>

              <TextField
                label="Username"
                required
                autoComplete="username"
                placeholder="your_username"
                hint="Letters, numbers, hyphens and underscores."
                value={formData.username}
                error={errors.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />

              <TextField
                label="Email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                hint={isEmailChecking ? "Checking availability…" : undefined}
                value={formData.email}
                error={errors.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />

              {isPharmacy && (
                <>
                  <TextField
                    label="License number"
                    required
                    autoComplete="off"
                    placeholder="e.g. RPh-123456"
                    hint={
                      isLicenseChecking ? "Verifying license…" : undefined
                    }
                    value={formData.licenseNumber}
                    error={errors.licenseNumber}
                    onChange={(e) =>
                      handleInputChange("licenseNumber", e.target.value)
                    }
                  />
                  <TextField
                    label="Pharmacy name"
                    required
                    autoComplete="organization"
                    value={formData.pharmacyName}
                    error={errors.pharmacyName}
                    onChange={(e) =>
                      handleInputChange("pharmacyName", e.target.value)
                    }
                  />
                  <TextField
                    label="Phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={formData.phone}
                    error={errors.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                  <TextField
                    label="Address"
                    autoComplete="street-address"
                    value={formData.address}
                    error={errors.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <TextField
                      label="City"
                      autoComplete="address-level2"
                      value={formData.city}
                      error={errors.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                    <TextField
                      label="State"
                      autoComplete="address-level1"
                      value={formData.state}
                      error={errors.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                    />
                    <TextField
                      label="ZIP"
                      autoComplete="postal-code"
                      value={formData.zipCode}
                      error={errors.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                    />
                  </div>
                </>
              )}

              <TextField
                label="Password"
                required
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                hint="At least 8 characters, with upper, lower and a number."
                value={formData.password}
                error={errors.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="h-11 cursor-pointer rounded-lg px-3 text-xs font-semibold text-ink-muted transition-colors hover:text-ink"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                }
              />

              <TextField
                label="Confirm password"
                required
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.confirmPassword}
                error={errors.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="h-11 cursor-pointer rounded-lg px-3 text-xs font-semibold text-ink-muted transition-colors hover:text-ink"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                }
              />

              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-muted">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => {
                      setAgreeToTerms(e.target.checked);
                      if (errors.agreeToTerms) {
                        setErrors((prev) => ({ ...prev, agreeToTerms: "" }));
                      }
                    }}
                    aria-invalid={errors.agreeToTerms ? true : undefined}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-brand"
                  />
                  <span>
                    I agree to the{" "}
                    <a href="/legal?tab=terms" className="font-semibold text-brand hover:text-brand-hover">
                      terms of service
                    </a>{" "}
                    and{" "}
                    <a href="/legal?tab=privacy" className="font-semibold text-brand hover:text-brand-hover">
                      privacy policy
                    </a>
                    .
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1.5 text-sm text-danger">
                    {errors.agreeToTerms}
                  </p>
                )}
              </div>

              {errors.general && (
                <p
                  role="alert"
                  className="rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger"
                >
                  {errors.general}
                </p>
              )}

              {isSuccess && (
                <div
                  role="status"
                  className="rounded-2xl bg-ok-soft px-4 py-3 text-sm text-ok"
                >
                  Account created. Redirecting to your dashboard…
                  {isPharmacy && (
                    <p className="mt-1">
                      Once signed in, please{" "}
                      <button
                        type="button"
                        onClick={() => router.push("/verify-license")}
                        className="cursor-pointer font-semibold underline"
                      >
                        verify your pharmacy license
                      </button>{" "}
                      to start providing consultations.
                    </p>
                  )}
                </div>
              )}

              <Button type="submit" size="lg" fullWidth loading={isLoading}>
                {isLoading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Encrypted and handled per HIPAA guidelines.
          </p>
        </div>
      </main>
    </div>
  );
}
