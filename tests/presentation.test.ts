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

    expect(readingOrderIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of readingOrderIssues) {
      expect(issue.severity).toBe("critical");
      expect(issue.description).toMatch(/screen-reader|sequence/i);
    }
  });

  it("gives reading-order issues an explicit remediation sequence", () => {
    const readingOrderIssues = demoAccessibilityReport.issues.filter(i => i.type === "reading-order");

    for (const issue of readingOrderIssues) {
      expect(issue.recommendation).toMatch(/phase 1.*phase 2.*phase 3/i);
      expect(issue.recommendation).toMatch(/decorative|artifact/i);
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

  it("all issues reference valid slide IDs", () => {
    const slideIds = new Set(demoDeck.slides.map(s => s.id));
    for (const issue of demoAccessibilityReport.issues) {
      expect(slideIds.has(issue.slideId)).toBe(true);
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
});
