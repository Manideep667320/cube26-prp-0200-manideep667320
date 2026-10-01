import React, { useState } from 'react';
import { AlertCircle, X, ShieldAlert } from 'lucide-react';
import { OverallVerdict } from '../types';

interface OverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: string;
  originalVerdict: OverallVerdict;
  onSubmit: (newVerdict: OverallVerdict, operatorId: string, reason: string) => void;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({
  isOpen,
  onClose,
  unitId,
  originalVerdict,
  onSubmit,
}) => {
  const [newVerdict, setNewVerdict] = useState<OverallVerdict>('PASS');
  const [operatorId, setOperatorId] = useState('MV-4082 (Marcus Vance)');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Operational requirement: A valid documented reason is mandatory for manual overrides.');
      return;
    }
    setError('');
    onSubmit(newVerdict, operatorId, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl p-6 flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-600">
            <ShieldAlert size={18} />
            <h3 className="font-bold text-sm text-slate-900">
              Record Operator Override ({unitId})
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-2 mb-4 leading-relaxed">
          Overrides are permanently linked to the unit&apos;s cryptographic proof record with original verdict, new verdict, operator badge ID, and mandatory explanation for Amazon audit trail.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Original vs New Verdict */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-500 mb-1">Original Verdict</label>
              <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-rose-600">
                {originalVerdict}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-500 mb-1">Override Verdict</label>
              <select
                value={newVerdict}
                onChange={(e) => setNewVerdict(e.target.value as OverallVerdict)}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-blue-500 text-xs font-mono font-bold text-emerald-600 outline-none cursor-pointer shadow-2xs"
              >
                <option value="PASS">PASS (Approve)</option>
                <option value="FAIL">FAIL (Reject)</option>
                <option value="UNCERTAIN">UNCERTAIN (Escalate)</option>
              </select>
            </div>
          </div>

          {/* Operator Badge */}
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">Station Operator</label>
            <input
              type="text"
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 outline-none"
            />
          </div>

          {/* Mandatory Reason */}
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Mandatory Operational Rationale <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Physical bubble-wrap thickness manually measured at 0.55in; verified compliant with Amazon fragile glass drop mandate."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-sans text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 font-mono">
              <AlertCircle size={13} />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-2xs transition-colors"
            >
              Commit Permanent Override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
