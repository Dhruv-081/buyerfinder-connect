import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User, Building2, Mail, Phone, Globe, Package, Save, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "TradeReach — Your Profile" },
      { name: "description", content: "Manage your exporter profile and pitch defaults." },
    ],
  }),
  component: Profile,
});

const STORAGE_KEY = "tradereach:profile";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name is too short").max(60),
  companyName: z.string().min(2, "Company name is required").max(80),
  email: z.string().email("Enter a valid email").or(z.literal("")).optional(),
  phone: z.string().max(30).optional(),
  website: z
    .string()
    .max(120)
    .optional()
    .refine((v) => !v || /^https?:\/\//.test(v) || /^[a-z0-9.-]+\.[a-z]{2,}/i.test(v), {
      message: "Enter a valid URL",
    }),
  product: z.string().max(100).optional(),
  bio: z.string().max(400).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const DEFAULTS: ProfileForm = {
  displayName: "",
  companyName: "",
  email: "",
  phone: "",
  website: "",
  product: "",
  bio: "",
};

function loadProfile(): ProfileForm {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<ProfileForm>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

function Profile() {
  const [hydrated, setHydrated] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: DEFAULTS,
  });

  useEffect(() => {
    const stored = loadProfile();
    form.reset(stored);
    setHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (values: ProfileForm) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    toast.success("Profile saved", {
      description: "Your exporter details will pre-fill the buyer composer.",
    });
  };

  const handleReset = () => {
    const stored = loadProfile();
    form.reset(stored);
    toast("Changes discarded");
  };

  const displayName = form.watch("displayName");
  const companyName = form.watch("companyName");
  const product = form.watch("product");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-display text-lg text-primary-foreground">
                T
              </span>
              <span className="font-display text-xl tracking-tight">TradeReach</span>
            </div>
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
              <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
                Find Buyers
              </Link>
              <Link to="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                Dashboard
              </Link>
              <Link to="/profile" className="text-primary font-semibold">
                Profile
              </Link>
            </nav>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl border border-input px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div>
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Your exporter profile</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            These details pre-fill the pitch composer on the home page so you don&apos;t have to
            retype them for every buyer. Stored locally in your browser — no account required.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Summary card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-2xl font-display font-bold text-primary">
                {(displayName || "T").trim().charAt(0).toUpperCase()}
              </span>
              <p className="mt-4 font-display text-xl">
                {displayName || (hydrated ? "Your name" : "—")}
              </p>
              <p className="text-sm text-muted-foreground">
                {companyName || (hydrated ? "Your company" : "—")}
              </p>
              {product ? (
                <span className="mt-3 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                  Exports: {product}
                </span>
              ) : (
                <span className="mt-3 text-xs text-muted-foreground">No product set yet</span>
              )}
            </div>
            <div className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{form.watch("email") || "No email set"}</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span className="truncate">{form.watch("phone") || "No phone set"}</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4 shrink-0" />
                <span className="truncate">{form.watch("website") || "No website set"}</span>
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              <Link
                to="/"
                className="flex-1 rounded-xl bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Use in composer
              </Link>
              <Link
                to="/dashboard"
                className="flex-1 rounded-xl border border-input px-4 py-2 text-center text-sm font-medium hover:bg-secondary"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
          >
            <h2 className="font-display text-lg font-semibold">Edit details</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Changes save to this browser. Clear site data to reset.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <User className="h-3.5 w-3.5" /> Display name
                </span>
                <input
                  {...form.register("displayName")}
                  placeholder="Dhruv Choudhary"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
                {form.formState.errors.displayName && (
                  <span className="mt-1 block text-xs text-destructive">
                    {form.formState.errors.displayName.message}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" /> Company name
                </span>
                <input
                  {...form.register("companyName")}
                  placeholder="Sunrise Exports"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
                {form.formState.errors.companyName && (
                  <span className="mt-1 block text-xs text-destructive">
                    {form.formState.errors.companyName.message}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> Email
                </span>
                <input
                  {...form.register("email")}
                  type="email"
                  placeholder="you@sunrise-exports.com"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
                {form.formState.errors.email && (
                  <span className="mt-1 block text-xs text-destructive">
                    {form.formState.errors.email.message}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </span>
                <input
                  {...form.register("phone")}
                  placeholder="+91 98…"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </label>

              <label className="block">
                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" /> Website
                </span>
                <input
                  {...form.register("website")}
                  placeholder="sunrise-exports.com"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
                {form.formState.errors.website && (
                  <span className="mt-1 block text-xs text-destructive">
                    {form.formState.errors.website.message}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Package className="h-3.5 w-3.5" /> Product you export
                </span>
                <input
                  {...form.register("product")}
                  placeholder="organic basmati rice"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  About / bio
                </span>
                <textarea
                  {...form.register("bio")}
                  rows={4}
                  placeholder="A short line about your export strengths, certifications, or capacity."
                  className="mt-1.5 w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
                <span className="mt-1 block text-right text-xs text-muted-foreground">
                  {(form.watch("bio") ?? "").length}/400
                </span>
              </label>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Save className="h-4 w-4" /> Save profile
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-input px-6 py-2.5 text-sm font-medium hover:bg-secondary"
              >
                Discard changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-muted-foreground">
          Profile data stays in your browser under <code className="rounded bg-muted px-1 py-0.5">{STORAGE_KEY}</code>. Clear site data to remove it.
        </div>
      </footer>
    </main>
  );
}
