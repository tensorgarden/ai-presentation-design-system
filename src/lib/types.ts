export type SlideContentType = "title" | "narrative" | "comparison" | "timeline" | "metric" | "evidence" | "cta";

export interface DesignToken {
  id: string; name: string; value: string; category: "color" | "typography" | "spacing" | "logo" | "iconography";
}

export interface BrandProfile {
  id: string; name: string; industry: string;
  colors: { primary: string; secondary: string; accent: string; background: string; text: string };
  typography: { headingFont: string; bodyFont: string; scale: string };
  logoUrl: string;
}

export interface Slide {
  id: string; deckId: string; position: number;
  contentType: SlideContentType; title: string; body: string;
  visual: string; notes: string; narrativeStrength: number; flagged: boolean;
}

export interface Deck {
  id: string; brandId: string; title: string; description: string;
  slideCount: number; narrativeScore: number; createdBy: string;
  slides: Slide[];
}

export interface NarrativeAnalysis {
  deckId: string; hasArc: boolean; arcPattern: string;
  weakSlides: number[]; strongSlides: number[];
  recommendations: string[];
}

export interface ContentFlag {
  slideId: string; issue: string; severity: "minor" | "major"; suggestion: string;
}

export interface ContentReview {
  deckId: string; overallScore: number; flags: ContentFlag[];
  timeEstimate: string;
}

export interface AccessibilityIssue {
  slideId: string;
  type: "contrast" | "font-size" | "alt-text" | "color-blind";
  severity: "minor" | "major" | "critical";
  description: string;
  recommendation: string;
}

export interface AccessibilityReport {
  deckId: string;
  overallScore: number; // 0-100
  passes: boolean; // true if overallScore >= 70 and no critical issues
  issues: AccessibilityIssue[];
}

export interface BrandConsistencyIssue {
  slideId: string;
  checkType: "color-mismatch" | "font-mismatch" | "logo-missing" | "spacing-violation" | "token-override";
  severity: "minor" | "major" | "critical";
  description: string;
  recommendation: string;
  autoFixable: boolean;
}

export interface BrandConsistencyReport {
  deckId: string;
  brandId: string;
  overallScore: number; // 0-100 — percentage of slides passing brand checks
  passes: boolean; // true if overallScore >= 80 and no critical issues
  issues: BrandConsistencyIssue[];
}

export interface PresentationSnapshot {
  brands: BrandProfile[];
  activeDeck: Deck | null;
  narrativeAnalysis: NarrativeAnalysis | null;
  contentReview: ContentReview | null;
  designTokens: DesignToken[];
  accessibilityReport: AccessibilityReport | null;
  brandConsistencyReport: BrandConsistencyReport | null;
}
