import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText, BarChart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch stats
    const { count: resumeCount } = await supabase
        .from("resumes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id);

    const { count: analysisCount } = await supabase
        .from("analyses")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id);

    // Fetch recent analyses
    const { data: recentAnalyses } = await supabase
        .from("analyses")
        .select("id, score_overall, created_at, job_title, resumes(title)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <Link href="/app/resumes/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Analysis
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{resumeCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Analyses Run</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analysisCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">🏆</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {recentAnalyses?.[0]?.score_overall ?? "-"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Analyses</h2>
                {recentAnalyses && recentAnalyses.length > 0 ? (
                    <div className="grid gap-4">
                        {recentAnalyses.map((analysis) => (
                            <Link key={analysis.id} href={`/app/analysis/${analysis.id}`}>
                                <Card className="hover:bg-muted/50 transition-colors">
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="space-y-1">
                                            <p className="font-medium leading-none">
                                                {analysis.job_title || "General Analysis"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {(analysis.resumes as any)?.title} • {new Date(analysis.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`text-lg font-bold ${(analysis.score_overall || 0) >= 80 ? "text-green-600" :
                                                    (analysis.score_overall || 0) >= 60 ? "text-yellow-600" : "text-red-600"
                                                }`}>
                                                {analysis.score_overall}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            No analyses yet. Start by creating a new one!
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
