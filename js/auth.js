//  Registration: creates a user in /users
//  Session: saved in localStorage

import { apiGet, apiPost } from "./api.js";

const SESSION_KEY = "crudtask_session";
//read the session
export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}
//save the session
export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
//delete session
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

 // The user chooses a role (user/admin).
 
export async function registerUser({ name, email, password, role }) {
  if (!name || !email || !password || !role) {
    throw new Error("Completa todos los campos");
  }

  if (role !== "user" && role !== "admin") {
    throw new Error("Rol inválido");
  }

  // Verify that the email address does not already exist.
  const existing = await apiGet(`/users?email=${encodeURIComponent(email)}`);
  if (existing.length > 0) {
    alert("Este corre ya existe")
    return
  }
      

  // Create user
  return apiPost("/users", { name, email, password, role });
}


 // The role is obtained from the database and redirected accordingly.
 
export async function login({ email, password }) {
  if (!email || !password) throw new Error("Completa email y contraseña");

  const users = await apiGet(
    `/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  );

  if (users.length === 0) throw new Error("Credenciales inválidas");

  const user = users[0];

  // We saved the session without a password.
  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  setSession(session);
  return session;
}