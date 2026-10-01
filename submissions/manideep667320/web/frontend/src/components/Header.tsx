import React, { useState } from 'react';
import { Package, ChevronsUpDown, ShieldCheck, FileCode, Check, Building2 } from 'lucide-react';
import { TenantOrg, UnitScenario } from '../types';

interface HeaderProps {
  currentMode: 'station' | 'manager';
  onModeChange: (mode: 'station' | 'manager') => void;
  onOpenLandingPage?: () => void;
  tenant: TenantOrg;
  onTenantChange: (tenant: TenantOrg) => void;
  onRunIsolationTest: () => void;
  scenarios: Record<string, UnitScenario>;
  selectedScenarioKey: string;
  onScenarioChange: (key: string) => void;
  onOpenContract: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  onOpenLandingPage,
  tenant,
  onTenantChange,
  onRunIsolationTest,
  scenarios,
  selectedScenarioKey,
  onScenarioChange,
  onOpenContract,
}) => {
  const [itemDropdownOpen, setItemDropdownOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const currentScenario = scenarios[selectedScenarioKey] || Object.values(scenarios)[0];
  const shortSku = currentScenario.sku.replace('SKU-', '');

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-2.5">
      <div className="flex items-center justify-between">
        {/* Left: PrepFlow Logo + Station Pill */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={onOpenLandingPage}
            title="View Standalone Architecture &amp; System Overview Landing Page"
          >
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Package size={17} strokeWidth={2.2} />
            </div>
            <div className="flex items-center text-sm">
              <span className="font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">PrepFlow</span>
              <span className="text-slate-300 font-light mx-2">/</span>
              <span className="text-slate-600 font-normal">
                {currentMode === 'station' ? 'Packing Bench' : 'Disputes & Claims'}
              </span>
            </div>
          </div>

          {/* Station Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Station #03 (Pack &amp; Verify)</span>
          </div>

          {/* Link to Standalone Landing Page */}
          {onOpenLandingPage && (
            <button
              onClick={onOpenLandingPage}
              className="flex items-center gap-1.5 text-xs font-mono text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title="Return to System Overview Landing Page"
            >
              <span>&larr; System Overview</span>
            </button>
          )}
        </div>

        {/* Center: DUAL MODE SWITCHER (Strictly 2 tabs: Packing Bench vs Disputes & Claims) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => onModeChange('station')}
            className={`text-xs font-medium px-4 py-1.5 rounded-lg transition-all ${
              currentMode === 'station'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Packing Bench
          </button>
          <button
            onClick={() => onModeChange('manager')}
            className={`text-xs font-medium px-4 py-1.5 rounded-lg transition-all ${
              currentMode === 'manager'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Disputes &amp; Claims
          </button>
        </div>

        {/* Right: Active Item Selector + Profile */}
        <div className="flex items-center gap-3">
          {/* Active Item Selector Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400 hidden md:inline">Active Item:</span>
              <button
                onClick={() => setItemDropdownOpen(!itemDropdownOpen)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-slate-800 font-semibold cursor-pointer transition-colors shadow-2xs"
              >
                <span>{currentScenario.unit_id} · {shortSku}</span>
                <ChevronsUpDown size={13} className="text-slate-400" />
              </button>
            </div>

            {/* Dropdown Menu */}
            {itemDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 font-semibold">
                  Select Active Station Unit
                </div>
                {Object.entries(scenarios).map(([key, sc]) => {
                  const isSelected = selectedScenarioKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        onScenarioChange(key);
                        setItemDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          sc.overall === 'PASS' ? 'bg-emerald-500' : sc.overall === 'FAIL' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        <span>{sc.unit_id} · {sc.sku.replace('SKU-', '')}</span>
                      </div>
                      {isSelected && <Check size={14} className="text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick RLS & Contract Popover / Tool Button */}
          <div className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              title="Enterprise Tenancy & Contract Options"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              <Building2 size={16} />
            </button>

            {toolsOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-1 py-1 font-semibold">
                  Enterprise Configuration
                </div>
                <div className="mt-1 flex flex-col gap-1.5">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                    <div className="text-slate-500 text-[11px] mb-1 font-mono">Tenant Scope (RLS Isolated):</div>
                    <select
                      value={tenant}
                      onChange={(e) => {
                        onTenantChange(e.target.value as TenantOrg);
                        setToolsOpen(false);
                      }}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-mono font-medium text-slate-800 outline-none"
                    >
                      <option value="org_demo_alpha">org_demo_alpha (Apex Logistics)</option>
                      <option value="org_demo_bravo">org_demo_bravo (Prime 3PL)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      onRunIsolationTest();
                      setToolsOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors"
                  >
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Audit PostgreSQL RLS Tenancy</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenContract();
                      setToolsOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors"
                  >
                    <FileCode size={14} className="text-blue-600" />
                    <span>View Step 5 Recovery Contract</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* User Profile Block */}
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <div className="font-semibold text-xs text-slate-900 leading-tight">Marcus Vance</div>
              <div className="text-[11px] text-slate-500 font-sans leading-tight">Apex Logistics · Shift A</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
              MV
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
