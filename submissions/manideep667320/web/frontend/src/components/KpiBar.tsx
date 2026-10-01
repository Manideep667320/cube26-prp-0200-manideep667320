import React from 'react';
import { Video, Zap } from 'lucide-react';

interface KpiBarProps {
  unitsPacked?: number;
  complianceRate?: string;
  reworkResolved?: number;
  camStatus?: string;
  inferenceMs?: number;
}

export const KpiBar: React.FC<KpiBarProps> = ({
  unitsPacked = 62,
  complianceRate = '98.4%',
  reworkResolved = 2,
  camStatus = 'Overhead Cam #1 Online',
  inferenceMs = 148,
}) => {
  return (
    <div className="bg-white border-b border-slate-200/90 px-6 py-2 flex items-center justify-between text-xs font-sans">
      {/* Left Shift Metrics */}
      <div className="flex items-center text-slate-600">
        <div>
          <span>Today&apos;s Shift: </span>
          <strong className="font-bold text-slate-900 font-mono">{unitsPacked} units packed</strong>
        </div>

        <span className="text-slate-300 mx-3">|</span>

        <div>
          <span>Compliance Rate: </span>
          <strong className="font-bold text-emerald-600 font-mono">{complianceRate}</strong>
        </div>

        <span className="text-slate-300 mx-3">|</span>

        <div>
          <span>Rework / Flags: </span>
          <strong className="font-bold text-slate-900 font-mono">{reworkResolved} resolved</strong>
        </div>
      </div>

      {/* Right Hardware & Inference Telemetry */}
      <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
        <div className="flex items-center gap-1.5">
          <Video size={13} className="text-emerald-500 shrink-0" />
          <span>{camStatus}</span>
        </div>

        <span className="text-slate-300">·</span>

        <div className="flex items-center gap-1">
          <Zap size={12} className="text-slate-400 shrink-0" />
          <span>Inference: {inferenceMs}ms</span>
        </div>
      </div>
    </div>
  );
};
