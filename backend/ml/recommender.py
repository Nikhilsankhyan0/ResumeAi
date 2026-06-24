#!/usr/bin/env python3
"""recommender.py — Job recommender using skill_matching_model__3_.pkl + curated listings."""
import sys, json, os, re

SEARCH_PATHS = [
    os.path.join(os.path.dirname(__file__), "..", "..", "ml_models", "skill_matching_model__3_.pkl"),
    os.path.join(os.getcwd(), "ml_models", "skill_matching_model__3_.pkl"),
]
SKILLS_DB = {}
for _p in SEARCH_PATHS:
    if os.path.exists(_p):
        import pickle
        with open(_p, "rb") as _f:
            SKILLS_DB = pickle.load(_f)
        break
if not SKILLS_DB:
    SKILLS_DB = {
        "INFORMATION-TECHNOLOGY": ["python","java","javascript","sql","linux","docker","kubernetes","aws","git","rest api"],
        "FINANCE": ["financial analysis","excel","budgeting","forecasting","accounting","sql","power bi"],
        "HR": ["recruitment","onboarding","employee relations","performance management","training"],
        "DESIGNER": ["figma","adobe xd","ui/ux","wireframing","prototyping"],
    }

JOB_LISTINGS = {
    "data-analyst": [
        {"id":1,"title":"Data Analyst","company":"Amazon","location":"Bangalore","type":"Full-time","salary":"₹8–14 LPA","posted":"1d ago","tags":["SQL","Python","AWS"],"applyUrl":"https://www.linkedin.com/jobs/search/?keywords=data+analyst&location=Bangalore","source":"LinkedIn"},
        {"id":2,"title":"Business Intelligence Analyst","company":"Microsoft","location":"Hyderabad","type":"Full-time","salary":"₹12–18 LPA","posted":"2d ago","tags":["Power BI","SQL","DAX"],"applyUrl":"https://www.naukri.com/business-intelligence-analyst-jobs-in-hyderabad","source":"Naukri"},
        {"id":3,"title":"Data Analyst","company":"Flipkart","location":"Bangalore","type":"Full-time","salary":"₹10–16 LPA","posted":"1d ago","tags":["Python","Tableau","MySQL"],"applyUrl":"https://www.naukri.com/data-analyst-jobs-in-bangalore","source":"Naukri"},
        {"id":4,"title":"Analytics Engineer","company":"PhonePe","location":"Bangalore","type":"Full-time","salary":"₹14–22 LPA","posted":"3d ago","tags":["dbt","Python","BigQuery"],"applyUrl":"https://www.linkedin.com/jobs/search/?keywords=analytics+engineer+india","source":"LinkedIn"},
        {"id":5,"title":"Data Scientist","company":"Swiggy","location":"Bangalore","type":"Full-time","salary":"₹15–25 LPA","posted":"4d ago","tags":["Python","ML","Statistics"],"applyUrl":"https://www.naukri.com/data-scientist-jobs-in-bangalore","source":"Naukri"},
        {"id":6,"title":"Power BI Developer","company":"Cognizant","location":"Chennai","type":"Full-time","salary":"₹7–12 LPA","posted":"2d ago","tags":["Power BI","DAX","Excel"],"applyUrl":"https://www.naukri.com/power-bi-developer-jobs","source":"Naukri"},
        {"id":7,"title":"SQL Developer / MIS Analyst","company":"HDFC Bank","location":"Mumbai","type":"Full-time","salary":"₹6–10 LPA","posted":"5d ago","tags":["SQL","Excel","Reporting"],"applyUrl":"https://www.naukri.com/mis-analyst-jobs","source":"Naukri"},
        {"id":8,"title":"Tableau Developer","company":"Accenture","location":"Pune","type":"Full-time","salary":"₹8–13 LPA","posted":"1w ago","tags":["Tableau","SQL","BI"],"applyUrl":"https://www.naukri.com/tableau-developer-jobs-in-pune","source":"Naukri"},
    ],
    "data-scientist": [
        {"id":1,"title":"Data Scientist","company":"Google","location":"Bangalore","type":"Full-time","salary":"₹25–45 LPA","posted":"1d ago","tags":["ML","Python","TensorFlow"],"applyUrl":"https://www.linkedin.com/jobs/search/?keywords=data+scientist&location=Bangalore","source":"LinkedIn"},
        {"id":2,"title":"ML Engineer","company":"Flipkart","location":"Bangalore","type":"Full-time","salary":"₹20–35 LPA","posted":"2d ago","tags":["PyTorch","MLOps","Python"],"applyUrl":"https://www.naukri.com/machine-learning-engineer-jobs-in-bangalore","source":"Naukri"},
        {"id":3,"title":"AI/ML Engineer","company":"Amazon","location":"Hyderabad","type":"Full-time","salary":"₹22–40 LPA","posted":"3d ago","tags":["AWS","Deep Learning"],"applyUrl":"https://www.linkedin.com/jobs/search/?keywords=machine+learning+engineer+india","source":"LinkedIn"},
        {"id":4,"title":"NLP Engineer","company":"Microsoft","location":"Hyderabad","type":"Full-time","salary":"₹20–38 LPA","posted":"4d ago","tags":["NLP","Python"],"applyUrl":"https://www.naukri.com/nlp-engineer-jobs","source":"Naukri"},
        {"id":5,"title":"Data Scientist - Analytics","company":"Meesho","location":"Bangalore","type":"Full-time","salary":"₹18–30 LPA","posted":"2d ago","tags":["Python","SQL"],"applyUrl":"https://www.naukri.com/data-scientist-jobs","source":"Naukri"},
    ],
    "software-engineer": [
        {"id":1,"title":"Senior Frontend Engineer","company":"Stripe","location":"Remote","type":"Full-time","salary":"$140–180k","posted":"1d ago","tags":["React","TypeScript"],"applyUrl":"https://www.linkedin.com/jobs/search/?keywords=senior+frontend+engineer&location=Remote","source":"LinkedIn"},
        {"id":2,"title":"Full Stack Developer","company":"Notion","location":"SF","type":"Full-time","salary":"$130–160k","posted":"2d ago","tags":["Node.js","React"],"applyUrl":"https://www.linkedin.com/jobs/search/?keywords=full+stack+developer","source":"LinkedIn"},
        {"id":3,"title":"React Developer","company":"Razorpay","location":"Bangalore","type":"Full-time","salary":"₹20–35 LPA","posted":"3d ago","tags":["React","TypeScript"],"applyUrl":"https://www.naukri.com/react-developer-jobs-in-bangalore","source":"Naukri"},
        {"id":4,"title":"Backend Engineer","company":"Zepto","location":"Mumbai","type":"Full-time","salary":"₹18–30 LPA","posted":"2d ago","tags":["Node.js","Redis"],"applyUrl":"https://www.naukri.com/backend-developer-jobs-in-mumbai","source":"Naukri"},
        {"id":5,"title":"Software Developer","company":"Infosys","location":"Pune","type":"Full-time","salary":"₹6–12 LPA","posted":"5d ago","tags":["Java","Spring"],"applyUrl":"https://www.naukri.com/software-developer-jobs-in-pune","source":"Naukri"},
        {"id":6,"title":"Frontend Developer","company":"Meesho","location":"Bangalore","type":"Full-time","salary":"₹12–20 LPA","posted":"1w ago","tags":["React","JavaScript"],"applyUrl":"https://www.naukri.com/frontend-developer-jobs-in-bangalore","source":"Naukri"},
    ],
    "designer": [
        {"id":1,"title":"Product Designer","company":"Razorpay","location":"Bangalore","type":"Full-time","salary":"₹12–20 LPA","posted":"1d ago","tags":["Figma","UI/UX"],"applyUrl":"https://www.linkedin.com/jobs/search/?keywords=product+designer&location=Bangalore","source":"LinkedIn"},
        {"id":2,"title":"UX Designer","company":"Swiggy","location":"Bangalore","type":"Full-time","salary":"₹10–18 LPA","posted":"2d ago","tags":["Research"],"applyUrl":"https://www.naukri.com/ux-designer-jobs-in-bangalore","source":"Naukri"},
        {"id":3,"title":"UI/UX Designer","company":"CRED","location":"Bangalore","type":"Full-time","salary":"₹14–22 LPA","posted":"3d ago","tags":["Figma"],"applyUrl":"https://www.naukri.com/ui-ux-designer-jobs","source":"Naukri"},
        {"id":4,"title":"Senior UX Designer","company":"Figma","location":"Remote","type":"Full-time","salary":"$120–155k","posted":"4d ago","tags":["Research","Framer"],"applyUrl":"https://www.linkedin.com/jobs/search/?keywords=senior+ux+designer","source":"LinkedIn"},
        {"id":5,"title":"Visual Designer","company":"Meesho","location":"Bangalore","type":"Full-time","salary":"₹8–14 LPA","posted":"5d ago","tags":["Illustrator"],"applyUrl":"https://www.naukri.com/visual-designer-jobs","source":"Naukri"},
    ],
    "hr": [
        {"id":1,"title":"HR Business Partner","company":"Google","location":"Hyderabad","type":"Full-time","salary":"₹18–30 LPA","posted":"1d ago","tags":["HR Strategy"],"applyUrl":"https://www.linkedin.com/jobs/search/?keywords=hr+business+partner+india","source":"LinkedIn"},
        {"id":2,"title":"Talent Acquisition Specialist","company":"Infosys","location":"Bangalore","type":"Full-time","salary":"₹6–12 LPA","posted":"2d ago","tags":["Recruitment"],"applyUrl":"https://www.naukri.com/talent-acquisition-jobs-in-bangalore","source":"Naukri"},
        {"id":3,"title":"HR Manager","company":"TCS","location":"Mumbai","type":"Full-time","salary":"₹10–16 LPA","posted":"3d ago","tags":["People Mgmt"],"applyUrl":"https://www.naukri.com/hr-manager-jobs-in-mumbai","source":"Naukri"},
        {"id":4,"title":"Recruiter","company":"Swiggy","location":"Bangalore","type":"Full-time","salary":"₹5–9 LPA","posted":"4d ago","tags":["Tech Hiring"],"applyUrl":"https://www.naukri.com/recruiter-jobs-in-bangalore","source":"Naukri"},
        {"id":5,"title":"HR Generalist","company":"Wipro","location":"Pune","type":"Full-time","salary":"₹5–8 LPA","posted":"5d ago","tags":["Payroll"],"applyUrl":"https://www.naukri.com/hr-generalist-jobs-in-pune","source":"Naukri"},
    ],
    "finance": [
        {"id":1,"title":"Financial Analyst","company":"Goldman Sachs","location":"Mumbai","type":"Full-time","salary":"₹12–20 LPA","posted":"1d ago","tags":["Modelling","Excel"],"applyUrl":"https://www.linkedin.com/jobs/search/?keywords=financial+analyst+india","source":"LinkedIn"},
        {"id":2,"title":"Investment Analyst","company":"ICICI Bank","location":"Mumbai","type":"Full-time","salary":"₹10–16 LPA","posted":"2d ago","tags":["Equity","CFA"],"applyUrl":"https://www.naukri.com/investment-analyst-jobs-in-mumbai","source":"Naukri"},
        {"id":3,"title":"Finance Manager","company":"Flipkart","location":"Bangalore","type":"Full-time","salary":"₹15–25 LPA","posted":"3d ago","tags":["FP&A"],"applyUrl":"https://www.naukri.com/finance-manager-jobs-in-bangalore","source":"Naukri"},
        {"id":4,"title":"Data Analyst - Finance","company":"Paytm","location":"Noida","type":"Full-time","salary":"₹8–13 LPA","posted":"2d ago","tags":["SQL","Excel"],"applyUrl":"https://www.naukri.com/finance-data-analyst-jobs","source":"Naukri"},
        {"id":5,"title":"Tax Consultant","company":"KPMG","location":"Mumbai","type":"Full-time","salary":"₹7–11 LPA","posted":"5d ago","tags":["GST","Tally"],"applyUrl":"https://www.naukri.com/tax-consultant-jobs-in-mumbai","source":"Naukri"},
    ],
    "devops": [
        {"id":1,"title":"DevOps Engineer","company":"Amazon","location":"Bangalore","type":"Full-time","salary":"₹18–32 LPA","posted":"1d ago","tags":["AWS","Kubernetes"],"applyUrl":"https://www.linkedin.com/jobs/search/?keywords=devops+engineer+bangalore","source":"LinkedIn"},
        {"id":2,"title":"Cloud Engineer","company":"Microsoft","location":"Hyderabad","type":"Full-time","salary":"₹15–28 LPA","posted":"2d ago","tags":["Azure","Terraform"],"applyUrl":"https://www.naukri.com/cloud-engineer-jobs-in-hyderabad","source":"Naukri"},
        {"id":3,"title":"SRE / Platform Eng","company":"Google","location":"Bangalore","type":"Full-time","salary":"₹25–45 LPA","posted":"3d ago","tags":["GCP","Prometheus"],"applyUrl":"https://www.linkedin.com/jobs/search/?keywords=site+reliability+engineer+india","source":"LinkedIn"},
        {"id":4,"title":"Infrastructure Engineer","company":"Razorpay","location":"Bangalore","type":"Full-time","salary":"₹15–25 LPA","posted":"4d ago","tags":["Kubernetes","Linux"],"applyUrl":"https://www.naukri.com/devops-engineer-jobs-in-bangalore","source":"Naukri"},
    ],
}

def match_score(user_lower, required):
    if not required: return 0.0
    matched = [s for s in required if any(s in u or u in s for u in user_lower)]
    return round(len(matched)/len(required)*100, 1)

def recommend(user_skills, target_role=None, top_n=5, detected_role=None):
    user_lower = {s.lower() for s in user_skills}

    scored = []
    for role_key, required in SKILLS_DB.items():
        score = match_score(user_lower, required)
        matched = [s for s in required if any(s in u or u in s for u in user_lower)]
        missing = [s for s in required if not any(s in u or u in s for u in user_lower)]
        scored.append({"role":role_key,"match_score":score,"matched_skills":matched,"missing_skills":missing[:8]})
    scored.sort(key=lambda x: x["match_score"], reverse=True)
    top_roles = scored[:top_n]

    if target_role:
        key = target_role.upper().replace(" ","-")
        detail = next((r for r in scored if r["role"]==key), top_roles[0] if top_roles else {})
    else:
        detail = top_roles[0] if top_roles else {}

    # Use detected_role to pick job listings (this is the key fix)
    job_key = detected_role if detected_role in JOB_LISTINGS else "software-engineer"
    listings = JOB_LISTINGS.get(job_key, JOB_LISTINGS["software-engineer"])

    base_match = max(detail.get("match_score", 65), 65)
    job_listings = []
    for i, job in enumerate(listings):
        pct = max(55, min(97, round(base_match + 18 - i*4)))
        job_listings.append({**job, "match": pct})

    return {
        "recommended_roles": top_roles,
        "target_role_detail": detail,
        "missing_skills": detail.get("missing_skills", []),
        "matched_skills": detail.get("matched_skills", []),
        "job_listings": job_listings,
    }

if __name__ == "__main__":
    payload = json.loads(sys.stdin.read().strip())
    skills = payload.get("skills", [])
    target_role = payload.get("target_role")
    top_n = int(payload.get("top_n", 5))
    detected = payload.get("detected_role")
    print(json.dumps(recommend(skills, target_role, top_n, detected)))
