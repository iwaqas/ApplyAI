
"use client";

import { useState, useEffect, useCallback } from "react";
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
import { db, storage, isFirebaseConfigured } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
  type StorageReference,
} from "firebase/storage";
import { Progress } from "@/components/ui/progress";

const USER_ID = "default-user";

interface UploadedFile {
  name: string;
  url: string;
  ref: StorageReference;
}

interface UploadingFile {
  name: string;
  progress: number;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }

    const fetchProfileAndFiles = async () => {
      const profileDocRef = doc(db, "profiles", USER_ID);
      const documentsRef = ref(storage, `users/${USER_ID}/documents`);
      
      try {
        const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data().brief || "");
        }
        
        const res = await listAll(documentsRef);
        const files = await Promise.all(
          res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return { name: itemRef.name, url, ref: itemRef };
          })
        );
        setUploadedFiles(files);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Could not load your profile or documents.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndFiles();
  }, [toast]);

  const handleSaveChanges = async () => {
    if (!isFirebaseConfigured) {
      toast({
        title: "Configuration Error",
        description: "Firebase is not configured. Please set it up to save data.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    
    const profileDocRef = doc(db, "profiles", USER_ID);
    
    try {
      await setDoc(profileDocRef, { brief: profileData }, { merge: true });
      toast({
        title: "Profile Saved",
        description: "Your profile has been updated.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your profile.",
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isFirebaseConfigured) {
        toast({ title: "Configuration Error", description: "Firebase is not configured for file uploads.", variant: "destructive" });
        return;
    }
    if (e.target.files) {
        const documentsRef = ref(storage, `users/${USER_ID}/documents`);
        const filesToUpload = Array.from(e.target.files);
        
        filesToUpload.forEach(file => {
            const fileRef = ref(documentsRef, file.name);
            const uploadTask = uploadBytesResumable(fileRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadingFiles(prev => {
                        const existing = prev.find(f => f.name === file.name);
                        if (existing) {
                            return prev.map(f => f.name === file.name ? { ...f, progress } : f);
                        }
                        return [...prev, { name: file.name, progress }];
                    });
                },
                (error) => {
                    console.error("Upload failed:", error);
                    toast({ title: `Upload of ${file.name} failed`, variant: "destructive" });
                    setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const newFile: UploadedFile = { name: file.name, url: downloadURL, ref: uploadTask.snapshot.ref };
                        setUploadedFiles(prev => [...prev, newFile]);
                        setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
                        toast({ title: "Upload Complete", description: `${file.name} has been uploaded.` });
                    });
                }
            );
        });
    }
};

const handleDeleteFile = (fileToDelete: UploadedFile) => {
    if (!isFirebaseConfigured) return;
    deleteObject(fileToDelete.ref).then(() => {
        setUploadedFiles(prev => prev.filter(f => f.name !== fileToDelete.name));
        toast({ title: "File Deleted", description: `${fileToDelete.name} has been deleted.` });
    }).catch(error => {
        console.error("Error deleting file:", error);
        toast({ title: "Delete Failed", description: `Could not delete ${fileToDelete.name}.`, variant: "destructive" });
    });
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
                placeholder="Paste your resume, CV, experiences, awards, skills, etc."
                className="min-h-[400px] text-sm"
                value={profileData}
                onChange={(e) => setProfileData(e.target.value)}
                disabled={isSaving}
              />
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges} disabled={isSaving || isLoading}>
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
                <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} multiple disabled={!isFirebaseConfigured} />
              </label>
            </div>
            <ul className="space-y-2 text-sm">
             {uploadingFiles.map(file => (
                <li key={file.name}>
                  <div className="flex items-center justify-between">
                      <span className="truncate">{file.name}</span>
                      <span className="text-muted-foreground">{Math.round(file.progress)}%</span>
                  </div>
                  <Progress value={file.progress} className="h-1 mt-1" />
                </li>
             ))}
              {uploadedFiles.map((file) => (
                <li key={file.name} className="flex items-center justify-between rounded-md border p-2">
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </a>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteFile(file)}>
                      <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
              {isLoading && (
                  <li className="flex justify-center items-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                  </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
