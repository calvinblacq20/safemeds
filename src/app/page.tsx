/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  GraduationCap,
  Lock,
  MessageCircle,
  Menu,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Truck,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/Common/Footer";
import ThemeToggle from "@/components/Common/ThemeToggle";

const NAV = [
  { label: "About", href: "/about" },
  { label: "Consult", href: "/consult" },
  { label: "Track", href: "/track" },
  { label: "Contact", href: "/contact" },
];

/** The three audiences. Each gets one flat pastel fill, as in the reference —
 *  the colour is the whole decoration, so the cards carry no shadow. */
const ROLES = [
  {
    icon: GraduationCap,
    title: "Students",
    description:
      "Get anonymous medical consultations and advice from licensed pharmacists.",
    fill: "bg-accent-cyan",
  },
  {
    icon: Stethoscope,
    title: "Pharmacists",
    description:
      "Provide professional medical advice and consultations to students.",
    fill: "bg-accent-coral",
  },
  {
    icon: ShieldCheck,
    title: "Administrators",
    description:
      "Manage the platform and oversee all operations and user activities.",
    fill: "bg-accent-butter",
  },
];

const FEATURES = [
  {
    icon: Lock,
    title: "Privacy first",
    description:
      "All consultations are completely anonymous and encrypted for maximum privacy.",
  },
  {
    icon: ShieldCheck,
    title: "Licensed professionals",
    description:
      "Only verified, licensed pharmacists can provide medical consultations.",
  },
  {
    icon: Smartphone,
    title: "Easy access",
    description:
      "Simple, intuitive interface accessible from any device, anywhere.",
  },
  {
    icon: Truck,
    title: "Delivery tracking",
    description:
      "Real-time GPS tracking for prescription deliveries straight to your location.",
  },
  {
    icon: MessageCircle,
    title: "Live chat",
    description:
      "Real-time messaging with pharmacists for immediate medical advice.",
  },
  {
    icon: BarChart3,
    title: "Health analytics",
    description:
      "Track your consultations, medications, and health trends over time.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "SafeMeds helped me get a prescription refill without leaving my dorm. The pharmacist was professional and the delivery was fast.",
    role: "Student, KNUST",
  },
  {
    quote:
      "I was nervous about asking for help, but the anonymous consultation made it easy. Highly recommend for anyone on campus.",
    role: "Student, University of Ghana",
  },
  {
    quote:
      "As a pharmacist, SafeMeds lets me reach students who might otherwise avoid seeking care. The platform is intuitive and secure.",
    role: "Licensed Pharmacist",
  },
  {
    quote:
      "Ordering a refill between classes used to mean skipping a lecture. Now I do it from the library and it shows up at my hall.",
    role: "Student, Legon",
  },
  {
    quote:
      "The chat felt like texting a friend who happens to be a pharmacist. No judgment, just clear answers.",
    role: "Student, Ashesi University",
  },
  {
    quote:
      "License verification took minutes and the dashboard makes triaging consultations painless during a full shift.",
    role: "Licensed Pharmacist",
  },
  {
    quote:
      "Delivery tracking meant I wasn't stuck guessing when my order would show up. It arrived exactly on time.",
    role: "Student, KNUST",
  },
  {
    quote:
      "As someone new to the city, not knowing a local pharmacy wasn't a barrier. SafeMeds connected me in minutes.",
    role: "Student, University of Ghana",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const dashboardPath =
        user.role === "CLIENT"
          ? "/client-dashboard"
          : user.role === "PHARMACY"
            ? "/pharmacy-dashboard"
            : user.role === "ADMIN"
              ? "/admin"
              : "/auth";
      router.push(dashboardPath);
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-6 text-center">
        <div>
          <div
            className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-line border-t-ink"
            role="status"
            aria-label="Loading"
          />
          <h2 className="text-xl text-ink">Loading SafeMeds…</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Preparing your healthcare experience
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-6 text-center">
        <div>
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-ok">
            <CheckCircle2 className="h-6 w-6 text-white" aria-hidden />
          </div>
          <h2 className="text-xl text-ink">
            Welcome back, {user.name || user.username}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Redirecting to your {user.role.toLowerCase()} dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav: a white pill floating on the cream canvas. */}
      <div className="px-4 pt-5 sm:px-6">
        <nav className="mx-auto flex max-w-5xl items-center gap-3 rounded-full bg-surface px-4 py-2.5 shadow-card sm:px-6">
          <Link href="/" className="text-lg tracking-tight text-ink">
            SafeMeds
          </Link>

          <div className="ml-6 hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle variant="icon" size="md" />
            <Link
              href="/auth"
              className="hidden h-10 items-center rounded-full px-4 text-sm text-ink transition-colors hover:bg-surface-muted sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="hidden h-10 items-center rounded-full bg-brand px-5 text-sm text-brand-ink transition-colors hover:bg-brand-hover sm:inline-flex"
            >
              Get started
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-muted md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="mx-auto mt-2 max-w-5xl rounded-card bg-surface p-3 shadow-card md:hidden">
            {[...NAV, { label: "Sign in", href: "/auth" }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm text-ink transition-colors hover:bg-surface-muted"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1 flex h-12 items-center justify-center rounded-full bg-brand text-sm text-brand-ink"
            >
              Get started
            </Link>
          </div>
        )}
      </div>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs text-ink-muted shadow-card">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
              Anonymous consultations, licensed pharmacists
            </span>

            <h1 className="mt-7 text-5xl text-ink sm:text-6xl md:text-7xl">
              Healthcare, anonymized.
              <br />
              For students.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              Secure, anonymous healthcare consultations for students. Get
              professional medical advice from licensed pharmacists in a safe,
              confidential environment — all from your phone.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm text-brand-ink transition-colors hover:bg-brand-hover shadow-md"
              >
                Create free account
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/consult"
                className="inline-flex h-12 items-center justify-center rounded-full border border-ink/15 px-7 text-sm text-ink transition-colors hover:bg-surface"
              >
                Start anonymous consult
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual Showcase */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-14 relative mx-auto max-w-5xl"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-line bg-surface">
              <img
                src="/images/pexels-ninthgrid-2149521550-30677591.jpg"
                alt="Pharmacist consultation with student"
                className="w-full h-[380px] sm:h-[480px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Floating Badges */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-left">
                <div className="backdrop-blur-md bg-white/20 dark:bg-black/40 p-5 rounded-2xl border border-white/20 text-white max-w-md">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-300 mb-1">
                    <ShieldCheck className="h-4 w-4" /> 100% Anonymous & Confidential
                  </div>
                  <h3 className="text-xl font-medium text-white">Direct Access to Verified Pharmacists</h3>
                  <p className="text-sm text-white/80 mt-1">Get prescriptions, advice, and swift campus delivery without stigma.</p>
                </div>

                <div className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 p-4 rounded-2xl shadow-lg border border-line text-ink">
                  <div className="text-xs">
                    <p className="font-semibold text-ink">Always Active</p>
                    <p className="text-ink-muted">Campus-wide Telepharmacy</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Clinical Excellence Showcase */}
        <section className="bg-surface-muted py-16 border-y border-line">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div {...fadeUp} className="space-y-5">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand">
                  Clinical Standards & Safety
                </span>
                <h2 className="text-3xl sm:text-4xl text-ink font-normal leading-tight">
                  Hospital-grade care in your pocket
                </h2>
                <p className="text-ink-muted leading-relaxed">
                  Every consultation is led by licensed pharmacists adhering to strict clinical protocols. From routine symptom checks to confidential medication management, SafeMeds brings professional medical oversight directly to students.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-surface border border-line">
                    <p className="text-2xl font-bold text-brand">100%</p>
                    <p className="text-xs text-ink-muted mt-1">Verified Licensed Pharmacists</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface border border-line">
                    <p className="text-2xl font-bold text-brand">&lt;15m</p>
                    <p className="text-xs text-ink-muted mt-1">Average Response Time</p>
                  </div>
                </div>
              </motion.div>

              <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="relative group">
                <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl border border-line">
                  <img
                    src="/images/pexels-arthur-uzoagba-3061628-30348333.jpg"
                    alt="Clinical Medical Team"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs uppercase tracking-widest text-teal-300 font-semibold">Specialized Care</p>
                    <p className="text-sm font-medium">Equipped for complex medical consultations</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <motion.div {...fadeUp} className="max-w-xl">
            <p className="text-sm text-ink-muted">Three roles, one platform</p>
            <h2 className="mt-2 text-4xl text-ink sm:text-5xl">
              Built for how you use it
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((role, index) => (
              <motion.article
                key={role.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`rounded-card ${role.fill} p-7 text-black overflow-hidden relative group shadow-sm hover:shadow-md transition-all`}
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/10">
                  <role.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-2xl">{role.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/70">
                  {role.description}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Visual Gallery Grid */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl text-ink">Complete Care Experience</h2>
            <p className="text-ink-muted mt-2">See how SafeMeds transforms campus healthcare from consultation to prescription delivery.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="rounded-3xl overflow-hidden border border-line bg-surface shadow-card group">
              <div className="h-52 overflow-hidden relative">
                <img src="/images/pexels-klaus-nielsen-6303650.jpg" alt="Digital Consultation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-ink">Personalized Guidance</h3>
                <p className="text-sm text-ink-muted mt-1">Discuss health concerns confidentially with digital case history access.</p>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="rounded-3xl overflow-hidden border border-line bg-surface shadow-card group">
              <div className="h-52 overflow-hidden relative">
                <img src="/images/pexels-tima-miroshnichenko-5452224.jpg" alt="Pharmacist Teamwork" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-ink">Expert Review</h3>
                <p className="text-sm text-ink-muted mt-1">Cross-checking prescriptions for interactions and dosage accuracy.</p>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="rounded-3xl overflow-hidden border border-line bg-surface shadow-card group">
              <div className="h-52 overflow-hidden relative">
                <img src="/images/pexels-thirdman-5327862.jpg" alt="Health Diagnostics" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-ink">Vital Tracking</h3>
                <p className="text-sm text-ink-muted mt-1">Monitor symptom progression and vital signs during recovery.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <motion.h2 {...fadeUp} className="max-w-xl text-4xl text-ink sm:text-5xl">
            Everything you need
          </motion.h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <motion.article
                key={feature.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="rounded-card bg-surface p-7 shadow-card border border-line/50 hover:border-brand/40 transition-colors"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-ink">
                  <feature.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Testimonials — the marquee keeps its seamless -50% loop. */}
        <section className="py-20">
          <motion.h2
            {...fadeUp}
            className="mx-auto max-w-5xl px-4 text-4xl text-ink sm:px-6 sm:text-5xl"
          >
            Trusted by students
          </motion.h2>

          <div
            className="mt-12 overflow-hidden"
            style={{ ["--marquee-duration" as string]: "48s" }}
          >
            <div className="marquee-track flex w-max gap-5">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
                <figure
                  key={index}
                  aria-hidden={index >= TESTIMONIALS.length}
                  className="w-[320px] shrink-0 rounded-card bg-surface p-7 shadow-card"
                >
                  <blockquote className="text-sm leading-relaxed text-ink">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-5 text-xs text-ink-muted">
                    {item.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA — the reference's flat black block. */}
        <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
          <motion.div
            {...fadeUp}
            className="rounded-panel bg-brand px-6 py-16 text-center text-brand-ink sm:px-12"
          >
            <h2 className="mx-auto max-w-2xl text-4xl sm:text-5xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-ink/70">
              Join students who trust SafeMeds for their healthcare needs. Get
              professional medical advice in a safe, anonymous environment.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand-ink px-7 text-sm text-brand transition-opacity hover:opacity-90"
              >
                Create your account
              </Link>
              <Link
                href="/auth"
                className="inline-flex h-12 items-center justify-center rounded-full border border-brand-ink/30 px-7 text-sm text-brand-ink transition-colors hover:bg-brand-ink/10"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
