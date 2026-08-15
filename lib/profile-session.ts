const KEY = "razaemustafa_profile_id";

export function getStoredProfileId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setStoredProfileId(id: string) {
  window.localStorage.setItem(KEY, id);
}

export function clearStoredProfileId() {
  window.localStorage.removeItem(KEY);
}
