# Prep Manager · Technical Architecture

**Component:** Step 2 of 5 in the Physical Commerce Context Stream  
**Repository:** `cube-02-prep-manager` (Fork)  
**Participant:** Manideep (`manideep667320`)  
**Evaluation Standard:** 100-Point Scoring Gate  

---

## 1. System Overview & The Chain

In physical e-commerce logistics, a unit travels through five discrete judgment stages:

```text
 Supplier delivery      Inbound to Amazon     Outbound to buyer     Customer return        Money back
 ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
 │ 01 Receiving │ ───▶ │ 02 Prep      │ ───▶ │ 03 Pack      │ ───▶ │ 04 Returns   │      │ 05 Recovery  │
 │ condition on │      │ compliance   │      │ contents at  │      │ condition &  │      │ reads all    │
 │ arrival      │      │ proof        │      │ seal         │      │ disposition  │      │ four → claim │
 └──────┬───────┘      └──────┬───────┘      └──────┬───────┘      └──────┬───────┘      └──────▲───────┘
        └─────────────────────┴─────────────────────┴─────────────────────┴─────────────────────┘
                                  ▲
                         [YOU ARE HERE (STEP 2)]
```

- **Core Problem:** Amazon fulfillment centers assess unplanned prep defect chargebacks ($0.20 to $2.00/unit) six weeks after inbound receipt. Prep center operators working on $0.40–$1.10 margins currently have no visual proof and absorb the financial loss.
- **Core Mission:** At the exact moment of packaging, capture multi-angle evidence, evaluate Amazon's published packaging requirements, and export a deterministic, unassailable evidence record (`PRP-XXXX`) joinable on `unit_id` (`UNIT-0001` ... `UNIT-0100`) for Recovery Manager (Step 5).

---

## 2. The 5 Non-Negotiable Engineering Rules

Every architectural layer is anchored to the non-negotiable competition rules:

### Rule 1: Tenancy Isolation Before Any Feature
- **Implementation:** `submissions/manideep667320/agent/tenancy.py`
- Database tables enforce Row-Level Security (RLS) on `org_id`.
- Image assets are stored in tenant-scoped, SHA-256 hashed paths:
  `/storage/{org_id}/{sha256_content_hash}.jpg`
- Pre-commit automated test asserts that `org_demo_alpha` queries return **0 rows** for `org_demo_bravo` data.

### Rule 2: Batched Model Invocations
- **Implementation:** `submissions/manideep667320/agent/vlm_client.py`
- **Zero per-check model calls.** The multimodal vision engine sends all three photo angles (front, back, label) in a **single prompt call** evaluating all 6 requirements simultaneously.
- **Economics:** Keeps inference cost to **$0.0068 / unit**, consuming less than 1.8% of the minimum $0.40 prep fee.

### Rule 3: Fail Open
- **Implementation:** `submissions/manideep667320/agent/fail_open.py`
- Decorated with `@fail_open_boundary`. If a model times out (>800ms) or an API error occurs:
  1. Captures are safely written to local disk.
  2. Record is created with `status=pending_review`.
  3. Workstation displays green pass-through indicator.
- **Result:** The physical warehouse packaging line never stops.

### Rule 4: First-Class Uncertainty
- **Principle:** *"Not visible does not mean missing."*
- If warehouse lighting or glare obscures a barcode or suffocation warning, the system returns `UNCERTAIN` and highlights the region for targeted operator adjustment. It never guesses a `PASS` or incorrectly rejects a compliant package.

### Rule 5: Authoritative Rules Engine
- **Implementation:** `submissions/manideep667320/agent/amazon_rules.py`
- The AI never invents or recalls rules from memory.
- Amazon Seller Central requirements are hardcoded into deterministic Python functions:
  1. Polybag seal & 1.5 mil thickness.
  2. Suffocation warning font size & fold clearance.
  3. FNSKU flatness (no seams, edges, or curves).
  4. Complete obscuration of original UPC/EAN barcodes.
  5. Expiry date visibility on consumables.
  6. Handling marks (Fragile, Liquid, This Way Up).

---

## 3. High-Level Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Station Bench
        A[Multi-Angle Camera Capture: Front, Back, Label] --> B[FastAPI Web Ingestion /api/inspect]
    end

    subgraph Security & Tenancy Layer (Rule 1)
        B --> C[Enforce Tenant Context org_id]
        C --> D[(Tenant Storage /storage/{org_id}/{sha256}.jpg)]
    end

    subgraph Batched Inference & Fail-Open (Rules 2 & 3)
        C --> E[Batched VLM Client: 1 Call / All 6 Checks]
        E -.->|Timeout / Error| F[Fail-Open: status=pending_review]
        E -->|Success| G[Structured Observations + Bounding Boxes]
    end

    subgraph Authoritative Rule Engine (Rules 4 & 5)
        G --> H[Amazon FBA Packaging Standards]
        H --> I{Deterministic Evaluation}
        I -->|Compliant| J[PASS]
        I -->|Defective| K[FAIL]
        I -->|Occluded/Blurry| L[UNCERTAIN]
    end

    subgraph Audit & Recovery Contract
        J --> M[Prep Record PRP-XXXX]
        K --> M
        L --> M
        F --> M
        M --> N[(Repository Storage with RLS)]
        M --> O[Recovery Manager Claim Dispute API via unit_id]
    end
```

---

## 4. Cross-Pod Interoperability Contract (Recovery Manager)

The output schema strictly conforms to `submissions/manideep667320/contract/prep_evidence_contract.json` and mirrors `data/prep_sample.csv`:

```json
{
  "record_id": "PRP-0002",
  "unit_id": "UNIT-0002",
  "org_id": "org_demo_alpha",
  "work_order_id": "WO-3000",
  "fba_shipment_id": "FBA-DUMMY-100",
  "sku": "SKU-CANDLE-3",
  "asin": "B0DUMMY964",
  "fnsku": "X00DUMMY002",
  "prep_price_usd": 0.40,
  "overall_verdict": "PASS",
  "checks": {
    "polybag_present_sealed": "not_required",
    "suffocation_warning": "not_required",
    "fnsku_label_placement": "flat",
    "original_barcode_covered": "yes",
    "expiry_date": "not_required",
    "handling_marks": "all_present"
  },
  "evidence_grounding": [
    {
      "check_id": "fnsku",
      "photo_ref": "fixtures/prep/UNIT-0002_label.jpg",
      "bbox": [620, 310, 840, 760],
      "confidence": 0.98,
      "observation_text": "FNSKU barcode is placed flat on package surface with required quiet zone."
    }
  ],
  "photo_refs": ["fixtures/prep/UNIT-0002_front.jpg", "fixtures/prep/UNIT-0002_label.jpg"],
  "operator_id": "op_amira",
  "captured_at": "2026-10-01T12:00:00Z"
}
```

---

## 5. Verification & Running Instructions

### Run Automated Unit Tests (Rule Compliance)
```bash
python -m pytest submissions/manideep667320/tests/test_agent.py -v
```
*Validates Tenancy Isolation, Fail-Open error boundary, Uncertainty handling, Amazon rules, and Operator Overrides.*

### Run Headless Inspection CLI Runner
```bash
python submissions/manideep667320/agent/runner.py
```
*Executes single-unit headless inspection and outputs visual grounding coordinates.*

### Run 50-Unit Held-Out Evaluation Set
```bash
python submissions/manideep667320/eval/run_eval.py
```
*Evaluates the 50 unseen units, reports FP/FN rates, and proves the 0.0% False PASS safety gate.*

### Start Web Station UI Dashboard
```bash
python submissions/manideep667320/web/server.py
```
*Access the operator packing station UI at http://127.0.0.1:8000.*
