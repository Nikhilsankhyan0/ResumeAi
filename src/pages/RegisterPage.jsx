import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Mail, Lock, User, Sparkles, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { setCredentials } from "../store/index.js";
import { register, saveSession } from "../services/authService.js";

const PERKS = ["Free forever plan", "ATS scoring in 60 s", "AI job matching"];

function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters",     ok: password.length >= 8     },
    { label: "Uppercase letter",   ok: /[A-Z]/.test(password)  },
    { label: "Number",             ok: /\d/.test(password)     },
  ];
  const strength = checks.filter(c => c.ok).length;
  const colors   = ["#f43f5e", "#f59e0b", "#6366f1", "#10b981"];
  return (
    <div className="flex flex-col gap-2 mt-1.5">
      <div className="flex gap-1">
        {[0,1,2,3].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i < strength ? colors[strength] : "rgba(255,255,255,.08)" }}/>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {checks.map(c => (
          <span key={c.label} className="flex items-center gap-1 text-[10px] font-body"
            style={{ color: c.ok ? "#10b981" : "var(--text-subtle)" }}>
            <CheckCircle2 size={9} className={c.ok ? "text-emerald-400" : "opacity-30"}/>{c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ name: "", email: "", password: "" });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  function validate() {
    if (!form.name.trim() || form.name.trim().length < 2) return "Full name must be at least 2 characters.";
    if (!form.email.trim())                               return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email))                return "Enter a valid email address.";
    if (!form.password)                                   return "Password is required.";
    if (form.password.length < 8)                         return "Password must be at least 8 characters.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErr = validate();
    if (validationErr) { setError(validationErr); return; }
    setError("");
    setLoading(true);
    try {
      const data = await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      saveSession({ user: data.user, token: data.token });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg-primary)" }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
        className="w-full max-w-md">

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

          <h1 className="font-display font-800 text-2xl mb-1" style={{ color:"var(--text-primary)" }}>Create your account</h1>
          <p className="text-sm font-body mb-4" style={{ color:"var(--text-muted)" }}>Start analyzing resumes for free</p>

          <div className="flex flex-wrap gap-3 mb-6">
            {PERKS.map(p => (
              <span key={p} className="flex items-center gap-1.5 text-xs font-body" style={{ color:"var(--text-muted)" }}>
                <CheckCircle2 size={11} className="text-emerald-400"/>{p}
              </span>
            ))}
          </div>

          {error && (
            <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
              className="mb-4 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-body text-rose-300"
              style={{ background:"rgba(244,63,94,.08)", border:"1px solid rgba(244,63,94,.2)" }}>
              <AlertCircle size={14} className="flex-shrink-0"/>{error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {[
              { label:"Full Name",     name:"name",     type:"text",  icon:User,  ph:"Jane Smith",       auto:"name"     },
              { label:"Email Address", name:"email",    type:"email", icon:Mail,  ph:"you@example.com",  auto:"email"    },
            ].map(({ label, name, type, icon: Icon, ph, auto }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-xs font-display font-600" style={{ color:"var(--text-muted)" }}>{label}</label>
                <div className="relative">
                  <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:"var(--text-subtle)" }}/>
                  <input type={type} value={form[name]} placeholder={ph}
                    autoComplete={auto}
                    onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setError(""); }}
                    className="input-glass pl-9 text-sm w-full"/>
                </div>
              </div>
            ))}

            {/* Password with strength meter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display font-600" style={{ color:"var(--text-muted)" }}>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:"var(--text-subtle)" }}/>
                <input type={showPw ? "text" : "password"} value={form.password}
                  placeholder="Min. 8 characters" autoComplete="new-password"
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(""); }}
                  className="input-glass pl-9 pr-10 text-sm w-full"/>
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color:"var(--text-subtle)" }}>
                  {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
              {form.password && <PasswordStrength password={form.password}/>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 py-3 mt-2">
              {loading
                ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/>Creating account…</>
                : <><span>Create Account</span><ArrowRight size={14}/></>
              }
            </button>
          </form>

          <p className="text-center text-sm font-body mt-6" style={{ color:"var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-display font-600 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
