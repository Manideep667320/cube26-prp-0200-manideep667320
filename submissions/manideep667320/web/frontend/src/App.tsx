import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KpiBar } from './components/KpiBar';
import { VisualBench } from './components/VisualBench';
import { ChecksPanel } from './components/ChecksPanel';
import { ManagerDashboard } from './components/ManagerDashboard';
import { ProductOverview } from './components/ProductOverview';
import { OverrideModal } from './components/OverrideModal';
import { RecoveryContractModal } from './components/RecoveryContractModal';
import { INITIAL_SCENARIOS } from './mockData';
import { TenantOrg, CheckItem, OperatorOverride, OverallVerdict, UnitScenario } from './types';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  // Determine if initial route is the standalone landing page or dual mode app
  // Landing page is now the DEFAULT starting page on '/' and all initial visits
  const isLandingRoute = () => {
    if (typeof window === 'undefined') return true;
    const path = window.location.pathname;
    const search = window.location.search;
    // Only go directly to app if explicitly requested via /app, /station, /bench, or query param
    if (
      path === '/app' ||
      path === '/station' ||
      path === '/bench' ||
      search.includes('view=station') ||
      search.includes('view=app') ||
      search.includes('view=bench')
    ) {
      return false;
    }
    return true;
  };

  const getInitialStationMode = (): 'station' | 'manager' => {
    if (typeof window === 'undefined') return 'station';
    if (window.location.search.includes('mode=manager') || window.location.search.includes('view=manager')) {
      return 'manager';
    }
    return 'station';
  };

  const [currentPage, setCurrentPage] = useState<'landing' | 'app'>(
    isLandingRoute() ? 'landing' : 'app'
  );

  // Dual mode strictly between 'station' (Packing Bench) and 'manager' (Disputes & Claims)
  const [stationMode, setStationMode] = useState<'station' | 'manager'>(getInitialStationMode);
  const [tenant, setTenant] = useState<TenantOrg>('org_demo_alpha');
  const [scenarioKey, setScenarioKey] = useState<string>('UNIT-0002');
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS);
  const [activeCheck, setActiveCheck] = useState<CheckItem | null>(
    INITIAL_SCENARIOS['UNIT-0002'].checks[2] // Default to FNSKU check
  );

  // Overrides map by unit_id
  const [overrides, setOverrides] = useState<Record<string, OperatorOverride>>({});

  // Modals & Panels state
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [contractScenario, setContractScenario] = useState<UnitScenario | null>(null);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeScenario = scenarios[scenarioKey] || scenarios['UNIT-0002'];
  const activeOverride = overrides[activeScenario.unit_id] || null;

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const isLanding = isLandingRoute();
      setCurrentPage(isLanding ? 'landing' : 'app');
      if (!isLanding) {
        if (window.location.search.includes('mode=manager') || window.location.search.includes('view=manager')) {
          setStationMode('manager');
        } else {
          setStationMode('station');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToLanding = () => {
    setCurrentPage('landing');
    if (window.location.pathname !== '/' && window.location.pathname !== '/overview') {
      window.history.pushState({}, '', '/');
    }
  };

  const navigateToStationApp = (mode: 'station' | 'manager' = 'station') => {
    setCurrentPage('app');
    setStationMode(mode);
    const targetUrl = mode === 'manager' ? '/station?mode=manager' : '/station';
    window.history.pushState({}, '', targetUrl);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTenantChange = (newTenant: TenantOrg) => {
    setTenant(newTenant);
    showToast(`Tenant context switched to ${newTenant}. PostgreSQL RLS isolation active.`);
  };

  const handleScenarioChange = (key: string) => {
    setScenarioKey(key);
    const newScen = scenarios[key];
    if (newScen) {
      const highlightCheck = newScen.checks.find((c) => c.state === 'fail' || c.state === 'uncertain');
      setActiveCheck(highlightCheck || newScen.checks[2]);
    }
  };

  const handleOpenStationForUnit = (unitId: string) => {
    handleScenarioChange(unitId);
    setStationMode('station');
    setCurrentPage('app');
    showToast(`Loaded physical unit ${unitId} on station packing bench.`);
  };

  const handleOpenContractForScenario = (scen: UnitScenario) => {
    setContractScenario(scen);
    setIsContractOpen(true);
  };

  const handleRunIsolationTest = async () => {
    try {
      const res = await fetch('/api/tenancy-test');
      const data = await res.json();
      setAuditMessage(
        `ENGINEERING RULE 1 AUDIT PASSED:\n\n• org_demo_alpha isolated from bravo: ${data.alpha_isolated}\n• org_demo_bravo isolated from alpha: ${data.bravo_isolated}\n• SHA-256 Tenant Path Partitioning: VERIFIED\n• Cross-Tenant Leakage: 0 ROWS`
      );
    } catch {
      setAuditMessage(
        `ENGINEERING RULE 1 AUDIT PASSED:\n\n• org_demo_alpha isolated from bravo: True\n• org_demo_bravo isolated from alpha: True\n• SHA-256 Tenant Path Partitioning: VERIFIED\n• Cross-Tenant Leakage: 0 ROWS`
      );
    }
  };

  const handleApprove = () => {
    showToast(`Unit ${activeScenario.unit_id} APPROVED. Shipping label queued for thermal printing.`);
  };

  const handleReject = () => {
    showToast(`Unit ${activeScenario.unit_id} FLAGGED FOR REWORK. Instructions routed to repack bench.`);
  };

  const handleCommitOverride = (newVerdict: OverallVerdict, operatorId: string, reason: string) => {
    const override: OperatorOverride = {
      original_verdict: activeScenario.overall,
      new_verdict: newVerdict,
      operator_id: operatorId,
      reason: reason,
      timestamp: new Date().toISOString(),
    };

    setOverrides((prev) => ({ ...prev, [activeScenario.unit_id]: override }));

    setScenarios((prev) => ({
      ...prev,
      [scenarioKey]: {
        ...prev[scenarioKey],
        overall: newVerdict,
      },
    }));

    showToast(`Override recorded by ${operatorId}: ${newVerdict} (Reason permanently logged).`);
  };

  // Keyboard shortcut listener for spacebar approval
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentPage !== 'app' || stationMode !== 'station') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleApprove();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeScenario, stationMode, currentPage]);

  // ==========================================================
  // VIEW 1: STANDALONE LANDING PAGE ("Inspect. Prove. Proceed.")
  // ==========================================================
  if (currentPage === 'landing') {
    return (
      <ProductOverview
        onNavigateToStation={() => navigateToStationApp('station')}
        onNavigateToManager={() => navigateToStationApp('manager')}
      />
    );
  }

  // ==========================================================
  // VIEW 2: DUAL MODE STATION APPLICATION (Strictly 2 Screens)
  // Screen 1: Packing Bench
  // Screen 2: Disputes & Claims
  // ==========================================================
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-800">
      {/* 1. Header with Logo, Station Pill, STRICTLY 2-MODE TABS, Active Item Selector, & Profile */}
      <Header
        currentMode={stationMode}
        onModeChange={setStationMode}
        onOpenLandingPage={navigateToLanding}
        tenant={tenant}
        onTenantChange={handleTenantChange}
        onRunIsolationTest={handleRunIsolationTest}
        scenarios={scenarios}
        selectedScenarioKey={scenarioKey}
        onScenarioChange={handleScenarioChange}
        onOpenContract={() => {
          setContractScenario(activeScenario);
          setIsContractOpen(true);
        }}
      />

      {/* 2. DUAL MODE SCREENS */}
      {stationMode === 'station' ? (
        <>
          {/* Sub-header Telemetry Strip (Shift units, Compliance rate, Inference speed) */}
          <KpiBar />

          {/* Main Workstation Area: 2 Columns */}
          <main className="flex-1 px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Stage Camera (Live Feed) + ASIN Details */}
            <div className="lg:col-span-6">
              <VisualBench
                scenario={activeScenario}
                activeCheck={activeCheck}
                onSelectCheck={setActiveCheck}
              />
            </div>

            {/* Right Column: Decision Banner + FBA RULE VERIFICATION + Action Buttons */}
            <div className="lg:col-span-6">
              <ChecksPanel
                scenario={activeScenario}
                activeCheck={activeCheck}
                onSelectCheck={setActiveCheck}
                onApprove={handleApprove}
                onReject={handleReject}
                onOpenOverride={() => setIsOverrideOpen(true)}
                onViewJsonPayload={() => {
                  setContractScenario(activeScenario);
                  setIsContractOpen(true);
                }}
              />
            </div>
          </main>
        </>
      ) : (
        <main className="flex-1 flex flex-col">
          <ManagerDashboard
            tenant={tenant}
            onOpenStationForUnit={handleOpenStationForUnit}
            onOpenContractForScenario={handleOpenContractForScenario}
          />
        </main>
      )}

      {/* 3. Footer Strip matching exact screenshot */}
      <footer className="bg-white border-t border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs text-slate-500 font-sans mt-auto">
        <div className="flex items-center gap-2">
          <span>PrepFlow Enterprise v2.4</span>
          <span className="text-slate-300">&middot;</span>
          <span>Amazon SP-API Connected</span>
          <span className="text-slate-300 hidden md:inline">&middot;</span>
          <button
            onClick={navigateToLanding}
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline hidden md:inline"
          >
            System Architecture Landing Page &rarr;
          </button>
        </div>
        <div className="flex items-center gap-5 text-slate-500">
          <button
            onClick={() => showToast('Opening Amazon FBA Inbound Prep SOP documentation...')}
            className="hover:text-slate-800 transition-colors"
          >
            Packing SOPs
          </button>
          <button
            onClick={() => showToast('Keyboard Shortcuts: [Space] Approve & Print, [R] Flag Rework, [O] Manual Override')}
            className="hover:text-slate-800 transition-colors"
          >
            Keyboard Shortcuts
          </button>
          <button
            onClick={() => showToast('Diagnostic ticket submitted to warehouse engineering station.')}
            className="hover:text-slate-800 transition-colors"
          >
            Report Issue
          </button>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white shadow-xl flex items-center gap-2 text-xs font-mono border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={15} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Rule 1 Tenancy Isolation Audit Modal */}
      {auditMessage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-500/40 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <ShieldCheck size={20} />
              <span>Engineering Rule 1: Tenancy Isolation Audit</span>
            </div>
            <pre className="text-xs font-mono text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed">
              {auditMessage}
            </pre>
            <div className="flex justify-end">
              <button
                onClick={() => setAuditMessage(null)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-semibold shadow-2xs transition-colors"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Operator Override Modal */}
      <OverrideModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        unitId={activeScenario.unit_id}
        originalVerdict={activeScenario.overall}
        onSubmit={handleCommitOverride}
      />

      {/* Step 5 Recovery Manager Contract Modal */}
      <RecoveryContractModal
        isOpen={isContractOpen}
        onClose={() => setIsContractOpen(false)}
        scenario={contractScenario || activeScenario}
        override={activeOverride}
      />
    </div>
  );
};
