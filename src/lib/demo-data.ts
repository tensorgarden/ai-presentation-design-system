import type { AccessibilityIssue, AccessibilityReport, BoardReadinessGate, BrandConsistencyIssue, BrandConsistencyReport, BrandProfile, ContentDensityIssue, ContentDensityReport, ContentFlag, ContentReview, Deck, DesignToken, NarrativeAnalysis, PresentationSnapshot, Slide, SourceEvidence, SourceExportGuard, SourceVerificationIssue, SourceVerificationReport, SourceVerifiedClaim, StructureAuditIssue, StructureAuditReport } from "./types";

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

const accessibilityIssues: AccessibilityIssue[] = [
  {
    slideId: "s2", type: "font-size" as const, severity: "major" as const,
    description: "Body text at 47 words with no hierarchy — read aloud time exceeds 25 seconds. Presentation audiences can't read and listen simultaneously.",
    recommendation: "Reduce body to 2-3 bullet points. Font size should be ≥ 24pt for body text in conference-room settings."
  },
  {
    slideId: "s3", type: "contrast", severity: "critical",
    elementKind: "normal-text",
    foreground: "#e94560",
    background: "#fafafa",
    measuredRatio: 3.668,
    renderedFontSizePt: 14,
    renderedFontWeight: "normal",
    requiredRatio: 4.5,
    criterion: "WCAG 1.4.3",
    description: "Side-by-side chart labels use #e94560 on #fafafa at 3.7:1, below the WCAG AA 4.5:1 threshold for normal text. A large-text exception cannot be assumed without exported font-size evidence.",
    recommendation: "Darken chart labels to #1a1a2e (16.3:1) and rerun the contrast check against the exported slide colors."
  },
  {
    slideId: "s3", type: "color-blind", severity: "major",
    elementKind: "chart-series",
    encodedMeaning: "Red marks the underperforming early-stage cohort; green marks the healthier growth-stage cohort.",
    nonColorCues: [],
    description: "Comparison slide relies on red/green color coding for early-stage versus growth-stage performance, so the series become indistinguishable when color is unavailable or difficult to perceive.",
    recommendation: "Add direct series labels and a stripe pattern for the underperforming cohort, then verify the exported chart in grayscale. A blue/orange palette alone is not a sufficient non-color cue."
  },
  {
    slideId: "s4", type: "font-size" as const, severity: "major" as const,
    description: "Metric card numbers at 14px in #1a1a2e on #fafafa have strong contrast (16.3:1), but trend annotations in #16213e at 10px may still be illegible in a conference-room setting.",
    recommendation: "Set annotation font size to ≥ 12px while retaining the high-contrast #1a1a2e text token."
  },
  {
    slideId: "s4", type: "contrast", severity: "major",
    elementKind: "meaningful-graphic",
    foreground: "#aab4c4",
    background: "#fafafa",
    measuredRatio: 2.005,
    renderedFontSizePt: null,
    renderedFontWeight: null,
    requiredRatio: 3,
    criterion: "WCAG 1.4.11",
    description: "The benchmark line that distinguishes 2.1% peer churn from the 4.8% portfolio rate uses #aab4c4 on #fafafa at 2.0:1. Because the line carries meaning, it falls below the 3:1 non-text contrast threshold.",
    recommendation: "Darken the benchmark line until it reaches at least 3:1 against #fafafa, retain a dashed line style as a non-color cue, and verify the exported slide rather than only the editor preview."
  },
  {
    slideId: "s5", type: "alt-text", severity: "major",
    objectName: "CS staffing versus churn scatter plot",
    altTextSource: "ai-generated",
    altTextReviewStatus: "needs-revision",
    currentAltText: "A chart with dots and a line.",
    description: "The scatter plot retains generic AI-generated alt text that names the object but omits the CS staffing and churn insight. Screen-reader users cannot interpret the relationship, and the generated description has not been approved.",
    recommendation: "Replace it with contextual alt text: 'Scatter plot: companies above 0.8 CS hires per $1M ARR show 80% lower churn, with a benchmark line at 1.2 CS hires per $1M ARR.' Add a linked data table, then have a named accessibility reviewer approve the text before export."
  },
  {
    slideId: "s6", type: "reading-order", severity: "critical",
    layoutKind: "timeline",
    observedSequence: ["phase 3 label", "decorative arrow connector", "phase 1 label", "target metric card", "phase 2 label"],
    intendedSequence: ["title", "phase 1 label", "phase 2 label", "phase 3 label", "target metric card"],
    decorativeObjects: [{ name: "arrow connector", handling: "mark-decorative" }],
    changesNarrativeMeaning: true,
    description: "The three-phase timeline is visually arranged left to right, but its exported object order reads phase 3 before phase 1 and inserts a decorative arrow connector between the phases. Screen-reader users hear the 90-day intervention plan out of sequence, so the remediation steps land before the problem they address.",
    recommendation: "Set the reading order to title, phase 1 label, phase 2 label, phase 3 label, then the target metric card; mark the arrow connector as decorative so assistive technology skips it before export. Re-verify the sequence in the exported PowerPoint Reading Order pane rather than the editor preview."
  },
  {
    slideId: "s4", type: "reading-order", severity: "major",
    layoutKind: "metric-cards",
    observedSequence: ["benchmark annotation", "headline churn figure", "trajectory note", "card border icon"],
    intendedSequence: ["title", "headline churn figure", "benchmark annotation", "trajectory note"],
    decorativeObjects: [{ name: "card border icon", handling: "exclude-from-order" }],
    changesNarrativeMeaning: false,
    description: "The three metric cards are exported in stacking order rather than visual order, so the screen reader announces the benchmark annotation before the 4.8% headline figure it annotates. Each card's meaning survives the jumble, but the sequence contradicts the visual left-to-right layout.",
    recommendation: "Reorder the exported object sequence to title, headline churn figure, benchmark annotation, then trajectory note; exclude the decorative card border icons from the reading order. Confirm the order in the Reading Order pane before sharing the deck."
  },
  {
    slideId: "s8", type: "link-text" as const, severity: "major" as const,
    description: "The CTA uses a generic 'View details' hyperlink label with no destination context. When screen-reader users scan the deck's list of links, they cannot tell that it opens the advisor-program approval memo.",
    recommendation: "Rename the link 'Review the embedded CS advisor approval memo' and add the ScreenTip 'Opens the advisor-program approval memo in the portfolio data room.'"
  },
  {
    slideId: "s7", type: "slide-title" as const, severity: "major" as const,
    description: "Slide 7's visible ROI heading is a freeform text box rather than the slide's title placeholder. Screen-reader and Outline view navigation can report the slide as untitled even though sighted viewers see a heading.",
    recommendation: "Set 'Projected Impact: $2.1M Annual Revenue Saved' as the unique slide title placeholder; if the visual layout cannot accommodate it, keep the title in an off-slide hidden title placeholder rather than a decorative text box."
  },
  {
    slideId: "s1", type: "motion", severity: "critical",
    elementKind: "animated-background",
    autoStarts: true,
    durationSeconds: 12,
    loops: true,
    pauseStopHideControl: "missing",
    honorsReducedMotion: false,
    criterion: "WCAG 2.2.2",
    description: "The title slide ships a looping animated GIF background that starts automatically and cycles every 12 seconds with no pause, stop, or hide control. Animated GIFs cannot be paused by the viewer, so the motion runs for the entire time the slide is on screen.",
    recommendation: "Replace the GIF with a static brand visual, or swap it for a video element with an explicit pause control placed near the content. Respect the viewer's reduced-motion setting as an additional safeguard — not as a substitute for a control every viewer can reach."
  },
  {
    slideId: "s2", type: "motion", severity: "major",
    elementKind: "auto-advancing-slide",
    autoStarts: true,
    durationSeconds: 8,
    loops: true,
    pauseStopHideControl: "missing",
    honorsReducedMotion: false,
    criterion: "WCAG 2.2.2",
    description: "The exported share-link kiosk mode auto-advances every 8 seconds and loops back to the first slide with no pause, stop, or hide control. WCAG 2.2.2 requires a control for auto-updating content that runs longer than 5 seconds, and 8 seconds is less than half the slide's estimated 18-second read time.",
    recommendation: "Default the share link to manual advance, or add a visible pause/play control within the first few interactive elements. Set any auto-advance interval to at least the slide's estimated read time, and never loop a board deck automatically."
  },
  {
    slideId: "s3", type: "table-structure" as const, severity: "major" as const,
    description: "The comparison slide embeds a 2×3 data table with cohort revenue and churn figures, but the table has no marked header row. Screen-reader users navigating by cell cannot determine whether '4.8%' belongs to the churn or growth column without explicit scope attributes.",
    recommendation: "Mark the top row as a header row and add scope='col' to each header cell so assistive technology can announce column context. If the table is decorative rather than data-bearing, replace it with a chart-only alternative."
  },
  {
    slideId: "s8", type: "focus-order" as const, severity: "critical" as const,
    observedOrder: ["approval memo link", "next/previous deck controls", "pause control", "slide title"],
    expectedOrder: ["slide title", "approval memo link", "pause control", "next/previous deck controls"],
    criterion: "WCAG 2.4.3",
    description: "In the exported share-link build, the absolutely positioned approval-memo link is the first tab stop even though it renders visually in the lower right of slide 8. Keyboard users reach the CTA before the slide title, and the kiosk pause control comes after every other interactive element. WCAG 2.4.3 requires focus to follow a sequence that preserves meaning and operability, so a viewer tabbing through the deck hears the ask before the context.",
    recommendation: "Reorder the exported DOM so tab stops follow the visual sequence: slide title, approval memo link, pause control, then next/previous deck controls. Verify the sequence with keyboard-only navigation in the exported share link rather than the editor preview, and re-check after any slide reordering."
  },
  {
    slideId: "s8", type: "focus-not-obscured", severity: "critical",
    focusedElement: "approval memo link",
    obscuredBy: "sticky-footer",
    visibility: "fully-obscured",
    criterion: "WCAG 2.4.11",
    description: "The exported share link keeps a sticky deck-controls footer at the bottom of the viewport, so tabbing to the approval memo link leaves the focused control completely hidden behind author-created content. Sighted keyboard users lose the interaction point and may think navigation has stalled.",
    recommendation: "Reserve space with CSS scroll-padding-bottom or move the focus target above the persistent deck controls; verify that the approval memo link remains at least partially visible while tabbing through the exported share link, then re-check the focus indicator against adjacent colors."
  },
  {
    slideId: "s8", type: "language-declaration" as const, severity: "major" as const,
    languageScope: "presentation",
    declaredLanguage: null,
    expectedLanguage: "en-US",
    criterion: "WCAG 3.1.1",
    description: "The exported presentation has no programmatically declared default language. Screen-reader software may apply the wrong pronunciation rules when it reads the deck, leaving assistive technology users to interpret the CTA without reliable language context.",
    recommendation: "Declare the presentation language as en-US and mark any different-language text spans explicitly, then verify the language tag in the exported PowerPoint presentation rather than only in the editor preview."
  },
  {
    slideId: "s8", type: "target-size" as const, severity: "major" as const,
    targetName: "next-slide arrow control",
    widthCssPx: 18,
    heightCssPx: 18,
    minimumSizeCssPx: 24,
    spacingToAdjacentTargetCssPx: 10,
    criterion: "WCAG 2.5.8",
    description: "The exported share-link build renders the next-slide arrow at 18 by 18 CSS pixels against the 24 by 24 CSS pixel minimum, with only 10 CSS pixels to the adjacent pause control. The undersized targets are close enough to increase accidental activation risk for people with limited dexterity, and the presentation has no documented spacing exception.",
    recommendation: "Increase the next-slide arrow to at least 24×24 CSS pixels and preserve at least 24 CSS pixels of clearance from the pause control. Verify the computed target dimensions and spacing in the exported share link, not only in the editor preview."
  },
  {
    slideId: "s2", type: "text-spacing" as const, severity: "major" as const,
    description: "The exported context slide applies a fixed 1.0 line-height and compressed letter spacing to fit 47 words into the metric-card layout. When users increase text spacing, labels collide with the adjacent metric cards and two lines become unreadable.",
    recommendation: "Remove fixed-height text boxes, support at least 1.5 line spacing and 0.12em letter spacing, then verify the reflowed content in the exported presentation at 200% text spacing rather than only in the editor preview."
  },
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

const structureAuditIssues: StructureAuditIssue[] = [
  {
    slideId: "s2",
    checkType: "single-idea",
    severity: "critical",
    description: "Context slide mixes three positive portfolio updates with the churn risk signal. Structure-first presentation reviews expect one sharp idea per slide so the audience does not have to decide what matters while the presenter is speaking.",
    recommendation: "Split slide 2 into separate 'Momentum' and 'Risk Signal' slides, or rewrite the body around a single headline: '$47M growth, but early-stage churn is rising.'"
  },
  {
    slideId: "s5",
    checkType: "supporting-evidence",
    severity: "major",
    description: "The evidence slide correctly names a fixable staffing gap, but it does not label which data point is the proof anchor. AI-generated decks often look polished while leaving executives unsure which evidence supports the recommendation.",
    recommendation: "Add a proof-anchor caption under the scatter plot: 'Companies above 0.8 CS hires per $1M ARR show 80% lower churn.' Keep the body focused on the implication."
  },
  {
    slideId: "s8",
    checkType: "decision-path",
    severity: "major",
    description: "CTA names the requested budget and review forum, but it omits the decision deadline and first owner. A boardroom deck should make the next decision path explicit instead of leaving follow-up to meeting notes.",
    recommendation: "Add 'Decision needed by September 15; operating partner owns advisor onboarding by October 1' so the close is actionable immediately after the meeting."
  }
];

export const demoStructureAuditReport: StructureAuditReport = {
  deckId: "deck_nova_q3",
  structureFirstScore: 63,
  passes: false,
  insightDensity: "too-dense",
  issues: structureAuditIssues
};

const sourceEvidence: SourceEvidence[] = [
  {
    id: "src_q3_operating_metrics",
    title: "Nova Q3 portfolio metrics workbook",
    sourceType: "uploaded-file",
    location: "data-room/nova-q3-portfolio-metrics.xlsx#PortfolioSummary",
    retrievedAt: "2026-06-18",
    linkedSlideIds: ["s2", "s3", "s7"],
    owner: "Portfolio operations",
    expiresAt: "2026-07-18",
    freshnessStatus: "current"
  },
  {
    id: "src_cs_staffing_benchmark",
    title: "Customer-success staffing benchmark packet",
    sourceType: "benchmark",
    location: "uploaded-benchmark/cs-staffing-2026.pdf#page=7",
    retrievedAt: "2026-06-18",
    linkedSlideIds: ["s4", "s5"],
    owner: "Research lead",
    expiresAt: "2026-07-18",
    freshnessStatus: "current"
  },
  {
    id: "src_founder_churn_notes",
    title: "Founder churn review call notes",
    sourceType: "analyst-note",
    location: "notes/2026-06-19-founder-churn-review.md#root-cause",
    retrievedAt: "2026-06-19",
    linkedSlideIds: ["s5", "s6"],
    owner: "Portfolio analyst",
    expiresAt: "2026-07-03",
    freshnessStatus: "expires-soon"
  },
  {
    id: "src_roi_working_model",
    title: "Draft ROI scenario model v0.8",
    sourceType: "data-room",
    location: "data-room/nova-roi-scenario-model-v0.8.xlsx#InterventionROI!B12:H42",
    retrievedAt: "2026-06-12",
    linkedSlideIds: ["s7"],
    owner: "Finance reviewer",
    expiresAt: "2026-06-25",
    freshnessStatus: "stale"
  },
  {
    id: "src_advisor_program_approved_model",
    title: "Embedded CS advisor program — approved financial model (locked)",
    sourceType: "data-room",
    location: "data-room/nova-cs-advisor-program-approved-v1.2.xlsx#ExecutiveSummary!B5:G18",
    retrievedAt: "2026-06-21",
    linkedSlideIds: ["s6", "s7"],
    owner: "Finance partner",
    expiresAt: "2026-08-21",
    freshnessStatus: "current"
  },
  {
    id: "src_90day_intervention_plan",
    title: "90-day CS intervention plan — stakeholder approval memo",
    sourceType: "analyst-note",
    location: "shared-docs/90day-cs-intervention-plan-approved-2026-06-20.docx#Summary",
    retrievedAt: "2026-06-20",
    linkedSlideIds: ["s6"],
    owner: "Operating partner",
    expiresAt: "2026-07-04",
    freshnessStatus: "expires-soon"
  }
];

const sourceVerifiedClaims: SourceVerifiedClaim[] = [
  {
    slideId: "s2",
    claim: "$47M aggregate portfolio revenue growth this quarter",
    evidenceId: "src_q3_operating_metrics",
    evidenceExcerpt: "Aggregate quarterly revenue growth: $47.0M across the active portfolio cohort.",
    supportLevel: "direct",
    status: "verified",
    confidence: 0.96,
    reviewedBy: "Operating partner",
    lastChecked: "2026-06-20"
  },
  {
    slideId: "s4",
    claim: "Early-stage churn is 4.8% versus a 2.1% benchmark",
    evidenceId: "src_cs_staffing_benchmark",
    evidenceExcerpt: "Early-stage monthly logo churn: 4.8%; 2026 peer benchmark median: 2.1%.",
    supportLevel: "direct",
    status: "verified",
    confidence: 0.92,
    reviewedBy: "Portfolio analyst",
    lastChecked: "2026-06-20"
  },
  {
    slideId: "s5",
    claim: "Companies above 0.8 customer-success hires show materially lower churn",
    evidenceId: "src_founder_churn_notes",
    evidenceExcerpt: "Companies staffed above 0.8 CS hires per $1M ARR reported materially lower churn in the review cohort.",
    supportLevel: "direct",
    status: "verified",
    confidence: 0.88,
    reviewedBy: "Portfolio analyst",
    lastChecked: "2026-06-21"
  }
];

const sourceVerificationIssues: SourceVerificationIssue[] = [
  {
    slideId: "s7",
    claim: "8.75x projected return from the embedded CS advisor program",
    evidenceId: "src_roi_working_model",
    status: "needs-review",
    severity: "major",
    description: "ROI math is derived from a stale working scenario model rather than a locked finance-approved version. AI-generated decks can make unsupported financial claims look final when citations are missing or stale.",
    reviewerAction: "Attach the approved model version and finance reviewer before the slide is used in an LP or board meeting.",
    blocksExternalUse: true
  }
];

const boardReadinessGates: BoardReadinessGate[] = [
  {
    id: "gate_finance_roi_s7",
    slideId: "s7",
    claim: "8.75x projected return from the embedded CS advisor program",
    gateType: "finance-signoff",
    requiredApprover: "Finance reviewer",
    dueBy: "2026-06-28",
    status: "blocked",
    blockingReason: "Board-facing ROI claim still points to stale scenario-model evidence; a named finance reviewer must attach the locked model before external use."
  },
  {
    id: "gate_intervention_plan_s6",
    slideId: "s6",
    claim: "90-day intervention plan with CS advisor deployment across 3 companies",
    gateType: "citation-validation",
    requiredApprover: "Operating partner",
    dueBy: "2026-06-26",
    status: "ready-for-review",
    blockingReason: ""
  }
];

const blockedExternalSourceIssues = sourceVerificationIssues.filter(issue => issue.blocksExternalUse);

const sourceExportGuard: SourceExportGuard = {
  deckId: "deck_nova_q3",
  status: "blocked",
  blockedClaimCount: blockedExternalSourceIssues.length,
  blockedSlideIds: Array.from(new Set(blockedExternalSourceIssues.map(issue => issue.slideId))),
  reason: "Deck export blocked: board-facing ROI claim relies on stale scenario-model evidence. Attach locked finance-approved source evidence before PDF or share-link export.",
  nextReviewer: boardReadinessGates.find(gate => gate.status === "blocked")?.requiredApprover ?? "Finance reviewer",
  dueBy: boardReadinessGates.find(gate => gate.status === "blocked")?.dueBy ?? "2026-06-28",
  callout: "Pre-export guard prevents polished AI slides with unverified financial citations from leaving the workspace."
};

export const demoSourceVerificationReport: SourceVerificationReport = {
  deckId: "deck_nova_q3",
  passes: false,
  verifiedClaimCount: sourceVerifiedClaims.length,
  claimsNeedingReview: sourceVerificationIssues.length,
  staleEvidenceCount: sourceEvidence.filter(source => source.freshnessStatus === "stale").length,
  evidenceSources: sourceEvidence,
  verifiedClaims: sourceVerifiedClaims,
  issues: sourceVerificationIssues,
  exportGuard: sourceExportGuard,
  boardReadinessGates
};

export const demoSnapshot: PresentationSnapshot = {
  brands: demoBrands,
  activeDeck: demoDeck,
  narrativeAnalysis: demoNarrativeAnalysis,
  contentReview: demoContentReview,
  designTokens: demoDesignTokens,
  accessibilityReport: demoAccessibilityReport,
  brandConsistencyReport: demoBrandConsistencyReport,
  contentDensityReport: demoContentDensityReport,
  structureAuditReport: demoStructureAuditReport,
  sourceVerificationReport: demoSourceVerificationReport
};
