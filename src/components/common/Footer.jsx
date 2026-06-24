import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Twitter, Github, Linkedin, ArrowRight, Mail, MapPin, Shield, Zap } from "lucide-react";

const FOOTER_LINKS = [
  { heading:"Product",  links:[{label:"Features",href:"/#features"},{label:"How It Works",href:"/#how-it-works"},{label:"Pricing",href:"/#pricing"},{label:"Changelog",href:"#"}] },
  { heading:"Company",  links:[{label:"About",href:"#"},{label:"Blog",href:"#"},{label:"Careers",href:"#"},{label:"Contact",href:"#"}] },
  { heading:"Support",  links:[{label:"Docs",href:"#"},{label:"Help Center",href:"#"},{label:"API",href:"#"},{label:"Status",href:"#"}] },
];

const SOCIALS = [
  { icon:Twitter,  href:"https://twitter.com" },
  { icon:Github,   href:"https://github.com"  },
  { icon:Linkedin, href:"https://linkedin.com"},
];

export default function Footer() {
  const [email,  setEmail]  = useState("");
  const [subbed, setSubbed] = useState(false);

  function handleSub(e) {
    e.preventDefault();
    if (!email) return;
    setSubbed(true);
    setEmail("");
  }

  return (
    <footer className="relative mt-16" style={{ borderTop:"1px solid var(--border-color)" }}>
      <div className="absolute inset-x-0 -top-24 h-48 pointer-events-none"
        style={{ background:"radial-gradient(ellipse 60% 100% at 50% 0%,rgba(99,102,241,.08) 0%,transparent 70%)" }}/>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10"
          style={{ borderBottom:"1px solid var(--border-color)" }}>

          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background:"linear-gradient(135deg,var(--accent-1),var(--accent-2))" }}>
                <Sparkles size={16} className="text-white"/>
              </div>
              <span className="font-display font-800 text-lg" style={{ color:"var(--text-primary)" }}>
                Resume<span className="gradient-text-purple">AI</span>
              </span>
            </Link>
            <p className="text-sm font-body leading-relaxed max-w-xs" style={{ color:"var(--text-muted)" }}>
              Intelligent resume analysis and AI-powered job matching — built for the modern job seeker.
            </p>
            <div className="flex flex-wrap gap-2">
              {[{icon:Shield,label:"SOC 2"},{icon:Zap,label:"99.9% Uptime"}].map(({icon:Icon,label}) => (
                <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body"
                  style={{ background:"rgba(255,255,255,.04)", border:"1px solid var(--border-color)", color:"var(--text-muted)" }}>
                  <Icon size={11} className="text-indigo-400"/>{label}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon:Icon, href }) => (
                <motion.a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ y:-2, scale:1.1 }} whileTap={{ scale:.95 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  style={{ background:"rgba(255,255,255,.05)", border:"1px solid var(--border-color)", color:"var(--text-muted)" }}>
                  <Icon size={15}/>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading} className="flex flex-col gap-4">
              <h4 className="font-display font-700 text-sm" style={{ color:"var(--text-primary)" }}>{heading}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="text-sm font-body transition-colors duration-200 hover:text-indigo-400"
                      style={{ color:"var(--text-muted)" }}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          style={{ borderBottom:"1px solid var(--border-color)" }}>
          <div>
            <h4 className="font-display font-700 text-base mb-1" style={{ color:"var(--text-primary)" }}>Stay in the loop</h4>
            <p className="text-sm font-body" style={{ color:"var(--text-muted)" }}>Product updates, career tips — no spam.</p>
          </div>
          {subbed ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-emerald-300"
              style={{ background:"rgba(16,185,129,.1)", border:"1px solid rgba(16,185,129,.2)" }}>
              <Sparkles size={14}/> You're subscribed!
            </div>
          ) : (
            <form onSubmit={handleSub} className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:"var(--text-subtle)" }}/>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" className="input-glass pl-9 py-2.5 text-sm"/>
              </div>
              <button type="submit" className="btn-primary text-sm py-2.5 px-5">Subscribe</button>
            </form>
          )}
        </div>

        {/* Bottom */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-body" style={{ color:"var(--text-subtle)" }}>
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5" style={{ color:"var(--text-subtle)" }}>
            <MapPin size={11}/><span className="text-xs font-body">San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-4">
            {["Privacy","Terms","Cookies"].map(item => (
              <Link key={item} to="#" className="text-xs font-body hover:text-indigo-400 transition-colors" style={{ color:"var(--text-subtle)" }}>{item}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
