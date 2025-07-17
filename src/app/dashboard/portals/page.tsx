"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const portals = [
  {
    name: "LinkedIn",
    description: "The world's largest professional network.",
    logo: "https://placehold.co/48x48.png",
    connected: true,
  },
  {
    name: "Indeed",
    description: "The #1 job site in the world.",
    logo: "https://placehold.co/48x48.png",
    connected: true,
  },
  {
    name: "Monster",
    description: "Find the right job or hire the right talent.",
    logo: "https://placehold.co/48x48.png",
    connected: false,
  },
  {
    name: "ZipRecruiter",
    description: "The smartest way to hire.",
    logo: "https://placehold.co/48x48.png",
    connected: true,
  },
  {
    name: "Glassdoor",
    description: "Company reviews, salaries, and jobs.",
    logo: "https://placehold.co/48x48.png",
    connected: false,
  },
    {
    name: "Wellfound",
    description: "Formerly AngelList Talent.",
    logo: "https://placehold.co/48x48.png",
    connected: false,
  },
];

export default function PortalsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Connect Job Portals</h1>
        <p className="text-muted-foreground">
          Link your accounts to let ApplyAI find and apply for jobs on your behalf.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {portals.map((portal) => (
          <Card key={portal.name}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    src={portal.logo}
                    alt={`${portal.name} logo`}
                    width={48}
                    height={48}
                    className="rounded-md"
                    data-ai-hint="company logo"
                  />
                  <div>
                    <CardTitle>{portal.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {portal.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor={`connect-${portal.name.toLowerCase()}`}>
                  {portal.connected ? "Connected" : "Connect"}
                </Label>
                <Switch
                  id={`connect-${portal.name.toLowerCase()}`}
                  checked={portal.connected}
                  aria-label={`Connect to ${portal.name}`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
