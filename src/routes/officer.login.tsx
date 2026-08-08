import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/auth/auth-layout";
import { GlassButton } from "@/components/glass";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departments } from "@/data/departments";
import { useI18n } from "@/lib/i18n";
import { signIn } from "@/lib/session";

const title = "Officer Login | TN Smart Grievance Redressal System";
const description =
  "Secure two-factor sign-in for authorised Tamil Nadu department officers to review and resolve grievances.";

export const Route = createFileRoute("/officer/login")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: OfficerLogin,
});

function OfficerLogin() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [stage, setStage] = useState<"creds" | "2fa">("creds");
  const [employeeId, setEmployeeId] = useState("TN-ELE-40218");
  const [dept, setDept] = useState("electricity");
  const [code, setCode] = useState("");

  const submitCreds = (e: FormEvent) => {
    e.preventDefault();
    setStage("2fa");
  };

  const submit2fa = (e: FormEvent) => {
    e.preventDefault();
    const department = departments.find((d) => d.id === dept);
    signIn({
      role: "officer",
      name: "K. Anbarasan",
      detail: `${employeeId} · ${department ? t(department.nameKey) : ""}`,
    });
    toast.success(t("auth.verify"));
    void navigate({ to: "/officer" });
  };

  return (
    <AuthLayout title={t("auth.officer.title")} subtitle={t("auth.officer.subtitle")}>
      {stage === "creds" ? (
        <form onSubmit={submitCreds} className="space-y-4">
          <div>
            <Label htmlFor="employee">{t("auth.employee")}</Label>
            <Input
              id="employee"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              className="mt-1.5 h-12 rounded-2xl bg-background/70"
            />
          </div>
          <div>
            <Label htmlFor="officer-password">{t("auth.password")}</Label>
            <Input
              id="officer-password"
              type="password"
              defaultValue="demo1234"
              autoComplete="current-password"
              required
              className="mt-1.5 h-12 rounded-2xl bg-background/70"
            />
          </div>
          <div>
            <Label htmlFor="dept">{t("auth.department")}</Label>
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger id="dept" className="mt-1.5 !h-12 rounded-2xl bg-background/70">
                <SelectValue placeholder={t("auth.department.select")} />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {t(d.nameKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <GlassButton type="submit" size="lg" className="w-full rounded-2xl">
            {t("auth.continue")}
          </GlassButton>
        </form>
      ) : (
        <form onSubmit={submit2fa} className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-primary/8 px-4 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
              <Lock className="size-4.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{t("auth.2fa")}</p>
              <p className="text-xs text-muted-foreground">{t("auth.2fa.hint")}</p>
            </div>
          </div>
          <div>
            <Label htmlFor="otp">{t("auth.2fa")}</Label>
            <Input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              required
              className="mt-1.5 h-14 rounded-2xl bg-background/70 text-center font-display text-2xl tracking-[0.5em]"
            />
          </div>
          <GlassButton type="submit" size="lg" className="w-full rounded-2xl">
            {t("auth.verify")}
          </GlassButton>
          <GlassButton
            type="button"
            variant="ghost"
            className="w-full rounded-2xl"
            onClick={() => setStage("creds")}
          >
            {t("auth.back")}
          </GlassButton>
        </form>
      )}

      <div className="mt-7 flex items-center gap-3 rounded-2xl bg-secondary/12 px-4 py-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary/25 text-secondary-foreground animate-pulse-ring">
          <ShieldCheck className="size-4.5" aria-hidden="true" />
        </span>
        <p className="min-w-0 text-xs font-medium text-secondary-foreground">{t("auth.secure")}</p>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">{t("auth.demo")}</p>
      <p className="mt-2 text-center text-xs">
        <Link to="/login" className="font-medium text-primary hover:underline">
          {t("nav.citizen")}
        </Link>
      </p>
    </AuthLayout>
  );
}
