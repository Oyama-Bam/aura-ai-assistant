import { createServerFn } from "@tanstack/react-start";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch } from "./ai-gateway.server";

const MODEL = "openai/gpt-6-astra";

const SAFETY_SYSTEM =
  "You are a senior workplace communications and research assistant for a premium productivity suite. " +
  "Be precise, professional and concise. Never invent facts, figures, quotes or sources. " +
  "If information is unavailable, say so plainly.";

function gateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured. Missing LOVABLE_API_KEY.");
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  return createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
}

const reasoningOptions = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "low",
    reasoningSummary: "auto",
    store: false,
    include: ["reasoning.encrypted_content"],
  },
};

const EmailInput = z.object({
  recipient: z.string().min(1).max(500),
  purpose: z.string().min(1).max(1000),
  keyPoints: z.string().max(4000).default(""),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const lovable = gateway();

    const result = streamText({
      model: lovable.responses(MODEL),
      system:
        SAFETY_SYSTEM +
        " You write workplace emails. Output ONLY the email: a 'Subject:' line, then a blank line, then the body " +
        "with a greeting, well-structured paragraphs and a sign-off. Use [Your Name] as the sign-off placeholder. " +
        "No commentary, no markdown code fences.",
      prompt: [
        `Recipient and context: ${data.recipient}`,
        `Purpose of the email: ${data.purpose}`,
        `Key points to include: ${data.keyPoints || "(none supplied — keep it brief)"}`,
        `Tone: ${data.tone}`,
      ].join("\n"),
      providerOptions: reasoningOptions,
    });

    return { email: (await result.text).trim() };
  });

const ResearchInput = z.object({
  query: z.string().min(3).max(4000),
});

const ResearchSchema = z.object({
  isSupported: z
    .boolean()
    .describe("False only when the input is an unusable/invalid link or is impossible to research."),
  notice: z
    .string()
    .describe("Short explanation when isSupported is false, otherwise an empty string."),
  title: z.string().describe("Short title for the research topic."),
  summary: z.string().describe("A clear 3-6 sentence summary."),
  keyInsights: z.array(z.string()).describe("4-6 concise key insights."),
  recommendations: z.array(z.string()).describe("3-5 concrete, actionable workplace recommendations."),
});

export type ResearchResult = z.infer<typeof ResearchSchema>;

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }): Promise<ResearchResult> => {
    const lovable = gateway();

    const result = streamText({
      model: lovable.responses(MODEL),
      output: Output.object({ schema: ResearchSchema }),
      system:
        SAFETY_SYSTEM +
        " You produce structured research briefs for business professionals. " +
        "You cannot browse the web: if the user supplies a URL, work from what the URL and your own knowledge " +
        "reliably indicate, and state clearly in the notice field that the page content was not fetched. " +
        "If the input is not a valid or usable link or topic, set isSupported to false and explain why.",
      prompt: `Research request:\n${data.query}`,
      providerOptions: reasoningOptions,
    });

    return await result.output;
  });
