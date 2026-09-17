import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Mail, Wand2 } from "lucide-react";
import { AppShell, Disclaimer, PageHeader } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Email Generator — Atelier Workplace AI" },
      {
        name: "description",
        content: "Draft professional workplace emails in a formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "Email Generator — Atelier Workplace AI" },
      {
        property: "og:description",
        content: "Draft professional workplace emails in a formal, friendly or persuasive tone.",
      },
    ],
  }),
  component: EmailGenerator,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

function EmailGenerator() {
  const generate = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = recipient.trim().length > 0 && purpose.trim().length > 0 && !loading;

  const onGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generate({
        data: { recipient: recipient.trim(), purpose: purpose.trim(), keyPoints, tone },
      });
      setOutput(result.email);
    } catch {
      setError("The email couldn't be generated just now. Please adjust your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setRecipient("");
    setPurpose("");
    setKeyPoints("");
    setTone("Formal");
    setOutput("");
    setError(null);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Smart Email Generator"
        title="Write the email once, properly."
        description="Give a little context and the assistant drafts a complete, send-ready email you can edit before copying."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="rounded-sm border border-border bg-card p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient &amp; context</Label>
              <Input
                id="recipient"
                placeholder="e.g. My line manager, Sarah, about last week's client review"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g. Request a deadline extension of one week"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                rows={6}
                placeholder={"One point per line, e.g.\nClient feedback arrived late\nDraft is 80% complete"}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button onClick={onGenerate} disabled={!canSubmit} className="gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                {loading ? "Drafting…" : "Generate email"}
              </Button>
              <Button variant="outline" onClick={clearAll} disabled={loading}>
                Clear
              </Button>
            </div>

            {!canSubmit && !loading ? (
              <p className="text-xs text-muted-foreground">
                Add a recipient/context and a purpose to enable drafting.
              </p>
            ) : null}
          </div>
        </section>

        <section className="flex flex-col rounded-sm border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl text-foreground">Your draft</h2>
            <div className="flex gap-2">
              <CopyButton value={output} />
              <Button variant="outline" size="sm" onClick={() => setOutput("")} disabled={!output}>
                Clear
              </Button>
            </div>
          </div>

          {error ? (
            <p className="mb-4 rounded-sm border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
              {error}
            </p>
          ) : null}

          {loading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
              <Loader2 className="h-5 w-5 animate-spin text-gold" />
              <p className="text-sm text-muted-foreground">Composing your email…</p>
            </div>
          ) : output ? (
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="min-h-[26rem] flex-1 resize-y font-sans text-sm leading-relaxed"
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-border py-16 text-center">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <p className="max-w-xs text-sm text-muted-foreground">
                Your generated email will appear here, fully editable.
              </p>
            </div>
          )}
        </section>
      </div>

      <Disclaimer className="mt-6" />
    </AppShell>
  );
}
