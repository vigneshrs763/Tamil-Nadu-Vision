import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, KeyRound, IdCard } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/auth/auth-layout";
import { GlassButton } from "@/components/glass";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { signIn } from "@/lib/session";

const title = "Citizen Login | TN Smart Grievance Redressal System";
const description =
  "Sign in as a citizen of Tamil Nadu to file grievances, track progress and view AI suggestions.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: CitizenLogin,
});

function CitizenLogin() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("meena.r@example.in");
  const [password, setPassword] = useState("demo1234");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    signIn({ role: "citizen", name: "Meena Ravichandran", detail: identifier });
    toast.success(t("auth.login"));
    void navigate({ to: "/citizen" });
  };

  return (
    <AuthLayout title={t("auth.citizen.title")} subtitle={t("auth.citizen.subtitle")}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="identifier">{t("auth.emailmobile")}</Label>
          <Input
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            required
            className="mt-1.5 h-12 rounded-2xl bg-background/70"
          />
        </div>
        <div>
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="mt-1.5 h-12 rounded-2xl bg-background/70"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" defaultChecked />
            <Label htmlFor="remember" className="text-sm font-normal">
              {t("auth.remember")}
            </Label>
          </div>
          <button
            type="button"
            onClick={() => toast.info(t("auth.forgot"))}
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("auth.forgot")}
          </button>
        </div>

        <GlassButton type="submit" size="lg" className="w-full rounded-2xl">
          {t("auth.login")}
        </GlassButton>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {t("auth.or")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-2.5">
        <GlassButton
          variant="glass"
          className="w-full rounded-2xl"
          onClick={() => toast.info(t("auth.otp"))}
        >
          <KeyRound className="size-4" aria-hidden="true" />
          {t("auth.otp")}
        </GlassButton>
        <GlassButton
          variant="outline"
          className="w-full rounded-2xl"
          onClick={() => toast.info(t("auth.digilocker.soon"))}
        >
          <IdCard className="size-4" aria-hidden="true" />
          {t("auth.digilocker")}
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {t("auth.digilocker.soon")}
          </span>
        </GlassButton>
        <GlassButton
          variant="ghost"
          className="w-full rounded-2xl"
          onClick={() => toast.info(t("auth.create"))}
        >
          {t("auth.create")}
        </GlassButton>
      </div>

      <div className="mt-7 flex items-center gap-3 rounded-2xl bg-secondary/12 px-4 py-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary/25 text-secondary-foreground animate-pulse-ring">
          <ShieldCheck className="size-4.5" aria-hidden="true" />
        </span>
        <p className="min-w-0 text-xs font-medium text-secondary-foreground">{t("auth.secure")}</p>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">{t("auth.demo")}</p>
      <p className="mt-2 text-center text-xs">
        <Link to="/officer/login" className="font-medium text-primary hover:underline">
          {t("nav.officer")}
        </Link>
      </p>
    </AuthLayout>
  );
}
