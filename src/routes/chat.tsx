import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { MessagesSquare } from "lucide-react";
import { AppShell, Disclaimer, PageHeader } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Atelier Workplace AI" },
      {
        name: "description",
        content: "Ask workplace and productivity questions and get practical, professional answers.",
      },
      { property: "og:title", content: "AI Chat — Atelier Workplace AI" },
      {
        property: "og:description",
        content: "Ask workplace and productivity questions and get practical, professional answers.",
      },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Help me write a professional email",
  "Summarise this topic",
  "Give me productivity tips",
];

function textOf(parts: { type: string; text?: string }[]) {
  return parts.map((p) => (p.type === "text" ? (p.text ?? "") : "")).join("");
}

function ChatPage() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    onError: () =>
      setError("The assistant couldn't respond just now. Please try sending your message again."),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!busy) textareaRef.current?.focus();
  }, [busy, messages.length]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setError(null);
    setInput("");
    void sendMessage({ text: value });
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="AI Workplace Chatbot"
        title="A colleague who's always available."
        description="Ask about writing, meetings, planning or productivity. This conversation disappears when you leave."
      />

      <section className="flex h-[62vh] min-h-[28rem] flex-col rounded-sm border border-border bg-card">
        <Conversation className="flex-1">
          <ConversationContent className="gap-6 px-5 py-6 sm:px-8">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-gold/40 text-gold">
                  <MessagesSquare className="h-4.5 w-4.5" />
                </span>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Start with a suggestion, or ask anything about your working day.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <Button key={s} variant="outline" size="sm" onClick={() => send(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((message) => {
              const text = textOf(message.parts as { type: string; text?: string }[]);
              return (
                <Message key={message.id} from={message.role}>
                  <MessageContent
                    className={
                      message.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-transparent px-0 text-foreground"
                    }
                  >
                    <MessageResponse>{text}</MessageResponse>
                  </MessageContent>
                  {message.role === "assistant" && text ? (
                    <CopyButton value={text} className="h-7 self-start px-2 text-xs" />
                  ) : null}
                </Message>
              );
            })}

            {status === "submitted" ? <Shimmer>Thinking…</Shimmer> : null}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-border p-4 sm:px-6">
          {error ? <p className="mb-3 text-xs text-destructive">{error}</p> : null}
          <PromptInput
            onSubmit={(_, event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              autoFocus
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about emails, meetings, planning or productivity…"
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={!input.trim() && !busy} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </section>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setMessages([])} disabled={busy}>
          New conversation
        </Button>
        <span className="text-xs text-muted-foreground">
          Nothing from this chat is saved once you close the page.
        </span>
      </div>

      <Disclaimer className="mt-6" />
    </AppShell>
  );
}
