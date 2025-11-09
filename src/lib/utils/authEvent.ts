export const AUTH_UPDATE_EVENT = "auth:update";

export type AuthPayload = {
  token: string | null;
  user: any | null;
};

export function emitAuthUpdate(payload: AuthPayload) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(AUTH_UPDATE_EVENT, { detail: payload })
    );
  }
}

export function getStoredAuth<T = any>(): { token: string; user: T } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
