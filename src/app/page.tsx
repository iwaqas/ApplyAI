import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <Icons.logo className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              ApplyAI
            </CardTitle>
            <CardDescription className="text-md text-muted-foreground">
              Your AI-powered copilot for job applications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">Sign in to get started</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <Icons.google className="mr-2 h-4 w-4" />
                  Google
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <Icons.linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <Icons.github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <Icons.apple className="mr-2 h-4 w-4" />
                  Apple
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
