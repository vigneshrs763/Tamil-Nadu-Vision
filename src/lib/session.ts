import { useEffect, useState } from "react";

export type Session = {
  role: "citizen" | "officer";
  name: string;
  detail: string;
};

const KEY = "tngrs.session";

export function signIn(session: Session) {
  window.localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("tngrs-session"));
}

export function signOut() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("tngrs-session"));
}

export function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

/** Client-only demo session. Returns null during SSR and the first paint. */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setSession(readSession());
    sync();
    setReady(true);
    window.addEventListener("tngrs-session", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tngrs-session", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { session, ready };
}
