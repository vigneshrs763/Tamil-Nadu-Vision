import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FilePlus2,
  Search,
  Bell,
  Sparkles,
  ArrowRight,
  Clock3,
  CircleCheckBig,
  Activity,
} from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { GlassCard, PriorityBadge, Reveal, glassButtonClass } from "@/components/glass";
import { departments } from "@/data/departments";
import { complaints, notifications } from "@/data/complaints";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";

const title = "Citizen Dashboard | TN Smart Grievance Redressal System";
const description =
  "Your grievances, notifications, AI suggestions and recent activity in one glass dashboard.";

export const Route = createFileRoute("/citizen/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CitizenDashboard,
});

const suggestions = [
  "Attach a photo to TN-GRV-2026-005104 — cases with evidence close 38% faster.",
  "Your street-light case matches 3 nearby reports. A cluster escalation was requested for you.",
  "Best time to file a Water Supply complaint in your ward: before 10 AM (fastest assignment).",
];

function CitizenDashboard() {
  const { t } = useI18n();
  const { session } = useSession();
  const mine = complaints.filter((c) => c.mobile === "9840012345" || c.citizen === session?.name);
  const open = mine.filter((c) => c.stage !== "step.resolved").length;
  const resolved = mine.filter((c) => c.stage === "step.resolved").length;

  return (
    <AppShell role="citizen">
      <Reveal>
        <GlassCard className="p-7 sm:p-9">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">{t("dash.welcome")}</p>
              <h1 className="mt-1 text-2xl font-extrabold text-balance sm:text-4xl">
                <span className="text-gradient-brand">{session?.name ?? "Citizen"}</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{t("dash.welcome.sub")}</p>
            </div>
            <dl className="grid grid-cols-3 gap-3">
              <Stat icon={<Clock3 className="size-4" />} label={t("dash.open")} value={String(open)} />
              <Stat
                icon={<CircleCheckBig className="size-4" />}
                label={t("dash.resolved")}
                value={String(resolved)}
              />
              <Stat
                icon={<Activity className="size-4" />}
                label={t("dash.avg")}
                value={`3.1 ${t("stats.days")}`}
              />
            </dl>
          </div>
        </GlassCard>
      </Reveal>

      <section className="mt-6" aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="sr-only">
          {t("dash.quick")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Reveal>
            <Link to="/citizen/file" className="block h-full">
              <GlassCard className="glow-ring h-full p-7">
                <span className="grid size-14 place-items-center rounded-3xl bg-gradient-to-br from-primary/25 to-accent/20 text-primary">
                  <FilePlus2 className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{t("dash.file")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t("file.subtitle")}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {t("file.next")} <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </GlassCard>
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <Link to="/track" className="block h-full">
              <GlassCard className="glow-ring h-full p-7">
                <span className="grid size-14 place-items-center rounded-3xl bg-gradient-to-br from-secondary/25 to-primary/20 text-primary">
                  <Search className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{t("dash.track")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t("track.subtitle")}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {t("track.button")} <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </GlassCard>
            </Link>
          </Reveal>
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <GlassCard className="h-full p-6 sm:p-7">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="truncate text-base font-bold">{t("dash.previous")}</h2>
              <Link
                to="/track"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t("dash.viewall")}
              </Link>
            </div>
            <ul className="mt-5 space-y-3">
              {mine.map((c) => {
                const dept = departments.find((d) => d.id === c.departmentId);
                return (
                  <li key={c.id}>
                    <div className="rounded-2xl bg-background/55 p-4">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                        <div className="min-w-0">
                          <p className="font-mono text-[11px] text-muted-foreground">{c.id}</p>
                          <p className="mt-0.5 truncate text-sm font-semibold">{c.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {dept ? t(dept.nameKey) : ""} · {c.district}
                          </p>
                        </div>
                        <PriorityBadge
                          level={c.priority}
                          label={t(`common.priority.${c.priority}`)}
                        />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                          {t(c.stage)}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {t("track.eta")}: {c.eta}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </GlassCard>
        </Reveal>

        <div className="space-y-4">
          <Reveal delay={0.06}>
            <GlassCard className="p-6">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <Sparkles className="size-4.5 text-accent" aria-hidden="true" />
                {t("dash.ai")}
              </h2>
              <ul className="mt-4 space-y-3">
                {suggestions.map((s) => (
                  <li
                    key={s}
                    className="rounded-2xl bg-accent/8 p-3.5 text-xs leading-relaxed text-pretty"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.12}>
            <GlassCard className="p-6">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <Bell className="size-4.5 text-primary" aria-hidden="true" />
                {t("dash.notifications")}
              </h2>
              <ul className="mt-4 space-y-3">
                {notifications.slice(0, 3).map((n) => (
                  <li key={n.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <p className="text-xs font-semibold text-pretty">{n.title}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{n.at}</p>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.18}>
            <GlassCard className="p-6">
              <h2 className="text-base font-bold">{t("dash.activity")}</h2>
              <ol className="mt-4 space-y-3.5">
                {complaints[0]!.timeline.slice(-4).reverse().map((e) => (
                  <li key={e.at} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                    <span
                      className="mt-1.5 size-2 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium">{t(e.stage)}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {e.at} · {e.note}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </GlassCard>
          </Reveal>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/citizen/file" className={glassButtonClass({ variant: "primary", size: "lg" })}>
          <FilePlus2 className="size-4.5" aria-hidden="true" />
          {t("dash.file")}
        </Link>
      </div>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-background/55 px-4 py-3 text-center">
      <span className="mx-auto grid size-8 place-items-center rounded-full bg-primary/12 text-primary">
        {icon}
      </span>
      <dd className="mt-2 font-display text-lg font-extrabold tabular-nums">{value}</dd>
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
    </div>
  );
}
