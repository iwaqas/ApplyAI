
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Book,
  Briefcase,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardNav } from "@/components/dashboard-nav";
import { Icons } from "@/components/icons";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
  { label: "Preferences", href: "/dashboard/preferences", icon: Settings },
  { label: "Connected Portals", href: "/dashboard/portals", icon: Briefcase },
  { label: "Applications", href: "/dashboard/applications", icon: FileText },
  { label: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
];

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = navItems.find((item) => item.href === pathname)?.label || "Dashboard";

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Icons.logo className="h-7 w-7 text-primary" />
            <span className="text-lg font-semibold">ApplyAI</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <DashboardNav items={navItems} />
        </SidebarContent>
        <SidebarFooter>
          <Button variant="outline" asChild>
            <a href="https://firebase.google.com/docs/app-hosting/getting-started" target="_blank" rel="noopener noreferrer">
              <Book className="mr-2 h-4 w-4" />
              Documentation
            </a>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold tracking-tight">{pageTitle}</h1>
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="@user" data-ai-hint="user avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
