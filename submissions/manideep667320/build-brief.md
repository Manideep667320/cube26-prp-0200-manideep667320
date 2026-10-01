# Build Brief · Prep Manager (Round 2)

**Builder:** Manideep (`manideep667320`)  
**Position in Chain:** Step 2 of 5 (Inbound to Amazon)  
**Downstream Consumer:** Recovery Manager (Step 5)  
**Date:** October 1, 2026  

---

## 1. Problem Statement & Operational Context

In the five-stage physical commerce chain (Receiving → Prep → Pack → Returns → Recovery), Step 2 is the compliance gate before inventory enters Amazon’s fulfillment network. 

When a unit arrives at an Amazon fulfillment center with non-compliant prep (e.g. unsealed bag, missing suffocation warning, FNSKU applied over a cardboard seam), Amazon charges an unplanned prep fee ($0.20 to $2.00 per unit). Because these fees arrive 6 weeks after inbound shipment, prep centers (charging only $0.40 to $1.10/unit) have no photographic defense and must absorb the loss.

**Prep Manager builds the agent that inspects prepped units from multi-angle photographs and produces immutable, cross-pod compliance evidence (`PRP-XXXX`).**

---

## 2. Core Architecture & Design Decisions

### A. The 5 Non-Negotiable Rules Architecture

1. **Tenancy Isolation (Rule 1):** Multi-tenant PostgreSQL database with Row-Level Security (RLS) forced on `org_id` (`org_demo_alpha` vs `org_demo_bravo`). Image assets are stored under unguessable SHA-256 hashed paths scoped by tenant namespace.
2. **Batched Model Invocations (Rule 2):** Exactly **ONE** multimodal vision model call per unit carrying all 6 checks. The prompt injects all 3 angles simultaneously and returns a structured Pydantic payload. Keeps compute cost < $0.007/unit.
3. **Fail-Open Operational SLA (Rule 3):** If model inference times out or errors, the workstation persists captures, logs `status=pending_review`, and immediately displays a green pass-through light. The packing station line never blocks.
4. **First-Class Uncertainty (Rule 4):** "Not visible != missing." When evidence is obscured by glare or fold, the engine returns `UNCERTAIN` and instructs the operator on targeted retake.
5. **Authoritative Amazon Prep Rules (Rule 5):** Hardcoded Amazon Seller Central FBA requirements (e.g. polybag opening ≥ 5 in requires warning in minimum pt size; FNSKU must be flat with 0.25 in quiet margin covering manufacturer barcode).

### B. Core Six Checks Codified

| Check | Valid States | Authoritative Requirement |
|---|---|---|
| `polybag_present_sealed` | `yes`, `not_sealed`, `missing`, `uncertain`, `not_required` | 1.5 mil thickness, fully enclosed, heat-sealed or taped. |
| `suffocation_warning` | `legible`, `obscured_by_fold`, `missing`, `uncertain`, `not_required` | Required for bag openings ≥ 5"; minimum font size based on dimensions; must not be folded over. |
| `fnsku_label_placement` | `flat`, `on_seam`, `on_curve`, `on_edge`, `missing`, `uncertain` | Must be scannable on widest flat face; never on seam/curve/perforation. |
| `original_barcode_covered` | `yes`, `no`, `uncertain` | Original UPC/EAN/ISBN must be covered to prevent mis-scans. |
| `expiry_date` | `legible`, `illegible_after_wrap`, `uncertain`, `not_required` | Consumables must show expiry clearly through external wrap. |
| `handling_marks` | `all_present`, `some_missing`, `uncertain`, `not_required` | Fragile, Liquid ("This Way Up"), Heavy orientation marks. |

---

## 3. Technology Stack & Knowledge Item Compliance

- **Backend:** Python 3.11+, FastAPI, Pydantic v2, PostgreSQL / SQLite with RLS.
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS (Operator packing station UI with bounding-box evidence overlay).
- **Inference:** Single batched multimodal prompt (Gemini Flash / GPT-4o-mini).
- **Code Standards:** 50 lines → 10–15 lines refactoring, repository pattern, settings singleton, typed boundaries, zero raw dict passing.
