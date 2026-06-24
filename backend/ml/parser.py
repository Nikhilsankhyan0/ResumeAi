#!/usr/bin/env python3
import sys, json, re, os

def extract_text(path):
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        try:
            import pdfplumber
            with pdfplumber.open(path) as pdf:
                return "\n".join(p.extract_text() or "" for p in pdf.pages)
        except: pass
        try:
            from pypdf import PdfReader
            return "\n".join(p.extract_text() or "" for p in PdfReader(path).pages)
        except: pass
    elif ext in (".docx", ".doc"):
        try:
            from docx import Document
            return "\n".join(p.text for p in Document(path).paragraphs)
        except: pass
    try:
        with open(path, "r", errors="ignore") as f: return f.read()
    except: return ""

SKILLS = [
    "python","pandas","numpy","matplotlib","seaborn","scipy","scikit-learn","sklearn",
    "tensorflow","pytorch","keras","pyspark","nltk","spacy","xgboost","lightgbm",
    "sql","mysql","postgresql","oracle","sql server","sqlite","mongodb","cassandra","redis",
    "tableau","power bi","ms excel","excel","google sheets","looker","qlik","ssrs","ssas","ssis",
    "data analysis","data analytics","data visualization","data cleaning","data wrangling",
    "etl","data governance","data modeling","data warehouse","reporting","kpi","dashboards",
    "statistical analysis","statistics","hypothesis testing","regression","forecasting",
    "machine learning","deep learning","nlp","computer vision","a/b testing","feature engineering",
    "apache spark","hadoop","kafka","airflow","dbt","bigquery","snowflake","redshift","databricks",
    "javascript","typescript","react","angular","vue","node.js","express","next.js","html","css",
    "php","java","c++","c#","go","rust","kotlin","swift","ruby","scala","r","matlab",
    "spring","laravel","django","flask","fastapi","graphql","rest api","microservices",
    "docker","kubernetes","aws","azure","gcp","ci/cd","git","github","linux","bash",
    "terraform","ansible","jenkins","prometheus","grafana",
    "figma","adobe xd","sketch","photoshop","illustrator","wireframing","prototyping","ui/ux",
    "agile","scrum","jira","project management","team management","leadership","presentation",
]

def extract_skills(text):
    tl = text.lower()
    found = []
    for s in SKILLS:
        if re.search(r'\b' + re.escape(s) + r'\b', tl) and s not in found:
            found.append(s)
    return found

def extract_email(text):
    m = re.search(r'[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}', text)
    return m.group(0) if m else ""

def extract_phone(text):
    m = re.search(r'(\+?\d[\d\s\-().]{7,}\d)', text)
    return m.group(0).strip() if m else ""

def extract_name(text):
    lines = [l.strip() for l in text.strip().splitlines() if l.strip()]
    for line in lines[:8]:
        words = line.split()
        if 2 <= len(words) <= 4:
            if not any(c in line for c in ["@","http","+91","+1","."]) or line.count(".") == 0:
                if all(w[0].isupper() for w in words if w[0].isalpha()):
                    if len(line) < 40:
                        return line
    return lines[0][:50] if lines else ""

def extract_experience_years(text):
    ms = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)', text, re.I)
    if ms: return max(int(m) for m in ms)
    # Count from date ranges
    ranges = re.findall(r'(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)?\s*(\d{4})\s*[–\-]\s*(\d{4}|present|current)', text, re.I)
    import datetime
    cy = datetime.datetime.now().year
    total = 0
    for _, s, e in ranges:
        try:
            total += max(0, (cy if e.lower() in ('present','current') else int(e)) - int(s))
        except: pass
    return min(total, 20)

def extract_education(text):
    levels = {"phd":"PhD","ph.d":"PhD","doctorate":"PhD",
              "master":"Master's","msc":"Master's","m.tech":"Master's","mba":"Master's",
              "bachelor":"Bachelor's","bsc":"Bachelor's","b.tech":"Bachelor's","b.e":"Bachelor's",
              "bca":"Bachelor's","b.ca":"Bachelor's",
              "diploma":"Diploma","certificate":"Certificate"}
    tl = text.lower()
    for k, v in levels.items():
        if k in tl: return v
    return "Not specified"

def detect_role(text, skills):
    combined = text.lower() + " " + " ".join(skills).lower()
    signals = {
        "data-analyst":      ["data analyst","data analysis","business intelligence","bi analyst","tableau","power bi","sql analyst","mis analyst"],
        "data-scientist":    ["data scientist","machine learning","ml engineer","deep learning","nlp","ai engineer"],
        "software-engineer": ["software engineer","frontend developer","backend developer","full stack","react developer","node developer","software developer"],
        "designer":          ["ui designer","ux designer","product designer","figma","ui/ux","graphic designer"],
        "hr":                ["human resources","talent acquisition","hr manager","recruiter","hrbp"],
        "finance":           ["financial analyst","accountant","finance manager","investment","banking","ca ","cfa","audit"],
        "devops":            ["devops","cloud engineer","sre","platform engineer","kubernetes engineer"],
    }
    best, best_score = "data-analyst", 0
    for role, sigs in signals.items():
        sc = sum(1 for s in sigs if s in combined)
        if sc > best_score:
            best_score, best = sc, role
    # Extra: if tableau/power bi/data analysis in skills → data analyst
    da_skills = {"tableau","power bi","data analysis","data analytics","ms excel","excel","pandas","numpy"}
    if len(da_skills & set(skills)) >= 3:
        best = "data-analyst"
    return best

def parse_resume(path):
    if not os.path.exists(path):
        return {"error": f"File not found: {path}"}
    raw = extract_text(path)
    if not raw.strip():
        return {"error": "Could not extract text. Install pdfplumber: pip install pdfplumber"}
    skills   = extract_skills(raw)
    exp      = extract_experience_years(raw)
    edu      = extract_education(raw)
    role     = detect_role(raw, skills)
    ml_text  = f"{role.replace('-',' ')} {edu.lower()} {' '.join(skills)} experience {exp} years"
    return {
        "name":             extract_name(raw),
        "email":            extract_email(raw),
        "phone":            extract_phone(raw),
        "education":        edu,
        "experience_years": exp,
        "skills":           skills,
        "detected_role":    role,
        "raw_text":         raw[:4000],
        "ml_text":          ml_text,
    }

if __name__ == "__main__":
    if len(sys.argv) >= 2:
        fp = sys.argv[1]
    else:
        payload = json.loads(sys.stdin.read().strip())
        fp = payload.get("file_path","")
    print(json.dumps(parse_resume(fp)))
