import { configureStore, createSlice } from "@reduxjs/toolkit";

// ── Per-user localStorage helpers ─────────────────────────────────────────────
function userKey(userId, key) {
  return userId ? `rai_${key}_${userId}` : null;
}
function loadForUser(userId, key, fallback) {
  const k = userKey(userId, key);
  if (!k) return fallback;
  try { return JSON.parse(localStorage.getItem(k) ?? "null") ?? fallback; }
  catch { return fallback; }
}
function saveForUser(userId, key, value) {
  const k = userKey(userId, key);
  if (!k) return;
  localStorage.setItem(k, JSON.stringify(value));
}
function clearForUser(userId, key) {
  const k = userKey(userId, key);
  if (k) localStorage.removeItem(k);
}

// ── Auth slice ────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:    JSON.parse(localStorage.getItem("rai_user") ?? "null"),
    token:   localStorage.getItem("rai_token") ?? null,
    loading: false,
    error:   null,
  },
  reducers: {
    setCredentials(state, { payload: { user, token } }) {
      state.user  = user;
      state.token = token;
      state.error = null;
      localStorage.setItem("rai_user",  JSON.stringify(user));
      localStorage.setItem("rai_token", token);
    },
    logout(state) {
      // Do NOT wipe user-scoped data — just clear session
      state.user  = null;
      state.token = null;
      localStorage.removeItem("rai_user");
      localStorage.removeItem("rai_token");
    },
    setAuthLoading(state, { payload }) { state.loading = payload; },
    setAuthError(state,   { payload }) { state.error = payload; state.loading = false; },
  },
});

// ── Resume slice ──────────────────────────────────────────────────────────────
const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    uploadedFile:    null,
    analysisResult:  null,
    analysisLoading: false,
    analysisError:   null,
    history:         [],   // loaded lazily after login
  },
  reducers: {
    // Called once after login to hydrate per-user data
    hydrateUserData(state, { payload: userId }) {
      state.history = loadForUser(userId, "history", []);
    },
    // Clear all in-memory data on logout (localStorage stays per-user)
    clearUserData(state) {
      state.uploadedFile   = null;
      state.analysisResult = null;
      state.analysisError  = null;
      state.history        = [];
    },
    setUploadedFile(state, { payload }) {
      state.uploadedFile   = payload;
      state.analysisResult = null;
      state.analysisError  = null;
    },
    setAnalysisLoading(state, { payload }) { state.analysisLoading = payload; },
    setAnalysisResult(state, { payload })  {
      state.analysisResult  = payload;
      state.analysisLoading = false;
      state.analysisError   = null;
    },
    setAnalysisError(state, { payload }) {
      state.analysisError   = payload;
      state.analysisLoading = false;
    },
    addToHistory(state, { payload: { result, userId } }) {
      const entry = {
        id:       Date.now(),
        date:     new Date().toISOString(),
        result,
        fileName: state.uploadedFile?.name ?? "Resume",
      };
      state.history.unshift(entry);
      if (state.history.length > 20) state.history.pop();
      saveForUser(userId, "history", state.history);
    },
    clearHistory(state, { payload: userId }) {
      state.history = [];
      clearForUser(userId, "history");
    },
    loadHistoryEntry(state, { payload }) {
      state.analysisResult = payload.result;
    },
    clearAnalysis(state) {
      state.uploadedFile   = null;
      state.analysisResult = null;
      state.analysisError  = null;
    },
  },
});

// ── Jobs slice ────────────────────────────────────────────────────────────────
const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    savedJobs: [],
    loading:   false,
    error:     null,
    filters:   { location: "", type: "all", experience: "all" },
  },
  reducers: {
    hydrateSavedJobs(state, { payload: userId }) {
      state.savedJobs = loadForUser(userId, "saved_jobs", []);
    },
    clearSavedJobs(state) { state.savedJobs = []; },
    setJobsLoading(state, { payload }) { state.loading = payload; },
    setJobsError(state,   { payload }) { state.error = payload; state.loading = false; },
    toggleSaveJob(state, { payload: { id, userId } }) {
      const idx = state.savedJobs.indexOf(id);
      if (idx === -1) state.savedJobs.push(id);
      else            state.savedJobs.splice(idx, 1);
      saveForUser(userId, "saved_jobs", state.savedJobs);
    },
    setFilters(state, { payload }) { state.filters = { ...state.filters, ...payload }; },
  },
});

// ── UI slice ──────────────────────────────────────────────────────────────────
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: window.innerWidth >= 1024,
    toast:       null,
    theme:       localStorage.getItem("rai_theme") ?? "dark",
  },
  reducers: {
    toggleSidebar(state)               { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen(state, { payload }) { state.sidebarOpen = payload; },
    showToast(state, { payload })      { state.toast = payload; },
    clearToast(state)                  { state.toast = null; },
    setTheme(state, { payload }) {
      state.theme = payload;
      localStorage.setItem("rai_theme", payload);
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("rai_theme", state.theme);
    },
  },
});

// ── Store ─────────────────────────────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    auth:   authSlice.reducer,
    resume: resumeSlice.reducer,
    jobs:   jobsSlice.reducer,
    ui:     uiSlice.reducer,
  },
});

// ── Action exports ────────────────────────────────────────────────────────────
export const { setCredentials, logout, setAuthLoading, setAuthError } = authSlice.actions;
export const {
  hydrateUserData, clearUserData,
  setUploadedFile, setAnalysisLoading, setAnalysisResult, setAnalysisError,
  addToHistory, clearHistory, loadHistoryEntry, clearAnalysis,
} = resumeSlice.actions;
export const {
  hydrateSavedJobs, clearSavedJobs,
  toggleSaveJob, setFilters, setJobsLoading, setJobsError,
} = jobsSlice.actions;
export const { toggleSidebar, setSidebarOpen, showToast, clearToast, setTheme, toggleTheme } = uiSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectAuth   = (s) => s.auth;
export const selectResume = (s) => s.resume;
export const selectJobs   = (s) => s.jobs;
export const selectUI     = (s) => s.ui;
