import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  CircleCheckBig,
  Copy,
  FileText,
  Image as ImageIcon,
  Mail,
  MapPin,
  Mic,
  Phone,
  Send,
  Sparkles,
  User,
  Video,
  XCircle,
  MessageSquareMore,
  Repeat2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/app-shell";
import { ComplaintTimeline } from "@/components/complaint-timeline";
import { GlassButton, GlassCard, PriorityBadge, Reveal } from "@/components/glass";
import { Textarea } from "@/components/ui/textarea";
import { departments } from "@/data/departments";
import { complaints, type Complaint } from "@/data/complaints";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/officer/complaints/$id")({
  loader: ({ params }) => {
    const complaint = complaints.find((c) => c.id === params.id);
    if (!complaint) throw notFound();
    return { complaint };
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `Review ${loaderData.complaint.id} | TN Grievance Officer Console`
      : "Complaint unavailable | TN Grievance Officer Console";
    const description = loaderData
      ? loaderData.complaint.title
      : "This complaint could not be loaded.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: ComplaintReview,
});

const evidenceIcon = {
  image: ImageIcon,
  video: Video,
  pdf: FileText,
  audio: Mic,
} as const;

function ComplaintReview() {
  const { complaint } = Route.useLoaderData() as { complaint: Complaint };
  const { t } = useI18n();
  const [note, setNote] = useState("");
  const dept = departments.find((d) => d.id === complaint.departmentId);

  return (
    <AppShell role="officer" aiComplaint={complaint}>
      <Reveal>
        <Link
          to="/officer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t("officer.dash.title")}
        </Link>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground">{complaint.id}</p>
            <h1 className="mt-1 text-2xl font-extrabold text-balance sm:text-3xl">
              {complaint.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {dept ? t(dept.nameKey) : ""} · {complaint.category} · {complaint.district}
            </p>
          </div>
          <PriorityBadge
            level={complaint.priority}
            label={t(`common.priority.${complaint.priority}`)}
          />
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Reveal>
            <GlassCard className="p-6">
              <h2 className="text-base font-bold">{t("review.citizen")}</h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <Info icon={<User className="size-4" />} label="Name" value={complaint.citizen} />
                <Info icon={<Phone className="size-4" />} label="Mobile" value={complaint.mobile} />
                <Info
                  icon={<Mail className="size-4" />}
                  label="Email"
                  value={complaint.citizenEmail}
                />
                <Info
                  icon={<MapPin className="size-4" />}
                  label="Address"
                  value={complaint.address}
                />
              </dl>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.05}>
            <GlassCard className="p-6">
              <h2 className="text-base font-bold">{t("review.details")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-pretty">{complaint.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Chip>{t("track.filed")}: {complaint.filedOn}</Chip>
                <Chip>{t("track.eta")}: {complaint.eta}</Chip>
                <Chip>{t(complaint.stage)}</Chip>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard className="p-6">
              <h2 className="text-base font-bold">{t("review.evidence")}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {complaint.evidence.map((e) => {
                  const Icon = evidenceIcon[e.type];
                  return (
                    <li
                      key={e.name}
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl bg-background/60 p-4"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/15 text-primary">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{e.name}</span>
                        <span className="block text-xs text-muted-foreground">{e.size}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.15}>
            <GlassCard className="p-6">
              <h2 className="text-base font-bold">{t("review.timeline")}</h2>
              <div className="mt-5">
                <ComplaintTimeline stage={complaint.stage} events={complaint.timeline} />
              </div>
            </GlassCard>
          </Reveal>
        </div>

        <div className="space-y-4">
          <Reveal delay={0.06}>
            <GlassCard className="p-6">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <Sparkles className="size-4.5 text-accent" aria-hidden="true" />
                {t("review.summary")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-pretty">{complaint.aiSummary}</p>

              <dl className="mt-4 space-y-3">
                <Row label={t("review.suggested")} value={dept ? t(dept.nameKey) : "—"} />
                <Row label={t("review.score")} value={`${complaint.severity}/100`} />
                <Row
                  label={t("review.duplicate")}
                  value={`${complaint.duplicates} similar reports`}
                  icon={<Copy className="size-3.5" />}
                />
              </dl>

              <div className="mt-4 rounded-2xl bg-accent/8 p-4">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {t("review.response")}
                </p>
                <p className="mt-2 text-sm leading-relaxed">{complaint.suggestedResponse}</p>
                <GlassButton
                  variant="accent"
                  size="sm"
                  className="mt-3 rounded-2xl"
                  onClick={() => toast.success("Suggested response sent to citizen")}
                >
                  <Send className="size-4" aria-hidden="true" />
                  {t("review.update")}
                </GlassButton>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.12}>
            <GlassCard className="p-6">
              <h2 className="text-base font-bold">{t("review.actions")}</h2>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <GlassButton
                  className="rounded-2xl"
                  onClick={() => toast.success(`${t("review.accept")} · ${complaint.id}`)}
                >
                  <CircleCheckBig className="size-4" aria-hidden="true" />
                  {t("review.accept")}
                </GlassButton>
                <GlassButton
                  variant="glass"
                  className="rounded-2xl"
                  onClick={() => toast(`${t("review.reassign")} · ${complaint.id}`)}
                >
                  <Repeat2 className="size-4" aria-hidden="true" />
                  {t("review.reassign")}
                </GlassButton>
                <GlassButton
                  variant="glass"
                  className="rounded-2xl"
                  onClick={() => toast(`${t("review.moreinfo")} · ${complaint.id}`)}
                >
                  <MessageSquareMore className="size-4" aria-hidden="true" />
                  {t("review.moreinfo")}
                </GlassButton>
                <GlassButton
                  variant="ghost"
                  className="rounded-2xl text-destructive"
                  onClick={() => toast.error(`${t("review.reject")} · ${complaint.id}`)}
                >
                  <XCircle className="size-4" aria-hidden="true" />
                  {t("review.reject")}
                </GlassButton>
              </div>

              <div className="mt-5">
                <label htmlFor="note" className="text-sm font-medium">
                  {t("review.notes")}
                </label>
                <Textarea
                  id="note"
                  rows={4}
                  value={note}
                  placeholder={t("review.notes.placeholder")}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1.5 rounded-2xl bg-background/70"
                />
                <GlassButton
                  variant="glass"
                  size="sm"
                  className="mt-3 rounded-2xl"
                  disabled={!note.trim()}
                  onClick={() => {
                    toast.success(t("review.save"));
                    setNote("");
                  }}
                >
                  {t("review.save")}
                </GlassButton>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </AppShell>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-2xl bg-background/60 p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
        {icon}
      </span>
      <span className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 truncate text-sm font-semibold">{value}</dd>
      </span>
    </div>
  );
}

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="text-sm font-semibold">{value}</dd>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{children}</span>
  );
}
