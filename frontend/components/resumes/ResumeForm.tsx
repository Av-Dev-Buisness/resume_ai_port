"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // Assuming Label component exists or use standard label
import { analyzeResume } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function ResumeForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const title = formData.get("title") as string;
        const resumeText = formData.get("resumeText") as string;
        const jobTitle = formData.get("jobTitle") as string;
        const jobDescription = formData.get("jobDescription") as string;

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("User not authenticated");

            // 1. Create Resume Record
            const { data: resume, error: resumeError } = await supabase
                .from("resumes")
                .insert({
                    user_id: user.id,
                    title,
                    original_text: resumeText,
                })
                .select()
                .single();

            if (resumeError) throw resumeError;

            // 2. Call Analysis API
            const analysisResult = await analyzeResume(resumeText, jobTitle, jobDescription);

            // 3. Save Analysis Record
            const { data: analysis, error: analysisError } = await supabase
                .from("analyses")
                .insert({
                    user_id: user.id,
                    resume_id: resume.id,
                    job_title: jobTitle,
                    job_description: jobDescription,
                    score_overall: analysisResult.score_overall,
                    score_format: analysisResult.score_format,
                    score_keywords: analysisResult.score_keywords,
                    score_clarity: analysisResult.score_clarity,
                    suggestions: analysisResult.suggestions,
                    improved_text: analysisResult.improved_text,
                })
                .select()
                .single();

            if (analysisError) throw analysisError;

            // 4. Redirect
            router.push(`/app/analysis/${analysis.id}`);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Resume Title
                    </label>
                    <Input id="title" name="title" placeholder="e.g. Software Engineer 2024" required />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="resumeText" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Resume Content
                    </label>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("resumeFile")?.click()}
                                className="w-full sm:w-auto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                Upload Resume File
                            </Button>
                            <input
                                id="resumeFile"
                                name="resumeFile"
                                type="file"
                                accept=".pdf,.docx,.txt"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        try {
                                            const { extractText } = await import("@/lib/api");
                                            const result = await extractText(file);
                                            const textarea = document.getElementById("resumeText") as HTMLTextAreaElement;
                                            if (textarea) {
                                                textarea.value = result.text;
                                            }
                                        } catch (err) {
                                            console.error("Error extracting text:", err);
                                            setError("Failed to extract text from file");
                                        }
                                    }
                                }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Upload a PDF, DOCX, or TXT file, or paste text below</p>
                    </div>
                    <Textarea
                        id="resumeText"
                        name="resumeText"
                        placeholder="Paste your resume text here..."
                        className="min-h-[200px]"
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="jobTitle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Target Job Title (Optional)
                    </label>
                    <Input id="jobTitle" name="jobTitle" placeholder="e.g. Senior Frontend Developer" />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="jobDescription" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Target Job Description (Optional)
                    </label>
                    <Textarea
                        id="jobDescription"
                        name="jobDescription"
                        placeholder="Paste the job description here for better matching..."
                        className="min-h-[150px]"
                    />
                </div>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                    {error}
                </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                    </>
                ) : (
                    "Analyze Resume"
                )}
            </Button>
        </form>
    );
}
