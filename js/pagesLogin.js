//all the login logic
import { login } from "./auth.js";
import { qs, showMessage } from "./utils.js";

export function initLogin() {
  const form = qs("#loginForm");
  const msg = qs("#msg");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showMessage(msg, "", "info");

    const email = qs("#email").value.trim();
    const password = qs("#password").value.trim();

    try {
      const session = await login({ email, password });

      if (session.role === "admin") {
        window.location.href = "./pages/admin-dashboard.html";
      } else {
        window.location.href = "./pages/user-task.html";
      }
    } catch (err) {
      showMessage(msg, err.message, "err");
    }
  });
}