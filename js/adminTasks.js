//show all tasks
import { requireRole } from "./guards.js";
import { apiGet, apiPatch, apiDelete } from "./api.js";
import { qs, showMessage } from "./utils.js";
import { clearSession } from "./auth.js";

export function initAdminTasks() {
  const session = requireRole("admin");
  if (!session) return;

  const list = qs("#taskList");
  const msg = qs("#msg");
//logout button
  qs("#logoutBtn")?.addEventListener("click", () => {
    clearSession();
    window.location.href = "../index.html";
  });

  async function load() {
    //The admin can see all tasks
    const tasks = await apiGet("/tasks");
    const users = await apiGet("/users");
    render(tasks, users);
  }

  function render(tasks, users) {
    list.innerHTML = "";

    if (tasks.length === 0) {
      list.innerHTML = `<p class="text-slate-500">No hay tareas registradas.</p>`;
      return;
    }

    const userMap = new Map(users.map(u => [u.id, u.email]));

    for (const t of tasks) {
      const owner = userMap.get(t.userId) || "desconocido";

      const item = document.createElement("div");
      item.className = "p-4 bg-white rounded-xl shadow-sm border flex flex-col gap-2";

      item.innerHTML = `
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="font-semibold text-slate-800">${t.title}</h3>
            <p class="text-sm text-slate-500">${t.description || ""}</p>
            <p class="text-xs text-slate-400 mt-1">Owner: ${owner}</p>
          </div>
          <span class="text-xs px-2 py-1 rounded-full border">${t.status}</span>
        </div>

        <div class="flex flex-wrap gap-2">
          <select data-action="status" data-id="${t.id}" class="border rounded-lg px-2 py-1 text-sm">
            <option value="pending" ${t.status === "pending" ? "selected" : ""}>pending</option>
            <option value="in progress" ${t.status === "in progress" ? "selected" : ""}>in progress</option>
            <option value="completed" ${t.status === "completed" ? "selected" : ""}>completed</option>
          </select>

          <button data-action="edit" data-id="${t.id}" class="px-3 py-1 text-sm rounded-lg bg-slate-900 text-white">
            Editar
          </button>
          <button data-action="delete" data-id="${t.id}" class="px-3 py-1 text-sm rounded-lg bg-red-600 text-white">
            Eliminar
          </button>
        </div>
      `;

      list.appendChild(item);
    }
  }

  list?.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const { action, id } = btn.dataset;

    try {
      if (action === "delete") {
        await apiDelete(`/tasks/${id}`);
        await load();
      }

      if (action === "edit") {
        const newTitle = prompt("Nuevo título:");
        if (!newTitle) return;

        const newDesc = prompt("Nueva descripción (opcional):") ?? "";
        await apiPatch(`/tasks/${id}`, { title: newTitle, description: newDesc });
        await load();
      }
    } catch (err) {
      showMessage(msg, err.message, "err");
    }
  });

  list?.addEventListener("change", async (e) => {
    const sel = e.target.closest('select[data-action="status"]');
    if (!sel) return;

    try {
      await apiPatch(`/tasks/${sel.dataset.id}`, { status: sel.value });
      await load();
    } catch (err) {
      showMessage(msg, err.message, "err");
    }
  });

  load();
}