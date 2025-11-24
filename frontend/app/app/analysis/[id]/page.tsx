import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, CheckCircle, Copy } from "lucide-react";
import { notFound } from "next/navigation";

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: analysis } = await supabase
        .from("analyses")
        .select("*, resumes(original_text, title)")
        .eq("id", id)
        .eq("user_id", user?.id)
        .single();

    if (!analysis) {
        notFound();
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/app/resumes/${analysis.resume_id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analysis Result</h1>
                    <p className="text-muted-foreground">
                        For: {(analysis.resumes as any)?.title} {analysis.job_title && `— Target: ${analysis.job_title}`}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-4xl font-bold ${analysis.score_overall >= 80 ? "text-green-600" :
                            analysis.score_overall >= 60 ? "text-yellow-600" : "text-red-600"
                            }`}>
                            {analysis.score_overall}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Format</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analysis.score_format}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analysis.score_keywords}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Clarity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analysis.score_clarity}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Tabs defaultValue="improved" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="improved">Improved Version</TabsTrigger>
                            <TabsTrigger value="original">Original</TabsTrigger>
                        </TabsList>
                        <TabsContent value="improved" className="mt-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>AI Improved Content</CardTitle>
                                    <Button variant="outline" size="sm">
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {analysis.improved_text}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="original" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Original Content</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                        {(analysis.resumes as any)?.original_text}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {analysis.suggestions && (analysis.suggestions as string[]).map((suggestion, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
