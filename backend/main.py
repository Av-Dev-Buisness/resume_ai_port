from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import resume

app = FastAPI(title="AI Resume Optimizer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)

@app.get("/")
async def root():
    return {"message": "AI Resume Optimizer API is running"}
