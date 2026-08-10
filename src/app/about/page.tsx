/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BadgeCheck, Globe, Lock } from "lucide-react";
import Footer from "@/components/Common/Footer";

export default function AboutPage() {
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="mb-4 text-4xl text-ink md:text-5xl">
            About SafeMeds
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-ink-muted">
            SafeMeds is a secure telepharmacy platform built for university
            students in Ghana. We connect students with licensed pharmacists for
            anonymous medical consultations, prescription management, and
            medication delivery.
          </p>
        </motion.div>

        {/* Hero Image Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl border border-line h-56 sm:h-80 md:h-96"
        >
          <img
            src="/images/pexels-artempodrez-5726696.jpg"
            alt="Pharmaceutical research and quality laboratory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white max-w-xl">
            <h2 className="text-xl sm:text-3xl font-medium text-white">Dedicated to student wellness & security</h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1">Bridging campus healthcare gaps with state-of-the-art digital infrastructure.</p>
          </div>
        </motion.div>

        {/* Mission & Story with Split Images */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-card bg-surface overflow-hidden shadow-card border border-line flex flex-col"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src="/images/pexels-ninthgrid-2149521550-30677591.jpg"
                alt="Student consultation with doctor"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
            </div>
            <div className="p-7 flex-1">
              <h2 className="mb-3 text-2xl text-ink">
                Our Mission
              </h2>
              <p className="leading-relaxed text-ink-muted">
                To make quality healthcare accessible to every student — privately,
                affordably, and without judgment. We believe that no student should
                skip medical care because of cost, inconvenience, or fear of
                stigma.
              </p>
            </div>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-card bg-surface overflow-hidden shadow-card border border-line flex flex-col"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src="/images/pexels-tima-miroshnichenko-5452224.jpg"
                alt="Pharmacist team reviewing patient cases"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
            </div>
            <div className="p-7 flex-1">
              <h2 className="mb-3 text-2xl text-ink">
                Our Story
              </h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                SafeMeds was born from a simple observation: university students
                often avoid seeking medical help due to long queues, limited campus
                clinic hours, or privacy concerns.
              </p>
              <p className="leading-relaxed text-ink-muted">
                We built SafeMeds to bridge that gap — combining anonymous
                text-based consultations, e-prescriptions, and on-demand delivery
                into one seamless platform.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: Lock,
              title: "Privacy",
              description: "Every consultation is anonymous. No personal health data is ever linked to your identity without your explicit consent."
            },
            {
              icon: BadgeCheck,
              title: "Trust",
              description: "Every pharmacist on the platform is license-verified. We enforce strict professional standards."
            },
            {
              icon: Globe,
              title: "Access",
              description: "Designed for students. Mobile-first, works on any device, available 24/7 wherever you are."
            }
          ].map((value, i) => (
            <div
              key={i}
              className="rounded-card bg-surface p-6 shadow-card border border-line hover:border-brand/40 transition-colors"
            >
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-ink">
                <value.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mb-2 text-lg text-ink">
                {value.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                {value.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center bg-brand/10 rounded-3xl p-10 border border-brand/20"
        >
          <h3 className="text-2xl text-ink font-medium mb-3">Ready to experience private campus care?</h3>
          <p className="text-ink-muted text-sm max-w-md mx-auto mb-6">Create a free account or start an instant anonymous consultation in seconds.</p>
          <Link
            href="/signup"
            className="inline-flex h-12 items-center rounded-full bg-brand px-8 text-sm text-brand-ink transition-colors hover:bg-brand-hover shadow-md font-semibold"
          >
            Join SafeMeds Now
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
