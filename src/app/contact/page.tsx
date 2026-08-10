/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Mail, MapPin, Phone } from "lucide-react";
import Footer from "@/components/Common/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-xl tracking-tight text-ink">
            SafeMeds
          </Link>
          <Link
            href="/"
            className="text-sm text-ink-muted transition-colors hover:text-ink"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="mb-3 text-4xl text-ink md:text-5xl">
            Contact Us
          </h1>
          <p className="text-lg text-ink-muted">
            Have a question, concern, or feedback? We&apos;d love to hear from you.
          </p>
        </motion.div>

        {/* Visual Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mb-10 rounded-3xl overflow-hidden shadow-xl border border-line h-48 sm:h-60"
        >
          <img
            src="/images/pexels-ninthgrid-2149521550-30677591.jpg"
            alt="Doctor consultation and patient support"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <h2 className="text-xl sm:text-2xl font-medium text-white">We&apos;re here for your health & peace of mind</h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1">Our support team and pharmacists are ready to answer your inquiries.</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="rounded-card bg-surface p-6 shadow-card">
              <h2 className="mb-4 text-lg text-ink">
                Get in touch
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted" aria-hidden />
                  <div>
                    <p className="font-medium text-ink">Email</p>
                    <p className="text-sm text-ink-muted">support@safemeds.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted" aria-hidden />
                  <div>
                    <p className="font-medium text-ink">Phone</p>
                    <p className="text-sm text-ink-muted">+233 50 123 4567</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted" aria-hidden />
                  <div>
                    <p className="font-medium text-ink">Location</p>
                    <p className="text-sm text-ink-muted">KNUST, Kumasi, Ghana</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-card bg-surface p-6 shadow-card">
              <h2 className="mb-2 text-lg text-ink">
                Need help now?
              </h2>
              <p className="mb-4 text-sm text-ink-muted">
                For urgent medical concerns, please visit your nearest health
                facility or call emergency services. SafeMeds is not a
                replacement for emergency care.
              </p>
              <Link
                href="/consult"
                className="text-sm font-semibold text-brand hover:underline"
              >
                Start an anonymous consultation →
              </Link>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {sent ? (
              <div className="rounded-card bg-surface p-8 text-center shadow-card">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ok-soft"><Check className="h-6 w-6 text-ok" aria-hidden /></div>
                <h2 className="mb-2 text-xl text-ink">
                  Message sent!
                </h2>
                <p className="mb-6 text-ink-muted">
                  We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 rounded-card bg-surface p-8 shadow-card">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-12 px-4 rounded-2xl border border-line bg-surface-muted text-ink placeholder:text-ink-faint transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full h-12 px-4 rounded-2xl border border-line bg-surface-muted text-ink placeholder:text-ink-faint transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full h-12 px-4 rounded-2xl border border-line bg-surface-muted text-ink placeholder:text-ink-faint transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 rounded-2xl border border-line bg-surface-muted text-ink placeholder:text-ink-faint transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none py-3"
                  />
                </div>
                {error && (
                  <p className="text-sm text-danger">{error}</p>
                )}
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand text-sm text-brand-ink transition-colors hover:bg-brand-hover"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
