import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff, AlertCircle, Info } from "lucide-react";
import { setCredentials } from "../store/index.js";
import { login, saveSession } from "../services/authService.js";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form,    setForm]    = useState({ email:"", password:"" });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  function validate() {
    if (!form.email.trim())               return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address.";
    if (!form.password)                   return "Password is required.";
    if (form.password.length < 6)         return "Password must be at least 6 characters.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const ve = validate();
    if (ve) { setError(ve); return; }
    setError(""); setLoading(true);
    try {
      const data = await login({ email:form.email.trim(), password:form.password });
      saveSession({ user:data.user, token:data.token });
      dispatch(setCredentials({ user:data.user, token:data.token }));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally { setLoading(false); }
  }

  function fillDemo() {
    setForm({ email:"demo@resumeai.app", password:"password123" });
    setError("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background:"var(--bg-primary)" }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
        className="w-full max-w-md">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"linear-gradient(135deg,var(--accent-1),var(--accent-2))" }}>
            <Sparkles size={16} className="text-white"/>
          </div>
          <span className="font-display font-800 text-xl" style={{ color:"var(--text-primary)" }}>
            Resume<span className="gradient-text-purple">AI</span>
          </span>
        </Link>

        <div className="glass-card rounded-2xl p-8 relative">
          <div className="absolute top-0 inset-x-0 h-px"
            style={{ background:"linear-gradient(90deg,transparent,rgba(99,102,241,.5),transparent)" }}/>

          <h1 className="font-display font-800 text-2xl mb-1" style={{ color:"var(--text-primary)" }}>Welcome back</h1>
          <p className="text-sm font-body mb-6" style={{ color:"var(--text-muted)" }}>Sign in to your ResumeAI account</p>

          {/* Demo hint */}
          <button onClick={fillDemo}
            className="w-full mb-5 flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors hover:bg-indigo-500/08 text-xs font-body"
            style={{ background:"rgba(99,102,241,.06)", border:"1px solid rgba(99,102,241,.18)" }}>
            <Info size={14} className="text-indigo-400 flex-shrink-0"/>
            <span style={{ color:"var(--text-muted)" }}>
              <span className="font-display font-600 text-indigo-400">Demo:</span>{" "}
              demo@resumeai.app / password123
              <span className="ml-1 text-indigo-400 underline">Click to fill →</span>
            </span>
          </button>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
              className="mb-4 flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm font-body"
              style={{ background:"rgba(244,63,94,.08)", border:"1px solid rgba(244,63,94,.2)", color:"#fda4af" }}>
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5"/>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display font-600" style={{ color:"var(--text-muted)" }}>Email address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:"var(--text-subtle)" }}/>
                <input type="email" value={form.email} placeholder="you@example.com" autoComplete="email"
                  onChange={e => { setForm(f => ({...f, email:e.target.value})); setError(""); }}
                  className="input-glass pl-9 text-sm w-full"/>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display font-600" style={{ color:"var(--text-muted)" }}>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:"var(--text-subtle)" }}/>
                <input type={showPw ? "text" : "password"} value={form.password} placeholder="••••••••" autoComplete="current-password"
                  onChange={e => { setForm(f => ({...f, password:e.target.value})); setError(""); }}
                  className="input-glass pl-9 pr-10 text-sm w-full"/>
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color:"var(--text-subtle)" }}>
                  {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 py-3 mt-2">
              {loading
                ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/>Signing in…</>
                : <><span>Sign In</span><ArrowRight size={14}/></>}
            </button>
          </form>

          <p className="text-center text-sm font-body mt-6" style={{ color:"var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-display font-600 transition-colors">Sign up free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
