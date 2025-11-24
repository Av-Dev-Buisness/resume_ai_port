from pydantic import BaseModel
from typing import List, Optional

class ResumeAnalyzeRequest(BaseModel):
    resume_text: str
    job_title: Optional[str] = None
    job_description: Optional[str] = None

class AnalysisResponse(BaseModel):
    score_overall: int
    score_format: int
    score_keywords: int
    score_clarity: int
    suggestions: List[str]
    improved_text: str
