export type RawArticleInput = {
  source_name: string;
  source_url: string;
  raw_title: string;
  raw_summary: string;
};

export type FormattedCandidate = {
  source_name: string;
  source_url: string;
  raw_title: string;
  raw_summary: string;
  suggested_category: string;
  suggested_question_type: "text" | "image" | "news";
  suggested_content: string;
  suggested_headline: string;
  suggested_excerpt: string;
  suggested_answer: "real" | "fake";
  suggested_explanation: string;
  suggested_difficulty: "easy" | "medium" | "hard";
  suggested_tags: string[];
  suggested_image_prompt: string;
};

const responseSchema = {
  name: "question_candidate",
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "source_name", "source_url", "raw_title", "raw_summary", "suggested_category",
      "suggested_question_type", "suggested_content", "suggested_headline", "suggested_excerpt",
      "suggested_answer", "suggested_explanation", "suggested_difficulty", "suggested_tags", "suggested_image_prompt",
    ],
    properties: {
      source_name: { type: "string" },
      source_url: { type: "string" },
      raw_title: { type: "string" },
      raw_summary: { type: "string" },
      suggested_category: { type: "string" },
      suggested_question_type: { type: "string", enum: ["text", "image", "news"] },
      suggested_content: { type: "string" },
      suggested_headline: { type: "string" },
      suggested_excerpt: { type: "string" },
      suggested_answer: { type: "string", enum: ["real", "fake"] },
      suggested_explanation: { type: "string" },
      suggested_difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
      suggested_tags: { type: "array", items: { type: "string" } },
      suggested_image_prompt: { type: "string" },
    },
  },
  strict: true,
};

export async function formatCandidateWithOpenAI(article: RawArticleInput, apiKey: string): Promise<FormattedCandidate> {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content: "You convert real news snippets into quiz candidate objects for an editorial review queue. Always produce factual, concise, neutral outputs and preserve source context.",
        },
        {
          role: "user",
          content: `Format this raw article into a candidate object:\n${JSON.stringify(article)}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          ...responseSchema,
        },
      },
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(`OpenAI request failed: ${res.status}`);

  const outputText = json.output_text as string | undefined;

  const fallbackText = Array.isArray(json.output)
    ? json.output
        .flatMap((item: unknown) => {
          if (!item || typeof item !== "object" || !Array.isArray((item as { content?: unknown }).content)) return [];
          return (item as { content: unknown[] }).content;
        })
        .flatMap((contentItem: unknown) => {
          if (!contentItem || typeof contentItem !== "object") return [];
          const typedContent = contentItem as { type?: unknown; text?: unknown };
          if ((typedContent.type === "output_text" || typedContent.type === "text") && typeof typedContent.text === "string") {
            return [typedContent.text];
          }
          return [];
        })
        .join("\n")
    : "";

  const textToParse = outputText ?? fallbackText;

  if (!textToParse) {
    const shapeHint = {
      has_output_text: typeof json.output_text === "string",
      output_is_array: Array.isArray(json.output),
      output_item_types: Array.isArray(json.output)
        ? json.output.map((item: unknown) => (item && typeof item === "object" ? (item as { type?: unknown }).type ?? "unknown" : typeof item))
        : [],
    };
    throw new Error(`OpenAI structured output text missing (status=${res.status}, shape=${JSON.stringify(shapeHint)})`);
  }

  try {
    return JSON.parse(textToParse) as FormattedCandidate;
  } catch (error) {
    const shapeHint = {
      has_output_text: typeof json.output_text === "string",
      output_is_array: Array.isArray(json.output),
      extracted_text_length: textToParse.length,
    };
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`OpenAI structured output JSON parse failed (status=${res.status}, error=${errorMessage}, shape=${JSON.stringify(shapeHint)})`);
  }
}
