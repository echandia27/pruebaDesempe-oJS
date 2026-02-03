//We centralized the fetching to a JSON server, so 
// in the rest of the project we only use APIGet, APIPost...

const BASE_URL = "http://localhost:3000";
//request data from the server
export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Error GET ${path}`);
  return res.json();
}
//create a new record (create)
export async function apiPost(path, data) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error POST ${path}`);
  return res.json();
}
//partially update a record (update)
export async function apiPatch(path, data) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error PATCH ${path}`);
  return res.json();
}
//DELETE: Delete a record (delete)
export async function apiDelete(path) {
  const res = await fetch(`${BASE_URL}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error DELETE ${path}`);
  return true;
}