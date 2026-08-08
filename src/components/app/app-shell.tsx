import { Link, useNavigate } from "@tanstack/react-router";
import { Languages, LogOut, Sparkles } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { AiAssistantPanel } from "@/components/app/ai-assistant-panel";
import { NotificationCenter } from "@/components/app/notification-center";
import { GlassButton } from "@/components/glass";
import { useI18n } from "@/lib/i18n";
import { signOut, useSession } from "@/lib/session";
import type { Complaint } from "@/data/complaints";

export function AppShell({
  children,
  role,
  aiComplaint,
}: {
  children: ReactNode;
  role: "citizen" | "officer";
  aiComplaint?: Complaint;
}) {
  const { t, lang, toggle } = useI18n();
  const navigate = useNavigate();
  const { session, ready } = useSession();

  useEffect(() => {
    if (ready && !session) {
      void navigate({ to: role === "officer" ? "/officer/login" : "/login" });
    }
  }, [ready, session, navigate, role]);

  return (
    <div className="aurora-bg min-h-dvh">
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-5">
        <div className="glass-surface-strong mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full px-3 py-2 sm:px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <Sparkles className="size-4.5" aria-hidden="true" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[11px] text-muted-foreground">
                {t("brand.gov")}
              </span>
              <span className="block truncate font-display text-sm font-bold">
                {t("brand.name")}
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <GlassButton variant="ghost" size="sm" onClick={toggle} aria-label={t("nav.lang")}>
              <Languages className="size-4" aria-hidden="true" />
              <span className="font-semibold">{lang === "en" ? "தமிழ்" : "EN"}</span>
            </GlassButton>
            <NotificationCenter />
            <AiAssistantPanel {...(aiComplaint ? { complaint: aiComplaint } : {})} />
            <GlassButton
              variant="glass"
              size="icon"
              aria-label={t("dash.logout")}
              onClick={() => {
                signOut();
                void navigate({ to: "/" });
              }}
            >
              <LogOut className="size-4.5" aria-hidden="true" />
            </GlassButton>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-8 pb-20 sm:px-6">{children}</main>
    </div>
  );
}
