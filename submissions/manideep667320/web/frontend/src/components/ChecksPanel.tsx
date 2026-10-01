import React from 'react';
import { Check, X, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { UnitScenario, CheckItem } from '../types';

interface ChecksPanelProps {
  scenario: UnitScenario;
  activeCheck: CheckItem | null;
  onSelectCheck: (check: CheckItem) => void;
  onApprove: () => void;
  onReject: () => void;
  onOpenOverride: () => void;
  onViewJsonPayload?: () => void;
}

export const ChecksPanel: React.FC<ChecksPanelProps> = ({
  scenario,
  activeCheck,
  onSelectCheck,
  onApprove,
  onReject,
  onOpenOverride,
  onViewJsonPayload,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. Decision Banner */}
      {scenario.overall === 'PASS' && (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm leading-tight">
                Ready to Pack — All Requirements Satisfied
              </div>
              <div className="text-xs text-slate-600 mt-0.5 leading-snug">
                Computer vision verified all 6 inbound packaging standards. Zero Amazon chargeback flags.
              </div>
            </div>
          </div>

          <div className="bg-[#dcfce7] text-[#15803d] font-mono font-bold text-xs px-3 py-1 rounded-md border border-[#86efac] shrink-0">
            PASSED
          </div>
        </div>
      )}

      {scenario.overall === 'FAIL' && (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
              <X size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-bold text-rose-950 text-sm leading-tight">
                Rework Required — Critical Defect Detected
              </div>
              <div className="text-xs text-rose-700 mt-0.5 leading-snug">
                {scenario.defect_title || 'Non-compliant packaging violates Amazon inbound standard.'} Estimated chargeback: ${scenario.chargeback_risk_usd.toFixed(2)}/unit.
              </div>
            </div>
          </div>

          <div className="bg-[#fee2e2] text-[#b91c1c] font-mono font-bold text-xs px-3 py-1 rounded-md border border-[#fca5a5] shrink-0">
            FAILED
          </div>
        </div>
      )}

      {scenario.overall === 'UNCERTAIN' && (
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-bold text-amber-950 text-sm leading-tight">
                Human Verification Mandated — Edge Defect
              </div>
              <div className="text-xs text-amber-800 mt-0.5 leading-snug">
                {scenario.defect_title || 'CV confidence below authoritative threshold. Operator sign-off required.'}
              </div>
            </div>
          </div>

          <div className="bg-[#fef3c7] text-[#b45309] font-mono font-bold text-xs px-3 py-1 rounded-md border border-[#fcd34d] shrink-0">
            FLAGGED
          </div>
        </div>
      )}

      {/* 2. FBA RULE VERIFICATION Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="font-mono font-bold text-xs tracking-wider text-slate-800">
            FBA RULE VERIFICATION
          </span>
          <span className="font-mono text-xs text-slate-500">
            Standard: FBA-SPEC-2025
          </span>
        </div>

        {/* 6 Rules List */}
        <div className="divide-y divide-slate-100">
          {scenario.checks.map((check) => {
            const isSelected = activeCheck?.id === check.id;

            return (
              <div
                key={check.id}
                onClick={() => onSelectCheck(check)}
                className={`py-3 flex items-center justify-between gap-3 cursor-pointer rounded-lg px-2 -mx-2 transition-colors ${
                  isSelected ? 'bg-slate-50' : 'hover:bg-slate-50/70'
                }`}
              >
                {/* Left Status Icon & Content */}
                <div className="flex items-start gap-3 min-w-0">
                  {/* Status Indicator Icon */}
                  <div className="mt-0.5 shrink-0 w-5 flex items-center justify-center">
                    {check.state === 'na' && (
                      <span className="text-slate-400 font-bold text-base leading-none select-none">—</span>
                    )}
                    {check.state === 'pass' && (
                      <CheckCircle2 size={16} className="text-emerald-600" />
                    )}
                    {check.state === 'fail' && (
                      <div className="w-4 h-4 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600">
                        <X size={12} strokeWidth={2.5} />
                      </div>
                    )}
                    {check.state === 'uncertain' && (
                      <AlertTriangle size={15} className="text-amber-500" />
                    )}
                  </div>

                  {/* Rule Label & Description */}
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-medium text-xs sm:text-sm text-slate-900 leading-tight">
                        {check.name}
                      </span>
                      <span className="font-mono text-xs text-slate-400 font-normal">
                        {check.ruleNumber || check.code.replace('FBA-', '').replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">
                      {check.desc}
                    </div>
                  </div>
                </div>

                {/* Right Badge */}
                <div className="shrink-0">
                  {check.badgeText ? (
                    <span
                      className={`font-mono text-xs px-2.5 py-0.5 rounded font-medium inline-block text-center ${
                        check.badgeText === 'N/A'
                          ? 'bg-slate-100 text-slate-500'
                          : check.badgeText === 'FAILED'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold'
                          : check.badgeText === 'Review Required'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold'
                          : 'bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] font-semibold'
                      }`}
                    >
                      {check.badgeText}
                    </span>
                  ) : check.state === 'pass' ? (
                    <span className="bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] font-mono text-xs px-2.5 py-0.5 rounded font-semibold">
                      Passed
                    </span>
                  ) : check.state === 'fail' ? (
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 font-mono text-xs px-2.5 py-0.5 rounded font-semibold">
                      Defect
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 font-mono text-xs px-2.5 py-0.5 rounded font-medium">
                      N/A
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Card Footer: Proof Record & View JSON Payload */}
        <div className="border-t border-slate-100 pt-3 mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
            <FileText size={13} className="text-slate-400" />
            <span>Proof Record: {scenario.record_id}</span>
          </div>

          <button
            onClick={onViewJsonPayload}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer hover:underline transition-colors"
          >
            View JSON Payload
          </button>
        </div>
      </div>

      {/* 3. Action Buttons Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenOverride}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-2xs transition-colors"
          >
            Manual Override
          </button>

          <button
            onClick={onReject}
            className="px-4 py-2 rounded-lg border border-rose-300 bg-white hover:bg-rose-50 text-rose-600 font-medium text-xs shadow-2xs transition-colors"
          >
            Flag for Rework
          </button>
        </div>

        <button
          onClick={onApprove}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-2xs transition-all active:scale-[0.99]"
        >
          <Check size={14} strokeWidth={2.5} />
          <span>Approve &amp; Print Shipping Label</span>
          <span className="bg-[#1d4ed8] text-blue-100 text-[10px] font-mono px-2 py-0.5 rounded ml-1 font-normal">
            Space
          </span>
        </button>
      </div>
    </div>
  );
};
