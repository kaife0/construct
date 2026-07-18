/**
 * On-page SEO checks for the post editor — the same green/red list Rank Math shows.
 * Pure heuristics over the draft, run on every keystroke, so no network or parsing deps.
 */

export type SeoCheck = { label: string; passed: boolean };

export type SeoAnalysisInput = {
  focusKeyword: string;
  metaTitle: string;
  metaDescription: string;
  contentHtml: string;
};

const stripTags = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const contains = (haystack: string, needle: string) => {
  const term = needle.trim().toLowerCase();
  return term.length > 0 && haystack.toLowerCase().includes(term);
};

export function analyzeSeo({ focusKeyword, metaTitle, metaDescription, contentHtml }: SeoAnalysisInput) {
  const text = stripTags(contentHtml);
  const wordCount = text ? text.split(" ").length : 0;
  const headings = (contentHtml.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) ?? []).join(" ");

  const checks: SeoCheck[] = [
    { label: "Focus keyword in the SEO title", passed: contains(metaTitle, focusKeyword) },
    { label: "Focus keyword in the meta description", passed: contains(metaDescription, focusKeyword) },
    { label: "Focus keyword near the start of the content", passed: contains(text.slice(0, 300), focusKeyword) },
    { label: "Focus keyword in a subheading", passed: contains(headings, focusKeyword) },
    { label: "SEO title is filled in and under 60 characters", passed: metaTitle.length > 0 && metaTitle.length <= 60 },
    {
      label: "Meta description is between 120 and 160 characters",
      passed: metaDescription.length >= 120 && metaDescription.length <= 160,
    },
    { label: "Content is at least 600 words", passed: wordCount >= 600 },
    { label: "Links to another page on this site", passed: /href="\/(?!\/)/.test(contentHtml) },
    { label: "Links to an external source", passed: /href="https?:\/\//.test(contentHtml) },
    { label: "Content contains at least one image", passed: /<img\b/i.test(contentHtml) },
  ];

  const passed = checks.filter((check) => check.passed).length;
  return { checks, wordCount, score: Math.round((passed / checks.length) * 100) };
}

/** Red below 50, amber to 79, green at 80+ — mirrors the Rank Math score pill. */
export function scoreTone(score: number) {
  if (score >= 80) return { label: "Good", className: "bg-emerald-600 text-white" };
  if (score >= 50) return { label: "OK", className: "bg-amber-500 text-white" };
  return { label: "Poor", className: "bg-red-600 text-white" };
}
