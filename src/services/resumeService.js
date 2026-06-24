import axios from "axios";
import { ENDPOINTS } from "../utils/constants.js";

// ── Axios instance with auth header ──────────────────────────────────────────
const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rai_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Upload resume file (multipart/form-data) ──────────────────────────────────
// onProgress(pct: number) called during upload
export async function uploadResume(file, onProgress) {
  const form = new FormData();
  form.append("resume", file);

  const { data } = await api.post(ENDPOINTS.uploadResume, form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress(evt) {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded * 100) / evt.total));
      }
    },
  });

  return data; // { id, filename, url }
}

// ── Run ML analysis on an uploaded resume ────────────────────────────────────
// Returns: { ats_score, skills, gaps, insights, job_matches }
export async function analyzeResume(resumeId) {
  const { data } = await api.post(ENDPOINTS.analyzeResume, { resume_id: resumeId });
  return data;
}

// ── Upload then analyze — single call for the uploader flow ──────────────────
export async function uploadAndAnalyze(file, { onProgress, onUploaded } = {}) {
  const uploaded = await uploadResume(file, onProgress);
  if (onUploaded) onUploaded(uploaded);
  const analysis = await analyzeResume(uploaded.id);
  return { uploaded, analysis };
}

// ── Fetch job recommendations based on resume ────────────────────────────────
export async function fetchJobRecommendations(resumeId, filters = {}) {
  const { data } = await api.post(ENDPOINTS.jobRecommend, {
    resume_id: resumeId,
    ...filters,
  });
  return Array.isArray(data) ? data : data.jobs ?? [];
}

// ── Past analyses ─────────────────────────────────────────────────────────────
export async function fetchResumeHistory() {
  const { data } = await api.get(ENDPOINTS.resumeHistory);
  return data;
}

export async function deleteResume(id) {
  const { data } = await api.delete(ENDPOINTS.deleteResume(id));
  return data;
}

export default api;
