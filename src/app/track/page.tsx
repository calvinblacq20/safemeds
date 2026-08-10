"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Navigation from "@/components/Common/Navigation";
import { getAnonymousConsultationStatus } from "@/services/consultationService";
import { Button, Card, StatusBadge, TextField } from "@/components/ui";

interface TrackedMessage {
  content: string;
  createdAt: string;
  isFromPharmacist: boolean;
}

interface TrackedPrescription {
  dosage: string;
  duration: string;
  frequency: string;
  quantity: number;
  status: string;
  instructions?: string;
  medication: { name: string };
}

interface TrackedConsultation {
  id: string;
  type: string;
  status: string;
  description?: string;
  symptoms?: string;
  allergies?: string;
  medications?: string;
  anonymousId?: string;
  createdAt: string;
  updatedAt: string;
  messages: TrackedMessage[];
  prescriptions: TrackedPrescription[];
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Renders a labelled block only when the consultation actually carries it,
 *  so absent optional fields don't leave empty headings behind. */
function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-ink">{value}</dd>
    </div>
  );
}

function TrackConsultationContent() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState(
    searchParams.get("sessionId") || "",
  );
  const [consultation, setConsultation] = useState<TrackedConsultation | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = useCallback(async () => {
    if (!sessionId.trim()) {
      setError("Please enter a session ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getAnonymousConsultationStatus(sessionId);
      if (response) {
        setConsultation(response.consultation as TrackedConsultation);
      } else {
        setError("Session not found or has expired");
      }
    } catch (err) {
      console.error("Error tracking consultation:", err);
      setError("Failed to track consultation. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) handleTrack();
    // Runs on mount when a sessionId arrives via the query string.
  }, [sessionId, handleTrack]);

  return (
    <div className="min-h-screen bg-bg">
      <Navigation title="Track Consultation" userRole="client" />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* No heading here: Navigation already renders the page title as the
            document's h1, and a second one would duplicate it. */}
        <p className="max-w-xl text-ink-muted">
          Enter your session ID to check the status of your anonymous
          consultation.
        </p>

        <Card className="mt-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <TextField
              label="Session ID"
              wrapperClassName="flex-1"
              placeholder="Enter your session ID…"
              value={sessionId}
              error={error}
              onChange={(e) => {
                setSessionId(e.target.value);
                if (error) setError("");
              }}
            />
            <Button
              type="submit"
              loading={loading}
              className="sm:mb-0"
              icon={<Search className="h-4 w-4" aria-hidden />}
            >
              {loading ? "Checking…" : "Track"}
            </Button>
          </form>
        </Card>

        {consultation && (
          <section className="mt-6 space-y-5">
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm capitalize text-ink-muted">
                    {consultation.type.replace(/_/g, " ").toLowerCase()}
                  </p>
                  <h2 className="mt-1 text-2xl text-ink">
                    Consultation
                    {consultation.anonymousId
                      ? ` · ${consultation.anonymousId}`
                      : ""}
                  </h2>
                </div>
                <StatusBadge status={consultation.status} />
              </div>

              <dl className="mt-6 space-y-4">
                <Detail label="Description" value={consultation.description} />
                <Detail label="Symptoms" value={consultation.symptoms} />
                <Detail label="Allergies" value={consultation.allergies} />
                <Detail
                  label="Current medications"
                  value={consultation.medications}
                />
              </dl>

              <p className="mt-6 border-t border-line pt-4 text-xs text-ink-muted">
                Opened {formatDate(consultation.createdAt)} · Last updated{" "}
                {formatDate(consultation.updatedAt)}
              </p>
            </Card>

            <Card>
              <h3 className="text-xl text-ink">Messages</h3>
              {consultation.messages.length === 0 ? (
                <p className="mt-3 text-sm text-ink-muted">
                  No messages yet. A pharmacist will reply here.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {consultation.messages.map((message, index) => (
                    <li
                      key={index}
                      className={
                        message.isFromPharmacist
                          ? "rounded-2xl bg-surface-muted p-4"
                          : "rounded-2xl bg-brand p-4 text-brand-ink"
                      }
                    >
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <p
                        className={`mt-2 text-xs ${
                          message.isFromPharmacist
                            ? "text-ink-muted"
                            : "text-brand-ink/70"
                        }`}
                      >
                        {message.isFromPharmacist ? "Pharmacist" : "You"} ·{" "}
                        {formatDate(message.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <h3 className="text-xl text-ink">Prescriptions</h3>
              {consultation.prescriptions.length === 0 ? (
                <p className="mt-3 text-sm text-ink-muted">
                  No prescriptions have been issued for this consultation.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {consultation.prescriptions.map((prescription, index) => (
                    <li
                      key={index}
                      className="rounded-2xl bg-surface-muted p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="text-ink">
                          {prescription.medication.name}
                        </p>
                        <StatusBadge status={prescription.status} />
                      </div>
                      <p className="mt-1 text-sm text-ink-muted">
                        {prescription.dosage} · {prescription.frequency} ·{" "}
                        {prescription.duration} · Qty {prescription.quantity}
                      </p>
                      {prescription.instructions && (
                        <p className="mt-2 text-sm leading-relaxed text-ink">
                          {prescription.instructions}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}

export default function TrackConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg px-4 py-10">
          <div className="mx-auto h-64 max-w-3xl animate-pulse rounded-card bg-surface-sunken" />
        </div>
      }
    >
      <TrackConsultationContent />
    </Suspense>
  );
}
