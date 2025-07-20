
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Linkedin,
  Loader2,
  Paperclip,
  Trash2,
  UploadCloud,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { importLinkedInProfile } from "@/ai/flows/profile-import";
import { useToast } from "@/hooks/use-toast";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// We'll use a hardcoded user ID for now. This will be replaced with real auth later.
const USER_ID = "default-user";
// We only create the docRef if firebase is configured.
const profileDocRef = isFirebaseConfigured ? doc(db, "profiles", USER_ID) : null;


export default function ProfilePage() {
  const [profileData, setProfileData] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Only fetch if firebase is configured
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      if (!profileDocRef) {
          setIsLoading(false);
          return;
      }
      try {
        const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data().brief || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Could not load your profile from the database.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleSaveChanges = async () => {
    if (!isFirebaseConfigured || !profileDocRef) {
      toast({
        title: "Configuration Error",
        description: "Firebase is not configured. Please set it up to save data.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    try {
      await setDoc(profileDocRef, { brief: profileData }, { merge: true });
      toast({
        title: "Success!",
        description: "Your profile has been saved.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };


  const handleImport = async () => {
    if (!linkedinUrl.trim()) {
      toast({
        title: "Error",
        description: "Please paste your LinkedIn profile URL first.",
        variant: "destructive",
      });
      return;
    }
    setIsImporting(true);
    try {
      const result = await importLinkedInProfile({
        linkedinProfileUrl: linkedinUrl,
      });
      setProfileData(result.rephrasedProfile);
      toast({
        title: "Success!",
        description: "Your LinkedIn profile has been imported. Don't forget to save!",
      });
      setIsImportDialogOpen(false); // Close the dialog on success
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "There was an error importing your profile. Please try again.";
      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Professional Brief</CardTitle>
            <CardDescription>
              This is your master document. Add all your professional details
              here. Your changes are saved in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
               </div>
            ) : (
              <Textarea
                placeholder={isFirebaseConfigured ? "Paste your resume, CV, experiences, awards, skills, etc." : "Firebase not configured. Check the developer console for more info."}
                className="min-h-[400px] text-sm"
                value={profileData}
                onChange={(e) => setProfileData(e.target.value)}
              />
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Linkedin className="h-5 w-5 text-primary" />
              AI-Assisted Import
            </CardTitle>
            <CardDescription>
              Import from LinkedIn to get a head start.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Import from LinkedIn
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import from LinkedIn</DialogTitle>
                  <DialogDescription>
                    Paste your LinkedIn profile URL below. Our AI will scrape it and rephrase
                    it into a professional brief.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  placeholder="https://linkedin.com/in/your-profile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
                <DialogFooter>
                  <Button onClick={handleImport} disabled={isImporting}>
                    {isImporting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Import and Rephrase
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" /> Documents
            </CardTitle>
            <CardDescription>
              Upload your resume, CV, or other documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex h-24 w-full items-center justify-center rounded-md border-2 border-dashed">
              <label
                htmlFor="file-upload"
                className="flex cursor-pointer flex-col items-center gap-1 text-center text-sm text-muted-foreground"
              >
                <UploadCloud className="h-6 w-6" />
                <span>Upload Files</span>
                <Input id="file-upload" type="file" className="sr-only" />
              </label>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-md border p-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>resume_final_v2.pdf</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
              <li className="flex items-center justify-between rounded-md border p-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>cover_letter_template.docx</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
