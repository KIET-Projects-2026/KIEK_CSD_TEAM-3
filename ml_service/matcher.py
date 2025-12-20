import spacy
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load models once (important for performance)
nlp = spacy.load("en_core_web_sm")
model = SentenceTransformer("all-MiniLM-L6-v2")


def extract_keywords(text: str):
    doc = nlp(text.lower())
    return list(set(
        token.text for token in doc
        if token.pos_ in ["NOUN", "PROPN"]
        and not token.is_stop
        and len(token.text) > 2
    ))


def skill_overlap(resume_skills, job_skills):
    if not job_skills:
        return 0.0
    return len(set(resume_skills) & set(job_skills)) / len(job_skills)


def rank_jobs(resume_text: str, jobs: list):
    resume_skills = extract_keywords(resume_text)
    resume_vec = model.encode(resume_text)

    results = []

    for job in jobs:
        job_text = job["description"]
        job_vec = model.encode(job_text)

        semantic_score = float(
            cosine_similarity([resume_vec], [job_vec])[0][0] * 100
        )

        job_skills = extract_keywords(job_text)
        overlap_score = skill_overlap(resume_skills, job_skills) * 100

        # Final weighted score
        final_score = float(round(
            0.7 * semantic_score + 0.3 * overlap_score, 2
        ))

        # UX calibration
        final_score = min(100.0, max(final_score + 15, 0))

        results.append({
            "job_id": job["id"],
            "job_title": job.get("title", ""),
            "score": final_score,
            "matching_skills": list(set(resume_skills) & set(job_skills)),
            "missing_skills": list(set(job_skills) - set(resume_skills))
        })

    return sorted(results, key=lambda x: x["score"], reverse=True)
