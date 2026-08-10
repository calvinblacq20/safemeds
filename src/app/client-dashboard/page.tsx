/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ClipboardList,
  MessageCircle,
  Package,
  Pill,
  Search,
  Stethoscope,
  Truck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import NotificationBell from "@/components/Common/NotificationBell";
import ThemeToggle from "@/components/Common/ThemeToggle";
import {
  Avatar,
  Button,
  Card,
  CardSkeleton,
  CategoryTile,
  EmptyState,
  IconButton,
  SectionHeader,
  StatusBadge,
} from "@/components/ui";
import { getConsultations, type Consultation } from "@/services/consultationService";
import { getOrders, type Order } from "@/services/orderService";

const CATEGORIES = [
  { label: "Consult", icon: ClipboardList, href: "/consult" },
  { label: "Find meds", icon: Pill, href: "/search" },
  { label: "Orders", icon: Package, href: "/orders" },
  { label: "Delivery", icon: Truck, href: "/track" },
  { label: "Chat", icon: MessageCircle, href: "/chat" },
];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

export default function ClientDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [consultationRes, orderRes] = await Promise.all([
        getConsultations({ limit: 5 }),
        getOrders({ limit: 3 }),
      ]);
      if (cancelled) return;
      setConsultations(consultationRes.consultations);
      setOrders(orderRes.orders);
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const active = consultations.find(
    (c) => c.status === "PENDING" || c.status === "IN_PROGRESS",
  );
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const header = (
    <header className="flex items-start gap-3 pt-7 pb-6">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-normal text-ink truncate">Hello {firstName}</h1>
        <p className="text-sm text-ink-muted mt-0.5">{greeting()}. How are you today?</p>
      </div>
      <IconButton
        href="/search"
        label="Search medications"
        icon={<Search className="h-5 w-5" aria-hidden />}
      />
      <NotificationBell />
      <ThemeToggle variant="icon" size="md" />
    </header>
  );

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <AppShell activeId="home" role="CLIENT" header={header}>
        {/* Category rail — scrolls on phones, settles into a row on desktop. */}
        <nav aria-label="Shortcuts" className="rail gap-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((category) => (
            <CategoryTile key={category.label} {...category} />
          ))}
        </nav>

        {/* Featured card: the live consultation if there is one, otherwise the
            action that starts one. Same slot either way, so the page doesn't
            reflow depending on account state. */}
        <section className="mt-8">
          {loading ? (
            <div className="h-44 rounded-card bg-surface-sunken animate-pulse" />
          ) : active ? (
            <Card tone="brand" className="relative">
              {/* Corner pill + circular action mirror the reference card's
                  rating badge and favourite button. */}
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-ink px-3 py-1.5 text-xs font-semibold text-brand">
                  <Stethoscope className="h-3.5 w-3.5" aria-hidden />
                  Active
                </span>
                <IconButton
                  tone="onBrand"
                  href={`/chat/${active.id}`}
                  label="Open this conversation"
                  icon={<ArrowUpRight className="h-5 w-5" aria-hidden />}
                />
              </div>

              <p className="mt-5 text-sm capitalize text-brand-ink/75">{active.type}</p>
              <h2 className="text-2xl font-normal leading-tight">
                {active.assignedPharmacist
                  ? `${active.assignedPharmacist.firstName} ${active.assignedPharmacist.lastName}`
                  : "Awaiting a pharmacist"}
              </h2>

              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-brand-ink/15 px-4 py-3">
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-semibold capitalize">
                    {active.status.replace(/_/g, " ").toLowerCase()}
                  </p>
                  <p className="text-xs text-brand-ink/75">
                    Opened {formatDate(active.createdAt)} ·{" "}
                    {active._count?.messages ?? 0} messages
                  </p>
                </div>
                <Link
                  href={`/chat/${active.id}`}
                  className="inline-flex h-10 shrink-0 items-center rounded-xl bg-brand-ink px-4 text-sm font-semibold text-brand transition-colors duration-200 hover:opacity-90"
                >
                  Open chat
                </Link>
              </div>
            </Card>
          ) : (
            <div className="relative rounded-card overflow-hidden shadow-xl border border-line h-60 sm:h-64 flex flex-col justify-end p-6 text-white bg-slate-900 group">
              <img
                src="/images/pexels-klaus-nielsen-6303650.jpg"
                alt="Pharmacist consultation"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
              <div className="relative z-10 max-w-md">
                <h2 className="text-2xl font-normal text-white">Talk to a Pharmacist</h2>
                <p className="mt-1 text-xs sm:text-sm text-white/80 leading-relaxed">
                  Licensed pharmacists answer medication questions, review prescriptions & flag interactions within minutes.
                </p>
                <Link
                  href="/consult"
                  className="mt-4 inline-flex h-11 items-center rounded-2xl bg-brand px-6 text-sm font-semibold text-brand-ink hover:bg-brand-hover transition-colors shadow-md"
                >
                  Start a Consultation
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="mt-8">
          <SectionHeader title="Your consultations" href="/consult" action="New" />
          {loading ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : consultations.length === 0 ? (
            <Card padded={false}>
              <EmptyState
                icon={ClipboardList}
                title="No consultations yet"
                description="Ask a licensed pharmacist about dosages, side effects or interactions."
                action={
                  <Button onClick={() => router.push("/consult")}>
                    Start a consultation
                  </Button>
                }
              />
            </Card>
          ) : (
            <ul className="space-y-3">
              {consultations.map((consultation) => (
                <li key={consultation.id}>
                  <Link href={`/chat/${consultation.id}`} className="block">
                    <Card interactive className="flex items-center gap-4">
                      <Avatar
                        name={
                          consultation.assignedPharmacist
                            ? `${consultation.assignedPharmacist.firstName} ${consultation.assignedPharmacist.lastName}`
                            : "SafeMeds"
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-ink capitalize truncate">
                          {consultation.type}
                        </p>
                        <p className="text-sm text-ink-muted truncate">
                          {consultation.assignedPharmacist
                            ? `${consultation.assignedPharmacist.firstName} ${consultation.assignedPharmacist.lastName}`
                            : "Unassigned"}{" "}
                          · {formatDate(consultation.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={consultation.status} />
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {orders.length > 0 && (
          <section className="mt-8">
            <SectionHeader title="Recent orders" href="/orders" />
            <ul className="space-y-3">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link href={`/orders/${order.id}`} className="block">
                    <Card interactive className="flex items-center gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                        <Package className="h-5 w-5 text-brand" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-ink truncate">
                          {order.prescription?.medication.name ??
                            `Order ${order.orderNumber}`}
                        </p>
                        <p className="text-sm text-ink-muted truncate">
                          {order.orderNumber} · {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
