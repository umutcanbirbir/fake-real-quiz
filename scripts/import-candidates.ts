import { formatCandidateWithOpenAI, type RawArticleInput } from "../lib/ai/formatCandidate.ts";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";

const rawArticles: RawArticleInput[] = [
  {
    source_name: "Associated Press",
    source_url: "https://apnews.com/article/new-zealand-airport-goodbye-hug-time-limit",
    raw_title: "New Zealand airport sets a time limit for goodbye hugs",
    raw_summary: "A New Zealand airport introduced a short time limit in drop-off zones for farewell hugs, framing it as traffic flow management and prompting global reactions.",
  },
  {
    source_name: "Reuters",
    source_url: "https://www.reuters.com/world/asia-pacific/japan-aquarium-sunfish-recovered-after-human-cutouts-placed-tank-2024-01-22/",
    raw_title: "Japan aquarium says lonely sunfish recovered after staff placed human cutouts",
    raw_summary: "An aquarium in Japan reported a sunfish regained appetite and improved behavior after staff placed cardboard human figures near the tank during a closure period.",
  },
];

async function insertCandidate(candidate: Record<string, unknown>) {
  const payload = { ...candidate, status: "pending" };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/question_candidates`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase insert failed (${res.status}): ${body}`);
  }
}

async function run() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

  let inserted = 0;
  for (const article of rawArticles) {
    try {
      const formatted = await formatCandidateWithOpenAI(article, OPENAI_API_KEY);
      await insertCandidate(formatted);
      inserted += 1;
      console.log(`Inserted candidate: ${formatted.raw_title}`);
    } catch (error) {
      console.error(`Failed article: ${article.raw_title}`);
      console.error(error);
    }
  }

  console.log(`Done. Inserted ${inserted} of ${rawArticles.length} candidate(s).`);
}

run().catch((error) => {
  console.error("Import failed before processing all articles.");
  console.error(error);
  process.exit(1);
});
