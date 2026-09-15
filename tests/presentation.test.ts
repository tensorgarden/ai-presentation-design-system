import { describe, it, expect } from "vitest";
import { demoDeck, demoNarrativeAnalysis, demoContentReview, demoDesignTokens, demoAccessibilityReport, demoBrandConsistencyReport, demoContentDensityReport, demoStructureAuditReport, demoSourceVerificationReport } from "@/lib/demo-data";

describe("deck", () => {
  it("has 8 slides", () => expect(demoDeck.slides).toHaveLength(8));
  it("starts with title slide", () => {
    expect(demoDeck.slides[0].contentType).toBe("title");
  });
  it("ends with CTA slide", () => {
    expect(demoDeck.slides[demoDeck.slides.length - 1].contentType).toBe("cta");
  });
});

describe("narrative analysis", () => {
  it("detects a narrative arc", () => {
    expect(demoNarrativeAnalysis?.hasArc).toBe(true);
  });
  it("has recommendations", () => {
    expect((demoNarrativeAnalysis?.recommendations.length ?? 0)).toBeGreaterThanOrEqual(1);
  });
});

describe("content review", () => {
  it("flags at least one issue", () => {
    expect((demoContentReview?.flags.length ?? 0)).toBeGreaterThanOrEqual(1);
  });
  it("overall score above 70", () => {
    expect(demoContentReview?.overallScore ?? 0).toBeGreaterThan(70);
  });
});

describe("design tokens", () => {
  it("has tokens across all categories", () => {
    const cats = new Set(demoDesignTokens.map(t => t.category));
    expect(cats.has("color")).toBe(true);
    expect(cats.has("typography")).toBe(true);
  });
});

describe("brand consistency report", () => {
  it("has issues across multiple check types", () => {
    const types = new Set(demoBrandConsistencyReport.issues.map(i => i.checkType));
    expect(types.size).toBeGreaterThanOrEqual(3);
    expect(types.has("color-mismatch")).toBe(true);
    expect(types.has("font-mismatch")).toBe(true);
  });

  it("fails when score is below 80", () => {
    expect(demoBrandConsistencyReport.overallScore).toBeLessThan(80);
    expect(demoBrandConsistencyReport.passes).toBe(false);
  });

  it("scores at least 40 for a partially-compliant deck with token overrides", () => {
    expect(demoBrandConsistencyReport.overallScore).toBeGreaterThanOrEqual(40);
  });

  it("all issues reference valid slide IDs", () => {
    const slideIds = new Set(demoDeck.slides.map(s => s.id));
    for (const issue of demoBrandConsistencyReport.issues) {
      expect(slideIds.has(issue.slideId)).toBe(true);
    }
  });

  it("has at least one auto-fixable issue", () => {
    const autoFixable = demoBrandConsistencyReport.issues.filter(i => i.autoFixable);
    expect(autoFixable.length).toBeGreaterThanOrEqual(1);
  });

  it("flags token overrides where AI defaults replace brand design tokens", () => {
    const tokenOverrides = demoBrandConsistencyReport.issues.filter(i => i.checkType === "token-override");
    expect(tokenOverrides.length).toBeGreaterThanOrEqual(1);
    for (const issue of tokenOverrides) {
      expect(issue.description).toContain("design token");
    }
  });

  it("every issue has a non-empty recommendation", () => {
    for (const issue of demoBrandConsistencyReport.issues) {
      expect(issue.recommendation.length).toBeGreaterThan(10);
    }
  });
});

describe("accessibility report", () => {
  it("scores below 70 and fails", () => {
    expect(demoAccessibilityReport.overallScore).toBeLessThan(70);
    expect(demoAccessibilityReport.passes).toBe(false);
  });

  it("has issues across multiple accessibility categories", () => {
    const types = new Set(demoAccessibilityReport.issues.map(i => i.type));
    // Should cover contrast, font-size, alt-text, and color-blind
    expect(types.size).toBeGreaterThanOrEqual(3);
    expect(types.has("contrast")).toBe(true);
  });

  it("has at least one critical issue", () => {
    const criticals = demoAccessibilityReport.issues.filter(i => i.severity === "critical");
    expect(criticals.length).toBeGreaterThanOrEqual(1);
  });

  it("flags complex layouts whose exported reading order breaks the visual sequence", () => {
    const readingOrderIssues = demoAccessibilityReport.issues.filter(i => i.type === "reading-order");

    expect(readingOrderIssues.length).toBeGreaterThanOrEqual(2);
    for (const issue of readingOrderIssues) {
      expect(["timeline", "comparison-grid", "metric-cards", "process-flow"]).toContain(issue.layoutKind);
      expect(issue.observedSequence.length).toBeGreaterThanOrEqual(3);
      expect(issue.intendedSequence.length).toBe(issue.observedSequence.length);
      expect(issue.intendedSequence).not.toEqual(issue.observedSequence);
      expect(issue.intendedSequence[0]).toBe("title");
      expect(issue.description).toMatch(/screen-reader|sequence|reading order/i);
    }
  });

  it("keeps meaning-changing reading-order sequences critical", () => {
    const readingOrderIssues = demoAccessibilityReport.issues.filter(i => i.type === "reading-order");
    const meaningChanging = readingOrderIssues.filter(issue => issue.changesNarrativeMeaning);
    const orderOnly = readingOrderIssues.filter(issue => !issue.changesNarrativeMeaning);

    expect(meaningChanging.length).toBeGreaterThanOrEqual(1);
    for (const issue of meaningChanging) {
      expect(issue.severity).toBe("critical");
    }
    for (const issue of orderOnly) {
      expect(issue.severity).not.toBe("critical");
    }
  });

  it("gives reading-order issues an explicit semantic remediation sequence", () => {
    const timelineIssue = demoAccessibilityReport.issues.find(i => i.type === "reading-order" && i.layoutKind === "timeline");

    expect(timelineIssue).toBeDefined();
    if (timelineIssue?.type === "reading-order") {
      expect(timelineIssue.recommendation).toMatch(/phase 1.*phase 2.*phase 3/i);
      expect(timelineIssue.recommendation).toMatch(/decorative|artifact/i);
      expect(timelineIssue.recommendation).toMatch(/Reading Order pane/i);
    }
  });

  it("marks or excludes decorative objects instead of reading them as content", () => {
    const readingOrderIssues = demoAccessibilityReport.issues.filter(i => i.type === "reading-order");

    for (const issue of readingOrderIssues) {
      for (const decorative of issue.decorativeObjects) {
        expect(["mark-decorative", "exclude-from-order"]).toContain(decorative.handling);
        expect(decorative.name.length).toBeGreaterThan(5);
        expect(issue.recommendation).toMatch(/decorative|artifact|exclude/i);
      }
    }
  });

  it("flags hyperlink labels that lose meaning when read standalone", () => {
    const linkTextIssues = demoAccessibilityReport.issues.filter(i => i.type === "link-text");

    expect(linkTextIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of linkTextIssues) {
      expect(issue.severity).toMatch(/major|critical/);
      expect(issue.description).toMatch(/screen-reader|list of links/i);
      expect(demoDeck.slides.find(slide => slide.id === issue.slideId)?.contentType).toBe("cta");
    }
  });

  it("gives ambiguous links destination-specific text and a ScreenTip", () => {
    const linkTextIssues = demoAccessibilityReport.issues.filter(i => i.type === "link-text");

    for (const issue of linkTextIssues) {
      expect(issue.recommendation).toMatch(/approval memo/i);
      expect(issue.recommendation).toMatch(/ScreenTip/i);
      expect(issue.recommendation).not.toMatch(/'View details'|'Click here'|'Learn more'/i);
    }
  });

  it("flags visual headings that are not exported as navigable slide titles", () => {
    const slideTitleIssues = demoAccessibilityReport.issues.filter(i => i.type === "slide-title");

    expect(slideTitleIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of slideTitleIssues) {
      expect(issue.severity).toMatch(/major|critical/);
      expect(issue.description).toMatch(/title placeholder|untitled|Outline view/i);
    }
  });

  it("requires slide-title remediation to preserve a unique navigable title", () => {
    const slideTitleIssues = demoAccessibilityReport.issues.filter(i => i.type === "slide-title");

    for (const issue of slideTitleIssues) {
      const slide = demoDeck.slides.find(item => item.id === issue.slideId);
      expect(slide).toBeDefined();
      expect(issue.recommendation).toContain(slide?.title);
      expect(issue.recommendation).toMatch(/unique slide title placeholder/i);
      expect(issue.recommendation).toMatch(/off-slide|hidden/i);
    }
  });

  it("does not treat generic AI-generated alt text as export-ready", () => {
    const altTextIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "alt-text");

    expect(altTextIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of altTextIssues) {
      expect(issue.objectName.length).toBeGreaterThan(10);
      expect(issue.altTextSource).toBe("ai-generated");
      expect(issue.altTextReviewStatus).not.toBe("approved");
      expect(issue.currentAltText).toMatch(/^A chart/i);
    }
  });

  it("requires chart alt text to convey the insight and receive human approval", () => {
    const chartIssue = demoAccessibilityReport.issues.find(issue => (
      issue.type === "alt-text" && issue.objectName.includes("scatter plot")
    ));

    expect(chartIssue).toBeDefined();
    if (chartIssue?.type === "alt-text") {
      expect(chartIssue.recommendation).toMatch(/0\.8 CS hires.*80% lower churn/i);
      expect(chartIssue.recommendation).toMatch(/named accessibility reviewer approve/i);
      expect(chartIssue.recommendation).toMatch(/linked data table/i);
    }
  });

  it("records measured thresholds for every contrast issue", () => {
    const contrastIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "contrast");

    expect(contrastIssues.length).toBeGreaterThanOrEqual(2);
    for (const issue of contrastIssues) {
      expect(issue.foreground).toMatch(/^#[0-9a-f]{6}$/i);
      expect(issue.background).toMatch(/^#[0-9a-f]{6}$/i);
      expect(issue.measuredRatio).toBeLessThan(issue.requiredRatio);
      expect(issue.description).toContain(`${issue.measuredRatio.toFixed(1)}:1`);
    }
  });

  it("records rendered text size instead of inferring a large-text exception", () => {
    const normalTextIssue = demoAccessibilityReport.issues.find(issue => (
      issue.type === "contrast" && issue.elementKind === "normal-text"
    ));
    const graphicIssue = demoAccessibilityReport.issues.find(issue => (
      issue.type === "contrast" && issue.elementKind === "meaningful-graphic"
    ));

    expect(normalTextIssue?.type).toBe("contrast");
    if (normalTextIssue?.type === "contrast") {
      expect(normalTextIssue).toMatchObject({ renderedFontSizePt: 14, renderedFontWeight: "normal" });
      expect(normalTextIssue.renderedFontSizePt ?? 0).toBeLessThan(18);
    }
    expect(graphicIssue?.type).toBe("contrast");
    if (graphicIssue?.type === "contrast") {
      expect(graphicIssue).toMatchObject({ renderedFontSizePt: null, renderedFontWeight: null });
    }
  });

  it("applies WCAG thresholds by rendered element kind", () => {
    const contrastIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "contrast");
    const normalTextIssue = contrastIssues.find(issue => issue.elementKind === "normal-text");
    const graphicIssue = contrastIssues.find(issue => issue.elementKind === "meaningful-graphic");

    expect(normalTextIssue).toMatchObject({ requiredRatio: 4.5, criterion: "WCAG 1.4.3" });
    expect(graphicIssue).toMatchObject({ requiredRatio: 3, criterion: "WCAG 1.4.11" });
    expect(graphicIssue?.recommendation).toMatch(/exported slide|non-color cue/i);
  });

  it("records when chart meaning is conveyed by color alone", () => {
    const colorRelianceIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "color-blind");

    expect(colorRelianceIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of colorRelianceIssues) {
      expect(issue.elementKind).toBe("chart-series");
      expect(issue.encodedMeaning.length).toBeGreaterThan(30);
      expect(issue.nonColorCues).toHaveLength(0);
    }
  });

  it("requires color-dependent charts to add labels or patterns before export", () => {
    const colorRelianceIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "color-blind");

    for (const issue of colorRelianceIssues) {
      expect(issue.recommendation).toMatch(/direct.*label|pattern/i);
      expect(issue.recommendation).toMatch(/grayscale|non-color cue/i);
      expect(issue.recommendation).not.toMatch(/palette alone is sufficient/i);
    }
  });

  it("flags auto-starting motion longer than five seconds without pause controls", () => {
    const motionIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "motion");

    expect(motionIssues.length).toBeGreaterThanOrEqual(2);
    for (const issue of motionIssues) {
      expect(issue.autoStarts).toBe(true);
      expect(issue.durationSeconds).toBeGreaterThan(5);
      expect(issue.pauseStopHideControl).toBe("missing");
      expect(issue.criterion).toBe("WCAG 2.2.2");
      expect(issue.severity).toMatch(/major|critical/);
    }
  });

  it("requires looping animated backgrounds to offer a pausable or static alternative", () => {
    const backgroundIssue = demoAccessibilityReport.issues.find(issue => (
      issue.type === "motion" && issue.elementKind === "animated-background"
    ));

    expect(backgroundIssue).toBeDefined();
    if (backgroundIssue?.type === "motion") {
      expect(backgroundIssue.loops).toBe(true);
      expect(backgroundIssue.honorsReducedMotion).toBe(false);
      expect(backgroundIssue.description).toMatch(/GIF|cannot be paused/i);
      expect(backgroundIssue.recommendation).toMatch(/pause|static/i);
      expect(backgroundIssue.recommendation).toMatch(/reduced-motion/i);
    }
  });

  it("keeps auto-advance timers from outrunning the slide's estimated read time", () => {
    const autoAdvanceIssues = demoAccessibilityReport.issues
      .filter(issue => issue.type === "motion")
      .filter(issue => issue.elementKind === "auto-advancing-slide");

    expect(autoAdvanceIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of autoAdvanceIssues) {
      const slide = demoDeck.slides.find(item => item.id === issue.slideId);
      expect(slide).toBeDefined();
      expect(issue.durationSeconds).toBeLessThan(slide?.estimatedReadTimeSeconds ?? 0);
      expect(issue.recommendation).toMatch(/manual advance|pause/i);
      expect(issue.recommendation).toMatch(/estimated read time/i);
    }
  });

  it("all issues reference valid slide IDs", () => {
    const slideIds = new Set(demoDeck.slides.map(s => s.id));
    for (const issue of demoAccessibilityReport.issues) {
      expect(slideIds.has(issue.slideId)).toBe(true);
    }
  });

  it("flags data tables that lack marked header rows for screen-reader navigation", () => {
    const tableIssues = demoAccessibilityReport.issues.filter(i => i.type === "table-structure");

    expect(tableIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of tableIssues) {
      expect(issue.severity).toMatch(/major|critical/);
      expect(issue.description).toMatch(/header row|scope|screen-reader/i);
    }
  });

  it("requires table-structure remediation to name the missing markup rather than a vague suggestion", () => {
    const tableIssues = demoAccessibilityReport.issues.filter(i => i.type === "table-structure");

    for (const issue of tableIssues) {
      expect(issue.recommendation).toMatch(/header row|scope=|mark as header/i);
      expect(issue.recommendation).not.toMatch(/\bconsider\b|\bmaybe\b/i);
    }
  });

  it("flags exported decks whose keyboard tab order skips past the slide content", () => {
    const focusOrderIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "focus-order");

    expect(focusOrderIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of focusOrderIssues) {
      expect(issue.severity).toMatch(/major|critical/);
      expect(issue.criterion).toBe("WCAG 2.4.3");
      expect(issue.description).toMatch(/keyboard|tab stop/i);
      expect(issue.description).not.toMatch(/screen-reader/i);
    }
  });

  it("records the observed tab sequence and requires a named corrected order", () => {
    const focusOrderIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "focus-order");

    for (const issue of focusOrderIssues) {
      expect(issue.observedOrder.length).toBeGreaterThanOrEqual(3);
      expect(issue.expectedOrder.length).toBe(issue.observedOrder.length);
      expect(issue.expectedOrder).not.toEqual(issue.observedOrder);
      expect(issue.observedOrder[0]).not.toBe("slide title");
      expect(issue.expectedOrder[0]).toBe("slide title");
      expect(issue.recommendation).toMatch(/tab stops|focus order/i);
      expect(issue.recommendation).toMatch(/exported share link|exported DOM/i);
      expect(issue.recommendation).not.toMatch(/\bconsider\b|\bmaybe\b/i);
    }
  });

  it("flags focused controls that are fully hidden by persistent export chrome", () => {
    const focusVisibilityIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "focus-not-obscured");

    expect(focusVisibilityIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of focusVisibilityIssues) {
      expect(issue.visibility).toBe("fully-obscured");
      expect(issue.obscuredBy).toBe("sticky-footer");
      expect(issue.criterion).toBe("WCAG 2.4.11");
      expect(issue.description).toMatch(/keyboard|focus|hidden/i);
      expect(demoDeck.slides.find(slide => slide.id === issue.slideId)?.contentType).toBe("cta");
    }
  });

  it("flags presentations without a declared language for assistive technology", () => {
    const languageIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "language-declaration");

    expect(languageIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of languageIssues) {
      expect(issue.severity).toMatch(/major|critical/);
      expect(issue.languageScope).toBe("presentation");
      expect(issue.criterion).toBe("WCAG 3.1.1");
      expect(issue.declaredLanguage).toBeNull();
      expect(issue.expectedLanguage).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
      expect(issue.description).toMatch(/screen-reader|pronounc/i);
    }
  });

  it("requires language remediation to be verified in the exported presentation", () => {
    const languageIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "language-declaration");

    for (const issue of languageIssues) {
      expect(issue.recommendation).toMatch(/language (tag|declaration)/i);
      expect(issue.recommendation).toMatch(/exported (PowerPoint|presentation)/i);
      expect(issue.recommendation).not.toMatch(/consider|maybe/i);
    }
  });

  it("requires focus-visibility remediation to keep the control in view", () => {
    const focusVisibilityIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "focus-not-obscured");

    expect(focusVisibilityIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of focusVisibilityIssues) {
      expect(issue.recommendation).toMatch(/scroll-padding|move.*above|partially visible/i);
      expect(issue.recommendation).toMatch(/exported share link/i);
      expect(issue.recommendation).not.toMatch(/consider|maybe/i);
    }
  });

  it("flags undersized pointer targets in exported share-link controls", () => {
    const targetSizeIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "target-size");

    expect(targetSizeIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of targetSizeIssues) {
      expect(issue.criterion).toBe("WCAG 2.5.8");
      expect(Math.min(issue.widthCssPx, issue.heightCssPx)).toBeLessThan(issue.minimumSizeCssPx);
      expect(issue.description).toMatch(/24.*CSS pixels|target size/i);
    }
  });

  it("requires target-size remediation to account for spacing and exported dimensions", () => {
    const targetSizeIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "target-size");

    for (const issue of targetSizeIssues) {
      expect(issue.spacingToAdjacentTargetCssPx).not.toBeNull();
      expect(issue.spacingToAdjacentTargetCssPx).toBeLessThan(issue.minimumSizeCssPx);
      expect(issue.recommendation).toMatch(/24.?24|spacing|enlarge/i);
      expect(issue.recommendation).toMatch(/exported share link/i);
      expect(issue.recommendation).not.toMatch(/consider|maybe/i);
    }
  });

  it("flags text spacing overrides that make exported slide content collide", () => {
    const textSpacingIssues = demoAccessibilityReport.issues.filter(issue => issue.type === "text-spacing");

    expect(textSpacingIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of textSpacingIssues) {
      expect(issue.severity).toMatch(/major|critical/);
      expect(issue.description).toMatch(/line spacing|letter spacing|text spacing/i);
      expect(issue.recommendation).toMatch(/exported presentation|text spacing/i);
    }
  });
});

describe("content density report", () => {
  it("scores below 80 and fails when over half the slides exceed density limits", () => {
    expect(demoContentDensityReport.overallScore).toBeLessThan(80);
    expect(demoContentDensityReport.passes).toBe(false);
  });

  it("flags at least one critical density issue", () => {
    const criticals = demoContentDensityReport.issues.filter(i => i.severity === "critical");
    expect(criticals.length).toBeGreaterThanOrEqual(1);
  });

  it("total words and average words are internally consistent", () => {
    const sum = demoDeck.slides.reduce((acc, s) => acc + s.wordCount, 0);
    expect(demoContentDensityReport.totalWords).toBe(sum);
    expect(demoContentDensityReport.averageWordsPerSlide).toBeCloseTo(sum / demoDeck.slides.length, 1);
  });

  it("all issues reference valid slide IDs", () => {
    const slideIds = new Set(demoDeck.slides.map(s => s.id));
    for (const issue of demoContentDensityReport.issues) {
      expect(slideIds.has(issue.slideId)).toBe(true);
    }
  });

  it("every flagged slide's actual word count matches the issue's reported word count", () => {
    const wordCounts = new Map(demoDeck.slides.map(s => [s.id, s.wordCount]));
    for (const issue of demoContentDensityReport.issues) {
      expect(issue.wordCount).toBe(wordCounts.get(issue.slideId));
    }
  });

  it("every issue's word count exceeds the recommended maximum for its content type", () => {
    for (const issue of demoContentDensityReport.issues) {
      expect(issue.wordCount).toBeGreaterThan(issue.recommendedMax);
    }
  });

  it("every issue has a non-empty description and recommendation", () => {
    for (const issue of demoContentDensityReport.issues) {
      expect(issue.description.length).toBeGreaterThan(20);
      expect(issue.recommendation.length).toBeGreaterThan(20);
    }
  });

  it("reports content types consistent with the flagged slide", () => {
    const types = new Map(demoDeck.slides.map(s => [s.id, s.contentType]));
    for (const issue of demoContentDensityReport.issues) {
      expect(issue.contentType).toBe(types.get(issue.slideId));
    }
  });
});

describe("structure audit report", () => {
  it("fails decks with critical structure-first issues", () => {
    expect(demoStructureAuditReport.structureFirstScore).toBeLessThan(80);
    expect(demoStructureAuditReport.passes).toBe(false);
    expect(demoStructureAuditReport.issues.some(issue => issue.severity === "critical")).toBe(true);
  });

  it("flags one-sharp-idea and decision-path problems", () => {
    const checkTypes = new Set(demoStructureAuditReport.issues.map(issue => issue.checkType));
    expect(checkTypes.has("single-idea")).toBe(true);
    expect(checkTypes.has("decision-path")).toBe(true);
  });

  it("references valid slides and actionable recommendations", () => {
    const slideIds = new Set(demoDeck.slides.map(slide => slide.id));
    for (const issue of demoStructureAuditReport.issues) {
      expect(slideIds.has(issue.slideId)).toBe(true);
      expect(issue.description.length).toBeGreaterThan(30);
      expect(issue.recommendation.length).toBeGreaterThan(30);
    }
  });
});

describe("source verification report", () => {
  it("keeps verified claims anchored to valid slides and evidence sources", () => {
    const slideIds = new Set(demoDeck.slides.map(slide => slide.id));
    const sourceIds = new Set(demoSourceVerificationReport.evidenceSources.map(source => source.id));

    for (const claim of demoSourceVerificationReport.verifiedClaims) {
      expect(slideIds.has(claim.slideId)).toBe(true);
      expect(sourceIds.has(claim.evidenceId)).toBe(true);
      expect(claim.status).toBe("verified");
      expect(claim.confidence).toBeGreaterThan(0.8);
    }
  });

  it("requires claim-level evidence excerpts rather than source-only citations", () => {
    for (const claim of demoSourceVerificationReport.verifiedClaims) {
      expect(claim.evidenceExcerpt.trim().length).toBeGreaterThan(30);
      expect(claim.supportLevel).toBe("direct");
    }
  });

  it("keeps evidence excerpts distinct from source locations", () => {
    const sources = new Map(demoSourceVerificationReport.evidenceSources.map(source => [source.id, source]));

    for (const claim of demoSourceVerificationReport.verifiedClaims) {
      expect(claim.evidenceExcerpt).not.toBe(sources.get(claim.evidenceId)?.location);
    }
  });

  it("fails the report when a board-facing financial claim still needs review", () => {
    expect(demoSourceVerificationReport.passes).toBe(false);
    expect(demoSourceVerificationReport.claimsNeedingReview).toBeGreaterThanOrEqual(1);
    expect(demoSourceVerificationReport.issues.some(issue => issue.severity === "major" && issue.status === "needs-review")).toBe(true);
  });

  it("records retrievable source locations instead of free-floating citations", () => {
    for (const source of demoSourceVerificationReport.evidenceSources) {
      expect(source.location.length).toBeGreaterThan(20);
      expect(source.linkedSlideIds.length).toBeGreaterThanOrEqual(1);
      expect(source.retrievedAt).toMatch(/^2026-06-/);
    }
  });

  it("keeps claim counts internally consistent", () => {
    expect(demoSourceVerificationReport.verifiedClaimCount).toBe(demoSourceVerificationReport.verifiedClaims.length);
    expect(demoSourceVerificationReport.claimsNeedingReview).toBe(demoSourceVerificationReport.issues.length);
    expect(demoSourceVerificationReport.staleEvidenceCount).toBe(
      demoSourceVerificationReport.evidenceSources.filter(source => source.freshnessStatus === "stale").length
    );
  });

  it("keeps verified claims off stale evidence anchors", () => {
    const sources = new Map(demoSourceVerificationReport.evidenceSources.map(source => [source.id, source]));

    for (const claim of demoSourceVerificationReport.verifiedClaims) {
      const source = sources.get(claim.evidenceId);
      expect(source?.freshnessStatus).not.toBe("stale");
      expect(Date.parse(source?.expiresAt ?? "")).not.toBeNaN();
      expect(source?.owner.length ?? 0).toBeGreaterThan(3);
    }
  });

  it("blocks external use when a financial claim depends on stale evidence", () => {
    const staleSourceIds = new Set(
      demoSourceVerificationReport.evidenceSources
        .filter(source => source.freshnessStatus === "stale")
        .map(source => source.id)
    );

    expect(demoSourceVerificationReport.issues.some(issue => (
      issue.blocksExternalUse &&
      issue.evidenceId !== undefined &&
      staleSourceIds.has(issue.evidenceId)
    ))).toBe(true);
  });

  it("requires a named approver and due date for board-facing blocked claims", () => {
    const blockedGates = demoSourceVerificationReport.boardReadinessGates.filter(gate => gate.status === "blocked");

    expect(blockedGates.length).toBeGreaterThanOrEqual(1);
    for (const gate of blockedGates) {
      expect(gate.requiredApprover).toMatch(/reviewer|partner|lead/i);
      expect(Date.parse(gate.dueBy)).not.toBeNaN();
      expect(gate.blockingReason).toMatch(/stale|locked|review/i);
    }
  });

  it("links blocked board-readiness gates to review-needed source issues", () => {
    const reviewIssueKeys = new Set(
      demoSourceVerificationReport.issues
        .filter(issue => issue.blocksExternalUse)
        .map(issue => `${issue.slideId}:${issue.claim}`)
    );

    for (const gate of demoSourceVerificationReport.boardReadinessGates.filter(gate => gate.status === "blocked")) {
      expect(reviewIssueKeys.has(`${gate.slideId}:${gate.claim}`)).toBe(true);
    }
  });

  it("blocks deck export while source issues block external use", () => {
    const guard = demoSourceVerificationReport.exportGuard;
    const blockingIssues = demoSourceVerificationReport.issues.filter(issue => issue.blocksExternalUse);
    const blockingSlideIds = Array.from(new Set(blockingIssues.map(issue => issue.slideId)));

    expect(guard.status).toBe("blocked");
    expect(guard.blockedClaimCount).toBe(blockingIssues.length);
    expect(guard.blockedSlideIds).toEqual(blockingSlideIds);
    expect(guard.reason).toMatch(/export|share-link|source/i);
  });

  it("routes the export guard to the active board-readiness approver", () => {
    const blockedGate = demoSourceVerificationReport.boardReadinessGates.find(gate => gate.status === "blocked");

    expect(blockedGate).toBeDefined();
    expect(demoSourceVerificationReport.exportGuard.nextReviewer).toBe(blockedGate?.requiredApprover);
    expect(demoSourceVerificationReport.exportGuard.dueBy).toBe(blockedGate?.dueBy);
    expect(Date.parse(demoSourceVerificationReport.exportGuard.dueBy)).not.toBeNaN();
  });

  it("separates blocked gates from ready-for-review gates to surface actionable items", () => {
    const blockedGates = demoSourceVerificationReport.boardReadinessGates.filter(gate => gate.status === "blocked");
    const readyGates = demoSourceVerificationReport.boardReadinessGates.filter(gate => gate.status === "ready-for-review");

    expect(blockedGates.length).toBeGreaterThanOrEqual(1);
    expect(readyGates.length).toBeGreaterThanOrEqual(1);
    for (const gate of readyGates) {
      expect(gate.blockingReason).toBe("");
      expect(gate.requiredApprover).toMatch(/partner|reviewer|lead/i);
      expect(Date.parse(gate.dueBy)).not.toBeNaN();
    }
  });
});
