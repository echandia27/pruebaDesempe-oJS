//protects login data
import { getSession, clearSession } from "./auth.js";

function loginPath() {
  // If you are in /pages => return to the root with ../index.html
  return window.location.pathname.includes("/pages/")
    ? "../index.html"
    : "index.html";
}

export function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = loginPath();
    return null;
  }
  return session;
}
//If the session exists but doesn't match, we delete the session.
export function requireRole(expectedRole) {
  const session = requireAuth();
  if (!session) return null;

  if (session.role !== expectedRole) {
    clearSession();
    window.location.href = loginPath();
    return null;
  }

  return session;
}