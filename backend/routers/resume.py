from fastapi import APIRouter, HTTPException, UploadFile, File
from backend.models.schemas import ResumeAnalyzeRequest, AnalysisResponse
from backend.services.openai_client import analyze_resume_with_ai
from backend.services.file_parser import extract_text_from_file

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
    try:
        contents = await file.read()
        text = extract_text_from_file(contents, file.filename or "")
        return {"text": text, "filename": file.filename}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
