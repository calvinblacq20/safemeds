/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Baby,
  Brain,
  CheckCircle2,
  Heart,
  Pill,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/layout/PageHeader";
import {
  Button,
  Card,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  createAnonymousConsultation,
  createConsultation,
} from "@/services/consultationService";

/** Values are persisted and matched elsewhere in the app — labels can change,
 *  these strings can't. */
const TYPES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "general", label: "General health", icon: Stethoscope },
  { value: "mental health", label: "Mental health", icon: Brain },
  { value: "pain relief", label: "Pain relief", icon: Pill },
  { value: "pregnancy", label: "Pregnancy", icon: Baby },
  { value: "sexual health", label: "Sexual health", icon: Heart },
];

const STEPS = ["Concern", "Details", "About you"];

export default function ConsultPage() {
  const router = useRouter();
  // Deliberately not useAuth(): this page is reachable anonymously, and that
  // hook redirects signed-out visitors to /auth.
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ sessionId?: string; id?: string } | null>(
    null,
  );
  const [anonymous, setAnonymous] = useState(false);
  const [form, setForm] = useState({
    type: "",
    description: "",
    symptoms: "",
    medications: "",
    allergies: "",
    age: "",
    gender: "",
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Anonymous whenever there's no session, or when a signed-in user opts in.
  const asAnonymous = !isAuthenticated || anonymous;
  const canAdvance = step === 0 ? Boolean(form.type) : true;
  const canSubmit = Boolean(form.type && form.description.trim());

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError("Pick a concern and describe it before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      age: form.age ? parseInt(form.age, 10) : undefined,
      isAnonymous: asAnonymous,
    };

    try {
      if (asAnonymous) {
        const response = await createAnonymousConsultation(payload);
        if (!response) throw new Error("no response");
        setResult({ sessionId: response.sessionId, id: response.consultation.id });
      } else {
        const consultation = await createConsultation(payload);
        if (!consultation) throw new Error("no response");
        setResult({ id: consultation.id });
      }
    } catch {
      setError(
        "We couldn't submit your consultation. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 pb-16">
          <PageHeader title="Consultation submitted" />
          <Card className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-ok-soft">
              <CheckCircle2 className="h-8 w-8 text-ok" aria-hidden />
            </div>
            <h2 className="text-xl font-normal text-ink">You&apos;re in the queue</h2>
            <p className="mt-2 text-sm text-ink-muted">
              A licensed pharmacist reviews your inquiry and usually replies
              within 24 hours.
            </p>

            {result.sessionId && (
              <div className="mt-6 rounded-2xl bg-surface-muted p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Your session ID
                </p>
                <code className="mt-2 block break-all font-mono text-sm text-ink">
                  {result.sessionId}
                </code>
                <p className="mt-2 text-xs text-ink-muted">
                  Save this — it&apos;s the only way to reopen an anonymous
                  consultation.
                </p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Button
                fullWidth
                size="lg"
                onClick={() =>
                  router.push(
                    result.sessionId
                      ? `/track?sessionId=${result.sessionId}`
                      : `/chat/${result.id}`,
                  )
                }
              >
                {result.sessionId ? "Track my consultation" : "Open the conversation"}
              </Button>
              <Button
                fullWidth
                size="lg"
                variant="secondary"
                onClick={() => router.push(isAuthenticated ? "/client-dashboard" : "/")}
              >
                Back to home
              </Button>
            </div>
          </Card>

          <p className="mt-6 px-2 text-center text-xs text-ink-muted">
            If this is an emergency, contact emergency services immediately
            rather than waiting for a reply.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 pb-32">
        <PageHeader
          title="New consultation"
          subtitle={`Step ${step + 1} of ${STEPS.length} · ${STEPS[step]}`}
          back
        />

        {/* Visual Banner */}
        <div className="relative mb-6 rounded-3xl overflow-hidden shadow-lg border border-line h-44 sm:h-52">
          <img
            src="/images/pexels-klaus-nielsen-6303650.jpg"
            alt="Doctor consultation"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-lg font-medium text-white">Speak with a Licensed Pharmacist</h3>
            <p className="text-xs text-white/80">Get expert advice, prescriptions, and health guidance with zero judgment.</p>
          </div>
        </div>

        {/* Progress. The text lives in the header above, so the bars are
            decorative and hidden from screen readers. */}
        <div aria-hidden className="mb-6 flex gap-2">
          {STEPS.map((label, index) => (
            <span
              key={label}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-200",
                index <= step ? "bg-brand" : "bg-surface-sunken",
              )}
            />
          ))}
        </div>

        {step === 0 && (
          <section>
            <h2 className="mb-1 text-lg font-semibold text-ink">
              What do you need help with?
            </h2>
            <p className="mb-5 text-sm text-ink-muted">
              This routes your question to the right pharmacist.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {TYPES.map(({ value, label, icon: Icon }) => {
                const selected = form.type === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => set("type", value)}
                    className={cn(
                      "flex cursor-pointer flex-col items-start gap-3 rounded-card p-4 text-left",
                      "border-2 transition-colors duration-200",
                      selected
                        ? "border-brand bg-brand-soft"
                        : "border-transparent bg-surface shadow-card hover:border-line",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full",
                        selected ? "bg-brand text-brand-ink" : "bg-brand-soft text-brand",
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        selected ? "text-brand" : "text-ink",
                      )}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-5">
            <TextAreaField
              label="Describe your concern"
              required
              rows={5}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What's going on, when it started, and what you've already tried."
            />
            <TextAreaField
              label="Current symptoms"
              rows={3}
              value={form.symptoms}
              onChange={(e) => set("symptoms", e.target.value)}
              placeholder="Anything you're feeling right now."
            />
          </section>
        )}

        {step === 2 && (
          <section className="space-y-5">
            <TextAreaField
              label="Medications you're taking"
              rows={3}
              hint="Including anything over the counter — this is how interactions get caught."
              value={form.medications}
              onChange={(e) => set("medications", e.target.value)}
            />
            <TextAreaField
              label="Known allergies"
              rows={2}
              value={form.allergies}
              onChange={(e) => set("allergies", e.target.value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Age"
                type="number"
                min={13}
                max={120}
                inputMode="numeric"
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
              />
              <SelectField
                label="Gender"
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
              >
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </SelectField>
            </div>

            {isAuthenticated && (
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-surface p-4 shadow-card">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--brand)]"
                />
                <span>
                  <span className="block text-sm font-medium text-ink">
                    Submit anonymously
                  </span>
                  <span className="block text-xs text-ink-muted">
                    Detached from your account. You&apos;ll get a session ID
                    instead, and it won&apos;t appear in your history.
                  </span>
                </span>
              </label>
            )}

            <Card className="bg-brand-soft shadow-none">
              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-brand" aria-hidden />
                <div className="text-sm">
                  <p className="font-semibold text-ink">Privacy</p>
                  <p className="mt-1 text-ink-muted">
                    Only licensed pharmacists see this. For emergencies, contact
                    emergency services rather than waiting for a reply.
                  </p>
                </div>
              </div>
            </Card>
          </section>
        )}

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            {error}
          </p>
        )}
      </div>

      {/* Sticky action bar — the primary action stays under the thumb instead
          of at the bottom of a long form. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-2xl gap-3 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
          {step > 0 && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setStep((s) => s - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button
              size="lg"
              disabled={!canAdvance}
              onClick={() => setStep((s) => s + 1)}
              className="flex-[2]"
            >
              Next
            </Button>
          ) : (
            <Button
              size="lg"
              loading={submitting}
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="flex-[2]"
            >
              {submitting ? "Submitting…" : "Submit consultation"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
