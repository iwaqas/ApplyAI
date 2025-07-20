
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, Link, Loader2, Wand2 } from "lucide-react";
import { draftCvCoverLetter } from "@/ai/flows/draft-cv-cover-letter";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { scrapeUrl } from "@/ai/flows/scrape-url";
import { Separator } from "@/components/ui/separator";

const USER_ID = "default-user";

const applications = [
  {
    jobTitle: "Senior Frontend Developer",
    company: "Stripe",
    date: "2023-07-15",
    status: "Applied",
  },
  {
    jobTitle: "Product Designer",
    company: "Google",
    date: "2023-07-12",
    status: "Interviewing",
  },
  {
    jobTitle: "DevOps Engineer",
    company: "Vercel",
    date: "2023-07-10",
    status: "Applied",
  },
  {
    jobTitle: "UX Researcher",
    company: "Figma",
    date: "2023-07-05",
    status: "Offer",
  },
  {
    jobTitle: "Backend Engineer",
    company: "Netflix",
    date: "2023-07-01",
    status: "Rejected",
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Interviewing":
      return "default";
    case "Offer":
      return "secondary";
    case "Rejected":
      return "destructive";
    default:
      return "outline";
  }
};

export default function ApplicationsPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [includeCoverLetter, setIncludeCoverLetter] = useState(true);
  const [generatedCv, setGeneratedCv] = useState("");
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleImportFromUrl = async () => {
    if (!jobUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL.",
        variant: "destructive",
      });
      return;
    }
    setIsScraping(true);
    try {
      const scrapedContent = await scrapeUrl({ url: jobUrl });
      if (!scrapedContent || scrapedContent.length < 50) {
        throw new Error("Could not extract sufficient content from the URL. Try pasting the description manually.");
      }
      setJobDescription(scrapedContent);
      toast({
        title: "Success!",
        description: "Job description has been imported.",
      });
    } catch (error) {
       console.error(error);
       const errorMessage = error instanceof Error ? error.message : "There was an error scraping the URL.";
       toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
        setIsScraping(false);
    }
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please paste or import a job description.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    setGeneratedCv("");
    setGeneratedCoverLetter("");
    try {
      const profileDocRef = doc(db, "profiles", USER_ID);
      const preferencesDocRef = doc(db, "preferences", USER_ID);

      const [profileSnap, preferencesSnap] = await Promise.all([
        getDoc(profileDocRef),
        getDoc(preferencesDocRef),
      ]);

      const profileData = profileSnap.exists() ? profileSnap.data().brief : "";
      const preferencesData = preferencesSnap.exists() ? preferencesSnap.data() : null;

      if (!profileData || !preferencesData) {
        toast({
          title: "Profile or Preferences Missing",
          description: "Please make sure you have saved your profile brief and job preferences before generating an application.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }
      
      const jobPreferencesString = `Career Level: ${preferencesData.careerLevel}, Years of Experience: ${preferencesData.experience}, Preferred Job Titles: ${preferencesData.jobTitles.map((t: any) => t.value).join(', ')}`;

      const result = await draftCvCoverLetter({
        jobDescription,
        includeCoverLetter,
        profileData: profileData,
        jobPreferences: jobPreferencesString,
      });

      setGeneratedCv(result.cv);
      if (result.coverLetter) {
        setGeneratedCoverLetter(result.coverLetter);
      }
      toast({
        title: "Success!",
        description: "Your new CV and Cover Letter are ready.",
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "There was an error generating the documents. Please try again.";
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Application History</CardTitle>
            <CardDescription>
              Track all your job applications in one place.
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Wand2 className="mr-2 h-4 w-4" />
                Draft New Application
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Draft New Application with AI</DialogTitle>
                <DialogDescription>
                  Paste a job description below, or import from a URL, and we'll craft a tailored CV
                  and cover letter for you.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="job-url">Import from URL</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="job-url"
                        placeholder="https://example.com/job-posting"
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                        disabled={isScraping}
                      />
                      <Button onClick={handleImportFromUrl} disabled={isScraping}>
                        {isScraping ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Link className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">OR</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job-description">Paste Job Description</Label>
                    <Textarea
                      id="job-description"
                      placeholder="Paste the full job description here."
                      className="h-80"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-cover-letter"
                      checked={includeCoverLetter}
                      onCheckedChange={(checked) => setIncludeCoverLetter(!!checked)}
                    />
                    <Label htmlFor="include-cover-letter">
                      Include Cover Letter
                    </Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Generated Documents</Label>
                  <Card className="h-96 overflow-auto">
                    <CardContent className="p-4">
                      {isGenerating ? (
                        <div className="flex h-full items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : (
                        <div className="space-y-4 text-sm">
                          {generatedCv && (
                            <div>
                               <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold">CV</h3>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleDownload(generatedCv, "cv.txt")}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                              <pre className="whitespace-pre-wrap rounded-md bg-muted p-2 font-sans">
                                {generatedCv}
                              </pre>
                            </div>
                          )}
                          {generatedCoverLetter && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold">Cover Letter</h3>
                                 <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleDownload(generatedCoverLetter, "cover-letter.txt")}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                              <pre className="whitespace-pre-wrap rounded-md bg-muted p-2 font-sans">
                                {generatedCoverLetter}
                              </pre>
                            </div>
                          )}
                          {!generatedCv && !generatedCoverLetter && (
                            <p className="text-muted-foreground">Your generated documents will appear here.</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleGenerate} disabled={isGenerating}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{app.jobTitle}</TableCell>
                <TableCell>{app.company}</TableCell>
                <TableCell>{app.date}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
