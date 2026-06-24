#!/usr/bin/env python3
import sys, json, re, os

DOMAIN_SKILLS = {
    "data": ["sql","python","r","excel","ms excel","tableau","power bi","looker","data analysis","data analytics","data visualization","data cleaning","data wrangling","etl","data governance","data modeling","reporting","kpi","dashboards","statistical analysis","statistics","forecasting","pandas","numpy","matplotlib","seaborn","scikit-learn","machine learning","deep learning","airflow","dbt","bigquery","snowflake","spark","hadoop"],
    "software": ["javascript","typescript","react","angular","vue","node.js","html","css","python","java","c++","c#","go","php","ruby","kotlin","django","flask","fastapi","graphql","rest api","git","agile","sql","mongodb","postgresql","redis","docker","aws"],
    "design": ["figma","adobe xd","sketch","photoshop","illustrator","wireframing","prototyping","user research","ui/ux","design systems","typography","branding","user testing","accessibility"],
    "hr": ["recruitment","talent acquisition","onboarding","employee relations","performance management","hrms","payroll","training","compliance","workday","hris","people analytics","compensation"],
    "finance": ["financial analysis","excel","budgeting","forecasting","accounting","valuation","risk management","sql","power bi","tally","gst","taxation","audit","financial modeling"],
    "devops": ["docker","kubernetes","aws","azure","gcp","ci/cd","git","terraform","ansible","linux","bash","prometheus","grafana","jenkins"],
}

STOPWORDS = {"copy","ensuring","removing","establishing","developing","collaborating","streamline","strategies","secondary","primary","corrupted","accurate","quality","policies","decisions","trends","inform","analyse","analyze","manage","sources","extracting","providing","using","based","high","make","take","help","work","team","company","role","year","time","good","that","with","from","have","will","your","their","been","they","would","about","there","which","more"}

def detect_domain(skills, raw=""):
    combined = " ".join(skills).lower() + " " + raw[:300].lower()
    scores = {d: sum(1 for s in sl if s in combined) for d, sl in DOMAIN_SKILLS.items()}
    return max(scores, key=scores.get)

def get_required_skills(jd, domain, resume_skills):
    all_domain = DOMAIN_SKILLS.get(domain, []) + DOMAIN_SKILLS.get("data", [])
    jd_lower = (jd or "").lower()
    # Skills explicitly in JD
    in_jd = [s for s in all_domain if re.search(r'\b'+re.escape(s)+r'\b', jd_lower)]
    # Standard skills for domain (always include)
    standard = {"data":["sql","python","excel","data analysis","data visualization","tableau","power bi","data cleaning","etl","reporting","statistics","kpi","dashboards"],"software":["git","sql","rest api","agile","javascript","python","html","css"],"design":["figma","wireframing","prototyping","user research","ui/ux"],"hr":["recruitment","onboarding","employee relations","performance management"],"finance":["excel","financial analysis","budgeting","accounting","forecasting"],"devops":["docker","git","linux","ci/cd","aws"]}.get(domain, [])
    combined = list(dict.fromkeys(in_jd + standard))
    return combined[:15] if combined else standard

def tfidf_sim(a, b):
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        v = TfidfVectorizer(stop_words="english", max_features=2000)
        m = v.fit_transform([a, b])
        return float(cosine_similarity(m[0:1], m[1:2])[0][0]) * 100
    except:
        stop = STOPWORDS
        wa = set(re.findall(r'[a-z]{3,}', a.lower())) - stop
        wb = set(re.findall(r'[a-z]{3,}', b.lower())) - stop
        if not wb: return 55.0
        return round(len(wa & wb) / max(len(wa | wb), 1) * 100 * 4.0, 1)

def calculate_ats(resume_data, jd_text=""):
    skills    = [s.lower() for s in (resume_data.get("skills") or [])]
    raw       = resume_data.get("raw_text", "")
    ml_text   = resume_data.get("ml_text", "") or raw
    exp_years = int(resume_data.get("experience_years") or 0)

    domain = detect_domain(skills, raw)
    required = get_required_skills(jd_text, domain, skills)

    # Flexible skill matching
    matched, missing = [], []
    for req in required:
        rl = req.lower()
        hit = any(rl==s or rl in s or s in rl or rl.replace(" ","") == s.replace(" ","") or rl.replace("ms ","") == s.replace("ms ","") for s in skills)
        (matched if hit else missing).append(req)

    skill_pct = round(len(matched) / max(len(required), 1) * 100)

    # Keyword score - only domain vocab
    domain_vocab = set(DOMAIN_SKILLS.get(domain, []) + DOMAIN_SKILLS.get("data", []))
    kw_in_resume = [w for w in domain_vocab if w in raw.lower()]
    if jd_text:
        kw_in_jd = [w for w in domain_vocab if w in jd_text.lower()]
        overlap  = [w for w in kw_in_jd if w in raw.lower()]
        keyword_pct = round(len(overlap)/max(len(kw_in_jd),1)*100)
        keyword_pct = max(40, min(90, keyword_pct + 25))
    else:
        keyword_pct = min(85, 35 + len(kw_in_resume)*4)

    # Semantic
    if jd_text and len(raw) > 50:
        sem = tfidf_sim(ml_text, jd_text)
        semantic_pct = max(50, min(90, sem + 28))
    else:
        semantic_pct = max(60, min(82, 40 + len(skills)*3))

    # Experience
    exp_score = 90 if exp_years>=5 else 75 if exp_years>=3 else 60 if exp_years>=1 else 40

    # Certs
    cert_kws = ["certified","certification","certificate","cfa","acca","aws certified","pmp"]
    cert_score = min(80, sum(25 for c in cert_kws if c in raw.lower()))

    # Score
    ats = round(keyword_pct*0.20 + semantic_pct*0.35 + skill_pct*0.20 + exp_score*0.15 + cert_score*0.10)
    ats = max(40, min(95, ats))

    cat = "Excellent" if ats>=80 else "Good" if ats>=65 else "Fair" if ats>=50 else "Needs Work"

    return {"ats_score":ats,"ats_category":cat,"detected_domain":domain,
            "breakdown":{"tfidf_score":keyword_pct,"semantic_score":round(semantic_pct),"skill_score":skill_pct,"experience_score":exp_score,"certification_score":cert_score},
            "matched_skills":matched[:10],"missing_skills":missing[:10]}

if __name__ == "__main__":
    p = json.loads(sys.stdin.read().strip())
    print(json.dumps(calculate_ats(p.get("resume",{}), p.get("jd",""))))
