import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { BookOpen, Loader2, Search } from "lucide-react";
import { AppShell, Disclaimer, PageHeader } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { runResearch } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — Atelier Workplace AI" },
      {
        name: "description",
        content: "Turn a topic, question or link into a structured brief with insights and recommendations.",
      },
      { property: "og:title", content: "Research Assistant — Atelier Workplace AI" },
      {
        property: "og:description",
        content: "Turn a topic, question or link into a structured brief with insights and recommendations.",
      },
    ],
  }),
  component: ResearchAssistant;
});

function looksLikeUrl(value: string) {
  return /^(https?:\/\/|www\.)\S+$/i.test(value.trim());
}

function ResearchAssistant() {
  const research = useServerFn(runResearch);
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState("");
  const [insights, setInsights] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [title, setTitle] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasOutput = Boolean(summary || insights || recommendations);
  const trimmed = query.trim();
  const invalidUrl = trimmed.length > 0 && /^https?:\/\//i.test(trimmed) && !/\.[a-z]{2,}/i.test(trimmed);
  const canSubmit = trimmed.length >= 3 && !invalidUrl && !loading;

  const onResearch = async () => {
    setLoading(true);
    setError(null);
    setNotice("");
    try {
      const result = await research({ data: { query: trimmed } });
      if (!result.isSupported) {
        setSummary("");
        setInsights("");
        setRecommendations("");
        setTitle("");
        setError(
          result.notice ||
            "That input couldn't be researched. Try a clearer topic, question or a full web address.",
        );
        return;
      }
      setTitle(result.title);
      setNotice(result.notice);
      setSummary(result.summary);
      setInsights(result.keyInsights.map((i) => `• ${i}`).join("\n"));
      setRecommendations(result.recommendations.map((r) => `• ${r}`).join("\n"));
    } catch {
      setError("The brief couldn't be generated just now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setQuery("");
    setSummary("");
    setInsights("");
    setRecommendations("");
    setTitle("");
    setNotice("");
    setError(null);
  };

  const fullBrief = [
    title ? title : null,
    summary ? `Summary\n${summary}` : null,
    insights ? `Key Insights\n${insights}` : null,
    recommendations ? `Recommendations\n${recommendations}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <AppShell>
      <PageHeader
        eyebrow="AI Research Assistant"
        title="From a question to a briefing."
        description="Enter a topic, a question or a web address and receive a summary, the key insights and clear recommendations."
      />

      <section className="rounded-sm border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="query">Topic, question or link</Label>
          <Textarea
            id="query"
            rows={4}
            placeholder="e.g. How should a hybrid team run weekly stand-ups? — or paste an article address"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {invalidUrl ? (
          <p className="mt-3 text-xs text-destructive">
            That web address doesn't look complete. Use a full address such as
            https://example.com/article, or type a topic instead.
          </p>
        ) : looksLikeUrl(trimmed) ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Pages aren't opened directly — the brief is built from the address and the assistant's
            existing knowledge, so verify anything important.
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={onResearch} disabled={!canSubmit} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? "Researching…" : "Build brief"}
          </Button>
          <Button variant="outline" onClick={clearAll} disabled={loading}>
            Clear
          </Button>
          <CopyButton value={fullBrief} label="Copy full brief" />
        </div>
      </section>

      {error ? (
        <p className="mt-6 rounded-sm border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-sm border border-border bg-card py-20 text-center">
          <Loader2 className="h-5 w-5 animate-spin text-gold" />
          <p className="text-sm text-muted-foreground">Reading, structuring and summarising…</p>
        </div>
      ) : hasOutput ? (
        <div className="mt-6 space-y-4">
          {title ? <h2 className="font-display text-2xl text-foreground">{title}</h2> : null}
          {notice ? (
            <p className="rounded-sm border border-border bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
              {notice}
            </p>
          ) : null}

          {[
            { label: "Summary", value: summary, set: setSummary, rows: 6 },
            { label: "Key Insights", value: insights, set: setInsights, rows: 7 },
            { label: "Recommendations", value: recommendations, set: setRecommendations, rows: 6 },
          ].map(({ label, value, set, rows }) => (
            <section key={label} className="rounded-sm border border-border bg-card p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-display text-lg text-foreground">{label}</h3>
                <CopyButton value={value} />
              </div>
              <Textarea
                rows={rows}
                value={value}
                onChange={(e) => set(e.target.value)}
                className="resize-y text-sm leading-relaxed"
              />
            </section>
          ))}
        </div>
      ) : !error ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-border bg-card py-20 text-center">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <p className="max-w-sm text-sm text-muted-foreground">
            Your summary, key insights and recommendations will appear here — all editable.
          </p>
        </div>
      ) : null}

      <Disclaimer className="mt-6" />
    </AppShell>
  );
}
