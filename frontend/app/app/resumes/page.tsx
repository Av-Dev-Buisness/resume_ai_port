import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { FileText, PlusCircle } from "lucide-react";

export default async function ResumesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: resumes } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
                <Link href="/app/resumes/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Analysis
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resumes && resumes.length > 0 ? (
                    resumes.map((resume) => (
                        <Link key={resume.id} href={`/app/resumes/${resume.id}`}>
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium truncate pr-4">
                                        {resume.title}
                                    </CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Created: {new Date(resume.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground line-clamp-3 mt-2">
                                        {resume.original_text}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No resumes found. Create your first one!
                    </div>
                )}
            </div>
        </div>
    );
}
