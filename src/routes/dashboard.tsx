import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { Users, Mail, TrendingUp, Globe, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "TradeReach — Dashboard & Analytics" },
      {
        name: "description",
        content: "Track your international buyer outreach, email campaigns, and market distribution.",
      },
    ],
  }),
  component: Dashboard,
});

const outreachData = [
  { month: "Jan", sent: 12, opened: 9, replied: 3 },
  { month: "Feb", sent: 28, opened: 22, replied: 7 },
  { month: "Mar", sent: 45, opened: 35, replied: 12 },
  { month: "Apr", sent: 60, opened: 48, replied: 18 },
  { month: "May", sent: 85, opened: 70, replied: 26 },
  { month: "Jun", sent: 110, opened: 92, replied: 34 },
];

const marketData = [
  { name: "UAE", leads: 45 },
  { name: "UK", leads: 38 },
  { name: "USA", leads: 62 },
  { name: "Germany", leads: 29 },
  { name: "Singapore", leads: 24 },
];

const recentActivity = [
  {
    id: 1,
    company: "Dubai Global Foods LLC",
    contact: "Ahmed Al-Maktoum",
    action: "Email drafted & sent",
    time: "2 hours ago",
    status: "Completed",
  },
  {
    id: 2,
    company: "London Import & Wholesalers",
    contact: "Sarah Jenkins",
    action: "Contact info retrieved",
    time: "5 hours ago",
    status: "Pending",
  },
  {
    id: 3,
    company: "Bavaria Organic GmbH",
    contact: "Hans Weber",
    action: "Pitch template customized",
    time: "1 day ago",
    status: "Completed",
  },
];

function Dashboard() {
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
              <Link
                to="/"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Find Buyers
              </Link>
              <Link
                to="/dashboard"
                className="text-primary font-semibold transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Profile
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="rounded-xl border border-input px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors"
            >
              Edit Profile
            </Link>
            <Link
              to="/"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              New Search
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl tracking-tight">Outreach Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor your export pipeline, email engagement, and target market distribution.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Buyers Discovered
              </span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-3xl font-bold">234</span>
              <span className="text-xs font-medium text-emerald-600 flex items-center">
                +18% <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Across 12 target markets</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Emails Sent
              </span>
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-3xl font-bold">110</span>
              <span className="text-xs font-medium text-emerald-600 flex items-center">
                +24% <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">34 responses recorded</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Response Rate
              </span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-3xl font-bold">30.9%</span>
              <span className="text-xs font-medium text-emerald-600 flex items-center">
                +4.2% <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Above industry average</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Active Markets
              </span>
              <Globe className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-3xl font-bold">8</span>
              <span className="text-xs font-medium text-muted-foreground">Active regions</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">UAE, UK, USA, Germany...</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Outreach Trend Chart */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Outreach Performance</h2>
              <span className="text-xs text-muted-foreground">Last 6 months</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={outreachData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.75rem",
                      color: "var(--foreground)",
                    }}
                  />
                  <Line type="monotone" dataKey="sent" stroke="var(--primary)" strokeWidth={2} name="Sent" />
                  <Line type="monotone" dataKey="replied" stroke="#10b981" strokeWidth={2} name="Replied" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Distribution Chart */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Leads by Top Market</h2>
              <span className="text-xs text-muted-foreground">Total verified</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.75rem",
                      color: "var(--foreground)",
                    }}
                  />
                  <Bar dataKey="leads" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-lg font-semibold">Recent Outreach Activity</h2>
              <p className="text-xs text-muted-foreground">Latest actions taken across your buyer pipeline</p>
            </div>
            <Link
              to="/"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all activity →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="pb-3 font-medium">Company</th>
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium">Action</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentActivity.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="py-4 font-medium">{item.company}</td>
                    <td className="py-4 text-muted-foreground">{item.contact}</td>
                    <td className="py-4">{item.action}</td>
                    <td className="py-4 text-muted-foreground text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {item.time}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" /> {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="border-t border-border mt-16">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-muted-foreground">
          TradeReach Analytics & Export Intelligence Dashboard. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
