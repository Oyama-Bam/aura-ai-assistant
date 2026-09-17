import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, BookOpen, MessagesSquare, ArrowRight, Clock, ShieldCheck, Sparkle } from "lucide-react";
import { AppShell, Disclaimer } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Atelier Workplace AI" },
      {
        name: "description",
        content:
          "Your premium AI workspace: draft professional emails, build research briefs and ask workplace questions.",
      },
      { property: "og:title", content: "Dashboard — Atelier Workplace AI" },
      {
        property: "og:description",
        content:
          "Your premium AI workspace: draft professional emails, build research briefs and ask workplace questions.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email-generator",
    icon: Mail,
    name: "Email Generator",
    copy: "Draft polished workplace emails from a few notes, in a formal, friendly or persuasive tone.",
  },
  {
    to: "/research",
    icon: BookOpen,
    name: "Research Assistant",
    copy: "Turn a topic, question or link into a structured brief with insights and recommendations.",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    name: "AI Chat",
    copy: "Ask anything about work, writing or productivity and get practical answers in seconds.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell>
      <section className="rounded-sm border border-border bg-card p-8 shadow-[var(--shadow-elevated)] sm:p-12">
        <p className="eyebrow">Welcome back</p>
        <div className="gold-rule my-3" />
        <h1 className="max-w-2xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
          A quieter, sharper way to get workplace writing done.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Atelier brings drafting, research and everyday questions into one calm workspace. Choose a
          tool below and start in seconds — nothing is stored between sessions.
        </p>
        <Link
          to="/email-generator"
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start with an email
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ to, icon: Icon, name, copy }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col rounded-sm border border-border bg-card p-6 transition-all hover:border-gold/50 hover:shadow-[var(--shadow-elevated)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-border text-foreground transition-colors group-hover:border-gold/50 group-hover:text-gold">
              <Icon className="h-4.5 w-4.5" />
            </span>
            <h2 className="mt-5 font-display text-xl text-foreground">{name}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors group-hover:text-gold">
              Open
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Clock, title: "Minutes, not hours", copy: "Structured prompts do the heavy lifting." },
          { icon: ShieldCheck, title: "Nothing stored", copy: "Your inputs live only in this session." },
          { icon: Sparkle, title: "Always editable", copy: "Every output is yours to refine and copy." },
        ].map(({ icon: Icon, title, copy }) => (
          <div key={title} className="rounded-sm border border-border bg-secondary/40 p-5">
            <Icon className="h-4 w-4 text-gold" />
            <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{copy}</p>
          </div>
        ))}
      </section>

      <Disclaimer className="mt-6" />
    </AppShell>
  );
}
