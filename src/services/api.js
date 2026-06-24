import axios from "axios";

const api = axios.create({
  baseURL: "/",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("rai_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, err => Promise.reject(err));

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      localStorage.removeItem("rai_token");
      localStorage.removeItem("rai_user");
      window.location.href = "/login";
    }
    const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message ?? "Request failed";
    return Promise.reject(new Error(msg));
  }
);

export function unwrap(promise) {
  return promise.then(r => r.data).catch(err => { throw err; });
}

export default api;
