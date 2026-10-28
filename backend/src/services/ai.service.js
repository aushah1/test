import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import env from "../config/config.js";

let client;

// Transient Google-side statuses worth retrying / falling back on (429 = rate limit).
const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const RETRY_DELAY_MS = 800;

// Each attempt gets its own deadline. Without this, 3 slow attempts in a row
// can easily pass the frontend's timeout and the user just sees
// "The model took too long".
const ATTEMPT_TIMEOUT_MS = 25_000;

// Cap the reply length so a rambling answer can't run for a minute.
const MAX_OUTPUT_TOKENS = 1024;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getClient() {
  if (!env.GEMINI_API_KEY) {
    throw Object.assign(new Error("AI is not configured on the server"), {
      status: 503,
    });
  }
  client ??= new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  return client;
}

// Our own timeout (AbortSignal.timeout) has no HTTP status; treat it as retryable.
const isTimeout = (err) =>
  err?.name === "TimeoutError" || err?.name === "AbortError";

export async function generateReply({ messages, skill }) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  if (skill) {
    contents[0].parts[0].text = `${skill.instructions}\n\n---\n\nUser request:\n${contents[0].parts[0].text}`;
  }

  const ai = getClient();

  // Fast model first (26B MoE, only ~4B params active per token), retry once,
  // then the bigger 31B model as the fallback.
  const attempts = [
    { model: env.GEMMA_MODEL, delayMs: 0 },
    { model: env.GEMMA_MODEL, delayMs: RETRY_DELAY_MS },
    { model: env.GEMMA_FALLBACK_MODEL, delayMs: 0 },
  ].filter((a, i, all) => !(i === 2 && a.model === all[0].model));

  let lastErr;
  for (const { model, delayMs } of attempts) {
    if (delayMs) await sleep(delayMs);
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          abortSignal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          // Gemma 4 can "think" before answering, which adds a lot of latency.
          // Per Google's docs: "high" = thinking on, "minimal" = off.
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL ?? "minimal" },
        },
      });
      const text = response.text?.trim();
      if (!text) throw Object.assign(new Error("Empty response"), { status: 500 });
      return text;
    } catch (err) {
      lastErr = err;
      console.error(
        `Gemma request failed (${model}):`,
        err.status ?? err.name ?? "",
        err.message,
      );
      // 400/401/403/404 won't improve by retrying: wrong key, bad request, bad model.
      if (!RETRYABLE.has(err.status) && !isTimeout(err)) break;
    }
  }

  if (lastErr?.status === 429) {
    throw Object.assign(
      new Error("Rate limit reached. Please wait a minute and try again."),
      { status: 429 },
    );
  }
  if (isTimeout(lastErr)) {
    throw Object.assign(
      new Error("The model is responding slowly right now. Please try again."),
      { status: 504 },
    );
  }
  throw Object.assign(
    new Error(
      "The AI service is having trouble right now (Google returned an error). Please try again in a moment.",
    ),
    { status: 502 },
  );
}