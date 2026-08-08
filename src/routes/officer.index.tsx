import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Inbox,
  Flame,
  CircleCheckBig,
  Timer,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/app/app-shell";
import { AnimatedCounter, GlassCard, PriorityBadge, Reveal } from "@/components/glass";
import { departments } from "@/data/departments";
import {
  heatmapValues,
  officerQueue,
  performanceData,
  priorityData,
  trendData,
} from "@/data/complaints";
import { useI18n } from "@/lib/i18n";

const title = "Officer Command Centre | TN Smart Grievance Redressal System";
const description =
  "Live department analytics: complaint trends, priority distribution, ward heatmap and SLA performance.";

export const Route = createFileRoute("/officer/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OfficerDashboard,
});

const pieColors = [
  "var(--color-destructive)",
  "var(--color-warning)",
  "var(--color-primary)",
  "var(--color-secondary)",
];

const insights = [
  "Ward 111 shows a 3.4× spike in electricity faults — pre-position a crew today.",
  "6 water complaints in Anna Nagar share one pipeline. Merge into a single works order.",
  "Roads SLA is trailing at 84%. Two cases will breach in under 9 hours.",
];

function OfficerDashboard() {
  const { t } = useI18n();

  return (
    <AppShell role="officer">
      <Reveal>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-balance sm:text-4xl">
              <span className="text-gradient-brand">{t("officer.dash.title")}</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("officer.dash.sub")}</p>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={<Inbox className="size-5" />}
          label={t("officer.pending")}
          value={128}
          delay={0}
        />
        <Kpi icon={<Flame className="size-5" />} label={t("officer.high")} value={32} delay={0.06} />
        <Kpi
          icon={<CircleCheckBig className="size-5" />}
          label={t("officer.resolvedtoday")}
          value={47}
          delay={0.12}
        />
        <Kpi
          icon={<Timer className="size-5" />}
          label={t("officer.avg")}
          value={2.6}
          decimals={1}
          suffix=" d"
          delay={0.18}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Reveal className="xl:col-span-2">
          <GlassCard className="h-full p-6">
            <h2 className="text-base font-bold">{t("officer.trends")}</h2>
            <div className="mt-5 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ left: -22, right: 6, top: 6 }}>
                  <defs>
                    <linearGradient id="filedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="filed"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    fill="url(#filedGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="var(--color-secondary)"
                    strokeWidth={2.5}
                    fill="url(#resolvedGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.08}>
          <GlassCard className="h-full p-6">
            <h2 className="text-base font-bold">{t("officer.priority")}</h2>
            <div className="mt-2 h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {priorityData.map((entry, i) => (
                      <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {priorityData.map((p, i) => (
                <li key={p.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: pieColors[i % pieColors.length] }}
                    aria-hidden="true"
                  />
                  <span className="truncate text-muted-foreground">{p.name}</span>
                  <span className="ml-auto font-semibold tabular-nums">{p.value}%</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Reveal>
          <GlassCard className="h-full p-6">
            <h2 className="text-base font-bold">{t("officer.heatmap")}</h2>
            <div
              className="mt-5 grid grid-cols-6 gap-1.5"
              role="img"
              aria-label={`${t("officer.heatmap")}: 36 ward cells, darker means more complaints`}
            >
              {heatmapValues.map((v, i) => (
                <span
                  key={i}
                  className="aspect-square rounded-lg transition-transform duration-300 hover:scale-110"
                  style={{
                    background: `color-mix(in oklab, var(--color-primary) ${Math.max(6, v)}%, color-mix(in oklab, var(--color-accent) ${Math.round(v / 3)}%, transparent))`,
                  }}
                  title={`Zone ${i + 1}: ${v} open`}
                />
              ))}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              Low
              <span className="h-2 flex-1 rounded-full bg-gradient-to-r from-primary/10 via-primary/45 to-accent" />
              High
            </p>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.06}>
          <GlassCard className="h-full p-6">
            <h2 className="text-base font-bold">{t("officer.performance")}</h2>
            <div className="mt-5 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} layout="vertical" margin={{ left: 12, right: 12 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis
                    type="category"
                    dataKey="dept"
                    tickLine={false}
                    axisLine={false}
                    width={78}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  />
                  <Tooltip
                    cursor={{ fill: "color-mix(in oklab, var(--color-primary) 8%, transparent)" }}
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="sla" radius={8} fill="var(--color-primary)" barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.12}>
          <GlassCard className="h-full p-6">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <Sparkles className="size-4.5 text-accent" aria-hidden="true" />
              {t("officer.insights")}
            </h2>
            <ul className="mt-4 space-y-3">
              {insights.map((i) => (
                <li key={i} className="rounded-2xl bg-accent/8 p-3.5 text-xs leading-relaxed">
                  {i}
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      </div>

      <Reveal>
        <GlassCard className="mt-4 p-6">
          <h2 className="text-base font-bold">{t("officer.queue")}</h2>
          <ul className="mt-5 space-y-3">
            {officerQueue.map((c) => {
              const dept = departments.find((d) => d.id === c.departmentId);
              return (
                <li key={c.id}>
                  <Link
                    to="/officer/complaints/$id"
                    params={{ id: c.id }}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-background/55 p-4 transition-colors hover:bg-background/85 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[11px] text-muted-foreground">
                        {c.id}
                      </span>
                      <span className="mt-0.5 block truncate text-sm font-semibold">{c.title}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {dept ? t(dept.nameKey) : ""} · {c.district} · {t(c.stage)}
                      </span>
                    </span>
                    <PriorityBadge level={c.priority} label={t(`common.priority.${c.priority}`)} />
                    <span className="hidden items-center gap-1.5 text-sm font-semibold text-primary sm:inline-flex">
                      {t("officer.review")}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </GlassCard>
      </Reveal>
    </AppShell>
  );
}

function Kpi({
  icon,
  label,
  value,
  decimals = 0,
  suffix,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <GlassCard className="h-full p-6">
        <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/22 to-accent/18 text-primary">
          {icon}
        </span>
        <p className="mt-4 font-display text-3xl font-extrabold tabular-nums">
          <AnimatedCounter value={value} decimals={decimals} {...(suffix ? { suffix } : {})} />
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </GlassCard>
    </Reveal>
  );
}
