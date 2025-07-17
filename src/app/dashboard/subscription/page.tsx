import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const freePlanFeatures = [
  "10 free applications per month",
  "AI-powered profile import",
  "Connect up to 2 job portals",
  "Basic application tracking",
];

const premiumPlanFeatures = [
  "Everything in Free, plus:",
  "Unlimited applications ($0.10/each after 10)",
  "Advanced CV & cover letter generation",
  "Connect unlimited job portals",
  "Priority support",
];

export default function SubscriptionPage() {
  const freeApplicationsUsed = 7;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your plan and billing details.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free Plan</CardTitle>
            <CardDescription>
              Your current plan. Perfect for getting started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm font-medium">
                <span>Monthly Applications</span>
                <span>
                  {freeApplicationsUsed} / 10 used
                </span>
              </div>
              <Progress value={(freeApplicationsUsed / 10) * 100} />
              <p className="mt-2 text-xs text-muted-foreground">
                Your free applications will reset in 12 days.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {freePlanFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Your Current Plan
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Premium Plan</CardTitle>
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <Star className="h-5 w-5" />
                <span>Most Popular</span>
              </div>
            </div>
            <CardDescription>
              Unlock the full power of ApplyAI and supercharge your job search.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-3xl font-bold">
              $3 <span className="text-lg font-normal text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {premiumPlanFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Upgrade to Premium
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
