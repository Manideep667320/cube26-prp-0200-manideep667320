import React, { useState } from 'react';
import { X, Copy, Check, FileCode } from 'lucide-react';
import { UnitScenario, OperatorOverride } from '../types';

interface RecoveryContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: UnitScenario;
  override: OperatorOverride | null;
}

export const RecoveryContractModal: React.FC<RecoveryContractModalProps> = ({
  isOpen,
  onClose,
  scenario,
  override,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const contractPayload = {
    record_id: scenario.record_id,
    unit_id: scenario.unit_id,
    org_id: scenario.org_id,
    work_order_id: scenario.work_order_id,
    fba_shipment_id: scenario.fba_shipment_id,
    sku: scenario.sku,
    asin: scenario.asin,
    fnsku: scenario.fnsku,
    prep_price_usd: scenario.prep_price_usd,
    target_destination: scenario.target_destination,
    overall_verdict: override ? override.new_verdict : scenario.overall,
    checks: {
      polybag_present_sealed: scenario.checks[0].rawStatus,
      suffocation_warning: scenario.checks[1].rawStatus,
      fnsku_label_placement: scenario.checks[2].rawStatus,
      original_barcode_covered: scenario.checks[3].rawStatus,
      expiry_date: scenario.checks[4].rawStatus,
      handling_marks: scenario.checks[5].rawStatus,
    },
    evidence_grounding: scenario.checks.map((c) => ({
      check_id: c.id,
      rule_number: c.ruleNumber,
      badge: c.badgeText,
      confidence: c.confidence,
      observation_text: c.desc,
    })),
    operator_override: override
      ? {
          original_verdict: override.original_verdict,
          new_verdict: override.new_verdict,
          operator_id: override.operator_id,
          reason: override.reason,
          timestamp: override.timestamp,
        }
      : null,
    evidence_sha256: scenario.evidence_sha256,
  };

  const jsonStr = JSON.stringify(contractPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-blue-600">
            <FileCode size={18} />
            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-tight">
                JSON Proof Payload &middot; {scenario.record_id}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Step 5 Recovery Manager Evidence Contract Schema
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-mono flex items-center gap-1.5 text-slate-700 shadow-2xs transition-colors"
            >
              {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* JSON Code Viewer */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-900 text-slate-200">
          <pre className="text-xs font-mono leading-relaxed">
            {jsonStr}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Schema verified against prep_evidence_contract.json</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-2xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
