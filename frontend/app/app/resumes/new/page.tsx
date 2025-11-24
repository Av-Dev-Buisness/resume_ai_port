import ResumeForm from "@/components/resumes/ResumeForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewResumePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>New Resume Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResumeForm />
                </CardContent>
            </Card>
        </div>
    );
}
