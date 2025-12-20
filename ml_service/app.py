from fastapi import FastAPI, UploadFile, File, Form
import tempfile
import os
import json

from document_parser import extract_text
from matcher import rank_jobs

app = FastAPI(title="Resume Job Matching ML Service")


def save_upload_file(upload_file: UploadFile) -> str:
    suffix = os.path.splitext(upload_file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(upload_file.file.read())
        return tmp.name


@app.post("/match")
async def match_resume_to_jobs(
    resume: UploadFile = File(...),
    jobs: str = Form(...)
):
    # Parse jobs JSON safely
    try:
        jobs = json.loads(jobs)
        assert isinstance(jobs, list)
    except Exception:
        return {
            "status": "error",
            "message": "Invalid jobs format. Expected JSON array."
        }

    temp_path = save_upload_file(resume)

    try:
        resume_text = extract_text(temp_path)
        ranked_jobs = rank_jobs(resume_text, jobs)

        return {
            "status": "success",
            "matches": ranked_jobs
        }

    finally:
        os.remove(temp_path)
