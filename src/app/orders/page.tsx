"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Package, RefreshCw, Truck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import {
  Button,
  Card,
  EmptyState,
  SelectField,
  StatusBadge,
} from "@/components/ui";
import { getOrders, type Order } from "@/services/orderService";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY_FOR_PICKUP",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount || 0,
  );

const humanise = (value: string) =>
  value.replace(/_/g, " ").toLowerCase().replace(/^./, (c) => c.toUpperCase());

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isStaff = user?.role === "PHARMACY" || user?.role === "ADMIN";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getOrders(filters);
      setOrders(response.orders);
      setPagination(response.pagination);
      setStatistics(response.statistics);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const update = (key: string, value: string | number) =>
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));

  const isFiltered = Boolean(filters.status || filters.paymentStatus);
  const rangeStart = (pagination.page - 1) * pagination.limit + 1;
  const rangeEnd = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    // The API scopes CLIENT queries to the signed-in user, so patients see
    // only their own orders here.
    <ProtectedRoute allowedRoles={["CLIENT", "PHARMACY", "ADMIN"]}>
      <AppShell
        activeId="orders"
        width={isStaff ? "wide" : "default"}
        header={
          <PageHeader
            title="Orders"
            subtitle={isStaff ? "Fulfilment queue" : "Your medication orders"}
            actions={
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchOrders}
                disabled={loading}
                aria-label="Refresh orders"
              >
                <RefreshCw
                  className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"}
                  aria-hidden
                />
              </Button>
            }
          />
        }
      >
        {isStaff && (
          <dl className="grid grid-cols-3 gap-3">
            {[
              { label: "Orders", value: statistics.totalOrders.toLocaleString() },
              { label: "Revenue", value: money(statistics.totalRevenue) },
              { label: "Average", value: money(statistics.averageOrderValue) },
            ].map((stat) => (
              <Card key={stat.label} className="text-center sm:text-left">
                <dt className="text-xs font-medium text-ink-muted">{stat.label}</dt>
                <dd className="mt-1 text-lg font-bold text-ink truncate">
                  {stat.value}
                </dd>
              </Card>
            ))}
          </dl>
        )}

        <div className={isStaff ? "mt-4 grid gap-3 sm:grid-cols-2" : "grid gap-3 sm:grid-cols-2"}>
          <SelectField
            label="Status"
            wrapperClassName="space-y-0"
            className="bg-surface shadow-card"
            value={filters.status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option value="">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {humanise(status)}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Payment"
            wrapperClassName="space-y-0"
            className="bg-surface shadow-card"
            value={filters.paymentStatus}
            onChange={(e) => update("paymentStatus", e.target.value)}
          >
            <option value="">All payment statuses</option>
            {PAYMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {humanise(status)}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-card bg-surface-sunken animate-pulse"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card padded={false}>
              <EmptyState
                icon={Package}
                title="No orders yet"
                description={
                  isFiltered
                    ? "Nothing matches these filters."
                    : isStaff
                      ? "Orders appear here once patients place them."
                      : "Orders placed after a consultation show up here."
                }
                action={
                  isFiltered ? (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          status: "",
                          paymentStatus: "",
                          page: 1,
                        }))
                      }
                    >
                      Clear filters
                    </Button>
                  ) : !isStaff ? (
                    <Button onClick={() => router.push("/consult")}>
                      Start a consultation
                    </Button>
                  ) : undefined
                }
              />
            </Card>
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => (
                <li key={order.id}>
                  <Card className="sm:flex sm:items-center sm:gap-4">
                    <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft sm:flex">
                      <Package className="h-5 w-5 text-brand" aria-hidden />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-ink truncate">
                            {order.prescription?.medication.name ??
                              `Order ${order.orderNumber}`}
                          </h3>
                          <p className="text-sm text-ink-muted truncate">
                            {order.orderNumber} ·{" "}
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <span className="shrink-0 font-bold text-ink">
                          {money(order.totalAmount)}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <StatusBadge status={order.status} />
                        <StatusBadge
                          status={`Payment ${humanise(order.paymentStatus)}`}
                          tone={
                            order.paymentStatus === "PAID"
                              ? "ok"
                              : order.paymentStatus === "FAILED"
                                ? "danger"
                                : "neutral"
                          }
                        />
                        {isStaff && order.user && (
                          <span className="text-xs text-ink-muted truncate">
                            {order.user.firstName} {order.user.lastName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 sm:mt-0 sm:shrink-0">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 sm:flex-none"
                        onClick={() => router.push(`/orders/${order.id}`)}
                      >
                        Details
                      </Button>
                      {order.delivery && (
                        <Button
                          size="sm"
                          className="flex-1 sm:flex-none"
                          icon={<Truck className="h-4 w-4" aria-hidden />}
                          onClick={() => router.push(`/delivery/${order.delivery!.id}`)}
                        >
                          Track
                        </Button>
                      )}
                    </div>
                  </Card>
                </li>
              ))}
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
                onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </Button>
              <span className="text-sm font-medium text-ink tabular-nums">
                {pagination.page} / {pagination.pages}
              </span>
              <Button
                size="sm"
                variant="secondary"
                disabled={pagination.page >= pagination.pages}
                onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
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
