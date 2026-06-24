import api, { unwrap } from "./api.js";

export async function login({ email, password }) {
  return unwrap(api.post("/api/auth/login", { email, password }));
}

export async function register({ name, email, password }) {
  return unwrap(api.post("/api/auth/register", { name, email, password }));
}

export async function getMe() {
  return unwrap(api.get("/api/auth/me"));
}

export async function updateProfile(data) {
  return unwrap(api.put("/api/user/profile", data));
}

export function saveSession({ user, token }) {
  localStorage.setItem("rai_token", token);
  localStorage.setItem("rai_user",  JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("rai_token");
  localStorage.removeItem("rai_user");
}
