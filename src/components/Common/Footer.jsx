import Link from "next/link";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Get started", href: "/signup" },
      { label: "Sign in", href: "/auth" },
      { label: "Consult a pharmacist", href: "/consult" },
      { label: "Track consultation", href: "/track" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Legal", href: "/legal" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of service", href: "/legal?tab=terms" },
      { label: "Privacy policy", href: "/legal?tab=privacy" },
      { label: "HIPAA compliance", href: "/legal?tab=hipaa" },
      { label: "Medical disclaimer", href: "/legal?tab=disclaimer" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:pr-6">
            <h3 className="text-lg tracking-tight text-ink">SafeMeds</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Anonymous healthcare consultations for students, answered by
              licensed pharmacists.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h4 className="text-sm text-ink">{column.heading}</h4>
              <ul className="mt-3 space-y-1">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {/* Padded to a 44px row rather than sized as bare inline
                        text — these are the footer's real tap targets. */}
                    <Link
                      href={link.href}
                      className="-mx-2 flex min-h-11 items-center rounded-xl px-2 text-sm text-ink-muted transition-colors hover:bg-surface hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-12 border-t border-line pt-6 text-xs text-ink-muted">
          &copy; {new Date().getFullYear()} SafeMeds. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
