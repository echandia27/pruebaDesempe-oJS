//displays the metrics for the administrator section
import { requireRole } from "./guards.js";
import { apiGet } from "./api.js";
import { qs } from "./utils.js";

export function initAdminDashboard() {
  const session = requireRole("admin");
  if (!session) return;

  qs("#adminName").textContent = session.name;

  async function loadMetrics() {
    const tasks = await apiGet("/tasks");

    const total = tasks.length;
    const pending = tasks.filter(t => t.status === "pending").length;
    const inProgress = tasks.filter(t => t.status === "in progress").length;
    const completed = tasks.filter(t => t.status === "completed").length;

    qs("#mTotal").textContent = total;
    qs("#mPending").textContent = pending;
    qs("#mProgress").textContent = inProgress;
    qs("#mCompleted").textContent = completed;
  }

  loadMetrics();
}