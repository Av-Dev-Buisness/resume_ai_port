import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ResumeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: resume } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .eq("user_id", user?.id)
        .single();

    if (!resume) {
        notFound();
    }

    const { data: analyses } = await supabase
        .from("analyses")
        .select("*")
        .eq("resume_id", resume.id)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/app/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">{resume.title}</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Original Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm font-mono max-h-[500px] overflow-y-auto">
                                {resume.original_text}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analysis History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analyses && analyses.length > 0 ? (
                                    analyses.map((analysis) => (
                                        <Link key={analysis.id} href={`/app/analysis/${analysis.id}`}>
                                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                                <div className="space-y-1">
                                                    <p className="font-medium">
                                                        {analysis.job_title || "General Analysis"}
                                                    </p>
                                                    <div className="flex items-center text-xs text-muted-foreground">
                                                        <Calendar className="mr-1 h-3 w-3" />
                                                        {new Date(analysis.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className={`text-lg font-bold ${(analysis.score_overall || 0) >= 80 ? "text-green-600" :
                                                    (analysis.score_overall || 0) >= 60 ? "text-yellow-600" : "text-red-600"
                                                    }`}>
                                                    {analysis.score_overall}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-sm">No analyses run yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
