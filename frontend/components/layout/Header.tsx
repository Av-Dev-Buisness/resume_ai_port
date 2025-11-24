import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Header() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const signOut = async () => {
        "use server";
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect("/");
    };

    return (
        <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-background">
            <Link className="flex items-center justify-center" href="/app/dashboard">
                <Sparkles className="h-6 w-6 text-primary mr-2" />
                <span className="font-bold text-xl">ResumeAI</span>
            </Link>
            <nav className="ml-6 flex gap-4 sm:gap-6">
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/app/dashboard">
                    Dashboard
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/app/resumes">
                    My Resumes
                </Link>
            </nav>
            <div className="ml-auto flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:inline-block">
                    {user?.email}
                </span>
                <form action={signOut}>
                    <Button variant="ghost" size="sm">
                        Sign Out
                    </Button>
                </form>
            </div>
        </header>
    );
}
