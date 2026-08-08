import { createFileRoute } from "@tanstack/react-router";
import { Search, CalendarClock, UserCheck, Building2, Radio } from "lucide-react";
import { useState, type FormEvent } from "react";

import { ComplaintTimeline } from "@/components/complaint-timeline";
import { GlassButton, GlassCard, PriorityBadge, Reveal } from "@/components/glass";
import { FloatingNav } from "@/components/site/floating-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { departments } from "@/data/departments";
import { findComplaint, type Complaint } from "@/data/complaints";
import { useI18n } from "@/lib/i18n";

const title = "Track Complaint | TN Smart Grievance Redressal System";
const description =
  "Track a Tamil Nadu grievance in real time using your Complaint ID, Tracking Number or registered mobile number.";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: TrackPage,
});

type Mode = "id" | "tracking" | "mobile";

function TrackPage() {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>("id");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Complaint | null>(null);
  const [notFound, setNotFound] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = findComplaint(query);
    setResult(found ?? null);
    setNotFound(!found);
  };

  const dept = result ? departments.find((d) => d.id === result.departmentId) : undefined;

  return (
    <div className="aurora-bg min-h-dvh">
      <FloatingNav />
      <main className="mx-auto max-w-4xl px-4 pt-32 pb-16 sm:px-6 sm:pt-40">
        <Reveal>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-balance sm:text-5xl">
              <span className="text-gradient-brand">{t("track.title")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
              {t("track.subtitle")}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <GlassCard className="mt-10 p-6 sm:p-8">
            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/70 p-1">
                <TabsTrigger value="id" className="rounded-full text-xs sm:text-sm">
                  {t("track.by.id")}
                </TabsTrigger>
                <TabsTrigger value="tracking" className="rounded-full text-xs sm:text-sm">
                  {t("track.by.tracking")}
                </TabsTrigger>
                <TabsTrigger value="mobile" className="rounded-full text-xs sm:text-sm">
                  {t("track.by.mobile")}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={onSubmit} className="mt-6">
              <Label htmlFor="track-input" className="text-sm font-medium">
                {t(`track.by.${mode}`)}
              </Label>
              <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <Input
                  id="track-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t(`track.placeholder.${mode}`)}
                  inputMode={mode === "mobile" ? "tel" : "text"}
                  className="h-12 rounded-2xl bg-background/70"
                />
                <GlassButton type="submit" size="lg" className="rounded-2xl">
                  <Search className="size-4.5" aria-hidden="true" />
                  {t("track.button")}
                </GlassButton>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{t("track.hint")}</p>
            </form>
          </GlassCard>
        </Reveal>

        {notFound ? (
          <GlassCard className="mt-6 p-6" role="status">
            <p className="text-sm text-destructive">{t("track.notfound")}</p>
          </GlassCard>
        ) : null}

        {result ? (
          <Reveal>
            <GlassCard className="mt-6 p-6 sm:p-8">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-muted-foreground">{result.id}</p>
                  <h2 className="mt-1 text-lg font-bold text-balance sm:text-xl">{result.title}</h2>
                </div>
                <PriorityBadge
                  level={result.priority}
                  label={t(`common.priority.${result.priority}`)}
                />
              </div>

              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <InfoRow
                  icon={<Building2 className="size-4" />}
                  label={t("track.dept")}
                  value={dept ? t(dept.nameKey) : "—"}
                />
                <InfoRow
                  icon={<UserCheck className="size-4" />}
                  label={t("track.officer")}
                  value={result.officer}
                />
                <InfoRow
                  icon={<CalendarClock className="size-4" />}
                  label={t("track.eta")}
                  value={result.eta}
                />
                <InfoRow
                  icon={<Radio className="size-4" />}
                  label={t("track.filed")}
                  value={result.filedOn}
                />
              </dl>

              <div className="mt-8 rounded-3xl bg-muted/50 p-5 sm:p-6">
                <h3 className="mb-5 text-sm font-semibold">{t("track.status")}</h3>
                <ComplaintTimeline stage={result.stage} events={result.timeline} />
              </div>
            </GlassCard>
          </Reveal>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 gap-3 rounded-2xl bg-background/50 px-4 py-3">
      <span className="mt-0.5 shrink-0 text-primary" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="truncate text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}
