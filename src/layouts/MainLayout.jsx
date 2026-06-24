import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FileSearch, BriefcaseBusiness, Clock, User, LogOut, Menu, X, Sparkles, Bell, Sun, Moon } from "lucide-react";
import { logout, clearUserData, clearSavedJobs, toggleSidebar, setSidebarOpen, clearToast, toggleTheme, selectAuth, selectUI } from "../store/index.js";

const NAV = [
  { to:"/dashboard", icon:LayoutDashboard,  label:"Dashboard"      },
  { to:"/analyze",   icon:FileSearch,        label:"Analyze Resume" },
  { to:"/jobs",      icon:BriefcaseBusiness, label:"Job Matches"    },
  { to:"/history",   icon:Clock,             label:"History"        },
  { to:"/profile",   icon:User,              label:"Profile"        },
];

function ThemeToggle() {
  const dispatch  = useDispatch();
  const { theme } = useSelector(selectUI);
  const dark = theme !== "light";
  return (
    <button onClick={() => dispatch(toggleTheme())} title={dark ? "Light mode" : "Dark mode"}
      className="relative w-11 h-6 rounded-full transition-all duration-300 flex items-center"
      style={{ background: dark ? "rgba(99,102,241,.3)" : "rgba(251,191,36,.3)", border:`1px solid ${dark ? "rgba(99,102,241,.5)" : "rgba(251,191,36,.5)"}` }}>
      <motion.div className="absolute w-4 h-4 rounded-full flex items-center justify-center"
        style={{ background: dark ? "#6366f1" : "#f59e0b" }}
        animate={{ x: dark ? "1px" : "24px" }} transition={{ type:"spring", stiffness:500, damping:30 }}>
        {dark ? <Moon size={9} className="text-white"/> : <Sun size={9} className="text-white"/>}
      </motion.div>
    </button>
  );
}

function Sidebar({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(selectAuth);

  function handleLogout() {
    dispatch(clearUserData());
    dispatch(clearSavedJobs());
    dispatch(logout());
    navigate("/login");
  }

  const content = (
    <div className="flex flex-col h-full py-5 px-3">
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background:"linear-gradient(135deg,var(--accent-1),var(--accent-2))" }}>
          <Sparkles size={14} className="text-white"/>
        </div>
        <span className="font-display font-800 text-lg" style={{ color:"var(--text-primary)" }}>
          Resume<span className="gradient-text-purple">AI</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ to, icon:Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <Icon size={17}/><span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-3 flex items-center gap-3 rounded-xl mb-3"
        style={{ background:"rgba(255,255,255,.03)", border:"1px solid var(--border-color)" }}>
        <span className="text-xs font-body" style={{ color:"var(--text-muted)" }}>Theme</span>
        <div className="ml-auto"><ThemeToggle/></div>
      </div>

      <div className="rounded-xl p-4 mb-4"
        style={{ background:"linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.08))", border:"1px solid rgba(99,102,241,.22)" }}>
        <p className="font-display text-xs font-700 mb-1" style={{ color:"var(--text-primary)" }}>Upgrade to Pro</p>
        <p className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>Unlimited analyses & AI insights</p>
        <button className="btn-primary w-full justify-center text-xs py-2">Upgrade Now</button>
      </div>

      <div className="divider mb-3"/>
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-700 text-white flex-shrink-0"
          style={{ background:"linear-gradient(135deg,var(--accent-1),var(--accent-2))" }}>
          {user?.name?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color:"var(--text-primary)" }}>{user?.name ?? "User"}</p>
          <p className="text-xs truncate" style={{ color:"var(--text-subtle)" }}>{user?.email ?? ""}</p>
        </div>
        <button onClick={handleLogout} title="Log out"
          className="p-1.5 rounded-lg transition-colors hover:text-rose-400"
          style={{ color:"var(--text-subtle)" }}>
          <LogOut size={14}/>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className={`hidden lg:flex flex-col flex-shrink-0 glass h-screen sticky top-0 transition-all duration-300 overflow-hidden ${open ? "w-60" : "w-[68px]"}`}
        style={{ borderRight:"1px solid var(--border-color)" }}>
        {open ? content : (
          <div className="flex flex-col h-full py-5 items-center gap-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-7"
              style={{ background:"linear-gradient(135deg,var(--accent-1),var(--accent-2))" }}>
              <Sparkles size={14} className="text-white"/>
            </div>
            {NAV.map(({ to, icon:Icon, label }) => (
              <NavLink key={to} to={to} title={label}
                className={({ isActive }) =>
                  `w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                  ${isActive ? "text-white bg-indigo-600/20 border border-indigo-500/25" : "hover:bg-white/5"}`}
                style={{ color:"var(--text-muted)" }}>
                <Icon size={17}/>
              </NavLink>
            ))}
          </div>
        )}
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div key="backdrop" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:.2 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose}/>
            <motion.aside key="drawer" initial={{ x:-260 }} animate={{ x:0 }} exit={{ x:-260 }}
              transition={{ type:"spring", stiffness:320, damping:32 }}
              className="fixed left-0 top-0 bottom-0 w-60 z-50 lg:hidden glass"
              style={{ borderRight:"1px solid var(--border-color)" }}>
              <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                style={{ color:"var(--text-muted)" }}><X size={16}/></button>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Topbar({ onMenuClick }) {
  const location  = useLocation();
  const { user }  = useSelector(selectAuth);
  const pageTitle = NAV.find(n => n.to === location.pathname)?.label ?? "ResumeAI";

  return (
    <header className="h-16 flex items-center px-5 gap-4 sticky top-0 z-30 glass"
      style={{ borderBottom:"1px solid var(--border-color)" }}>
      <button onClick={onMenuClick} className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
        style={{ color:"var(--text-muted)" }}><Menu size={18}/></button>
      <h1 className="flex-1 font-display font-700 text-base leading-none truncate" style={{ color:"var(--text-primary)" }}>{pageTitle}</h1>
      <div className="flex items-center gap-3">
        <div className="hidden sm:block"><ThemeToggle/></div>
        <button className="p-2 rounded-lg relative transition-colors hover:bg-white/5" style={{ color:"var(--text-muted)" }}>
          <Bell size={16}/><span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400"/>
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-700 text-white cursor-pointer"
          style={{ background:"linear-gradient(135deg,var(--accent-1),var(--accent-2))" }}>
          {user?.name?.[0]?.toUpperCase() ?? "U"}
        </div>
      </div>
    </header>
  );
}

function Toast() {
  const dispatch  = useDispatch();
  const { toast } = useSelector(selectUI);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch(clearToast()), toast.duration ?? 3500);
    return () => clearTimeout(t);
  }, [toast, dispatch]);

  const colours = {
    success:"border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    error:  "border-rose-500/30 bg-rose-500/10 text-rose-300",
    info:   "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div key="toast"
          initial={{ opacity:0, y:20, scale:.95 }} animate={{ opacity:1, y:0, scale:1 }}
          exit={{ opacity:0, y:16, scale:.95 }} transition={{ duration:.25 }}
          className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl glass border text-sm cursor-pointer max-w-sm ${colours[toast.type ?? "info"]}`}
          onClick={() => dispatch(clearToast())}>
          <span>{toast.message}</span><X size={13} className="flex-shrink-0 opacity-60"/>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function MainLayout() {
  const dispatch        = useDispatch();
  const { sidebarOpen } = useSelector(selectUI);

  function closeSidebar()   { if (window.innerWidth < 1024) dispatch(setSidebarOpen(false)); }
  function handleMenuClick(){ dispatch(toggleSidebar()); }

  useEffect(() => {
    const h = () => { if (window.innerWidth < 1024) dispatch(setSidebarOpen(false)); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={closeSidebar}/>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={handleMenuClick}/>
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div key={window.location.pathname}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:.28, ease:"easeOut" }}>
              <Outlet/>
            </motion.div>
          </div>
        </main>
      </div>
      <Toast/>
    </div>
  );
}
