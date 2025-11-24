from fastapi import APIRouter, HTTPException, UploadFile, File
from backend.models.schemas import ResumeAnalyzeRequest, AnalysisResponse
from backend.services.openai_client import analyze_resume_with_ai

router = APIRouter(prefix="/api", tags=["resume"])

@router.post("/analyze-resume", response_model=AnalysisResponse)
async def analyze_resume(request: ResumeAnalyzeRequest):
    try:
        result = analyze_resume_with_ai(
            resume_text=request.resume_text,
            job_title=request.job_title,
            job_description=request.job_description
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    # Placeholder for file parsing logic (PDF/DOCX)
    # For now, we just return a dummy text or read the file as text if possible
    content = await file.read()
    try:
        text = content.decode("utf-8")
    except UnicodeDecodeError:
        text = "Error: Could not decode file. Please upload a text file or paste content."
    
    return {"text": text}
