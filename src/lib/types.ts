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
  wordCount: number;
  estimatedReadTimeSeconds: number;
}

export interface ContentDensityIssue {
  slideId: string;
  contentType: SlideContentType;
  wordCount: number;
  recommendedMax: number;
  severity: "minor" | "major" | "critical";
  description: string;
  recommendation: string;
}

export interface ContentDensityReport {
  deckId: string;
  overallScore: number; // 0-100 — percentage of slides within density limits
  passes: boolean; // true if overallScore >= 80 and no critical issues
  totalWords: number;
  averageWordsPerSlide: number;
  issues: ContentDensityIssue[];
}

export interface StructureAuditIssue {
  slideId: string;
  checkType: "single-idea" | "audience-context" | "decision-path" | "supporting-evidence";
  severity: "minor" | "major" | "critical";
  description: string;
  recommendation: string;
}

export interface StructureAuditReport {
  deckId: string;
  structureFirstScore: number; // 0-100 - measures whether the deck is organized around one sharp insight per slide
  passes: boolean; // true if structureFirstScore >= 80 and no critical issues
  insightDensity: "too-dense" | "balanced" | "too-sparse";
  issues: StructureAuditIssue[];
}

export type SourceVerificationStatus = "verified" | "needs-review" | "missing-source";
export type SourceFreshnessStatus = "current" | "expires-soon" | "stale";
export type SourceExportStatus = "blocked" | "review-required" | "approved";

export interface SourceEvidence {
  id: string;
  title: string;
  sourceType: "uploaded-file" | "data-room" | "analyst-note" | "benchmark";
  location: string;
  retrievedAt: string;
  linkedSlideIds: string[];
  owner: string;
  expiresAt: string;
  freshnessStatus: SourceFreshnessStatus;
}

export interface SourceVerifiedClaim {
  slideId: string;
  claim: string;
  evidenceId: string;
  evidenceExcerpt: string;
  supportLevel: "direct" | "partial" | "contextual";
  status: SourceVerificationStatus;
  confidence: number;
  reviewedBy: string;
  lastChecked: string;
}

export interface SourceVerificationIssue {
  slideId: string;
  claim: string;
  evidenceId?: string;
  status: Exclude<SourceVerificationStatus, "verified">;
  severity: "minor" | "major" | "critical";
  description: string;
  reviewerAction: string;
  blocksExternalUse: boolean;
}

export interface BoardReadinessGate {
  id: string;
  slideId: string;
  claim: string;
  gateType: "finance-signoff" | "citation-validation" | "source-refresh";
  requiredApprover: string;
  dueBy: string;
  status: "blocked" | "ready-for-review" | "approved";
  blockingReason: string;
}

export interface SourceExportGuard {
  deckId: string;
  status: SourceExportStatus;
  blockedClaimCount: number;
  blockedSlideIds: string[];
  reason: string;
  nextReviewer: string;
  dueBy: string;
  callout: string;
}

export interface SourceVerificationReport {
  deckId: string;
  passes: boolean;
  verifiedClaimCount: number;
  claimsNeedingReview: number;
  staleEvidenceCount: number;
  evidenceSources: SourceEvidence[];
  verifiedClaims: SourceVerifiedClaim[];
  issues: SourceVerificationIssue[];
  exportGuard: SourceExportGuard;
  boardReadinessGates: BoardReadinessGate[];
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
  type: "contrast" | "font-size" | "alt-text" | "color-blind" | "reading-order";
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
  contentDensityReport: ContentDensityReport | null;
  structureAuditReport: StructureAuditReport | null;
  sourceVerificationReport: SourceVerificationReport | null;
}
