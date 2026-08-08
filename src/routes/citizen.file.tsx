import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Crosshair,
  Upload,
  Mic,
  FileText,
  Image as ImageIcon,
  Video,
  CircleCheckBig,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { GlassButton, GlassCard, PriorityBadge, Reveal, glassButtonClass } from "@/components/glass";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { departments, districts } from "@/data/departments";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const title = "File a Grievance | TN Smart Grievance Redressal System";
const description =
  "Submit a Tamil Nadu grievance in six guided steps with location, evidence and an AI analysis preview before submission.";

export const Route = createFileRoute("/citizen/file")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FileGrievance,
});

const stepKeys = ["file.s1", "file.s2", "file.s3", "file.s4", "file.s5", "file.s6"];

type Attachment = { name: string; kind: "image" | "video" | "pdf" | "audio" };

function FileGrievance() {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [deptId, setDeptId] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [district, setDistrict] = useState<string>("Chennai");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState<{ x: number; y: number } | null>(null);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<Attachment[]>([]);
  const [recording, setRecording] = useState(false);
  const [submitted, setSubmitted] = useState<{ id: string; tracking: string } | null>(null);

  const dept = departments.find((d) => d.id === deptId);

  const ai = useMemo(() => {
    const len = description.trim().length;
    const urgentWords = /(urgent|danger|accident|leak|fire|dark|child|hospital|அவசர|ஆபத்து)/i;
    const severity = Math.min(96, 42 + Math.round(len / 6) + (urgentWords.test(description) ? 22 : 0));
    const priority: "critical" | "high" | "medium" | "low" =
      severity >= 85 ? "critical" : severity >= 70 ? "high" : severity >= 50 ? "medium" : "low";
    const confidence = Math.min(99, 78 + Math.round(len / 22) + files.length * 3);
    const etaDays = dept ? Math.max(0.5, dept.avgDays * (severity >= 85 ? 0.5 : 1)) : 3;
    return { severity, priority, confidence, etaDays };
  }, [description, files.length, dept]);

  const canContinue = [
    Boolean(deptId),
    Boolean(category),
    Boolean(address.trim()) && Boolean(pin),
    description.trim().length >= 20,
    true,
    true,
  ][step];

  const submit = () => {
    const n = Math.floor(100000 + Math.random() * 899999);
    setSubmitted({ id: `TN-GRV-2026-${n.toString().slice(0, 6)}`, tracking: `TRK-${n}${n % 97}` });
  };

  if (submitted) {
    return (
      <AppShell role="citizen">
        <Reveal>
          <GlassCard className="mx-auto max-w-xl p-8 text-center sm:p-10">
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-secondary/18 text-secondary-foreground animate-pulse-ring">
              <CircleCheckBig className="size-10" aria-hidden="true" />
            </span>
            <h1 className="mt-6 text-2xl font-extrabold text-balance sm:text-3xl">
              {t("file.success.title")}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">{t("file.success.body")}</p>

            <dl className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-background/60 p-4">
                <dt className="text-xs text-muted-foreground">{t("file.complaintid")}</dt>
                <dd className="mt-1 font-mono text-sm font-bold">{submitted.id}</dd>
              </div>
              <div className="rounded-2xl bg-background/60 p-4">
                <dt className="text-xs text-muted-foreground">{t("file.tracking")}</dt>
                <dd className="mt-1 font-mono text-sm font-bold">{submitted.tracking}</dd>
              </div>
            </dl>

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
              <Link to="/track" className={glassButtonClass({ variant: "primary", size: "lg" })}>
                {t("file.gotrack")}
              </Link>
              <Link to="/citizen" className={glassButtonClass({ variant: "glass", size: "lg" })}>
                {t("file.dashboard")}
              </Link>
            </div>
          </GlassCard>
        </Reveal>
      </AppShell>
    );
  }

  return (
    <AppShell role="citizen">
      <Reveal>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-extrabold text-balance sm:text-4xl">
            <span className="text-gradient-brand">{t("file.title")}</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("file.subtitle")}</p>

          <ol className="mt-7 flex items-center gap-1.5" aria-label={t("file.step")}>
            {stepKeys.map((k, i) => (
              <li key={k} className="flex-1">
                <div
                  className={cn(
                    "h-1.5 rounded-full transition-colors duration-500",
                    i <= step ? "bg-gradient-to-r from-primary to-accent" : "bg-border",
                  )}
                />
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {t("file.step")} {step + 1} {t("file.of")} {stepKeys.length} · {t(stepKeys[step]!)}
          </p>

          <GlassCard className="mt-5 p-6 sm:p-8">
            {step === 0 ? (
              <fieldset>
                <legend className="sr-only">{t("file.s1")}</legend>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {departments.map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setDeptId(d.id);
                          setCategory("");
                        }}
                        aria-pressed={deptId === d.id}
                        className={cn(
                          "grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                          deptId === d.id
                            ? "border-primary bg-primary/8 shadow-[0_0_0_1px_var(--color-primary)]"
                            : "border-border bg-background/50 hover:bg-background/80",
                        )}
                      >
                        <span
                          className={`grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${d.tint} text-primary`}
                        >
                          <d.icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">
                            {t(d.nameKey)}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {t("dept.avg")}: {d.avgDays} {t("stats.days")}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </fieldset>
            ) : null}

            {step === 1 ? (
              <fieldset>
                <legend className="sr-only">{t("file.s2")}</legend>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {(dept?.categories ?? []).map((c) => (
                    <li key={c}>
                      <button
                        type="button"
                        onClick={() => setCategory(c)}
                        aria-pressed={category === c}
                        className={cn(
                          "min-h-14 w-full rounded-2xl border px-4 text-left text-sm font-medium transition-all",
                          category === c
                            ? "border-primary bg-primary/8 shadow-[0_0_0_1px_var(--color-primary)]"
                            : "border-border bg-background/50 hover:bg-background/80",
                        )}
                      >
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>
              </fieldset>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="district">{t("file.district")}</Label>
                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger id="district" className="mt-1.5 !h-12 rounded-2xl bg-background/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="address">{t("file.address")}</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1.5 h-12 rounded-2xl bg-background/70"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">{t("file.location.pick")}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      setPin({
                        x: ((e.clientX - r.left) / r.width) * 100,
                        y: ((e.clientY - r.top) / r.height) * 100,
                      });
                    }}
                    aria-label={t("file.location.pick")}
                    className="relative block h-56 w-full overflow-hidden rounded-3xl border border-border bg-[linear-gradient(0deg,color-mix(in_oklab,var(--color-primary)_8%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--color-primary)_8%,transparent)_1px,transparent_1px)] bg-[length:28px_28px] bg-secondary/8"
                  >
                    <span className="absolute inset-x-8 top-16 h-1.5 rounded-full bg-primary/20" />
                    <span className="absolute inset-y-6 left-1/3 w-1.5 rounded-full bg-primary/15" />
                    <span className="absolute right-10 bottom-8 size-16 rounded-full bg-secondary/20" />
                    {pin ? (
                      <span
                        className="absolute -translate-x-1/2 -translate-y-full"
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                      >
                        <MapPin className="size-8 fill-primary/25 text-primary" aria-hidden="true" />
                      </span>
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-xs font-medium text-muted-foreground">
                        {t("file.location.pick")}
                      </span>
                    )}
                  </button>
                  <GlassButton
                    type="button"
                    variant="glass"
                    size="sm"
                    className="mt-3 rounded-2xl"
                    onClick={() => setPin({ x: 52, y: 46 })}
                  >
                    <Crosshair className="size-4" aria-hidden="true" />
                    {t("file.location.detect")}
                  </GlassButton>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <Label htmlFor="desc">{t("file.desc.label")}</Label>
                <Textarea
                  id="desc"
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 rounded-2xl bg-background/70"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("file.desc.help")} · {description.trim().length}/20
                </p>
              </div>
            ) : null}

            {step === 4 ? (
              <div>
                <p className="text-sm font-medium">{t("file.upload.title")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("file.upload.help")}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFiles((f) =>
                        f.length >= 5
                          ? f
                          : [...f, { name: `evidence-${f.length + 1}.jpg`, kind: "image" }],
                      )
                    }
                    className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-background/50 text-sm font-medium hover:bg-background/80"
                  >
                    <Upload className="size-6 text-primary" aria-hidden="true" />
                    {t("file.upload.browse")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecording(true);
                      window.setTimeout(() => {
                        setRecording(false);
                        setFiles((f) =>
                          f.length >= 5 ? f : [...f, { name: "voice-note.m4a", kind: "audio" }],
                        );
                      }, 1400);
                    }}
                    className={cn(
                      "flex min-h-32 flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-background/50 text-sm font-medium hover:bg-background/80",
                      recording && "border-destructive text-destructive",
                    )}
                  >
                    <Mic className="size-6 text-accent" aria-hidden="true" />
                    {recording ? t("file.recording") : t("file.record")}
                  </button>
                </div>

                {files.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {files.map((f, i) => (
                      <li
                        key={`${f.name}-${i}`}
                        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-background/60 px-4 py-3"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                          {f.kind === "image" ? (
                            <ImageIcon className="size-4" aria-hidden="true" />
                          ) : f.kind === "video" ? (
                            <Video className="size-4" aria-hidden="true" />
                          ) : f.kind === "pdf" ? (
                            <FileText className="size-4" aria-hidden="true" />
                          ) : (
                            <Mic className="size-4" aria-hidden="true" />
                          )}
                        </span>
                        <span className="truncate text-sm">{f.name}</span>
                        <GlassButton
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${f.name}`}
                          onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                        >
                          <X className="size-4" aria-hidden="true" />
                        </GlassButton>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            {step === 5 ? (
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-accent" aria-hidden="true" />
                  <h2 className="text-base font-bold">{t("file.s6")}</h2>
                </div>

                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Field label={t("file.ai.dept")} value={dept ? t(dept.nameKey) : "—"} />
                  <Field
                    label={t("file.ai.eta")}
                    value={`${ai.etaDays.toFixed(1)} ${t("stats.days")}`}
                  />
                  <div className="rounded-2xl bg-background/60 p-4">
                    <dt className="text-xs text-muted-foreground">{t("file.ai.priority")}</dt>
                    <dd className="mt-2">
                      <PriorityBadge
                        level={ai.priority}
                        label={t(`common.priority.${ai.priority}`)}
                      />
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-background/60 p-4">
                    <dt className="text-xs text-muted-foreground">{t("file.ai.severity")}</dt>
                    <dd className="mt-2 font-display text-lg font-extrabold tabular-nums">
                      {ai.severity}/100
                    </dd>
                  </div>
                </dl>

                <div className="mt-3 rounded-2xl bg-accent/8 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{t("file.ai.confidence")}</p>
                    <p className="font-display text-lg font-extrabold text-gradient-brand tabular-nums">
                      {ai.confidence}%
                    </p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-secondary transition-[width] duration-1000"
                      style={{ width: `${ai.confidence}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 rounded-2xl bg-background/60 p-4">
                  <p className="text-xs text-muted-foreground">{t("file.desc.label")}</p>
                  <p className="mt-1.5 text-sm leading-relaxed">{description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {category} · {district} · {address}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:justify-between">
              <GlassButton
                type="button"
                variant="ghost"
                className="rounded-2xl"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                {t("file.back")}
              </GlassButton>
              {step < stepKeys.length - 1 ? (
                <GlassButton
                  type="button"
                  className="rounded-2xl"
                  disabled={!canContinue}
                  onClick={() => setStep((s) => s + 1)}
                >
                  {t("file.next")}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </GlassButton>
              ) : (
                <GlassButton type="button" className="rounded-2xl" onClick={submit}>
                  {t("file.submit")}
                  <CircleCheckBig className="size-4" aria-hidden="true" />
                </GlassButton>
              )}
            </div>
          </GlassCard>
        </div>
      </Reveal>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-background/60 p-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1.5 text-sm font-semibold">{value}</dd>
    </div>
  );
}
