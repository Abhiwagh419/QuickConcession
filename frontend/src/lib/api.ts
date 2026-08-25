const API = import.meta.env.VITE_API_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const staffToken = localStorage.getItem("staffToken");
  const studentToken = localStorage.getItem("jwt");

  let token: string | null = null;

  if (path.startsWith("/admin") || path.startsWith("/staff")) {
    token = staffToken;
  } else {
    token = studentToken;
  }

  const isAuthRoute =
    path.startsWith("/auth/login") ||
    path.startsWith("/auth/verify-otp") ||
    path.startsWith("/auth/staff/login");

  const headers: Record<string, string> = {};

  if (!isAuthRoute && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

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
  return localStorage.getItem("jwt") || localStorage.getItem("staffToken");
}
