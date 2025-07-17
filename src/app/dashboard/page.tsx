
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Activity,
  Briefcase,
  CheckCircle,
  FileText,
  User,
  Play,
  Square,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const recentApplications = [
  {
    jobTitle: "Senior Frontend Developer",
    company: "Stripe",
    status: "Applied",
  },
  {
    jobTitle: "Product Designer",
    company: "Google",
    status: "Interviewing",
  },
  {
    jobTitle: "DevOps Engineer",
    company: "Vercel",
    status: "Applied",
  },
  {
    jobTitle: "UX Researcher",
    company: "Figma",
    status: "Offer",
  },
];

export default function DashboardPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [numApplications, setNumApplications] = useState(10);
  const [isApplying, setIsApplying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentApp, setCurrentApp] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const { toast } = useToast();

  const maxApps = isPremium ? 100 : 10;

  const cost = useMemo(() => {
    if (!isPremium || numApplications <= 10) return 0;
    return (numApplications - 10) * 0.1;
  }, [isPremium, numApplications]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isApplying && currentApp < numApplications) {
      interval = setInterval(() => {
        setCurrentApp((prev) => prev + 1);
      }, 1000);
    } else if (isApplying && currentApp >= numApplications) {
      setIsApplying(false);
      setStatusMessage(`Finished applying to ${numApplications} jobs!`);
      toast({ title: "Success!", description: "Auto-applying complete." });
    }
    return () => clearInterval(interval);
  }, [isApplying, currentApp, numApplications, toast]);

  useEffect(() => {
    if (isApplying) {
      setProgress((currentApp / numApplications) * 100);
      setStatusMessage(`Applying to job ${currentApp + 1} of ${numApplications}...`);
    }
  }, [currentApp, isApplying, numApplications]);


  const handleStart = () => {
    if (numApplications > 0 && numApplications <= maxApps) {
      setIsApplying(true);
      setCurrentApp(0);
      setProgress(0);
      setStatusMessage("Starting application process...");
    } else {
      toast({
        title: "Invalid Number",
        description: `Please enter a number between 1 and ${maxApps}.`,
        variant: "destructive",
      });
    }
  };

  const handleStop = () => {
    setIsApplying(false);
    setStatusMessage(`Process stopped. ${currentApp} applications sent.`);
    toast({ title: "Process Stopped", description: "You stopped the auto-apply process." });
  };
  
  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
        setNumApplications(value);
    } else if (e.target.value === "") {
        setNumApplications(0);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profile Completion
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Applications Sent
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">in the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Portals
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              LinkedIn, Indeed, Monster
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Status
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="flex items-center space-x-2">
                <Label htmlFor="premium-switch">Free</Label>
                <Switch
                    id="premium-switch"
                    checked={isPremium}
                    onCheckedChange={setIsPremium}
                    aria-label="Toggle between Free and Premium plan"
                />
                <Label htmlFor="premium-switch" className="text-primary font-bold">Premium</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              {isPremium ? "Next billing on July 30th" : "Upgrade to unlock more features."}
            </p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="text-primary" /> Auto-Apply for Jobs
          </CardTitle>
          <CardDescription>
            Let AI handle the applications. Select how many jobs you want to apply for.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="num-applications">Number of Applications</Label>
              <Input
                id="num-applications"
                type="number"
                value={numApplications}
                onChange={handleNumChange}
                max={maxApps}
                min="1"
                disabled={isApplying}
              />
              <p className="text-xs text-muted-foreground">
                {isPremium
                  ? `First 10 are free. Additional apps are $0.10 each.`
                  : `You can apply for up to ${maxApps} jobs on the free plan.`}
              </p>
            </div>
            <div className="space-y-2 self-end">
              {isApplying ? (
                <Button onClick={handleStop} variant="destructive" className="w-full">
                  <Square className="mr-2" /> Stop Applying
                </Button>
              ) : (
                <Button onClick={handleStart} className="w-full">
                  <Play className="mr-2" /> Start Applying
                </Button>
              )}
               {cost > 0 && <p className="text-sm text-center font-medium">Estimated Cost: ${cost.toFixed(2)}</p>}
            </div>
          </div>
          {isApplying && (
             <div className="space-y-2 pt-4">
                <Progress value={progress} className="h-2"/>
                <p className="text-sm text-center text-muted-foreground">{statusMessage}</p>
            </div>
          )}
          {!isApplying && statusMessage && <p className="text-sm text-center text-muted-foreground pt-4">{statusMessage}</p>}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                A quick look at your latest job application activities.
              </CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/applications">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApplications.map((app, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{app.jobTitle}</TableCell>
                  <TableCell>{app.company}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        app.status === "Interviewing"
                          ? "default"
                          : app.status === "Offer"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        app.status === "Offer"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : ""
                      }
                    >
                      {app.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
