import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, ArrowRight, ChevronRight } from "lucide-react";
import { selectAuth } from "../../store/index.js";

const NAV_LINKS = [
  { label:"Features",    href:"#features"    },
  { label:"How It Works",href:"#how-it-works"},
  { label:"Pricing",     href:"#pricing"     },
];

// Smooth scroll to a section ID from anywhere on the page
function scrollToSection(id, navigate, pathname) {
  if (pathname !== "/") {
    // Navigate home first, then scroll after mount
    navigate(`/#${id}`);
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
}

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { token }  = useSelector(selectAuth);
  const location   = useLocation();
  const navigate   = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Handle hash on page load (e.g. navigated from another page)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-2xl border-b" : "bg-transparent border-b border-transparent"
      }`}
        style={scrolled ? {
          background:"rgba(7,7,22,.85)",
          borderColor:"rgba(255,255,255,.06)",
          boxShadow:"0 8px 32px rgba(0,0,0,.4)",
        } : {}}>

        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <motion.div whileHover={{ rotate:15, scale:1.1 }} transition={{ type:"spring", stiffness:400, damping:20 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
              <Sparkles size={15} className="text-white"/>
            </motion.div>
            <span className="font-display font-800 text-[1.05rem] leading-none" style={{ color:"var(--text-primary)" }}>
              Resume<span className="gradient-text-purple">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map(({ label, href }) => (
              <button key={href}
                onClick={() => scrollToSection(href.slice(1), navigate, location.pathname)}
                className="px-3.5 py-2 rounded-lg text-sm font-body transition-colors duration-200 hover:bg-white/07"
                style={{ color:"var(--text-muted)" }}>
                {label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
            {token ? (
              <button onClick={() => navigate("/dashboard")}
                className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                Dashboard <ArrowRight size={13}/>
              </button>
            ) : (
              <>
                <button onClick={() => navigate("/login")}
                  className="btn-secondary text-sm py-2 px-4">Sign in</button>
                <button onClick={() => navigate("/register")}
                  className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                  Get Started <ChevronRight size={13}/>
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(v => !v)}
            className="md:hidden ml-auto p-2 rounded-lg transition-colors hover:bg-white/06"
            style={{ color:"var(--text-muted)" }} aria-label="Toggle menu">
            {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div key="mob-bg"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:.2 }}
              className="fixed inset-0 z-40 bg-black/70 md:hidden"
              onClick={() => setMobileOpen(false)}/>
            <motion.div key="mob-panel"
              initial={{ opacity:0, y:-10, scale:.98 }}
              animate={{ opacity:1, y:0,   scale:1 }}
              exit={{   opacity:0, y:-10,  scale:.98 }}
              transition={{ type:"spring", stiffness:340, damping:30 }}
              className="fixed top-[72px] inset-x-4 z-50 md:hidden rounded-2xl overflow-hidden"
              style={{
                backdropFilter:"blur(28px)",
                background:"rgba(10,10,28,.92)",
                border:"1px solid rgba(255,255,255,.09)",
                boxShadow:"0 24px 64px rgba(0,0,0,.6)",
              }}>
              <div className="h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(99,102,241,.5),transparent)" }}/>
              <div className="p-4 flex flex-col gap-1">
                {NAV_LINKS.map(({ label, href }, i) => (
                  <motion.button key={href}
                    initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: i*.05+.05 }}
                    onClick={() => { scrollToSection(href.slice(1), navigate, location.pathname); setMobileOpen(false); }}
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-body text-left transition-colors hover:bg-white/05"
                    style={{ color:"var(--text-muted)" }}>
                    {label}
                  </motion.button>
                ))}
                <div className="flex flex-col gap-2 mt-3 pt-4" style={{ borderTop:"1px solid rgba(255,255,255,.06)" }}>
                  {token ? (
                    <button onClick={() => navigate("/dashboard")} className="btn-primary w-full justify-center">Go to Dashboard</button>
                  ) : (
                    <>
                      <button onClick={() => navigate("/login")}    className="btn-secondary w-full justify-center">Sign in</button>
                      <button onClick={() => navigate("/register")} className="btn-primary w-full justify-center">Get Started Free</button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
