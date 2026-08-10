"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Package, Pill, Plus } from "lucide-react";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import {
  Button,
  Card,
  EmptyState,
  SearchField,
  SelectField,
  StatusBadge,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { getMedications, type Medication } from "@/services/medicationService";

interface Stock {
  label: string;
  tone: "ok" | "warn" | "danger";
}

function stockFor(items: Array<{ quantity: number; minQuantity?: number }>): Stock {
  const total = (items ?? []).reduce((sum, item) => sum + item.quantity, 0);
  if (total === 0) return { label: "Out of stock", tone: "danger" };
  const floor = items[0]?.minQuantity ?? 10;
  if (total <= floor) return { label: "Low stock", tone: "warn" };
  return { label: "In stock", tone: "ok" };
}

export default function MedicationsPage() {
  const router = useRouter();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState({
    search: "",
    category: "",
    isPrescription: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Debounced: the previous version refetched the whole catalogue on every
  // keystroke because `filters` was a fresh object each render.
  useEffect(() => {
    const timer = setTimeout(
      () => setQuery((prev) => ({ ...prev, search, page: 1 })),
      300,
    );
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const response = await getMedications(
          query as unknown as Parameters<typeof getMedications>[0],
        );
        if (cancelled) return;
        setMedications(response.medications);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Error fetching medications:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const update = useCallback(
    (key: string, value: string | number) =>
      setQuery((prev) => ({ ...prev, [key]: value, page: 1 })),
    [],
  );

  const filtered = useMemo(
    () => Boolean(query.search || query.category || query.isPrescription),
    [query],
  );

  const rangeStart = (pagination.page - 1) * pagination.limit + 1;
  const rangeEnd = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <ProtectedRoute allowedRoles={["PHARMACY", "ADMIN"]}>
      <AppShell
        activeId="meds"
        width="wide"
        header={
          <PageHeader
            title="Medications"
            subtitle="Catalogue and stock levels"
            actions={
              <Button
                icon={<Plus className="h-4 w-4" aria-hidden />}
                onClick={() => router.push("/medications/add")}
              >
                <span className="hidden sm:inline">Add medication</span>
                <span className="sm:hidden">Add</span>
              </Button>
            }
          />
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SearchField
            className="sm:col-span-2 lg:col-span-2"
            label="Search medications"
            placeholder="Name or generic name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SelectField
            label="Category"
            wrapperClassName="space-y-0"
            className="shadow-card bg-surface"
            value={query.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">All categories</option>
            <option value="antibiotics">Antibiotics</option>
            <option value="pain-relief">Pain relief</option>
            <option value="mental-health">Mental health</option>
            <option value="contraceptives">Contraceptives</option>
            <option value="vitamins">Vitamins &amp; supplements</option>
          </SelectField>
          <SelectField
            label="Type"
            wrapperClassName="space-y-0"
            className="shadow-card bg-surface"
            value={query.isPrescription}
            onChange={(e) => update("isPrescription", e.target.value)}
          >
            <option value="">All types</option>
            <option value="true">Prescription only</option>
            <option value="false">Over the counter</option>
          </SelectField>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-card bg-surface-sunken animate-pulse"
                />
              ))}
            </div>
          ) : medications.length === 0 ? (
            <Card padded={false}>
              <EmptyState
                icon={Pill}
                title="No medications found"
                description={
                  filtered
                    ? "No match for these filters. Try widening the search."
                    : "The catalogue is empty. Add the first medication to get started."
                }
                action={
                  filtered ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSearch("");
                        setQuery((prev) => ({
                          ...prev,
                          search: "",
                          category: "",
                          isPrescription: "",
                          page: 1,
                        }));
                      }}
                    >
                      Clear filters
                    </Button>
                  ) : (
                    <Button onClick={() => router.push("/medications/add")}>
                      Add medication
                    </Button>
                  )
                }
              />
            </Card>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {medications.map((medication) => {
                const stock = stockFor(medication.inventoryItems ?? []);
                return (
                  <li key={medication.id}>
                    <Card className="flex h-full flex-col">
                      <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                          <Pill className="h-5 w-5 text-brand" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-ink truncate">
                            {medication.name}
                          </h3>
                          <p className="text-sm text-ink-muted truncate">
                            {medication.genericName || medication.manufacturer}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-ink shrink-0">
                          ${medication.price.toFixed(2)}
                        </span>
                      </div>

                      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <dt className="text-ink-muted text-xs">Strength</dt>
                          <dd className="text-ink truncate">{medication.strength}</dd>
                        </div>
                        <div>
                          <dt className="text-ink-muted text-xs">Form</dt>
                          <dd className="text-ink truncate">{medication.dosageForm}</dd>
                        </div>
                      </dl>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <StatusBadge status={stock.label} tone={stock.tone} />
                        <StatusBadge
                          status={
                            medication.isPrescription
                              ? "Prescription only"
                              : "Over the counter"
                          }
                          tone={medication.isPrescription ? "brand" : "neutral"}
                        />
                        {medication.isControlled && (
                          <StatusBadge status="Controlled" tone="warn" />
                        )}
                      </div>

                      <div className="mt-5 flex gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="flex-1"
                          onClick={() => router.push(`/medications/${medication.id}`)}
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          icon={<Package className="h-4 w-4" aria-hidden />}
                          onClick={() =>
                            router.push(`/inventory/add?medicationId=${medication.id}`)
                          }
                        >
                          Stock
                        </Button>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {!loading && pagination.pages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-6 flex items-center justify-between gap-4"
          >
            <p className="text-sm text-ink-muted">
              {rangeStart}–{rangeEnd} of {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={pagination.page <= 1}
                onClick={() =>
                  setQuery((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </Button>
              <span className={cn("text-sm font-medium text-ink tabular-nums")}>
                {pagination.page} / {pagination.pages}
              </span>
              <Button
                size="sm"
                variant="secondary"
                disabled={pagination.page >= pagination.pages}
                onClick={() =>
                  setQuery((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </nav>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
