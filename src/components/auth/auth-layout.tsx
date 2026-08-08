import { Link } from "@tanstack/react-router";
import { Sparkles, Languages, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { GlassButton, GlassCard } from "@/components/glass";
import { useI18n } from "@/lib/i18n";
import authBackdrop from "@/assets/auth-backdrop.jpg";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { t, lang, toggle } = useI18n();

  return (
    <div className="relative isolate min-h-dvh overflow-hidden">
      <img
        src={authBackdrop}
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        className="absolute inset-0 -z-10 size-full scale-110 object-cover blur-2xl"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-background/80 via-background/60 to-background/85"
        aria-hidden="true"
      />

      <div className="flex min-h-dvh flex-col px-4 py-6 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{t("nav.home")}</span>
          </Link>
          <GlassButton variant="glass" size="sm" onClick={toggle} aria-label={t("nav.lang")}>
            <Languages className="size-4" aria-hidden="true" />
            {lang === "en" ? "தமிழ்" : "EN"}
          </GlassButton>
        </div>

        <main className="flex flex-1 items-center justify-center py-10">
          <GlassCard className="w-full max-w-md p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-muted-foreground">
                  {t("brand.gov")}
                </p>
                <p className="truncate font-display text-sm font-bold">{t("brand.name")}</p>
              </div>
            </div>

            <h1 className="mt-7 text-2xl font-extrabold">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

            <div className="mt-7">{children}</div>

            {footer}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
