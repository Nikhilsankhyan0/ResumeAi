// ─────────────────────────────────────────────────────────────────────────────
// constants.js
// ─────────────────────────────────────────────────────────────────────────────

export const HERO_STATS = [
  { value:"2.4M+",  label:"Resumes Analyzed"    },
  { value:"94%",    label:"Interview Rate Boost" },
  { value:"180+",   label:"Job Boards Covered"   },
  { value:"4.9 ★",  label:"Average Rating"       },
];

export const FEATURES = [
  { id:"ats",       icon:"ScanSearch",       badge:"ATS Engine",   color:"indigo",  title:"ATS Score Analysis",     description:"Instantly score your resume against ATS filters used by top companies. Know exactly where you stand before applying."  },
  { id:"skills",    icon:"Layers",           badge:"Skills AI",    color:"violet",  title:"Skill Gap Detection",     description:"Our AI maps your skills against job requirements and highlights exactly what's missing — with learning paths."         },
  { id:"jobs",      icon:"BriefcaseBusiness",badge:"Job Match",    color:"blue",    title:"Smart Job Matching",      description:"Get hyper-personalized job recommendations ranked by compatibility — pulled from LinkedIn & Naukri in real-time."   },
  { id:"rewrite",   icon:"Wand2",            badge:"AI Rewrite",   color:"purple",  title:"One-Click Rewrite",       description:"Let our AI rewrite your bullet points and summary for maximum impact — tailored to specific job descriptions."         },
  { id:"interview", icon:"MessageSquare",    badge:"Interview Prep",color:"emerald",title:"Interview Prep AI",       description:"Practice role-specific questions with AI feedback on your answers, delivery, and confidence level."                   },
  { id:"track",     icon:"BarChart2",        badge:"Analytics",    color:"amber",   title:"Application Tracker",     description:"Visual dashboard to track every application, follow-up, and offer. Never lose track of where you stand."              },
];

export const HOW_IT_WORKS = [
  { step:"01", title:"Upload Your Resume",   description:"Drop your PDF or DOCX. We support all formats from any builder.", icon:"Upload"  },
  { step:"02", title:"AI Deep Analysis",     description:"Our ML pipeline scores your resume across 40+ dimensions instantly.", icon:"Brain"  },
  { step:"03", title:"Get Matched to Jobs",  description:"Receive ranked job recommendations tailored to your exact profile.", icon:"Target" },
  { step:"04", title:"Optimize & Apply",     description:"Use AI suggestions to refine your resume and apply with confidence.", icon:"Rocket" },
];

export const JOB_TYPES = [
  { value:"all",        label:"All Types"   },
  { value:"Full-time",  label:"Full-time"   },
  { value:"Part-time",  label:"Part-time"   },
  { value:"Contract",   label:"Contract"    },
  { value:"Freelance",  label:"Freelance"   },
  { value:"Internship", label:"Internship"  },
  { value:"Remote",     label:"Remote"      },
];

export const EXPERIENCE_LEVELS = [
  { value:"all",       label:"All Levels"  },
  { value:"entry",     label:"Entry Level" },
  { value:"mid",       label:"Mid Level"   },
  { value:"senior",    label:"Senior"      },
  { value:"lead",      label:"Lead/Staff"  },
  { value:"executive", label:"Executive"   },
];

export const SCORE_COLORS = {
  excellent:{ label:"Excellent", min:85, color:"#10b981" },
  good:     { label:"Good",      min:70, color:"#6366f1" },
  fair:     { label:"Fair",      min:50, color:"#f59e0b" },
  poor:     { label:"Poor",      min:0,  color:"#f43f5e" },
};

export const API_BASE = import.meta.env.VITE_API_URL || "/api";
export const ML_BASE  = import.meta.env.VITE_ML_URL  || "/api";

export const ENDPOINTS = {
  login:           `${API_BASE}/auth/login`,
  register:        `${API_BASE}/auth/register`,
  refreshToken:    `${API_BASE}/auth/refresh`,
  me:              `${API_BASE}/auth/me`,
  uploadResume:    `${API_BASE}/resume/upload`,
  analyzeResume:   `${API_BASE}/recommendations/analyze`,
  resumeHistory:   `${API_BASE}/resume/history`,
  deleteResume:    (id) => `${API_BASE}/resume/${id}`,
  jobRecommend:    `${API_BASE}/recommendations/jobs`,
  getProfile:      `${API_BASE}/user/profile`,
  updateProfile:   `${API_BASE}/user/profile`,
};

export const STORAGE_KEYS = {
  token:   "rai_token",
  user:    "rai_user",
  theme:   "rai_theme",
};

export const MAX_FILE_SIZE_MB = 5;
