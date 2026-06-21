import type { AccessibilityReport, BrandConsistencyIssue, BrandConsistencyReport, BrandProfile, ContentDensityIssue, ContentDensityReport, ContentFlag, ContentReview, Deck, DesignToken, NarrativeAnalysis, PresentationSnapshot, Slide } from "./types";

export const demoBrands: BrandProfile[] = [
  {
    id: "brand_nova", name: "Nova Ventures", industry: "Venture Capital",
    colors: { primary: "#1a1a2e", secondary: "#16213e", accent: "#e94560", background: "#fafafa", text: "#1a1a2e" },
    typography: { headingFont: "Inter", bodyFont: "Inter", scale: "1.25" },
    logoUrl: "/brands/nova-ventures.svg"
  },
  {
    id: "brand_meridian", name: "Meridian Health", industry: "Healthcare",
    colors: { primary: "#0d4f4f", secondary: "#1a7a7a", accent: "#f4a261", background: "#fefefe", text: "#0d4f4f" },
    typography: { headingFont: "Lora", bodyFont: "Open Sans", scale: "1.2" },
    logoUrl: "/brands/meridian-health.svg"
  }
];

const novaSlides: Slide[] = [
  { id: "s1", deckId: "deck_nova_q3", position: 1, contentType: "title", title: "Q3 2026 Portfolio Review", body: "Nova Ventures — Confidential", visual: "logo-top-right", notes: "30-second intro", narrativeStrength: 85, flagged: false, wordCount: 4, estimatedReadTimeSeconds: 1 },
  { id: "s2", deckId: "deck_nova_q3", position: 2, contentType: "narrative", title: "Where We Are: $340M AUM Across 28 Portfolio Companies", body: "Our portfolio delivered $47M in aggregate revenue growth this quarter. Three companies crossed $10M ARR. Two are preparing Series B. But churn in the early-stage cohort is up 3.2 percentage points — our biggest risk signal.", visual: "metric-card-grid", notes: "Context slide — frame the problem before the data", narrativeStrength: 72, flagged: false, wordCount: 44, estimatedReadTimeSeconds: 18 },
  { id: "s3", deckId: "deck_nova_q3", position: 3, contentType: "comparison", title: "Early-Stage vs Growth-Stage Performance", body: "Early-stage cohort: 4.8% monthly churn, $1.2M avg burn rate, 18-month runway. Growth-stage cohort: 1.1% monthly churn, 92% NRR, 9 of 12 companies cash-flow positive.", visual: "side-by-side-bars", notes: "Comparison makes the churn problem concrete", narrativeStrength: 90, flagged: false, wordCount: 32, estimatedReadTimeSeconds: 13 },
  { id: "s4", deckId: "deck_nova_q3", position: 4, contentType: "metric", title: "Churn Rate by Cohort: The Early-Stage Gap", body: "4.8% churn vs 2.1% benchmark. At current trajectory, early-stage portfolio loses $3.1M in annual recurring revenue by Q1 2027.", visual: "trend-line-chart", notes: "Single metric, big impact", narrativeStrength: 88, flagged: false, wordCount: 26, estimatedReadTimeSeconds: 11 },
  { id: "s5", deckId: "deck_nova_q3", position: 5, contentType: "evidence", title: "Root Cause: Customer Success Staffing Gap", body: "Our five earliest portfolio companies average 0.4 CS hires per $1M ARR. Industry benchmark is 1.2. Companies above 0.8 CS hires show 80% lower churn. This is a fixable operational gap — not a market problem.", visual: "scatter-plot", notes: "Diagnosis before prescription", narrativeStrength: 93, flagged: false, wordCount: 43, estimatedReadTimeSeconds: 17 },
  { id: "s6", deckId: "deck_nova_q3", position: 6, contentType: "timeline", title: "90-Day Intervention Plan", body: "Week 1–2: CS gap audit across early-stage cohort. Week 3–6: Embedded CS advisor deployment (shared across 3 companies). Week 7–12: Bi-weekly churn review with portfolio founders. Target: reduce early-stage churn to 3.2% by Q4.", visual: "timeline-horizontal", notes: "Concrete, time-boxed plan", narrativeStrength: 86, flagged: false, wordCount: 38, estimatedReadTimeSeconds: 16 },
  { id: "s7", deckId: "deck_nova_q3", position: 7, contentType: "metric", title: "Projected Impact: $2.1M Annual Revenue Saved", body: "Conservative estimate: reducing churn from 4.8% to 3.2% saves $2.1M in annual recurring revenue across the early-stage cohort. Investment required: $240K for embedded CS advisors. 8.75x projected return.", visual: "roi-breakdown", notes: "Close with the ROI", narrativeStrength: 91, flagged: false, wordCount: 34, estimatedReadTimeSeconds: 14 },
  { id: "s8", deckId: "deck_nova_q3", position: 8, contentType: "cta", title: "Recommendation", body: "Approve $240K for embedded CS advisor program targeting early-stage portfolio companies. Review churn metrics at the October partner meeting.", visual: "cta-card", notes: "Clear ask, clear timeline", narrativeStrength: 84, flagged: false, wordCount: 22, estimatedReadTimeSeconds: 9 }
];

export const demoDeck: Deck = {
  id: "deck_nova_q3", brandId: "brand_nova", title: "Q3 2026 Portfolio Review",
  description: "Quarterly portfolio review for Nova Ventures LP meeting. Focus: early-stage churn analysis and 90-day intervention plan.",
  slideCount: 8, narrativeScore: 86, createdBy: "AI Deck Generator v3",
  slides: novaSlides
};

export const demoNarrativeAnalysis: NarrativeAnalysis = {
  deckId: "deck_nova_q3",
  hasArc: true,
  arcPattern: "Problem → Evidence → Root Cause → Solution → ROI → Ask",
  weakSlides: [2],
  strongSlides: [5, 7],
  recommendations: [
    "Slide 2 (context) could be split into two slides: one for the positive metrics and one for the risk signal. Currently it buries the problem in the middle of good news.",
    "Add a customer quote slide between slides 4 and 5 to humanize the churn data before presenting the root cause analysis."
  ]
};

const accessibilityIssues = [
  {
    slideId: "s2", type: "font-size" as const, severity: "major" as const,
    description: "Body text at 47 words with no hierarchy — read aloud time exceeds 25 seconds. Presentation audiences can't read and listen simultaneously.",
    recommendation: "Reduce body to 2-3 bullet points. Font size should be ≥ 24pt for body text in conference-room settings."
  },
  {
    slideId: "s3", type: "contrast" as const, severity: "critical" as const,
    description: "Side-by-side bar chart uses #e94560 (accent red) on #fafafa background. Contrast ratio 4.1:1 — passes AA for large text but fails AAA for body labels.",
    recommendation: "Darken chart labels to #1a1a2e (ratio 13.4:1) or increase label font weight to 700 for the accent color."
  },
  {
    slideId: "s3", type: "color-blind" as const, severity: "major" as const,
    description: "Comparison slide relies on red/green color coding for early-stage (red) vs growth-stage (green). Deuteranopia affects ~5% of male viewers.",
    recommendation: "Add pattern fills (stripes for underperforming) or use blue/orange palette instead of red/green."
  },
  {
    slideId: "s4", type: "contrast" as const, severity: "major" as const,
    description: "Metric card numbers at 14px in #1a1a2e on #fafafa background are acceptable (ratio 13.4:1), but trend annotations in #16213e on #fafafa at 10px may be illegible.",
    recommendation: "Set annotation font size to ≥ 12px or use #1a1a2e for consistency."
  },
  {
    slideId: "s5", type: "alt-text" as const, severity: "major" as const,
    description: "Scatter plot has no alt text or accessible data table. Screen-reader users cannot interpret the CS staffing vs churn relationship.",
    recommendation: "Add descriptive alt text ('Scatter plot: CS hires per $1M ARR vs monthly churn rate, with benchmark line at 1.2 CS/$M ARR') and a linked data table."
  }
];

export const demoAccessibilityReport: AccessibilityReport = {
  deckId: "deck_nova_q3",
  overallScore: 58,
  passes: false,
  issues: accessibilityIssues
};

const contentFlags: ContentFlag[] = [
  { slideId: "s2", issue: "Dense text — 47 words in body. Recommended: 25–35 for a narrative slide.", severity: "minor", suggestion: "Split into two slides or reduce to the key headline: '$47M growth, 3 companies at $10M+ ARR, but early-stage churn rising.'" },
  { slideId: "s5", issue: "No visual label on scatter plot axes.", severity: "major", suggestion: "Add axis labels: X-axis = CS hires per $1M ARR, Y-axis = monthly churn rate. Include the benchmark reference line." },
  { slideId: "s8", issue: "CTA slide lacks specific deadline.", severity: "minor", suggestion: "Add: 'Decision needed by September 15 to begin advisor onboarding October 1.'" }
];

export const demoContentReview: ContentReview = {
  deckId: "deck_nova_q3", overallScore: 82,
  flags: contentFlags,
  timeEstimate: "~12 minutes to address all flags"
};

const brandConsistencyIssues: BrandConsistencyIssue[] = [
  {
    slideId: "s3",
    checkType: "color-mismatch",
    severity: "major",
    description: "Slide uses #e76f51 (warm orange) for the growth-stage bar series, but the Nova Ventures brand accent is #e94560 (cool red). Warm orange is not in the brand palette.",
    recommendation: "Replace bar fill with #e94560 or derive a tint from the brand secondary (#16213e) for the comparison series. Avoid introducing colors outside the token set.",
    autoFixable: true
  },
  {
    slideId: "s4",
    checkType: "font-mismatch",
    severity: "major",
    description: "Trend annotation uses Roboto Mono at 10px, but Nova Ventures specifies Inter for both heading and body. Introducing a monospace font breaks visual consistency.",
    recommendation: "Switch annotation to Inter at ≥12px. If monospaced numbers are needed for data tables, lift that through a design-token exception rather than an ad-hoc override.",
    autoFixable: true
  },
  {
    slideId: "s1",
    checkType: "logo-missing",
    severity: "minor",
    description: "Title slide has no logo element. Nova Ventures brand profile defines logo position as top-right 48px, but no logo placement was generated.",
    recommendation: "Insert logo at top-right with 48px height. For AI-generated decks, add a pre-generation rule that title slides always include the brand logo from the profile.",
    autoFixable: true
  },
  {
    slideId: "s6",
    checkType: "spacing-violation",
    severity: "minor",
    description: "Timeline items use 20px vertical gaps, but the Nova Ventures design token specifies an 8px base grid. 20px is not a multiple of 8 — the nearest compliant values are 16px or 24px.",
    recommendation: "Adjust vertical gap from 20px to 24px (3 × 8). If tighter spacing is intentional, use 16px (2 × 8) with smaller timeline icons. Either option keeps the layout on the brand grid.",
    autoFixable: true
  },
  {
    slideId: "s7",
    checkType: "token-override",
    severity: "major",
    description: "ROI breakdown chart uses #10b981 (Tailwind emerald) for positive bar segments, a palette color not defined in Nova Ventures design tokens. The brand secondary (#16213e) or a derived tint should be used instead. AI slide generators frequently default to framework defaults rather than brand token values.",
    recommendation: "Replace #10b981 bar fills with a tint derived from the brand secondary (#16213e) — for example, #2a4a7a at 60% opacity for positive segments. Define a chart-palette token set (positive, negative, neutral) in the design token registry so the AI generator has explicit instructions rather than falling back to framework defaults.",
    autoFixable: true
  }
];

export const demoBrandConsistencyReport: BrandConsistencyReport = {
  deckId: "deck_nova_q3",
  brandId: "brand_nova",
  overallScore: 44, // 4 of 8 slides pass — 50%. Extra weight for the token-override on the high-impact ROI slide.
  passes: false,
  issues: brandConsistencyIssues
};

export const demoDesignTokens: DesignToken[] = [
  { id: "tok_primary", name: "Primary Color", value: "#1a1a2e", category: "color" },
  { id: "tok_secondary", name: "Secondary Color", value: "#16213e", category: "color" },
  { id: "tok_accent", name: "Accent Color", value: "#e94560", category: "color" },
  { id: "tok_bg", name: "Background", value: "#fafafa", category: "color" },
  { id: "tok_text", name: "Text Color", value: "#1a1a2e", category: "color" },
  { id: "tok_heading", name: "Heading Font", value: "Inter", category: "typography" },
  { id: "tok_body", name: "Body Font", value: "Inter", category: "typography" },
  { id: "tok_scale", name: "Type Scale", value: "1.25 (Major Third)", category: "typography" },
  { id: "tok_spacing", name: "Grid Spacing", value: "8px base grid", category: "spacing" },
  { id: "tok_logo", name: "Logo Position", value: "Top-right, 48px", category: "logo" }
];

const contentDensityIssues: ContentDensityIssue[] = [
  {
    slideId: "s2",
    contentType: "narrative",
    wordCount: 44,
    recommendedMax: 30,
    severity: "critical",
    description: "Narrative slide contains 44 words — 47% over the recommended maximum of 30 for context-setting slides. Combined with the dense metric-card-grid visual, the audience will read the slide instead of listening. AI generators frequently pack too much copy into slides because they optimize for completeness over comprehension.",
    recommendation: "Split into two slides: one titled 'The Good News' ($47M revenue, 3 companies at $10M+ ARR) and one titled 'The Risk Signal' (early-stage churn up 3.2pp). Or reduce body to the lead headline: '$47M growth, but early-stage churn is rising — our biggest risk signal.'"
  },
  {
    slideId: "s5",
    contentType: "evidence",
    wordCount: 43,
    recommendedMax: 35,
    severity: "major",
    description: "Evidence slide at 43 words — 23% above the recommended 35-word ceiling. The scatter-plot visual carries the quantitative story, but the body restates every data point the chart already shows. This is a common AI-generation failure: the model treats text and visuals as independent delivery channels instead of complementary ones.",
    recommendation: "Reduce body to the key insight only: 'Companies above 0.8 CS hires show 80% lower churn. This is a staffing gap — not a market problem.' Let the scatter plot and axis labels deliver the data. Add the benchmark reference line to the chart."
  },
  {
    slideId: "s6",
    contentType: "timeline",
    wordCount: 38,
    recommendedMax: 25,
    severity: "major",
    description: "Timeline slide at 38 words — 52% over the recommended 25-word max for timeline content. Each phase (audit, deploy, review) is written as a full sentence when a three-column layout with phase labels, dates, and 5-7 words each would be more scannable.",
    recommendation: "Restructure as three timeline columns: Phase 1 (Weeks 1-2) 'CS gap audit — early-stage cohort', Phase 2 (Weeks 3-6) 'Embedded CS advisor deployment — 3 companies', Phase 3 (Weeks 7-12) 'Bi-weekly churn review with founders'. Move the target metric to a separate footer."
  },
  {
    slideId: "s4",
    contentType: "metric",
    wordCount: 26,
    recommendedMax: 20,
    severity: "minor",
    description: "Metric slide at 26 words — 30% over the recommended 20-word ceiling for single-metric slides. The trend-line chart already communicates the trajectory; the body repeats the headline data point with additional projection text that belongs in speaker notes.",
    recommendation: "Keep only the metric callout on-slide: '4.8% monthly churn vs 2.1% benchmark.' Move the projected revenue impact to the speaker notes or to a follow-up ROI slide (s7 already covers this)."
  }
];

export const demoContentDensityReport: ContentDensityReport = {
  deckId: "deck_nova_q3",
  overallScore: 50, // 4 of 8 slides pass density limits per their content type
  passes: false,
  totalWords: 243,
  averageWordsPerSlide: 30.4,
  issues: contentDensityIssues
};

export const demoSnapshot: PresentationSnapshot = {
  brands: demoBrands,
  activeDeck: demoDeck,
  narrativeAnalysis: demoNarrativeAnalysis,
  contentReview: demoContentReview,
  designTokens: demoDesignTokens,
  accessibilityReport: demoAccessibilityReport,
  brandConsistencyReport: demoBrandConsistencyReport,
  contentDensityReport: demoContentDensityReport
};
