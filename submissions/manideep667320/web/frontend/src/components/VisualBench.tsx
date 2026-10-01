import React, { useState } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { UnitScenario, CheckItem } from '../types';

interface VisualBenchProps {
  scenario: UnitScenario;
  activeCheck: CheckItem | null;
  onSelectCheck?: (check: CheckItem) => void;
}

type Angle = 'overhead' | 'front' | 'macro';

export const VisualBench: React.FC<VisualBenchProps> = ({
  scenario,
}) => {
  const [currentAngle, setCurrentAngle] = useState<Angle>('overhead');
  const [isCapturing, setIsCapturing] = useState(false);

  // Trigger flash/recapture effect
  const handleRecapture = () => {
    setIsCapturing(true);
    setTimeout(() => setIsCapturing(false), 300);
  };

  // Determine stage image
  let stageImage = '/candle_stage.jpg';
  if (scenario.photo_refs && scenario.photo_refs.length > 0) {
    stageImage = scenario.photo_refs[0];
  }

  // Warning pill text based on scenario
  let warningText = 'Glass Vessel · Bubble Wrap OK';
  if (scenario.unit_id === 'UNIT-0003') {
    warningText = 'Bagged Toy · Polybag Seal Required';
  } else if (scenario.unit_id === 'UNIT-0004') {
    warningText = 'Powder Canister · Foil Seal Mandate';
  }

  // Bounding box labels
  let bboxTopLabel = 'FNSKU · 98% Confidence';
  let bboxBottomLabel = 'UPC Covered 100%';
  let bboxBorderColor = 'border-emerald-400';
  let bboxLabelBg = 'bg-black/90 text-emerald-400 border-emerald-500/40';

  if (scenario.overall === 'FAIL') {
    if (scenario.unit_id === 'UNIT-0003') {
      bboxTopLabel = 'Polybag · Seal Open > 4cm';
      bboxBottomLabel = 'DEFECT DETECTED';
      bboxBorderColor = 'border-rose-500';
      bboxLabelBg = 'bg-black/90 text-rose-400 border-rose-500/40';
    } else {
      bboxTopLabel = 'FNSKU · 96% Confidence';
      bboxBottomLabel = 'UPC Barcode Exposed 100%';
      bboxBorderColor = 'border-rose-500';
      bboxLabelBg = 'bg-black/90 text-rose-400 border-rose-500/40';
    }
  } else if (scenario.overall === 'UNCERTAIN') {
    bboxTopLabel = 'FNSKU · 99% Confidence';
    bboxBottomLabel = 'Induction Seal Conf: 62%';
    bboxBorderColor = 'border-amber-400';
    bboxLabelBg = 'bg-black/90 text-amber-400 border-amber-500/40';
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Stage Camera Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono font-medium text-xs text-slate-700">
            Stage Camera / Top-Down 1080p
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Feed</span>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="relative w-full h-[360px] rounded-lg overflow-hidden border border-slate-200 bg-slate-900 select-none">
          {/* Main Inspection Image */}
          <img
            src={stageImage}
            alt="Overhead Inspection Camera Bench"
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              isCapturing ? 'opacity-40' : 'opacity-100'
            }`}
          />

          {/* Top-Right Amber Material Warning Badge */}
          <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-xs border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1.5 font-medium shadow-sm">
            <AlertTriangle size={12} className="text-amber-400" />
            <span>{warningText}</span>
          </div>

          {/* Computer Vision Bounding Box Overlay */}
          <div className={`absolute top-[23%] left-[17%] w-[62%] h-[60%] border-2 ${bboxBorderColor} bg-emerald-400/5 rounded-xs pointer-events-none transition-all duration-300`}>
            {/* Top-Left BBox Tag */}
            <div className={`absolute -top-3 left-2 ${bboxLabelBg} border px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wide flex items-center gap-1 shadow-xs`}>
              <span>{bboxTopLabel}</span>
            </div>

            {/* Bottom-Right BBox Tag */}
            <div className="absolute -bottom-3 right-2 bg-black/90 text-white border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wide shadow-xs">
              <span>{bboxBottomLabel}</span>
            </div>
          </div>
        </div>

        {/* Bottom Angle Controls & Recapture */}
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentAngle('overhead')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentAngle === 'overhead'
                  ? 'border border-slate-300 bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Overhead
            </button>
            <button
              onClick={() => setCurrentAngle('front')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentAngle === 'front'
                  ? 'border border-slate-300 bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Front Angle
            </button>
            <button
              onClick={() => setCurrentAngle('macro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentAngle === 'macro'
                  ? 'border border-slate-300 bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Barcode Macro
            </button>
          </div>

          <button
            onClick={handleRecapture}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <RotateCw size={12} className={isCapturing ? 'animate-spin' : ''} />
            <span>Re-capture</span>
          </button>
        </div>
      </div>

      {/* 2. Product Identity & ASIN Specifications Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        {/* ASIN Pill */}
        <div className="inline-block bg-slate-100 text-slate-700 font-mono font-bold text-xs px-2.5 py-1 rounded-md mb-2">
          ASIN: {scenario.asin}
        </div>

        {/* Title */}
        <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
          {scenario.product_title}
        </h2>

        {/* Category */}
        <p className="text-xs text-slate-500 mt-0.5 mb-3">
          Category: {scenario.category || 'Home & Candles · Fragile Glassware'}
        </p>

        {/* Horizontal Divider */}
        <div className="border-t border-slate-100 my-3" />

        {/* 2x2 Metadata Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              SKU
            </div>
            <div className="font-mono font-semibold text-xs text-slate-800 mt-0.5">
              {scenario.sku}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              FNSKU
            </div>
            <div className="font-mono font-semibold text-xs text-slate-800 mt-0.5">
              {scenario.fnsku}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              Work Order
            </div>
            <div className="font-mono font-semibold text-xs text-slate-800 mt-0.5">
              {scenario.work_order_id}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              Target Destination
            </div>
            <div className="font-mono font-semibold text-xs text-slate-800 mt-0.5">
              {scenario.target_destination || 'Amazon FBA (ONT8)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
