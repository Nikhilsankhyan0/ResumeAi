import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/index.js";
import MainLayout from "../layouts/MainLayout.jsx";

const LandingPage   = lazy(() => import("../pages/LandingPage.jsx"));
const LoginPage     = lazy(() => import("../pages/LoginPage.jsx"));
const RegisterPage  = lazy(() => import("../pages/RegisterPage.jsx"));
const DashboardPage = lazy(() => import("../pages/Dashboard.jsx"));
const AnalyzePage   = lazy(() => import("../pages/AnalyzePage.jsx"));
const ResultsPage   = lazy(() => import("../pages/ResultsPage.jsx"));
const JobsPage      = lazy(() => import("../pages/Recommendations.jsx"));
const ProfilePage   = lazy(() => import("../pages/Profile.jsx"));
const HistoryPage   = lazy(() => import("../pages/HistoryPage.jsx"));

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor:"rgba(99,102,241,.3)", borderTopColor:"#6366f1" }}/>
        <p className="text-sm font-display" style={{ color:"var(--text-muted)" }}>Loading…</p>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { token } = useSelector(selectAuth);
  return token ? children : <Navigate to="/login" replace/>;
}

function PublicRoute({ children }) {
  const { token } = useSelector(selectAuth);
  return !token ? children : <Navigate to="/dashboard" replace/>;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader/>}>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login"    element={<PublicRoute><LoginPage/></PublicRoute>}/>
        <Route path="/register" element={<PublicRoute><RegisterPage/></PublicRoute>}/>

        <Route element={<PrivateRoute><MainLayout/></PrivateRoute>}>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="/analyze"   element={<AnalyzePage/>}/>
          <Route path="/results"   element={<ResultsPage/>}/>
          <Route path="/jobs"      element={<JobsPage/>}/>
          <Route path="/history"   element={<HistoryPage/>}/>
          <Route path="/profile"   element={<ProfilePage/>}/>
        </Route>

        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </Suspense>
  );
}
