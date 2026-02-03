//qs = querySelector corto
export function qs(selector) {
  return document.querySelector(selector);
}
//will display messages in a custom div
export function showMessage(el, msg, type = "info") {
  if (!el) return;

  el.textContent = msg;

  const base = "mt-3 text-sm px-3 py-2 rounded border";
  const styles = {
    info: "bg-blue-50 text-blue-700 border-blue-200",
    ok: "bg-green-50 text-green-700 border-green-200",
    err: "bg-red-50 text-red-700 border-red-200",
  };

  el.className = `${base} ${styles[type] || styles.info}`;
}