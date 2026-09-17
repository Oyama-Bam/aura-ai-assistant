import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, Mail, BookOpen, MessagesSquare, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email-generator", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
  { to: "/chat", label: "AI Chat", icon: MessagesSquare },
] as const;

export const DISCLAIMER =
  "AI-generated content may contain errors. Review and verify important information before using it. Do not enter confidential or sensitive information.";

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-gold/40 font-display text-lg text-gold">
        A
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg text-sidebar-foreground">Atelier</span>
        <span className="block text-[0.625rem] uppercase tracking-[0.2em] text-sidebar-foreground/50">
          Workplace AI
        </span>
      </span>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <Icon className={cn("h-4 w-4", active ? "text-gold" : "text-sidebar-foreground/50")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col bg-sidebar px-5 py-6">
      <Brand />
      <div className="mt-8 flex-1">
        <p className="mb-3 px-3 text-[0.625rem] uppercase tracking-[0.18em] text-sidebar-foreground/40">
          Workspace
        </p>
        <NavLinks onNavigate={onNavigate} />
      </div>
      <p className="mt-8 border-t border-sidebar-border pt-4 text-[0.6875rem] leading-relaxed text-sidebar-foreground/40">
        Session-only workspace. Nothing you type is saved.
      </p>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-8">
      <p className="eyebrow">{eyebrow}</p>
      <div className="gold-rule my-3" />
      <h1 className="font-display text-3xl text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
    </header>
  );
}

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "rounded-sm border border-border bg-secondary/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {DISCLAIMER}
    </p>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarInner />
        </div>
      </aside>

      <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 lg:hidden">
        <Brand />
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((v) => !v)}
          className="rounded-sm border border-sidebar-border p-2 text-sidebar-foreground"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <div className="border-b border-sidebar-border bg-sidebar px-5 pb-6 lg:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      ) : null}

      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12">{children}</div>
      </main>
    </div>
  );
}
