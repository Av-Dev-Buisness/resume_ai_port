const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function analyzeResume(resumeText: string, jobTitle?: string, jobDescription?: string) {
    const response = await fetch(`${BACKEND_URL}/api/analyze-resume`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            resume_text: resumeText,
            job_title: jobTitle,
            job_description: jobDescription,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to analyze resume');
    }

    return response.json();
}

export async function extractText(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BACKEND_URL}/api/extract-text`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to extract text');
    }

    return response.json();
}
