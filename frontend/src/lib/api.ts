const API = import.meta.env.VITE_API_URL;

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("jwt");

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}
