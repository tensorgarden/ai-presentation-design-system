import { describe, it, expect } from "vitest";
import { demoDeck, demoNarrativeAnalysis, demoContentReview, demoDesignTokens, demoAccessibilityReport, demoBrandConsistencyReport, demoContentDensityReport } from "@/lib/demo-data";

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
