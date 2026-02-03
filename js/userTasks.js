import { apiGet, apiPost, apiPatch, apiDelete } from "./api.js";
import { requireRole } from "./guards.js";
import { qs, showMessage } from "./utils.js";

export function initUserTasks() {
  // 1) Protect the page: only "user" can enter
  const session = requireRole("user");
  if (!session) return;
   // 2) References to HTML elements
  const list = qs("#taskList");
  const form = qs("#taskForm");
  const msg = qs("#msg");

  async function load() {
    const tasks = await apiGet(`/tasks?userId=${session.id}`);
    render(tasks);
  }

  function render(tasks) {
    list.innerHTML = "";

    if (tasks.length === 0) {
      list.innerHTML = `<p class="text-slate-500">You don't have tasks yet.</p>`;
      return;
    }

    for (const t of tasks) {
      const item = document.createElement("div");
      item.className = "p-4 bg-white rounded-xl shadow-sm border flex flex-col gap-2";

      item.innerHTML = `
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="font-semibold text-slate-800">${t.title}</h3>
            <p class="text-sm text-slate-500">${t.description || ""}</p>
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
            Edit
          </button>
          <button data-action="delete" data-id="${t.id}" class="px-3 py-1 text-sm rounded-lg bg-red-600 text-white">
            Eliminate
          </button>
        </div>
      `;

      list.appendChild(item);
    }
  }

  // Create task
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    showMessage(msg, "", "info");

    const title = qs("#title").value.trim();
    const description = qs("#description").value.trim();

    if (!title) {
      showMessage(msg, "El título es obligatorio", "err");
      return;
    }

    try {
      await apiPost("/tasks", {
        title,
        description,
        status: "pending",
        userId: session.id,
        createdAt: new Date().toISOString(),
      });

      form.reset();
      showMessage(msg, "Tarea creada", "ok");
      await load();
    } catch (err) {
      showMessage(msg, err.message, "err");
    }
  });

  // Actions: edit, delete, change status
  list?.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

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
  //change of state
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