import json
from openai import OpenAI
from backend.config import settings
from backend.models.schemas import AnalysisResponse

client = OpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPT = """
You are an expert resume coach and recruiter. You evaluate resumes, score them and improve wording while keeping facts accurate.
"""

def analyze_resume_with_ai(resume_text: str, job_title: str = None, job_description: str = None) -> AnalysisResponse:
    user_content = f"Resume Text:\n{resume_text}\n"
    if job_title:
        user_content += f"\nTarget Job Title: {job_title}"
    if job_description:
        user_content += f"\nTarget Job Description: {job_description}"
    
    user_content += """
    
    Please analyze this resume and provide:
    1. Scores (0-100) for:
       - Overall Effectiveness (score_overall)
       - Format and Structure (score_format)
       - Keyword Alignment (score_keywords)
       - Clarity and Impact (score_clarity)
    2. A list of concrete suggestions for improvement.
    3. An improved version of the resume text that keeps factual content but improves wording.
    
    Return the response in strict JSON format matching this structure:
    {
      "score_overall": int,
      "score_format": int,
      "score_keywords": int,
      "score_clarity": int,
      "suggestions": [str],
      "improved_text": str
    }
    """

    try:
        response = client.chat.completions.create(
            model="gpt-5-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_content}
            ],
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        return AnalysisResponse(**data)
    except Exception as e:
        print(f"Error calling OpenAI: {e}")
        # Return a fallback or re-raise depending on requirements. 
        # For now, re-raising to let FastAPI handle 500, or returning a mock for dev if needed.
        raise e
