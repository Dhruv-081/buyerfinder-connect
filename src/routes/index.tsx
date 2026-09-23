import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";

import {
  discoverBuyers,
  findBuyerContacts,
  type BuyerCompany,
  type BuyerContactsResult,
} from "@/lib/buyers.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TradeReach — Find international buyers and email them" },
      {
        name: "description",
        content:
          "Search live company data to find importers, distributors and wholesalers abroad, pull decision-maker email addresses, and send them a pitch in one place.",
      },
      { property: "og:title", content: "TradeReach — Find international buyers and email them" },
      {
        property: "og:description",
        content:
          "Search live company data to find importers, distributors and wholesalers abroad, pull decision-maker email addresses, and send them a pitch in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MARKETS = [
  "the UAE",
  "the United Kingdom",
  "the United States",
  "Germany",
  "the Netherlands",
  "Singapore",
  "Australia",
  "Canada",
  "Saudi Arabia",
  "Japan",
  "France",
  "South Africa",
];

function Index() {
  const discover = useServerFn(discoverBuyers);
  const contacts = useServerFn(findBuyerContacts);

  const [query, setQuery] = useState("");
  const [markets, setMarkets] = useState<string[]>([]);
  const [openDomain, setOpenDomain] = useState<string | null>(null);
  const [picked, setPicked] = useState<BuyerContactsResult["contacts"][number] | null>(null);
  const [pickedCompany, setPickedCompany] = useState<string>("");

  const [senderName, setSenderName] = useState("");
  const [senderCompany, setSenderCompany] = useState("");
  const [product, setProduct] = useState("");

  const search = useMutation({
    mutationFn: (vars: { query: string; countries: string[] }) =>
      discover({ data: vars }) as Promise<BuyerCompany[]>,
  });

  const lookup = useMutation({
    mutationFn: (domain: string) =>
      contacts({ data: { domain } }) as Promise<BuyerContactsResult>,
  });

  const subject = useMemo(
    () =>
      `Supply enquiry${product ? `: ${product}` : ""}${senderCompany ? ` — ${senderCompany}` : ""}`,
    [product, senderCompany],
  );

  const body = useMemo(() => {
    const greeting = picked?.firstName ? `Dear ${picked.firstName},` : "Hello,";
    return [
      greeting,
      "",
      `I am ${senderName || "[your name]"}${senderCompany ? ` from ${senderCompany}` : ""}, and we supply ${product || "[your product]"} for export.`,
      "",
      `I came across ${pickedCompany || "your company"} while looking for established buyers in your market, and I believe our range would fit your sourcing needs.`,
      "",
      "We can share specifications, pricing and sample details straight away. Would you be open to a short call this week?",
      "",
      "Kind regards,",
      senderName || "[your name]",
      senderCompany,
    ]
      .filter((l) => l !== undefined)
      .join("\n");
  }, [picked, senderName, senderCompany, product, pickedCompany]);

  const mailto = picked
    ? `mailto:${picked.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : "#";

  const toggleMarket = (code: string) =>
    setMarkets((m) => (m.includes(code) ? m.filter((c) => c !== code) : [...m, code]));

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenDomain(null);
    setPicked(null);
    search.mutate({ query, countries: markets });
  };

  const openCompany = (c: BuyerCompany) => {
    setOpenDomain(c.domain);
    setPicked(null);
    setPickedCompany(c.organization ?? c.domain);
    lookup.mutate(c.domain);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-display text-lg text-primary-foreground">
              T
            </span>
            <span className="font-display text-xl tracking-tight">TradeReach</span>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Export buyer finder
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-14 pb-10">
        <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
          Find international buyers.
          <br />
          <span className="text-primary">Reach them by email the same day.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Describe the kind of buyer you want — importers, distributors, wholesalers, retail chains —
          and pick your target markets. Every company and contact comes from live business data. No
          files to upload.
        </p>

        <form
          onSubmit={runSearch}
          className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Who are you looking for?
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. organic rice importers and food distributors"
            className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />

          <div className="mt-5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Target markets (optional)
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              {MARKETS.map((m) => {
                const on = markets.includes(m);
                return (
                  <button
                    type="button"
                    key={m}
                    onClick={() => toggleMarket(m)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-secondary"
                    }`}
                  >
                    {m.replace(/^the /, "")}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={search.isPending}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {search.isPending ? "Searching buyers…" : "Find buyers"}
          </button>

          {search.isError && (
            <p className="mt-3 text-sm text-destructive">{(search.error as Error).message}</p>
          )}
        </form>
      </section>

      {search.data && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="font-display text-2xl">
            {search.data.length} companies found
          </h2>
          {search.data.length === 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              Try broader wording, for example “furniture wholesalers” instead of a brand name.
            </p>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {search.data.map((c) => (
              <div
                key={c.domain}
                className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg">{c.organization ?? c.domain}</h3>
                    <a
                      href={`https://${c.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                      {c.domain}
                    </a>
                  </div>
                  <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    {c.emailsTotal} contacts
                  </span>
                </div>

                <button
                  onClick={() => openCompany(c)}
                  className="mt-4 rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-secondary"
                >
                  {lookup.isPending && openDomain === c.domain
                    ? "Loading contacts…"
                    : "Get buyer emails"}
                </button>

                {openDomain === c.domain && lookup.isError && (
                  <p className="mt-3 text-sm text-destructive">
                    {(lookup.error as Error).message}
                  </p>
                )}

                {openDomain === c.domain && lookup.data && (
                  <ul className="mt-4 space-y-3 border-t border-border pt-4">
                    {lookup.data.contacts.length === 0 && (
                      <li className="text-sm text-muted-foreground">
                        No public email addresses found for this company.
                      </li>
                    )}
                    {lookup.data.contacts.map((p) => (
                      <li key={p.email} className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{p.email}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {[
                              [p.firstName, p.lastName].filter(Boolean).join(" ") || null,
                              p.position,
                              p.decisionMaker ? "decision maker" : null,
                              `${p.confidence}% confidence`,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setPicked(p);
                            setPickedCompany(c.organization ?? c.domain);
                            document
                              .getElementById("compose")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                        >
                          Write email
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="compose" className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="font-display text-2xl">Write to the buyer</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {picked
              ? `Drafting a message to ${picked.email}${pickedCompany ? ` at ${pickedCompany}` : ""}.`
              : "Pick a buyer contact above and your pitch will be drafted here."}
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
              <Field label="Your name" value={senderName} onChange={setSenderName} placeholder="Dhruv Choudhary" />
              <Field
                label="Your company"
                value={senderCompany}
                onChange={setSenderCompany}
                placeholder="Sunrise Exports"
              />
              <Field
                label="Product you export"
                value={product}
                onChange={setProduct}
                placeholder="organic basmati rice"
              />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Subject
              </p>
              <p className="mt-1 font-medium">{subject}</p>
              <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-background p-4 text-sm leading-relaxed">
                {body}
              </pre>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={mailto}
                  aria-disabled={!picked}
                  className={`inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground ${
                    picked ? "hover:opacity-90" : "pointer-events-none opacity-50"
                  }`}
                >
                  Send this email
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(`${subject}\n\n${body}`)}
                  className="rounded-xl border border-input px-5 py-2.5 text-sm font-medium hover:bg-secondary"
                >
                  Copy message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-muted-foreground">
          Contact data is sourced from public business records. Please follow the anti-spam rules of
          each market you email.
        </div>
      </footer>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
    </label>
  );
}
