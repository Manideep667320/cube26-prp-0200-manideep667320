import React, { useState } from 'react';
import {
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Building2,
  FileCode,
  CheckCircle2,
  Search,
  ExternalLink,
  ChevronRight,
  Truck,
  Check,
  Download
} from 'lucide-react';
import { MOCK_WORK_ORDERS, MOCK_DISPUTES, MOCK_VAULT_RECORDS, INITIAL_SCENARIOS } from '../mockData';
import { TenantOrg, UnitScenario } from '../types';

interface ManagerDashboardProps {
  tenant: TenantOrg;
  onOpenStationForUnit: (unitId: string) => void;
  onOpenContractForScenario: (scenario: UnitScenario) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  tenant,
  onOpenStationForUnit,
  onOpenContractForScenario,
}) => {
  const [activeTab, setActiveTab] = useState<'disputes' | 'shipments' | 'vault'>('disputes');
  const [selectedDispute, setSelectedDispute] = useState(MOCK_DISPUTES[0]);
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultFilter, setVaultFilter] = useState<'ALL' | 'PASS' | 'FAIL' | 'UNCERTAIN'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportDispute = () => {
    const matchingScenario = INITIAL_SCENARIOS[selectedDispute.matching_record_id.replace('PRP', 'UNIT')];
    if (matchingScenario) {
      onOpenContractForScenario(matchingScenario);
    } else {
      showToast(`Cryptographic evidence pack exported to Step 5 Recovery Manager for ${selectedDispute.dispute_id}`);
    }
  };

  const filteredVault = MOCK_VAULT_RECORDS.filter((rec) => {
    const matchesSearch =
      rec.record_id.toLowerCase().includes(vaultSearch.toLowerCase()) ||
      rec.sku.toLowerCase().includes(vaultSearch.toLowerCase()) ||
      rec.unit_id.toLowerCase().includes(vaultSearch.toLowerCase());
    const matchesFilter = vaultFilter === 'ALL' || rec.verdict === vaultFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 px-6 py-4 flex flex-col gap-4 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl z-50 text-xs font-mono flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Financial Margin Defense Cockpit (Top 4 Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Gross Prep Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono uppercase">
            <span>Inbound Prep Margin</span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-emerald-600">$1,155.00</div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              1,170 units billed at $0.40–$1.10 rate
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Inference Compute Cost:</span>
            <span className="text-blue-600 font-semibold">$7.95 (0.68% fee)</span>
          </div>
        </div>

        {/* Card 2: Intercepted Defects */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono uppercase">
            <span>Pre-Dispatch Defects Caught</span>
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={14} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-slate-900">
              34 <span className="text-xs font-normal text-slate-500">units</span>
            </div>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-semibold">
              +$68.00 in $2.00 FBA fees prevented
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Rework Turnaround:</span>
            <span className="text-slate-700 font-medium">4.2 min avg</span>
          </div>
        </div>

        {/* Card 3: Amazon Delayed Chargebacks */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono uppercase">
            <span>Amazon Chargeback Defense</span>
            <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={14} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-rose-600">
              $56.00 <span className="text-xs font-normal text-slate-500">claimed</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Amazon Inbound Performance audits
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-mono text-emerald-600 flex items-center justify-between">
            <span>Recovered via Step 5 Proof:</span>
            <span className="font-bold">$36.00 (64%)</span>
          </div>
        </div>

        {/* Card 4: Tenant Isolation & RLS Security */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono uppercase">
            <span>Tenant Compliance Vault</span>
            <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 size={14} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold font-mono text-slate-900 truncate">{tenant}</div>
            <p className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-1 font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              PostgreSQL RLS Active (Zero Leak)
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Cryptographic Proofs:</span>
            <span className="text-slate-700 font-medium">100% SHA-256 Hashed</span>
          </div>
        </div>
      </div>

      {/* Main Manager Workflow Sub-Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 pt-3 pb-0 bg-slate-50/50">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('disputes')}
              className={`px-4 py-2 text-xs font-mono font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'disputes'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <AlertTriangle size={14} className="text-rose-500" />
              <span>Amazon Dispute Claims</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-bold">
                {MOCK_DISPUTES.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('shipments')}
              className={`px-4 py-2 text-xs font-mono font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'shipments'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Truck size={14} className="text-blue-500" />
              <span>Outbound Shipments &amp; FBA Margin</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`px-4 py-2 text-xs font-mono font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'vault'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Station Evidence Vault (SHA-256)</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 pb-2 hidden sm:block">
            Amazon SP-API Connected · Ontario ONT8 &amp; Charlotte CLT2
          </div>
        </div>

        {/* TAB 1: Amazon Inbound Dispute Defense */}
        {activeTab === 'disputes' && (
          <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Dispute Queue (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500">
                  Select a delayed chargeback claim to review cryptographic station defense:
                </span>
                <span className="text-xs font-mono text-emerald-600 font-semibold">
                  Defense Win Rate: 94.2%
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {MOCK_DISPUTES.map((dispute) => {
                  const isSelected = selectedDispute.dispute_id === dispute.dispute_id;
                  return (
                    <div
                      key={dispute.dispute_id}
                      onClick={() => setSelectedDispute(dispute)}
                      className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/60 border-l-4 border-l-blue-600' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {dispute.dispute_status === 'recovered' ? (
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          ) : (
                            <AlertTriangle size={16} className="text-rose-500 shrink-0" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-slate-900">
                              {dispute.dispute_id}
                            </span>
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {dispute.fc_destination}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {dispute.fba_shipment_id}
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-slate-800 mt-1">
                            {dispute.claimed_defect}
                          </div>

                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            SKU: {dispute.sku} · Claim: {dispute.claimed_units} units @ ${dispute.fee_per_unit_usd.toFixed(2)}/ea
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-sm text-rose-600">
                          -${dispute.total_chargeback_usd.toFixed(2)}
                        </div>
                        <div className="mt-1">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                              (dispute.dispute_status as string) === 'recovered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : (dispute.dispute_status as string) === 'disputed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {dispute.dispute_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dispute Defense Policy Guidance Banner */}
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Amazon SP-API Recovery Automation:</strong> PrepFlow cryptographically links each packing bench timestamp, camera angle, and operator signature into a structured evidence packet. Amazon typically reimburses delayed chargebacks within 3 business days of evidentiary submission.
                </div>
              </div>
            </div>

            {/* Right Column: Dispute Defense Dossier (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileCode size={16} className="text-blue-600" />
                    <span className="font-mono font-bold text-xs text-slate-900">
                      Dispute Defense Dossier
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
                    Record: {selectedDispute.matching_record_id}
                  </span>
                </div>

                {/* Evidentiary Station Photograph */}
                <div className="mt-3">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-semibold">
                    Station Photo Evidence at Dispatch:
                  </div>
                  <div className="relative h-44 rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                    <img
                      src="/candle_stage.jpg"
                      alt="Station Proof"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/80 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                      SHA-256 HASH VERIFIED
                    </div>
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white/90 bg-black/80 px-2 py-0.5 rounded">
                      Timestamp: {selectedDispute.notice_date}
                    </div>
                  </div>
                </div>

                {/* Evidence Summary & Defense Argument */}
                <div className="mt-3 bg-white border border-slate-200 rounded-lg p-3 text-xs">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Automated Defense Statement for Amazon Seller Support:
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    &quot;{selectedDispute.our_evidence_summary}&quot;
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>FBA Spec: Rule 301/401</span>
                    <span className="text-emerald-600 font-semibold">Ready for SP-API transmission</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={handleExportDispute}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <ExternalLink size={13} />
                  <span>Transmit to Step 5 Recovery</span>
                </button>

                <button
                  onClick={() => showToast(`Evidence PDF downloaded for ${selectedDispute.dispute_id}`)}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                  title="Download Evidence PDF"
                >
                  <Download size={13} />
                  <span>PDF Pack</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Outbound Shipments */}
        {activeTab === 'shipments' && (
          <div className="p-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-mono text-slate-500 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Work Order</th>
                    <th className="py-2.5 px-4 font-semibold">Client / 3PL Tenant</th>
                    <th className="py-2.5 px-4 font-semibold">FBA Shipment</th>
                    <th className="py-2.5 px-4 font-semibold">FC Dest</th>
                    <th className="py-2.5 px-4 font-semibold">Total Units</th>
                    <th className="py-2.5 px-4 font-semibold">Passed</th>
                    <th className="py-2.5 px-4 font-semibold">Rework</th>
                    <th className="py-2.5 px-4 font-semibold">Prep Revenue</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {MOCK_WORK_ORDERS.map((wo) => (
                    <tr key={wo.work_order_id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{wo.work_order_id}</td>
                      <td className="py-3 px-4 text-slate-600">{wo.client_name}</td>
                      <td className="py-3 px-4 text-blue-600">{wo.fba_shipment_id}</td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                          {wo.destination_fc}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold">{wo.total_units}</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">{wo.passed_units}</td>
                      <td className="py-3 px-4 text-rose-600 font-bold">{wo.rework_units}</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">${wo.total_revenue_usd.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            wo.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : wo.status === 'dispatched'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {wo.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Station Evidence Vault */}
        {activeTab === 'vault' && (
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search record ID, SKU, or unit..."
                  value={vaultSearch}
                  onChange={(e) => setVaultSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-mono">
                {(['ALL', 'PASS', 'FAIL', 'UNCERTAIN'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setVaultFilter(filter)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      vaultFilter === filter
                        ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-mono text-slate-500 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Proof Record ID</th>
                    <th className="py-2.5 px-4 font-semibold">Unit ID</th>
                    <th className="py-2.5 px-4 font-semibold">SKU / Item</th>
                    <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                    <th className="py-2.5 px-4 font-semibold">Operator</th>
                    <th className="py-2.5 px-4 font-semibold">Verdict</th>
                    <th className="py-2.5 px-4 font-semibold">SHA-256 Hash</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredVault.map((rec) => (
                    <tr key={rec.record_id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{rec.record_id}</td>
                      <td className="py-3 px-4 text-blue-600 font-medium">{rec.unit_id}</td>
                      <td className="py-3 px-4 text-slate-700">{rec.sku}</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{rec.captured_at}</td>
                      <td className="py-3 px-4 text-slate-600">{rec.operator}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            rec.verdict === 'PASS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.verdict === 'FAIL'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rec.verdict}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] truncate max-w-[120px]" title={rec.rule_status}>
                        {rec.rule_status}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onOpenStationForUnit(rec.unit_id)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Station</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
