const API = import.meta.env.VITE_API_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token =
    localStorage.getItem("staffToken") ||
    localStorage.getItem("jwt");

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Only set JSON header if body is NOT FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

export function getAuthToken() {
  return (
    localStorage.getItem("jwt") ||
    localStorage.getItem("staffToken")
  );
}