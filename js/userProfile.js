//shows user data
import { requireRole } from "./guards.js";
import { clearSession } from "./auth.js";
import { qs } from "./utils.js";

export function initUserProfile() {
  const session = requireRole("user");
  if (!session) return;

  qs("#name").textContent = session.name;
  qs("#email").textContent = session.email;
  qs("#role").textContent = session.role;

  qs("#logoutBtn")?.addEventListener("click", () => {
    clearSession();
    window.location.href = "../index.html";
  });
}