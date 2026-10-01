import React, { useState } from 'react';
import {
  Camera,
  Eye,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Zap,
  Check,
  FileCheck,
  Package
} from 'lucide-react';

interface ProductOverviewProps {
  onNavigateToStation: () => void;
  onNavigateToManager: () => void;
}

export const ProductOverview: React.FC<ProductOverviewProps> = ({
  onNavigateToStation,
  onNavigateToManager,
}) => {
  // Interactive Hero & Tri-State Demo
  const [selectedOutcome, setSelectedOutcome] = useState<'UNCERTAIN' | 'PASS' | 'FAIL'>('UNCERTAIN');
  const [activePrincipleRule, setActivePrincipleRule] = useState<number>(0);

  const principleRules = [
    {
      title: 'Polybag presence',
      requirement: 'REQUIREMENT 1 / SEAL',
      status: 'PASS',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      callout: 'SEAL: Hermetic heat seal verified continuous',
      calloutPos: 'top-10 left-12',
    },
    {
      title: 'FNSKU label placement',
      requirement: 'REQUIREMENT 2 / MARGIN',
      status: 'FAIL',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      callout: 'FNSKU: Placed across curved seam (FAIL)',
      calloutPos: 'top-28 right-16',
    },
    {
      title: 'Warning notice visibility',
      requirement: 'REQUIREMENT 3 / SIZE',
      status: 'UNCERTAIN',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      callout: 'WARNING: Fold obscures 2 of 4 text lines',
      calloutPos: 'bottom-12 left-16',
    },
  ];

  return (
    <div className="flex flex-col bg-[#f8fafc] text-slate-800 min-h-screen">
      {/* ========================================================
          DEDICATED STANDALONE LANDING PAGE NAVIGATION BAR
      ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 lg:px-16 py-3 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shadow-xs">
              <Package size={17} strokeWidth={2.2} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base font-sans">PrepManager</span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded hidden sm:inline">
                FBA Compliance System
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-mono text-slate-600">
            <a href="#principles" className="hover:text-slate-900 transition-colors">Intelligence</a>
            <a href="#pipeline" className="hover:text-slate-900 transition-colors">Pipeline</a>
            <a href="#explainability" className="hover:text-slate-900 transition-colors">Evidence</a>
            <a href="#logic" className="hover:text-slate-900 transition-colors">Tri-State Logic</a>
          </div>

          {/* Action CTAs: Direct to Dual Mode App */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onNavigateToManager}
              className="text-xs font-mono font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors hidden sm:block"
            >
              Disputes &amp; Claims
            </button>
            <button
              onClick={onNavigateToStation}
              className="btn-tactile px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>Launch Station App</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          1. HERO SECTION: "Inspect. Prove. Proceed."
      ======================================================== */}
      <section className="relative pt-12 pb-16 px-6 lg:px-16 overflow-hidden bg-grid-pattern border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Massive Display Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* System Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-mono font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>VISUAL INSPECTION SYSTEM</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-[1.08] font-sans">
              Inspect. <br />
              <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Prove.
              </span> <br />
              Proceed.
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed font-sans">
              PrepManager turns automated physical inspection into auditable decision records &mdash;{' '}
              <span className="font-semibold text-slate-800">PASS</span>,{' '}
              <span className="font-semibold text-slate-800">FAIL</span>, or{' '}
              <span className="font-semibold text-slate-800">UNCERTAIN</span>.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center gap-3.5 flex-wrap">
              <button
                onClick={onNavigateToStation}
                className="btn-tactile px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>Launch Packing Bench</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={onNavigateToManager}
                className="btn-tactile px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium text-sm shadow-xs transition-colors"
              >
                Explore Dispute Defense
              </button>
            </div>
          </div>

          {/* Right Column: Floating Simulated Inspection Station Window */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              {/* Window Title Bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="text-xs font-mono text-slate-500 ml-2 font-medium">
                    CAM-01 &middot; Overhead 1080p
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>LIVE FEED</span>
                </div>
              </div>

              {/* Window Content: 2-Part Mock Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-12">
                {/* Left Area: Package Inspection Stage */}
                <div className="sm:col-span-7 bg-[#f1f5f9] p-6 relative flex items-center justify-center min-h-[280px] overflow-hidden select-none border-r border-slate-200/80">
                  {/* Grid calibration background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Laser Scanning Line Animation */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_8px_#3b82f6] animate-scan-line pointer-events-none z-20" />

                  {/* Packaging Subject Mock (Cardboard Package / Kraft Mailer) */}
                  <div className="relative w-44 h-36 rounded-lg bg-gradient-to-br from-[#d4b996] to-[#bfa07a] border border-[#a88a64] shadow-md flex items-center justify-center">
                    {/* Bounding Box Overlay */}
                    <div className="absolute inset-[-6px] border-2 border-emerald-500 rounded-md bg-emerald-500/5 transition-all duration-300 pointer-events-none" />

                    {/* FNSKU Thermal Label */}
                    <div className="w-28 h-16 bg-white border border-slate-300 rounded p-1.5 flex flex-col justify-between shadow-2xs">
                      <div className="h-6 flex items-center justify-center gap-0.5 overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-black h-full"
                            style={{ width: `${(i % 3) + 1}px` }}
                          />
                        ))}
                      </div>
                      <div className="text-[8px] font-mono font-bold text-center tracking-tight text-slate-800">
                        X00DUMMY002
                      </div>
                    </div>
                  </div>

                  {/* Corner Reticle Markers */}
                  <div className="absolute top-3 left-3 text-[9px] font-mono text-slate-400">
                    STAGE: 03
                  </div>
                  <div className="absolute bottom-3 left-3 text-[9px] font-mono text-slate-400">
                    CALIBRATED &plusmn;0.2mm
                  </div>
                </div>

                {/* Right Area: Real-Time Telemetry & Verification */}
                <div className="sm:col-span-5 p-4 flex flex-col justify-between bg-white text-xs">
                  <div>
                    {/* Confidence Meter */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-slate-500 font-mono text-[11px] mb-1 font-medium">
                        <span>Confidence</span>
                        <strong className="text-slate-900 font-bold">98%</strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-700"
                          style={{ width: '98%' }}
                        />
                      </div>
                    </div>

                    {/* Rule Checks List */}
                    <div className="space-y-2 font-mono text-[11px] text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Check size={12} className="text-emerald-600" />
                          <span>Polybag Sealed</span>
                        </span>
                        <span className="text-slate-400">OK</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Check size={12} className="text-emerald-600" />
                          <span>FNSKU Flat</span>
                        </span>
                        <span className="text-slate-400">OK</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Check size={12} className="text-emerald-600" />
                          <span>UPC Obscured</span>
                        </span>
                        <span className="text-slate-400">OK</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Check size={12} className="text-emerald-600" />
                          <span>Fragile Label</span>
                        </span>
                        <span className="text-slate-400">OK</span>
                      </div>
                    </div>
                  </div>

                  {/* Decision Result Pill */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                      DECISION RESULT
                    </div>
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1.5 rounded-lg font-mono font-bold text-center text-xs tracking-wider">
                      PASS &middot; APPROVED
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. METRIC TICKER & SENSOR STRIP
      ======================================================== */}
      <section className="bg-white border-b border-slate-200/90 py-3.5 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 overflow-x-auto text-xs font-mono text-slate-600">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Overhead Cam #1 4K Online</span>
          </div>
          <span className="text-slate-300">&middot;</span>
          <div className="shrink-0">
            Scan Rate: <strong className="text-slate-900 font-bold">120 FPS</strong>
          </div>
          <span className="text-slate-300">&middot;</span>
          <div className="shrink-0 flex items-center gap-1">
            <Zap size={13} className="text-blue-500" />
            <span>Inference: <strong className="text-slate-900 font-bold">148ms</strong></span>
          </div>
          <span className="text-slate-300">&middot;</span>
          <div className="shrink-0">
            Standard: <strong className="text-slate-900 font-bold">FBA-SPEC-2025</strong>
          </div>
          <span className="text-slate-300">&middot;</span>
          <div className="shrink-0 flex items-center gap-1 text-emerald-700">
            <ShieldCheck size={14} />
            <span>PostgreSQL RLS Isolated</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SECTION: "AI observes. Rules decide."
      ======================================================== */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          {/* Tag + Headline */}
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 mb-2">
              01 / PRINCIPLE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              AI observes. Rules decide.
            </h2>
            <p className="mt-3 text-slate-600 text-base leading-relaxed">
              PrepManager separates visual detection from compliance decisions. AI extracts what is visible. The requirement engine determines what that observation means.
            </p>
          </div>

          {/* Interactive 2-Column Demonstration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: 3 Interactive Requirement Cards */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {principleRules.map((rule, idx) => {
                const isActive = activePrincipleRule === idx;
                return (
                  <div
                    key={rule.title}
                    onClick={() => setActivePrincipleRule(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50/50 border-blue-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm text-slate-900">
                          {rule.title}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {rule.requirement}
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${rule.badgeClass}`}>
                        {rule.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Visual Parcel Stage with Floating Callout Tags */}
            <div className="lg:col-span-7 bg-[#f8fafc] border border-slate-200 rounded-2xl p-8 relative flex items-center justify-center min-h-[360px] overflow-hidden select-none">
              {/* Background Mat Lines */}
              <div className="absolute inset-0 bg-grid-pattern opacity-60" />

              {/* Package Illustration */}
              <div className="relative w-72 h-52 rounded-xl bg-gradient-to-br from-[#dfc8a7] to-[#c2a37b] border border-[#a88a64] shadow-lg flex items-center justify-center">
                {/* Simulated thermal barcode on package */}
                <div className="w-32 h-20 bg-white border border-slate-300 rounded p-2 flex flex-col justify-between shadow-xs">
                  <div className="h-9 flex items-center justify-center gap-0.5 overflow-hidden">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-black h-full"
                        style={{ width: `${(i % 3) + 1}px` }}
                      />
                    ))}
                  </div>
                  <div className="text-[9px] font-mono font-bold text-center tracking-tight text-slate-800">
                    FNSKU: X00DUMMY002
                  </div>
                </div>
              </div>

              {/* Floating Callout Tags with gentle animation */}
              <div className="absolute top-6 left-8 bg-white/95 backdrop-blur-xs border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold shadow-md animate-float flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>SEAL: Hermetic heat seal verified</span>
              </div>

              <div className="absolute top-10 right-8 bg-white/95 backdrop-blur-xs border border-rose-300 text-rose-800 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold shadow-md animate-float flex items-center gap-1.5" style={{ animationDelay: '1s' }}>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>FNSKU: Flat placement clear</span>
              </div>

              <div className="absolute bottom-6 left-12 bg-white/95 backdrop-blur-xs border border-blue-300 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold shadow-md animate-float flex items-center gap-1.5" style={{ animationDelay: '2s' }}>
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>UPC: 100% Obscured under label</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. SECTION: "From photograph to decision." (The Dark Contrast Pipeline)
      ======================================================== */}
      <section className="py-24 px-6 lg:px-16 bg-[#090e17] text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          {/* Tag & Heading */}
          <div className="max-w-2xl mb-16">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-2">
              02 / PIPELINE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              From photograph to decision.
            </h2>
            <p className="mt-3 text-slate-400 text-base leading-relaxed">
              Every inspection follows an auditable pipeline so that the final decision can be traced back to what the camera actually observed.
            </p>
          </div>

          {/* 4-Step Horizontal Pipeline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1: Capture */}
            <div className="bg-[#121927] border border-white/[0.08] hover:border-blue-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">01 / CAPTURE</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera size={16} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Capture</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A sensor photographs the item. The inspection station image profile is checked before analysis begins.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-slate-500">
                1080p Calibrated Top-Down
              </div>
            </div>

            {/* Step 2: Observe */}
            <div className="bg-[#121927] border border-white/[0.08] hover:border-blue-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">02 / OBSERVE</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Eye size={16} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Observe</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Vision models identify objects, labels, barcodes, tear, placement and other visible signals.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-slate-500">
                Multimodal VLM Batched Call
              </div>
            </div>

            {/* Step 3: Prove */}
            <div className="bg-[#121927] border border-white/[0.08] hover:border-blue-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">03 / PROVE</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck size={16} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Prove</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Observed data are evaluated vs the packaging requirements and scored individually for every requirement.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-slate-500">
                Amazon Rule 101 &ndash; 601 Engine
              </div>
            </div>

            {/* Step 4: Decide */}
            <div className="bg-[#121927] border border-white/[0.08] hover:border-blue-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">04 / DECIDE</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Decide</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The decision engine compiles evidences into PASS, FAIL, or UNCERTAIN without guessing requirements.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-slate-500">
                Zero False PASS Guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. SECTION: "Every verdict has a reason."
      ======================================================== */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Formula */}
          <div className="lg:col-span-6">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 mb-2">
              03 / EXPLAINABILITY
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Every verdict has a reason.
            </h2>
            <p className="mt-3 text-slate-600 text-base leading-relaxed">
              A decision without evidence is difficult to trust. PrepManager exposes the image, region, observation, requirement and reason behind each compliance result.
            </p>

            {/* Evidence Formula Callout Box */}
            <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                EVIDENCE FORMULA
              </div>
              <div className="text-xs sm:text-sm font-mono font-semibold text-slate-800 flex items-center gap-1.5 flex-wrap">
                <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">Image</span>
                <span className="text-slate-400">+</span>
                <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">Region</span>
                <span className="text-slate-400">+</span>
                <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">Observation</span>
                <span className="text-slate-400">+</span>
                <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">Requirement</span>
                <span className="text-blue-600 font-bold">&rArr;</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 font-bold">Verdict</span>
              </div>
            </div>
          </div>

          {/* Right Floating Inspection Evidence Inspector */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <FileCheck size={16} className="text-blue-600" />
                  <span className="font-mono font-bold text-xs text-slate-900">
                    Compliance Proof Inspector
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Target: Rule 301
                </span>
              </div>

              {/* Evidence Detail Rows */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Observation Grounding</div>
                  <div className="text-slate-800 font-sans font-medium">
                    &quot;Thermal FNSKU barcode applied completely flat on primary face with 0.25in margins clear.&quot;
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px]">Confidence</span>
                    <strong className="text-emerald-600 font-bold">98.4% Match</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px]">Amazon Policy</span>
                    <strong className="text-slate-800">FBA Rule 301</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. SECTION: "Three outcomes. No hidden assumptions."
      ======================================================== */}
      <section className="py-20 px-6 lg:px-16 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 mb-2">
            04 / TRI-STATE LOGIC
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Three outcomes. No hidden assumptions.
          </h2>
          <p className="mt-3 text-slate-600 text-base max-w-xl mx-auto leading-relaxed">
            The system does not force a decision when the available visual evidence is insufficient.
          </p>

          {/* 3 Outcome Cards (Interactive) */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Outcome 1: PASS */}
            <div
              onClick={() => setSelectedOutcome('PASS')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer bg-white ${
                selectedOutcome === 'PASS'
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="text-lg font-bold font-mono text-emerald-700 mb-2">PASS</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                All 6 inbound packaging standards verified by camera evidence. Approved to print shipping label. Zero chargeback flags.
              </p>
            </div>

            {/* Outcome 2: FAIL */}
            <div
              onClick={() => setSelectedOutcome('FAIL')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer bg-white ${
                selectedOutcome === 'FAIL'
                  ? 'border-rose-500 shadow-md ring-2 ring-rose-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <XCircle size={22} />
              </div>
              <h3 className="text-lg font-bold font-mono text-rose-700 mb-2">FAIL</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                At least one critical defect detected (e.g. unsealed polybag, exposed UPC). Flagged for rework to save $0.40&ndash;$2.00 fee.
              </p>
            </div>

            {/* Outcome 3: UNCERTAIN */}
            <div
              onClick={() => setSelectedOutcome('UNCERTAIN')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer bg-white ${
                selectedOutcome === 'UNCERTAIN'
                  ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <AlertTriangle size={22} />
              </div>
              <h3 className="text-lg font-bold font-mono text-amber-700 mb-2">UNCERTAIN</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Visual ambiguity or confidence below 85% safety threshold. Mandates human operator verification. Never makes unsafe guesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. HIGH-IMPACT BLUE HERO CALLOUT BANNER
      ======================================================== */}
      <section className="py-16 px-6 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
          {/* Subtle curved background rings */}
          <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full border border-white/10 pointer-events-none translate-x-20 translate-y-20" />
          <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full border border-white/10 pointer-events-none translate-x-10 translate-y-10" />

          <div className="max-w-xl relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Make every inspection explainable.
            </h2>
            <p className="mt-4 text-blue-100 text-sm sm:text-base leading-relaxed">
              Bring transparency to physical packaging workflows where every decision can be traced from photograph to evidence to requirement.
            </p>
            <div className="mt-8">
              <button
                onClick={onNavigateToStation}
                className="btn-tactile px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 shadow-md flex items-center gap-2 transition-all group"
              >
                <span>Start an inspection</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. CLEAN ENTERPRISE FOOTER
      ======================================================== */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 lg:px-16 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4 font-mono">
          <div>
            &copy; 2026 PrepFlow &middot; Amazon FBA Inbound Compliance &amp; Margin Defense
          </div>
          <div className="flex items-center gap-5">
            <button onClick={onNavigateToStation} className="hover:text-slate-900 transition-colors">
              Packing Station #03
            </button>
            <button onClick={onNavigateToManager} className="hover:text-slate-900 transition-colors">
              Disputes &amp; Claims
            </button>
            <span className="text-slate-300">&middot;</span>
            <span className="text-emerald-600 font-medium">SP-API Connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
