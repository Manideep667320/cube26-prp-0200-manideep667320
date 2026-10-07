# 03 · Executive One-Pager: Prep Manager

**Position in Chain:** Step 2 of 5 (Receiving → **Prep** → Pack → Returns → Recovery)  
**Target Customer:** FBA Prep Center Owners & 3PL Self-Prepping Sellers  
**Primary Deliverable:** Photographic & Bounding-Box Compliance Proof (`PRP-XXXX`)  
**Downstream Consumer:** Recovery Manager (Step 5) for Amazon Defect Fee Disputes

---

## 1. Problem & Operational Reality

Prep centers operate on razor-thin gross margins of **$0.40 to $1.10 per unit**. Six weeks after shipments leave the warehouse dock, Amazon fulfillment centers issue automated unplanned prep defect chargebacks ($0.20 to $2.00/unit) for alleged packaging violations (e.g. missing suffocation warnings, FNSKU on a seam, exposed UPCs). 

Because prep centers currently rely on paper work orders with zero visual evidence, they cannot refute Amazon's claims and are forced to absorb catastrophic chargebacks.

---

## 2. Solution: Evidence-First Compliance Engine

Prep Manager captures three high-speed photographs at the packing bench (Front, Back/Seam, Label Close-up) and executes a single batched multimodal inference pass evaluating Amazon's published packaging requirements:

```text
[Multi-Angle Photos] ──▶ [Batched VLM Analysis] ──▶ [Authoritative Amazon Rules] ──▶ [Evidence Record (PRP-XXXX)]
                                                                                         │
                                                                                         ▼
                                                                             [Recovery Manager (Step 5)]
```

- **Fail-Open Operational SLA:** The warehouse packing line never stops. Timeouts automatically record `pending_review` and unblock the operator.
- **First-Class Uncertainty:** Blurry photos or occluded labels trigger `UNCERTAIN` with targeted operator guidance instead of dangerous false passes.
- **Strict Multi-Tenancy:** Row-Level Security (RLS) guarantees absolute data isolation between customer prep centers (`org_demo_alpha` vs `org_demo_bravo`).

---

## 3. Performance & Operational Metrics

| Metric | Target | Minimum Acceptable | Measurement Methodology |
|---|:---:|:---:|---|
| **Cost per Unit Inspected** | **$0.007** | ≤ $0.015 | Total multimodal token inference cost per unit (batched 3-image prompt). |
| **False PASS Rate (Critical Safety)** | **< 1.0%** | ≤ 1.5% | Ground-truthed on held-out 50-unit eval set against Amazon FBA specifications. |
| **False FAIL Rate (Rework Cost)** | **< 2.5%** | ≤ 4.0% | Percentage of compliant units incorrectly rejected by the model. |
| **P95 Verification Latency** | **< 450 ms** | ≤ 800 ms | Time from capture submission to requirement verdict display. |
| **Fail-Open Line Delay** | **0 ms** | 0 ms | Operator station latency when vision service is degraded or offline. |
| **Tenant Isolation Leakage** | **0.00%** | 0.00% | Cross-tenant visibility test (`org_demo_alpha` querying `org_demo_bravo`). |
| **Recovery Manager Contract Match** | **100%** | 100% | JSON schema validation against `unit_id` join keys in `data/prep_sample.csv`. |

---

## 4. Kill Conditions (Hard Product Boundaries)

The project will be halted or killed immediately if any of the following conditions occur:

> 1. **False PASS Breach:** If the False PASS rate exceeds **1.5%** on authoritative Amazon FBA checks in the held-out evaluation set, the system is killed because false passes directly trigger Amazon fines and client churn.
> 2. **Economic Viability Breach:** If the cost per check exceeds **$0.02 per unit** (consuming greater than 5% of the prep center's lowest $0.40 unit prep price), the product is killed as economically unviable for 3PLs.
> 3. **Tenancy Leakage Breach:** If any database query or asset retrieval allows `org_demo_alpha` to view or access a single row or image belonging to `org_demo_bravo`, the build is stopped until RLS guarantees zero leakage.
