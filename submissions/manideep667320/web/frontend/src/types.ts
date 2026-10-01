export type TenantOrg = 'org_demo_alpha' | 'org_demo_bravo';

export type CheckStatus =
  | 'yes'
  | 'no'
  | 'not_sealed'
  | 'missing'
  | 'legible'
  | 'obscured_by_fold'
  | 'illegible_after_wrap'
  | 'flat'
  | 'on_seam'
  | 'on_curve'
  | 'on_edge'
  | 'all_present'
  | 'some_missing'
  | 'uncertain'
  | 'not_required';

export type OverallVerdict = 'PASS' | 'FAIL' | 'UNCERTAIN' | 'pending_review';

export interface BoundingBox {
  top: string;
  left: string;
  width: string;
  height: string;
}

export interface CheckItem {
  id: 'polybag' | 'warning' | 'fnsku' | 'barcode' | 'expiry' | 'handling';
  code: string; // e.g. 'FBA-POLY-101'
  name: string;
  ruleNumber?: string; // e.g. 'Rule 101'
  badgeText?: string;  // e.g. 'N/A', '98% Match', '100% Obscured', 'Verified'
  state: 'pass' | 'fail' | 'uncertain' | 'na';
  rawStatus: CheckStatus;
  desc: string;
  rule: string;
  confidence: number;
  bbox: BoundingBox;
  angleTarget: 'front' | 'seam' | 'label';
}

export interface UnitScenario {
  unit_id: string;
  record_id: string;
  org_id: TenantOrg;
  product_title: string;
  category?: string;
  sku: string;
  asin: string;
  fnsku: string;
  work_order_id: string;
  target_destination?: string;
  fba_shipment_id: string;
  prep_price_usd: number;
  chargeback_risk_usd: number;
  packaging_spec: string;
  overall: OverallVerdict;
  defect_title?: string;
  defect_remediation?: string;
  evidence_sha256: string;
  checks: CheckItem[];
  photo_refs: string[];
}

export interface OperatorOverride {
  original_verdict: OverallVerdict;
  new_verdict: OverallVerdict;
  operator_id: string;
  reason: string;
  timestamp: string;
}

export interface AmazonDisputeClaim {
  dispute_id: string;
  fba_shipment_id: string;
  fc_destination: string;
  sku: string;
  fnsku: string;
  claimed_defect: string;
  fee_per_unit_usd: number;
  claimed_units: number;
  total_chargeback_usd: number;
  notice_date: string;
  matching_record_id: string;
  our_evidence_summary: string;
  dispute_status: 'disputed' | 'recovered' | 'pending';
}

export interface WorkOrderSummary {
  work_order_id: string;
  client_name: string;
  fba_shipment_id: string;
  destination_fc: string;
  total_units: number;
  passed_units: number;
  rework_units: number;
  disputed_units: number;
  prep_fee_rate: number;
  total_revenue_usd: number;
  status: 'in_progress' | 'dispatched' | 'audited';
}


