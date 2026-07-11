import { demoBrands, demoContentReview, demoDeck, demoDesignTokens, demoNarrativeAnalysis, demoSourceVerificationReport, demoStructureAuditReport } from "@/lib/demo-data";

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: string }) {
  const t: Record<string, string> = { slate: "border-slate-200 bg-white text-slate-700", green: "border-emerald-200 bg-emerald-50 text-emerald-700", red: "border-red-200 bg-red-50 text-red-700", amber: "border-amber-200 bg-amber-50 text-amber-800", purple: "border-indigo-200 bg-indigo-50 text-indigo-700" };
  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${t[tone]}`}>{children}</span>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur ${className}`}>{children}</section>;
}

const slideIcons: Record<string, string> = { title: "📌", narrative: "📖", comparison: "⚖️", timeline: "📅", metric: "📊", evidence: "🔍", cta: "🎯" };

export default function Home() {
  const exportGuard = demoSourceVerificationReport.exportGuard;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-5 py-8 md:px-8 lg:px-10 bg-slate-50">
      {/* HEADER */}
      <header className="grid gap-6 rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-sm backdrop-blur lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="purple">AI Presentation</Badge>
            <Badge tone="green">{demoDeck.slideCount} slides</Badge>
            <Badge>Narrative score: {demoDeck.narrativeScore}/100</Badge>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Design System</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">AI Presentation Builder</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Design tokens enforce brand consistency. Layout engine adapts to content type — comparison, timeline, metric, CTA — not rigid templates. Narrative analysis catches weak slides before they reach the boardroom.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Active brand</p>
          {demoBrands.filter(b => b.id === demoDeck.brandId).map(brand => (
            <div key={brand.id}>
              <div className="flex gap-2 mb-2">
                {[brand.colors.primary, brand.colors.secondary, brand.colors.accent, brand.colors.background].map((c, i) => (
                  <div key={i} className="h-6 w-6 rounded-full border border-slate-200" style={{ backgroundColor: c }} title={c} />
                ))}
              </div>
              <p className="font-bold text-slate-950">{brand.name}</p>
              <p className="text-xs text-slate-500">{brand.industry} · {brand.typography.headingFont} / {brand.typography.bodyFont}</p>
            </div>
          ))}
        </div>
      </header>

      {/* SLIDE PREVIEWS */}
      <Card>
        <h2 className="text-xl font-bold text-slate-950">{demoDeck.title}</h2>
        <p className="mt-1 text-sm text-slate-500">{demoDeck.description}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {demoDeck.slides.map(slide => (
            <div key={slide.id} className={`rounded-2xl border p-4 ${slide.flagged ? "border-red-300 bg-red-50/30" : slide.narrativeStrength >= 85 ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200 bg-white"}`}>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-lg">{slideIcons[slide.contentType]}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400">#{slide.position}</span>
                  <span className={`text-[10px] font-semibold ${slide.narrativeStrength >= 85 ? "text-emerald-600" : slide.narrativeStrength >= 70 ? "text-amber-600" : "text-red-600"}`}>{slide.narrativeStrength}</span>
                </div>
              </div>
              <h3 className="font-bold text-sm text-slate-950">{slide.title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600 line-clamp-3">{slide.body}</p>
              <div className="mt-2 flex items-center gap-1">
                <Badge tone="slate">{slide.contentType}</Badge>
                {slide.flagged && <Badge tone="red">Flagged</Badge>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* NARRATIVE ANALYSIS + CONTENT REVIEW + STRUCTURE AUDIT */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="text-xl font-bold text-slate-950">Narrative Intelligence</h2>
          {demoNarrativeAnalysis && (
            <>
              <div className="mt-3 flex items-center gap-2">
                <Badge tone={demoNarrativeAnalysis.hasArc ? "green" : "red"}>
                  {demoNarrativeAnalysis.hasArc ? "Arc detected" : "No arc"}
                </Badge>
                <span className="text-sm text-slate-500">{demoNarrativeAnalysis.arcPattern}</span>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Strongest slides</p>
                {demoNarrativeAnalysis.strongSlides.map(n => {
                  const slide = demoDeck.slides.find(s => s.position === n);
                  return slide ? (
                    <div key={n} className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2 flex items-center justify-between">
                      <span className="text-sm text-emerald-800">Slide {n}: {slide.title}</span>
                      <span className="text-xs font-bold text-emerald-600">{slide.narrativeStrength}</span>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Recommendations</p>
                {demoNarrativeAnalysis.recommendations.map((rec, i) => (
                  <div key={i} className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 text-xs leading-5 text-amber-800">💡 {rec}</div>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-slate-950">Content Review</h2>
          {demoContentReview && (
            <>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-3xl font-black text-indigo-700">{demoContentReview.overallScore}</span>
                <span className="text-sm text-slate-400">/ 100 · {demoContentReview.flags.length} flags · {demoContentReview.timeEstimate}</span>
              </div>
              <div className="mt-4 space-y-3">
                {demoContentReview.flags.map((flag, i) => (
                  <div key={i} className={`rounded-xl border p-3 ${flag.severity === "major" ? "border-red-200 bg-red-50/30" : "border-amber-100 bg-amber-50/20"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-400">Slide {flag.slideId}</span>
                      <Badge tone={flag.severity === "major" ? "red" : "amber"}>{flag.severity}</Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-800">{flag.issue}</p>
                    <p className="mt-1 text-xs text-slate-500">{flag.suggestion}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-slate-950">Structure Audit</h2>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-3xl font-black text-indigo-700">{demoStructureAuditReport.structureFirstScore}</span>
            <span className="text-sm text-slate-400">/ 100 · {demoStructureAuditReport.insightDensity.replace("-", " ")}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Checks whether the deck follows a structure-first flow: one sharp idea per slide, clear proof anchors, and an explicit decision path for executives.
          </p>
          <div className="mt-4 space-y-3">
            {demoStructureAuditReport.issues.map(issue => (
              <div key={`${issue.slideId}-${issue.checkType}`} className={`rounded-xl border p-3 ${issue.severity === "critical" ? "border-red-200 bg-red-50/30" : "border-amber-100 bg-amber-50/20"}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-400">Slide {issue.slideId}</span>
                  <Badge tone={issue.severity === "critical" ? "red" : "amber"}>{issue.checkType}</Badge>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-800">{issue.description}</p>
                <p className="mt-1 text-xs text-slate-500">{issue.recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>


      {/* SOURCE VERIFICATION */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Source Verification</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
              Source-first checks catch AI-generated deck claims that look polished but are not yet backed by uploaded evidence, reviewer sign-off, or a retrievable citation anchor.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={demoSourceVerificationReport.passes ? "green" : "amber"}>
              {demoSourceVerificationReport.passes ? "ready" : "review needed"}
            </Badge>
            <Badge>{demoSourceVerificationReport.verifiedClaimCount} verified claims</Badge>
            <Badge tone="amber">{demoSourceVerificationReport.claimsNeedingReview} review item</Badge>
            <Badge tone={demoSourceVerificationReport.staleEvidenceCount > 0 ? "red" : "green"}>
              {demoSourceVerificationReport.staleEvidenceCount} stale source
            </Badge>
            <Badge tone={demoSourceVerificationReport.boardReadinessGates.some(gate => gate.status === "blocked") ? "red" : "green"}>
              {demoSourceVerificationReport.boardReadinessGates.length} review gate
            </Badge>
          </div>
        </div>
        <div className={`mt-4 rounded-2xl border p-4 ${exportGuard.status === "blocked" ? "border-red-200 bg-red-50/40" : exportGuard.status === "review-required" ? "border-amber-200 bg-amber-50/40" : "border-emerald-200 bg-emerald-50/30"}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pre-export citation guard</p>
            <Badge tone={exportGuard.status === "blocked" ? "red" : exportGuard.status === "review-required" ? "amber" : "green"}>
              {exportGuard.status.replace("-", " ")}
            </Badge>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900">{exportGuard.callout}</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">{exportGuard.reason}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-white/70 px-3 py-1">Blocked claims: {exportGuard.blockedClaimCount}</span>
            <span className="rounded-full bg-white/70 px-3 py-1">Slides: {exportGuard.blockedSlideIds.join(", ")}</span>
            <span className="rounded-full bg-white/70 px-3 py-1">Reviewer: {exportGuard.nextReviewer}</span>
            <span className="rounded-full bg-white/70 px-3 py-1">Due: {exportGuard.dueBy}</span>
          </div>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {demoSourceVerificationReport.verifiedClaims.map(claim => {
            const source = demoSourceVerificationReport.evidenceSources.find(item => item.id === claim.evidenceId);
            return (
              <div key={`${claim.slideId}-${claim.evidenceId}`} className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Slide {claim.slideId}</span>
                  <Badge tone="green">{Math.round(claim.confidence * 100)}% confidence</Badge>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{claim.claim}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">Source: {source?.title ?? "Missing source"}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Anchor: {source?.location ?? "Missing anchor"}</p>
                <blockquote className="mt-2 border-l-2 border-emerald-300 pl-2 text-xs leading-5 text-slate-600">
                  “{claim.evidenceExcerpt}”
                </blockquote>
                <p className="mt-1 text-xs text-slate-400">Support: {claim.supportLevel} · freshness: {source?.freshnessStatus ?? "unknown"} · expires {source?.expiresAt ?? "n/a"}</p>
                <p className="mt-1 text-xs text-slate-400">Reviewed by {claim.reviewedBy} on {claim.lastChecked}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {demoSourceVerificationReport.boardReadinessGates.map(gate => (
            <div key={gate.id} className={`rounded-2xl border p-4 ${gate.status === "blocked" ? "border-red-200 bg-red-50/40" : "border-emerald-200 bg-emerald-50/30"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-red-800">Slide {gate.slideId} · {gate.gateType}</span>
                <Badge tone={gate.status === "blocked" ? "red" : "green"}>{gate.status.replace("-", " ")}</Badge>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">{gate.claim}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">Required approver: {gate.requiredApprover} by {gate.dueBy}</p>
              <p className="mt-2 text-xs leading-5 text-red-700">{gate.blockingReason}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {demoSourceVerificationReport.issues.map(issue => (
            <div key={`${issue.slideId}-${issue.claim}`} className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-800">Slide {issue.slideId} · {issue.status}</span>
                <Badge tone={issue.severity === "critical" ? "red" : "amber"}>{issue.severity}</Badge>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">{issue.claim}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{issue.description}</p>
              {issue.evidenceId && (
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Evidence anchor: {demoSourceVerificationReport.evidenceSources.find(source => source.id === issue.evidenceId)?.title ?? issue.evidenceId}
                </p>
              )}
              <p className="mt-2 text-xs font-medium text-amber-900">Reviewer action: {issue.reviewerAction}</p>
              {issue.blocksExternalUse && <p className="mt-1 text-xs font-semibold text-red-700">External use blocked until finance sign-off is attached.</p>}
            </div>
          ))}
        </div>
      </Card>

      {/* DESIGN TOKENS */}
      <Card>
        <h2 className="text-xl font-bold text-slate-950">Design Tokens</h2>
        <p className="mt-1 text-sm text-slate-500">Every token is a single source of truth. Change one, and every slide inherits it.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {demoDesignTokens.map(tok => (
            <div key={tok.id} className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{tok.category}</p>
              <p className="mt-1 font-bold text-sm text-slate-950">{tok.name}</p>
              {tok.category === "color" ? (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-5 w-5 rounded border border-slate-200" style={{ backgroundColor: tok.value }} />
                  <span className="text-xs font-mono text-slate-500">{tok.value}</span>
                </div>
              ) : (
                <p className="mt-1 text-xs font-mono text-slate-500">{tok.value}</p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}
