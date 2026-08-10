/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, ShieldPlus } from "lucide-react";
import ThemeToggle from "@/components/Common/ThemeToggle";
import { Button, TextField } from "@/components/ui";
import { cn } from "@/lib/cn";

interface FormData {
  username: string;
  email: string;
  password: string;
  licenseNumber: string;
}

type Role = "CLIENT" | "PHARMACY" | "ADMIN";

const ROLES: { value: Role; label: string; needs: string }[] = [
  { value: "CLIENT", label: "Student", needs: "username + password" },
  {
    value: "PHARMACY",
    label: "Pharmacist",
    needs: "email + license number + password",
  },
  { value: "ADMIN", label: "Admin", needs: "username + password" },
];

export default function AuthPage() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    licenseNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<Role>("CLIENT");
  const [showPassword, setShowPassword] = useState(false);

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

  const validateForm = (): boolean => {
    const next: Record<string, string> = {};

    if (userType === "PHARMACY") {
      if (!formData.email.trim()) {
        next.email = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        next.email = "Enter a valid email address.";
      }
      if (!formData.licenseNumber.trim()) {
        next.licenseNumber = "License number is required.";
      }
    } else if (!formData.username.trim()) {
      next.username = "Username is required.";
    }

    if (!formData.password) next.password = "Password is required.";

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
        // Deliberately generic: never reveal which half of the pair was wrong.
        setErrors({
          general: "Invalid credentials. Check your details and try again.",
        });
      }
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ username: "", email: "", password: "", licenseNumber: "" });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-bg lg:flex">
      {/* Brand panel — desktop only. The phone layout is the card alone on the
          lavender canvas, which is what the design reference shows. */}
      <aside className="relative hidden lg:flex lg:w-[42%] xl:w-2/5 flex-col justify-between overflow-hidden p-10 text-white bg-slate-900">
        <img
          src="/images/pexels-tima-miroshnichenko-5452224.jpg"
          alt="Pharmacist team"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />

        <div className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-brand-ink shadow-lg">
            <ShieldPlus className="h-6 w-6" aria-hidden />
          </span>
          <span className="text-2xl font-bold tracking-tight text-white">SafeMeds</span>
        </div>

        <div className="relative z-10 my-auto backdrop-blur-md bg-white/10 p-6 rounded-3xl border border-white/20 text-white shadow-2xl">
          <h2 className="text-2xl font-medium text-white mb-2">Private & Seamless Campus Healthcare</h2>
          <p className="text-sm leading-relaxed text-white/80">
            Sign in to access your consultations, review prescriptions, track order deliveries, or chat with verified campus pharmacists.
          </p>
        </div>

        <p className="relative z-10 text-xs text-white/60">
          &copy; {new Date().getFullYear()} SafeMeds. All rights reserved.
        </p>
      </aside>

      <main className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <span className="flex items-center gap-2.5 text-ink">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
                <ShieldPlus className="h-5 w-5 text-brand-ink" aria-hidden />
              </span>
              <span className="text-lg font-bold tracking-tight">SafeMeds</span>
            </span>
            <ThemeToggle variant="icon" size="md" />
          </div>

          <div className="rounded-card bg-surface p-6 shadow-card sm:p-8">
            <header className="mb-6">
              <h1 className="text-2xl font-normal text-ink">Welcome back</h1>
              <p className="mt-1 text-sm text-ink-muted">
                No account?{" "}
                <button
                  onClick={() => router.push("/signup")}
                  className="cursor-pointer font-semibold text-brand hover:text-brand-hover transition-colors"
                >
                  Create one
                </button>
              </p>
            </header>

            {/* Role selector — segmented control, same pill language as the
                filter chips elsewhere in the app. */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-ink">Sign in as</p>
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
                        resetForm();
                      }}
                      className={cn(
                        "h-11 flex-1 cursor-pointer rounded-xl text-sm font-medium",
                        "transition-colors duration-200",
                        selected
                          ? "bg-brand text-brand-ink shadow-brand"
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
              {userType === "PHARMACY" ? (
                <TextField
                  label="Email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="pharmacist@example.com"
                  value={formData.email}
                  error={errors.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              ) : (
                <TextField
                  label="Username"
                  required
                  autoComplete="username"
                  placeholder="your_username"
                  value={formData.username}
                  error={errors.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                />
              )}

              {userType === "PHARMACY" && (
                <TextField
                  label="License number"
                  required
                  autoComplete="off"
                  placeholder="e.g. RPh-123456"
                  hint="Must match the license number on your account."
                  value={formData.licenseNumber}
                  error={errors.licenseNumber}
                  onChange={(e) =>
                    handleInputChange("licenseNumber", e.target.value)
                  }
                />
              )}

              <TextField
                label="Password"
                required
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
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

              {errors.general && (
                <p
                  role="alert"
                  className="rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger"
                >
                  {errors.general}
                </p>
              )}

              <Button type="submit" size="lg" fullWidth loading={isLoading}>
                {isLoading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <dl className="mt-6 space-y-2 border-t border-line pt-5 text-xs text-ink-muted">
              {ROLES.map((role) => (
                <div key={role.value} className="flex gap-1.5">
                  <dt className="font-semibold text-ink">{role.label}</dt>
                  <dd>— {role.needs}</dd>
                </div>
              ))}
            </dl>
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
