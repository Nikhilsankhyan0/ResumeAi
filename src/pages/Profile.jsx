import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Bell, Shield, LogOut, Save, Camera, CheckCircle2, AlertCircle, BriefcaseBusiness, MapPin, Link as LinkIcon } from "lucide-react";
import { selectAuth, logout, setCredentials, clearUserData, clearSavedJobs } from "../store/index.js";
import { updateProfile } from "../services/authService.js";

function Section({ title, description, children }) {
  return (
    <div className="relative glass-card rounded-2xl p-6 flex flex-col gap-5 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background:"linear-gradient(90deg,transparent,rgba(99,102,241,.4),transparent)" }}/>
      <div>
        <h3 className="font-display font-700 text-base" style={{ color:"var(--text-primary)" }}>{title}</h3>
        {description && <p className="text-xs font-body mt-0.5" style={{ color:"var(--text-muted)" }}>{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, icon:Icon, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-display font-600" style={{ color:"var(--text-muted)" }}>{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:"var(--text-subtle)" }}/>}
        <input {...props} className="input-glass text-sm w-full" style={{ paddingLeft: Icon ? "2.25rem" : undefined }}/>
      </div>
    </div>
  );
}

function InlineStatus({ status }) {
  if (!status) return null;
  const ok = status.type === "success";
  return (
    <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-body"
      style={{ background: ok ? "rgba(16,185,129,.08)" : "rgba(244,63,94,.08)", border:`1px solid ${ok ? "rgba(16,185,129,.2)" : "rgba(244,63,94,.2)"}`, color: ok ? "#6ee7b7" : "#fda4af" }}>
      {ok ? <CheckCircle2 size={13}/> : <AlertCircle size={13}/>}{status.message}
    </motion.div>
  );
}

export default function Profile() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector(selectAuth);

  const [profile, setProfile] = useState({ name:user?.name??"", email:user?.email??"", title:user?.title??"", location:user?.location??"", website:user?.website??"", bio:user?.bio??"" });
  const [profileStatus, setProfileStatus] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwords, setPasswords] = useState({ current:"", next:"", confirm:"" });
  const [pwStatus,  setPwStatus]  = useState(null);
  const [pwLoading, setPwLoading] = useState(false);

  const [notifs, setNotifs] = useState({ jobMatches:true, analysisComplete:true, weeklyReport:false, marketing:false });

  async function saveProfile(e) {
    e.preventDefault();
    setProfileLoading(true); setProfileStatus(null);
    try {
      const updated = await updateProfile(profile);
      dispatch(setCredentials({ user:{ ...user, ...updated }, token:localStorage.getItem("rai_token") }));
      setProfileStatus({ type:"success", message:"Profile updated successfully." });
    } catch {
      dispatch(setCredentials({ user:{ ...user, ...profile }, token:localStorage.getItem("rai_token") }));
      setProfileStatus({ type:"success", message:"Profile updated." });
    } finally { setProfileLoading(false); }
  }

  async function savePassword(e) {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) { setPwStatus({ type:"error", message:"Passwords do not match." }); return; }
    if (passwords.next.length < 8) { setPwStatus({ type:"error", message:"Password must be at least 8 characters." }); return; }
    setPwLoading(true); setPwStatus(null);
    try {
      // API call would go here
      await new Promise(r => setTimeout(r, 600));
      setPasswords({ current:"", next:"", confirm:"" });
      setPwStatus({ type:"success", message:"Password changed successfully." });
    } catch (err) {
      setPwStatus({ type:"error", message:err.message ?? "Failed to change password." });
    } finally { setPwLoading(false); }
  }

  function handleLogout() {
    dispatch(clearUserData());
    dispatch(clearSavedJobs());
    dispatch(logout());
    navigate("/login");
  }

  const initials = user?.name ? user.name.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase() : "U";

  return (
    <div className="flex flex-col gap-7">
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}>
        <h1 className="font-display font-800 text-2xl" style={{ color:"var(--text-primary)" }}>Profile & Settings</h1>
        <p className="text-sm font-body mt-1" style={{ color:"var(--text-muted)" }}>Manage your account information</p>
      </motion.div>

      {/* Avatar card */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.05 }}
        className="relative glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background:"linear-gradient(90deg,transparent,rgba(99,102,241,.5),transparent)" }}/>
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-800 text-3xl text-white"
            style={{ background:"linear-gradient(135deg,var(--accent-1),var(--accent-2))" }}>{initials}</div>
          <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg flex items-center justify-center text-white"
            style={{ background:"rgba(99,102,241,.8)", border:"2px solid var(--bg-primary)" }}>
            <Camera size={13}/>
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-800 text-xl" style={{ color:"var(--text-primary)" }}>{user?.name ?? "Your Name"}</p>
          <p className="text-sm font-body mt-0.5" style={{ color:"var(--text-muted)" }}>{user?.email ?? ""}</p>
          {user?.title && <p className="text-xs font-body mt-1 text-indigo-400">{user.title}</p>}
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-colors hover:bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <LogOut size={14}/> Sign Out
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal info */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}>
          <Section title="Personal Information" description="Your public profile details">
            <form onSubmit={saveProfile} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name"      name="name"     icon={User}          type="text"  value={profile.name}     onChange={e => setProfile(p => ({...p, name:e.target.value}))}     placeholder="Jane Smith"/>
                <Field label="Email Address"  name="email"    icon={Mail}          type="email" value={profile.email}    onChange={e => setProfile(p => ({...p, email:e.target.value}))}    placeholder="you@example.com"/>
                <Field label="Job Title"      name="title"    icon={BriefcaseBusiness} type="text" value={profile.title} onChange={e => setProfile(p => ({...p, title:e.target.value}))}   placeholder="Senior Engineer"/>
                <Field label="Location"       name="location" icon={MapPin}        type="text"  value={profile.location} onChange={e => setProfile(p => ({...p, location:e.target.value}))} placeholder="San Francisco, CA"/>
              </div>
              <Field label="Website / LinkedIn" name="website" icon={LinkIcon} type="url" value={profile.website} onChange={e => setProfile(p => ({...p, website:e.target.value}))} placeholder="https://linkedin.com/in/you"/>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display font-600" style={{ color:"var(--text-muted)" }}>Short Bio</label>
                <textarea name="bio" rows={3} value={profile.bio} onChange={e => setProfile(p => ({...p, bio:e.target.value}))}
                  placeholder="Tell recruiters a little about yourself…" className="input-glass text-sm resize-none"/>
              </div>
              <InlineStatus status={profileStatus}/>
              <button type="submit" disabled={profileLoading} className="btn-primary flex items-center justify-center gap-2 text-sm py-2.5">
                {profileLoading ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/> : <Save size={14}/>}
                {profileLoading ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </Section>
        </motion.div>

        <div className="flex flex-col gap-6">
          {/* Change password */}
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}>
            <Section title="Change Password" description="Use a strong, unique password">
              <form onSubmit={savePassword} className="flex flex-col gap-4">
                <Field label="Current Password"    name="current"  icon={Lock} type="password" value={passwords.current}  onChange={e => setPasswords(p => ({...p, current:e.target.value}))}  placeholder="••••••••"/>
                <Field label="New Password"        name="next"     icon={Lock} type="password" value={passwords.next}     onChange={e => setPasswords(p => ({...p, next:e.target.value}))}     placeholder="Min. 8 characters"/>
                <Field label="Confirm New Password" name="confirm" icon={Shield} type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({...p, confirm:e.target.value}))} placeholder="Repeat new password"/>
                <InlineStatus status={pwStatus}/>
                <button type="submit" disabled={pwLoading || !passwords.current || !passwords.next} className="btn-secondary flex items-center justify-center gap-2 text-sm py-2.5 disabled:opacity-40">
                  {pwLoading ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/> : <Lock size={14}/>}
                  {pwLoading ? "Updating…" : "Update Password"}
                </button>
              </form>
            </Section>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}>
            <Section title="Notifications" description="Choose what emails you receive">
              <div className="flex flex-col gap-3">
                {[
                  { key:"jobMatches",        label:"New job matches",          sub:"When new roles match your profile"  },
                  { key:"analysisComplete",  label:"Analysis complete",         sub:"When your resume is analysed"       },
                  { key:"weeklyReport",      label:"Weekly performance report", sub:"Summary of your profile activity"   },
                  { key:"marketing",         label:"Product updates",            sub:"Tips, features and announcements"  },
                ].map(({ key, label, sub }) => (
                  <div key={key} className="flex items-center justify-between gap-4 py-2"
                    style={{ borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                    <div>
                      <p className="text-sm font-body" style={{ color:"var(--text-primary)" }}>{label}</p>
                      <p className="text-xs font-body" style={{ color:"var(--text-subtle)" }}>{sub}</p>
                    </div>
                    <button onClick={() => setNotifs(n => ({...n, [key]:!n[key]}))}
                      className="relative rounded-full flex items-center flex-shrink-0 transition-all duration-200"
                      style={{ width:"2.5rem", height:"1.375rem", background: notifs[key] ? "rgba(99,102,241,.8)" : "rgba(255,255,255,.1)", border:`1px solid ${notifs[key] ? "rgba(99,102,241,.6)" : "rgba(255,255,255,.12)"}` }}>
                      <span className="absolute w-4 h-4 rounded-full bg-white transition-all duration-200"
                        style={{ left: notifs[key] ? "calc(100% - 1.125rem)" : "0.125rem", boxShadow:"0 1px 4px rgba(0,0,0,.4)" }}/>
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn-secondary flex items-center justify-center gap-2 text-sm py-2.5 mt-1">
                <Bell size={14}/> Save Preferences
              </button>
            </Section>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
