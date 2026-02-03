//all the logic of the record
import { registerUser } from "./auth.js";
import { qs, showMessage } from "./utils.js";

export function initRegister() {
  const form = qs("#registerForm");
  const msg = qs("#msg");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showMessage(msg, "", "info");

    const name = qs("#name").value.trim();
    const email = qs("#email").value.trim();
    const password = qs("#password").value.trim();
    const role = qs("#role").value;

    try {
      await registerUser({ name, email, password, role });
     // alert("Your account has been successfully created")
      showMessage(msg, "Cuenta creada Ahora inicia sesión", "ok");

      setTimeout(() => {
        
      }, 9000);
    } catch (err) {
      showMessage(msg, err.message, "err");
    }
    window.location.href = "../index.html";
  });
}