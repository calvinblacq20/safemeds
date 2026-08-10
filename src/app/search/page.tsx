"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Pill, Loader2 } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  genericName: string | null;
  dosageForm: string;
  strength: string;
  price: number;
  manufacturer: string;
  isPrescription: boolean;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/medications?search=${encodeURIComponent(query)}&limit=50`
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(data.medications || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen bg-bg">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="mb-3 text-4xl text-ink">
            Search Medications
          </h1>
          <p className="text-ink-muted">
            Find medications by name, generic name, or description
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="relative max-w-2xl mx-auto mb-10"
        >
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for medications..."
            className="w-full rounded-full border border-line bg-surface py-4 pl-12 pr-4 text-lg text-ink shadow-card transition-colors placeholder:text-ink-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </motion.div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-ink-muted" />
          </div>
        )}

        {!loading && searched && results.length === 0 && query.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Pill className="mx-auto mb-4 h-16 w-16 text-ink-faint" />
            <p className="text-xl font-medium text-ink-muted">
              No medications found
            </p>
            <p className="mt-1 text-ink-faint">
              Try adjusting your search term
            </p>
          </motion.div>
        )}

        {!query.trim() && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="mx-auto mb-4 h-16 w-16 text-ink-faint" />
            <p className="text-lg text-ink-faint">
              Type above to search for medications
            </p>
          </motion.div>
        )}

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="mb-2 text-sm text-ink-muted">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </p>
            {results.map((med, i) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-card border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-raised"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg text-ink">
                      {med.name}
                    </h3>
                    {med.genericName && (
                      <p className="text-sm text-ink-muted">
                        {med.genericName}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-ink">
                        {med.dosageForm}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                        {med.strength}
                      </span>
                      {med.isPrescription && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                          Rx Required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-ink">
                      ${Number(med.price).toFixed(2)}
                    </p>
                    <p className="text-xs mt-1 text-ink-faint">
                      {med.manufacturer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
