# Prep Manager — Production-Ready Implementation Plan

**Project:** Prep Manager  
**Version:** 1.0  
**Date:** 01 October 2026  
**Status:** Implementation Baseline

---

## 1. Executive Summary

Prep Manager is an evidence-backed visual compliance inspection system for product preparation.

The system receives a product/SKU context and one or more product photographs, determines which preparation requirements apply, analyzes the visible product and packaging, builds traceable evidence, evaluates that evidence against authoritative requirements, and produces a requirement-level and overall result:

- **PASS** — sufficient evidence shows the requirement is satisfied.
- **FAIL** — sufficient evidence shows the requirement is violated.
- **UNCERTAIN** — the available evidence is insufficient or conflicting.
- **N/A** — the requirement does not apply.

The central product principle is:

> **AI observes. Authoritative rules decide. Evidence explains. Uncertainty prevents unsafe assumptions.**

The system must never claim compliance when the available visual evidence cannot prove compliance.

---

## 2. Product Vision

Build a practical inspection assistant that helps warehouse operators determine whether a product has been prepared according to the applicable preparation requirements before it proceeds to the next operational step.

The product should reduce:

- preparation mistakes
- unnecessary manual inspection
- rework
- false approvals
- inconsistent inspection decisions
- time spent checking visual requirements

The product should increase:

- inspection consistency
- operator productivity
- traceability
- decision transparency
- confidence in automated inspection

---

## 3. Problem Definition

Manual preparation inspection can require an operator to visually check several requirements such as:

- packaging presence and condition
- sealing
- warning labels
- FNSKU placement
- barcode visibility/coverage
- expiry-date visibility
- handling marks
- other documented visual preparation requirements

The problem is not simply object detection.

The system must answer:

> **Does the available evidence prove that this product satisfies the applicable preparation requirement?**

This requires a combination of:

1. Product/SKU context
2. Authoritative requirements
3. Image quality validation
4. Computer vision
5. OCR
6. Barcode detection/decoding
7. Spatial reasoning
8. Evidence construction
9. Rule evaluation
10. Decision aggregation
11. Human review and correction
12. Auditability

---

## 4. Product Principles

### 4.1 Evidence First

Every compliance decision should be traceable to specific evidence.

The system should be able to answer:

- What was detected?
- In which image?
- Where in the image?
- What text/value was observed?
- Which requirement was evaluated?
- Which rule was applied?
- Why was the requirement marked PASS, FAIL, or UNCERTAIN?

### 4.2 AI Does Not Invent Rules

The AI system must not create preparation requirements.

Rules must originate from authoritative challenge/product requirements and be stored in a structured rule database.

The AI extracts observations from images.

The rule engine determines compliance.

### 4.3 Not Visible Does Not Mean Missing

If the system cannot see a required element, it must not automatically conclude that the element is absent.

Example:

> FNSKU cannot be read because the image is blurry.

Correct result:

> **UNCERTAIN**

Incorrect result:

> **FAIL**

### 4.4 Safe Uncertainty

The system should prefer:

> UNCERTAIN → request better evidence

over:

> unsupported PASS

### 4.5 Human Review Is a Feature

Human review is the correct path when:

- evidence is insufficient
- images conflict
- authenticity is suspicious
- AI confidence is inadequate
- the requirement cannot be visually verified
- the operator disputes the AI result

---

## 5. Scope

### 5.1 MVP In Scope

**Non-Negotiable Engineering Rules Foundation (MANDATORY)**
- **Tenancy Isolation (Rule 1):** PostgreSQL Row-Level Security (RLS) scoped to `org_id` (`org_demo_alpha` vs `org_demo_bravo`). No cross-org row visibility. Unguessable, tenant-scoped storage paths (presigned URLs / hash keys).
- **Batched Model Invocations (Rule 2):** Exactly **ONE** multimodal model call per unit carrying all checks simultaneously. Zero per-check model calls. Enforces unit economics inside the $0.40–$1.10/unit prep price.
- **Fail-Open Architecture (Rule 3):** Any model error, timeout, or service fault saves capture immediately, creates a record marked `status=pending` / `pending_review`, and returns instantly. Packing station and operator lines NEVER block.
- **First-Class Uncertainty (Rule 4):** `UNCERTAIN` is an explicit, distinct verdict (not low-confidence PASS). Missing visibility does not equal failure.
- **Authoritative Rules Engine (Rule 5):** Hardcoded Amazon FBA prep specifications (retrieved, not hallucinated).

**Product and Requirement Context**
- Product/SKU identification (`sku`, `asin`, `fnsku`)
- Work order requirement mapping (`work_order_id`, `wo_*` flags)
- Authoritative requirement sets & versioning
- Cross-pod join key standard: `unit_id` (`UNIT-0001` ... `UNIT-0100`)

**Image Inspection & Quality Gate**
- Multi-angle image capture/upload (Front, Back/Seam, Label close-up)
- Quality gating: Blur (Laplacian variance), exposure, resolution, occlusion
- Requirement-targeted retake guidance

**Visual Intelligence & Batched Analysis**
- Single batched VLM inference extracting structured observations:
  1. Polybag presence & seal completeness
  2. Suffocation warning presence, text legibility, & fold clearance
  3. FNSKU label placement (flat vs seam/curve/edge) & quiet zone
  4. Original manufacturer barcode (UPC/EAN) coverage status
  5. Expiry date visibility & format legibility
  6. Handling marks (Fragile, Liquid, This Way Up arrows)
- Bounding box coordinates & confidence scores per observation

**Compliance & Decision Engine**
- Deterministic evaluation: PASS, FAIL, UNCERTAIN, N/A per requirement
- Overall verdict aggregation: Any FAIL → FAIL; Else Any UNCERTAIN → UNCERTAIN; Else PASS
- Cross-pod evidence contract generation (`PRP-XXXX`) for Step 5 Recovery Manager

**Operational Workflow & Audit Trail**
- Approve, Fix & Re-inspect, Retake Photos, Manual Review
- Operator override tracking (capturing original verdict, override verdict, operator ID, and mandatory reason)
- Immutable inspection history with versioning

### 5.2 Out of Scope for MVP

Do not build these during the individual hackathon build:

- Full warehouse management system (WMS)
- Autonomous AI rule invention
- Generic conversational chatbot or voice assistant
- Large-scale analytics platform / enterprise RBAC beyond tenant RLS
- Mobile native application (responsive web dashboard is sufficient)
- Custom foundation model training / fine-tuning
- Microservice / Kubernetes orchestration (use modular monolith)
- Financial recovery claim submission (handled downstream by Pod 5: Recovery Manager)

---

## 6. Core User Journey

```text
SELECT / IDENTIFY PRODUCT
        ↓
LOAD APPLICABLE REQUIREMENTS
        ↓
CAPTURE / UPLOAD PHOTOS
        ↓
IMAGE AUTHENTICITY + QUALITY CHECK
        ↓
AI VISUAL ANALYSIS
        ↓
STRUCTURED OBSERVATIONS
        ↓
EVIDENCE BUILDER
        ↓
EVIDENCE VALIDATION
        ↓
RULE EVALUATION
        ↓
REQUIREMENT VERDICTS
        ↓
DECISION ENGINE
        ↓
PASS / FAIL / UNCERTAIN
        ↓
OPERATOR ACTION
        ↓
APPROVE / FIX / RETAKE / REVIEW
        ↓
RE-INSPECTION IF REQUIRED
        ↓
FINAL DECISION + AUDIT RECORD
```

---

## 7. High-Level Architecture

```text
                 PRODUCT / SKU
                      │
                      ▼
             APPLICABLE RULES
                      │
                      ▼
                PHOTO CAPTURE
                      │
                      ▼
        IMAGE AUTHENTICITY CHECK
                      │
                      ▼
           IMAGE QUALITY GATE
                      │
              ┌───────┴───────┐
              │               │
            GOOD            BAD/
              │           SUSPICIOUS
              │               │
              ▼               ▼
        AI / VISION       RETAKE /
          PIPELINE        REVIEW
              │
              ▼
      STRUCTURED OBSERVATIONS
              │
              ▼
        EVIDENCE BUILDER
              │
              ▼
      EVIDENCE VALIDATION
              │
              ▼
          RULE ENGINE
              │
              ▼
      REQUIREMENT VERDICTS
              │
              ▼
       DECISION ENGINE
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
     PASS    FAIL  UNCERTAIN
       │      │      │
       ▼      ▼      ▼
    APPROVE  FIX   RETAKE /
             &     REVIEW
           RETEST
              │
              ▼
       FINAL DECISION
              │
              ▼
         AUDIT RECORD
```

---

## 8. Development Workflow

### Stage 1 — Requirement Foundation

For every requirement define:

- Requirement ID
- Requirement name
- Description
- Applicability
- Required evidence
- Visual/non-visual classification
- PASS conditions
- FAIL conditions
- UNCERTAIN conditions
- Evidence requirements
- Rule version
- Source/reference
- Effective date

Rules must come from authoritative requirements, not be invented by an LLM.

### Stage 2 — Product/SKU Context

Establish what product is being inspected before compliance evaluation.

Possible sources:

1. Operator-selected SKU
2. Product database
3. Barcode
4. FNSKU
5. Other authoritative metadata

```text
Expected SKU
      ↓
Observed Product Identity
      ↓
Match?
  ┌───┴───┐
 YES      NO
  ↓        ↓
Continue  STOP
          Inspection
```

### Stage 3 — Requirement Applicability

```text
Product/SKU
    ↓
Requirement
    ↓
Does it apply?
 ┌──┴──┐
YES    NO
 ↓      ↓
Check   N/A
```

Do not confuse N/A with FAIL or UNCERTAIN.

### Stage 4 — Image Capture and Upload

Prefer controlled capture.

```text
Take Front Photo
       ↓
Take Side Photo
       ↓
Take Back Photo
       ↓
Take Label / Barcode Close-up
```

Uploaded images may be supported, but must still pass quality, trust, and consistency checks.

### Stage 5 — Image Authenticity and Trust

Maintain a separate internal image-trust state:

```text
TRUSTED
SUSPICIOUS
UNKNOWN
```

Use:

- live capture where possible
- guided multi-view capture
- basic provenance checks
- manipulation/synthetic-image indicators
- multi-view consistency

Image-forensics models are not perfect proof. Suspicious results should lead to UNCERTAIN/review rather than an unsupported accusation.

### Stage 6 — Image Quality Gate

Check:

- Blur
- Resolution
- Lighting
- Exposure
- Occlusion
- Coverage
- Relevant-area visibility

Use requirement-level visibility where possible.

Example:

```text
Polybag → visible
Warning → visible
FNSKU → unreadable
Expiry → not visible
```

Result:

```text
Polybag → PASS
Warning → PASS
FNSKU → UNCERTAIN
Expiry → UNCERTAIN
```

Request targeted retakes instead of rejecting the entire inspection unnecessarily.

### Stage 7 — AI / Vision Layer

Use specialized capabilities where appropriate.

```text
                 IMAGE
                   │
       ┌───────────┼────────────┐
       ▼           ▼            ▼
 Object Detection OCR       Barcode
       │           │         Detection
       └───────────┼────────────┘
                   ▼
          Spatial Reasoning
                   │
                   ▼
        Structured Observations
```

### Stage 8 — Evidence Layer

Every observation contributing to a decision becomes an evidence record.

Minimum fields:

```text
Evidence ID
Inspection ID
Requirement ID
Image ID
Bounding Region
Observation
Confidence
Source / Model
Timestamp
Evidence Status
```

### Stage 9 — Evidence Validation

Before rule evaluation:

```text
Observation
    ↓
Is evidence sufficient?
 ┌──┴──┐
YES    NO
 ↓      ↓
Rule   UNCERTAIN
Check
```

Consider:

- visibility
- image quality
- confidence
- spatial completeness
- consistency across images
- requirement-specific evidence needs

### Stage 10 — Evidence Conflict Handling

If images disagree:

```text
Multiple Evidence
       ↓
Conflict Detection
       ↓
Can conflict be resolved?
  ┌────┴────┐
 YES        NO
  ↓          ↓
Evaluate   UNCERTAIN
```

Request a better image or manual review when necessary.

### Stage 11 — Rule Engine

The rule engine:

1. Identifies applicable requirements.
2. Retrieves evidence.
3. Validates evidence sufficiency.
4. Evaluates evidence against the rule.
5. Returns a requirement-level verdict.
6. Stores reasoning/evidence references.

### Stage 12 — Decision Engine

Each requirement can be:

```text
PASS
FAIL
UNCERTAIN
N/A
```

Overall aggregation:

```text
If any applicable requirement = FAIL
        ↓
      FAIL

Else if any applicable requirement = UNCERTAIN
        ↓
    UNCERTAIN

Else
        ↓
      PASS
```

N/A requirements do not trigger failure or uncertainty.

### Stage 13 — Operator Workflow

**PASS**
```text
PASS → Approve → Continue
```

**FAIL**
```text
FAIL → Show reason/evidence → Fix product → Re-inspect
```

**UNCERTAIN**
```text
UNCERTAIN → Explain missing evidence → Retake / Manual Review
```

### Stage 14 — Human Override

```text
AI Result
    ↓
Operator Review
    ↓
Agree / Override
    ↓
Reason Required
    ↓
Final Decision
```

Never delete the original AI result.

### Stage 15 — Versioning

Never overwrite historical inspections.

```text
Inspection #102 v1
       ↓
FAIL
       ↓
Product corrected
       ↓
Inspection #102 v2
       ↓
PASS
```

Every inspection also stores:

- rule version
- model version
- OCR/barcode version
- pipeline version
- timestamp

---

## 9. AI-Generated Image Protection

A major attack scenario is:

> A user uploads an AI-generated or edited image of a perfectly prepared product and receives PASS.

Protection should use multiple signals.

### 9.1 Controlled Capture

Prefer photographs taken directly through the inspection interface.

### 9.2 Capture Challenge

Example:

```text
Capture Front
     ↓
Rotate Product
     ↓
Capture Side
     ↓
Capture Label
```

### 9.3 Image Forensics

Check for:

- manipulation indicators
- synthetic-image indicators
- suspicious metadata
- duplicated regions
- inconsistent lighting/shadows
- image composition anomalies

Do not treat a detector as absolute proof.

### 9.4 Multi-View Consistency

Compare:

- package geometry
- label position
- barcode location
- visible marks
- texture
- folds
- product identity

If images conflict:

> **UNCERTAIN — conflicting visual evidence.**

---

## 10. Backend Architecture & Core Engineering Rules

The backend is built as a lean, production-ready modular FastAPI monolith adhering strictly to the **Non-Negotiable Engineering Rules** and **Knowledge Base Code Writing Standards** (50 lines → 10–15 lines, single-responsibility, type annotations, Pydantic boundaries).

### 10.1 Tenancy Isolation Architecture (Engineering Rule 1)

Every table has Row-Level Security (RLS) enabled and forced at the database layer. No feature is built before tenant isolation is proven.

```sql
-- Enforce tenant isolation on all tables
ALTER TABLE prep_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prep_records FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON prep_records
    USING (org_id = CURRENT_SETTING('app.current_org_id', true));
```

- **Tenant Scoping:** Every request extracts `org_id` from the authenticated session / header (e.g. `org_demo_alpha` or `org_demo_bravo`).
- **Unguessable Media Keys:** Images are stored using UUIDv4/SHA-256 hashes scoped under tenant namespaces (e.g., `/artifacts/{org_id}/{sha256}.jpg`). Guessing another tenant's image URL yields 404 / 403.
- **Automated Isolation Test:** Pre-commit tests verify that `org_demo_alpha` queries return 0 rows for `org_demo_bravo` data.

### 10.2 Batched Single-Inference Engine (Engineering Rule 2)

**Critical:** Exactly **ONE** model call per unit carrying all checks, never one call per check.
At prep center margins of **$0.40 to $1.10 per unit**, multiple API calls destroy gross margin. A single multimodal prompt processes all angles (front, back, label) and yields a structured Pydantic payload:

```python
# Batched Multimodal VLM Caller (Single call per unit)
class UnitInspectionPayload(BaseModel):
    polybag: PolybagObservation
    suffocation_warning: SuffocationWarningObservation
    fnsku_placement: FNSKUObservation
    barcode_covered: BarcodeObservation
    expiry_date: ExpiryObservation
    handling_marks: HandlingMarksObservation

async def inspect_unit_batched(images: list[bytes], wo: WorkOrder) -> UnitInspectionPayload:
    """Evaluates all 6 checks in a single structured VLM call."""
    return await vlm_client.generate_structured(
        images=images,
        context=wo.to_prompt_context(),
        response_model=UnitInspectionPayload
    )
```

### 10.3 Fail-Open Architecture (Engineering Rule 3)

The warehouse line must never stall. A model failure, rate limit, or timeout must immediately:
1. Persist the captured images to object storage.
2. Create an evidence record with status `pending_review` / `pending`.
3. Return HTTP 202 / 200 immediately to unblock the physical packaging operator.

```python
@handle_agent_errors(fallback_status="pending_review")
async def process_prep_capture(capture: PrepCaptureInput) -> PrepRecord:
    # If VLM fails or times out, decorator writes pending_review record and unblocks
    ...
```

### 10.4 Repository Pattern & Concise Logic (KI Code Writing Rules)

Business logic does not contain raw SQL or repetitive try/except blocks:
- **Centralized Settings:** `from app.core.config import settings`
- **Entity Repositories:** `PrepRecordRepo.create()`, `PrepRecordRepo.get_by_unit_id()`
- **Rule Dispatch:** Dict dispatch table mapping check types to deterministic Amazon rule evaluators:
  ```python
  CHECK_EVALUATORS: dict[str, Callable] = {
      "polybag": evaluate_polybag_compliance,
      "suffocation_warning": evaluate_suffocation_compliance,
      "fnsku": evaluate_fnsku_compliance,
      "barcode": evaluate_barcode_compliance,
      "expiry": evaluate_expiry_compliance,
      "handling": evaluate_handling_compliance,
  }
  ```

---

## 11. Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Python
- FastAPI
- Pydantic

### Database

- PostgreSQL

### Storage

- Object storage for product images

### AI/CV

Use appropriate components for:

- object detection
- OCR
- barcode detection/decoding
- image quality analysis
- image similarity/consistency
- visual reasoning

Exact model selection should follow challenge data and deployment constraints.

---

## 12. Data Model

Core entities:

```text
Product
RequirementSet
Requirement
Inspection
InspectionImage
ImageQualityResult
ImageTrustResult
Observation
Evidence
ComplianceCheck
Review
AuditEvent
ModelVersion
RuleVersion
```

Relationship:

```text
Product
   │
   └── RequirementSet
          │
          └── Requirements
                 │
Inspection ──────┤
   │             │
   ├── Images    │
   │      ↓      │
   │   Observations
   │      ↓
   │   Evidence
   │      ↓
   └── Compliance Checks
              ↓
         Final Decision
              ↓
            Review
```

---

## 13. API Design

```http
POST /inspections
POST /inspections/{inspection_id}/images
POST /inspections/{inspection_id}/analyze
GET  /inspections/{inspection_id}
GET  /inspections/{inspection_id}/evidence
GET  /requirements
GET  /requirements/{requirement_id}
POST /inspections/{inspection_id}/review
```

---

## 14. Frontend Screens

### 1. Dashboard

Show:

- total inspections
- PASS
- FAIL
- UNCERTAIN
- pending reviews
- recent inspections

### 2. Create Inspection

```text
Select / scan SKU
       ↓
View applicable requirements
       ↓
Capture / upload images
       ↓
Start inspection
```

### 3. Analysis Progress

Show:

```text
Checking image quality
Analyzing product
Reading labels
Checking barcodes
Building evidence
Evaluating requirements
```

### 4. Inspection Result

Example:

```text
OVERALL: FAIL

✓ Polybag       PASS
✓ Warning       PASS
✗ FNSKU         FAIL
? Expiry        UNCERTAIN
```

### 5. Evidence View

Selecting a requirement should:

1. Open the relevant image.
2. Highlight the evidence region.
3. Show the observation.
4. Show the rule.
5. Explain the verdict.

### 6. Review Screen

Show:

- AI verdict
- evidence
- rule
- operator decision
- reason
- final status

---

## 15. UX Principles

The operator should not need to understand AI internals.

Avoid:

> Vision model confidence: 0.63

Prefer:

> **FNSKU could not be verified. Retake a close-up photo of the label.**

Every problem should answer:

- What is wrong?
- Why?
- What should I do next?

---

## 16. Testing Strategy

### Functional

1. Correctly sealed polybag
2. Missing warning
3. Obscured warning
4. Incorrect FNSKU
5. FNSKU on seam
6. Visible original barcode
7. Covered original barcode
8. Visible expiry
9. Covered expiry
10. Missing handling mark
11. Correct preparation
12. Requirement not applicable

### Evidence

13. Poor lighting
14. Blur
15. Occlusion
16. Partial crop
17. Multiple images
18. Conflicting images
19. Insufficient evidence

### Identity

20. Correct SKU
21. Wrong SKU
22. Unreadable SKU/barcode

### Trust

23. AI-generated-looking image
24. Edited image
25. Screenshot
26. Duplicate image
27. Inconsistent multi-view images

### Operational

28. Operator override
29. Product corrected and re-inspected
30. AI service failure
31. Database failure
32. Rule version change
33. Model version change

---

## 17. Evaluation Metrics

### ML Metrics

- Detection precision
- Detection recall
- OCR accuracy
- Barcode accuracy
- Requirement-level accuracy
- False PASS rate
- False FAIL rate
- UNCERTAIN precision
- Evidence grounding accuracy

### Product Metrics

- Average inspection time
- Manual review rate
- Retake rate
- Rework rate
- First-pass rate
- Operator override rate
- Inspection completion rate

### Primary Safety Metric

**False PASS rate** should receive special attention.

An incorrect PASS can be more damaging than an additional UNCERTAIN/manual review.

---

## 18. Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| AI invents rules | Critical | Rule DB from authoritative requirements |
| Not visible interpreted as absent | Critical | UNCERTAIN state |
| False PASS | Critical | Evidence sufficiency + conservative decisioning |
| AI-generated image | High | Controlled capture + authenticity checks + multi-view consistency |
| Wrong SKU | High | Product identity verification |
| Conflicting images | High | Conflict detection + UNCERTAIN |
| VLM spatial error | High | Specialized detection/OCR/barcode + evidence validation |
| Poor photographs | High | Image quality gate + targeted retake |
| Rule changes | High | Rule versioning |
| Model changes | Medium | Model versioning |
| AI service failure | High | Fail-safe UNCERTAIN/manual review |
| Excessive complexity | High | Modular monolith MVP |
| UI built before core pipeline | High | Vertical-slice development |

---

## 19. Development Milestones

### Milestone 0 — Requirement Lock

Deliver:

- authoritative requirements
- applicability matrix
- rule schema
- visual/non-visual classification
- PASS/FAIL/UNCERTAIN/N/A definitions

### Milestone 1 — End-to-End Skeleton

Build:

```text
React → FastAPI → PostgreSQL → Object Storage
```

Deliverable:

Create inspection → upload image → retrieve inspection.

### Milestone 2 — Image Intelligence

Implement:

- image quality
- object detection
- OCR
- barcode
- structured observations

Deliverable:

> Image → Observations

### Milestone 3 — Evidence System

Implement:

- bounding regions
- evidence objects
- confidence
- source/model
- multi-image evidence

Deliverable:

> Observations → Evidence

### Milestone 4 — Rule Engine

Implement:

- applicability
- evidence sufficiency
- PASS
- FAIL
- UNCERTAIN
- N/A

Deliverable:

> Evidence → Requirement Verdict

### Milestone 5 — Decision and Review

Implement:

- overall aggregation
- human review
- override
- correction
- reinspection
- audit history

Deliverable:

> Requirement Verdicts → Final Operational Decision

### Milestone 6 — Authenticity and Adversarial Protection

Implement:

- controlled capture
- basic forensic checks
- multi-view consistency
- suspicious image handling

Deliverable:

> Image Trust → Safe Inspection Path

### Milestone 7 — Operator UI

Build:

- create inspection
- analysis
- results
- evidence
- review
- reinspection

Deliverable:

> Complete operator workflow

### Milestone 8 — Validation

Run:

- normal cases
- failure cases
- uncertainty cases
- adversarial cases
- performance tests
- service failure tests

Deliverable:

> Validated MVP

---

## 20. Individual Builder Execution Plan (The 6 Submission Faces)

Per Competition Rule R1, Round 2 is strictly an **individual build**. Rather than dividing work across a fictitious 6-person team, the single builder executes in a vertical, phased cadence directly producing the **6 Submission Faces** required by the evaluation panel:

```text
Understand & Document (Face 1 & 2)
              ↓
Headless Agent & Tenancy (Face 3)
              ↓
Evaluation & Failure Modes (Face 4)
              ↓
Evidence UI & Record Page (Face 5)
              ↓
Cross-Pod Contract & Interop (Face 6)
```

### Phase 1: Problem Definition & Constraints (Face 1 & Face 2)
- **Face 1 Deliverables:**
  - `01-customer-letter.md`: Addressed to a prep center owner operating on $0.40–$1.10 margins facing six-week-delayed Amazon chargebacks.
  - `02-prfaq.md`: Customer and operational FAQs, including difficult questions (lighting limits, operator overrides, liability).
  - `03-one-pager.md`: Key operational metrics table + explicit **Kill Condition** (e.g., if false pass rate exceeds 1.5% or cost per check exceeds $0.03).
- **Face 2 Deliverables:**
  - `CLAUDE.md`: Hard durable constraints, non-negotiable rules (tenancy, batched calls, fail open, authoritative rules), and forbidden hand-waving language.

### Phase 2: Headless Agent Core (Face 3)
- **Directory:** `submissions/manideep667320/agent/`
- **Deliverables:**
  - `config.py`: Environment-driven settings singleton.
  - `tenancy.py`: Row-Level Security (RLS) enforcement on `org_id` (`org_demo_alpha` vs `org_demo_bravo`).
  - `fail_open.py`: Decorator ensuring model timeouts immediately yield `status=pending_review` without blocking.
  - `vlm_client.py`: Batched single-call multimodal inference returning typed Pydantic observations with bounding coordinates.
  - `amazon_rules.py`: Deterministic Amazon FBA prep rules engine (polybag seal, suffocation warning, FNSKU flat, barcode coverage, expiry format, handling marks).
  - `runner.py`: CLI tool executing headless inspections over local test fixtures.

### Phase 3: Rigorous Evaluation & Failures (Face 4)
- **Deliverable:** `eval-report.md`
- **Dataset:** Held-out 50-unit evaluation dataset (distinct from sample CSV).
- **Reporting:** Two-labeller ground-truth agreement, per-check False Positives (FP) and False Negatives (FN), `UNCERTAIN` distribution, and named failure modes. No generic "it works well".

### Phase 4: Evidence Record Page & Operator UX (Face 5)
- **Deliverable:** Minimal, high-impact operator dashboard (FastAPI + Vite/React).
- **Capabilities:**
  - Visual inspection review with highlighted bounding boxes.
  - Explanation of PASS, FAIL, or UNCERTAIN tied directly to the authoritative Amazon rule.
  - Operator override interface capturing original verdict, new verdict, and mandatory explanation.

### Phase 5: Cross-Pod Evidence Contract (Face 6)
- **Directory:** `submissions/manideep667320/contract/`
- **Deliverable:** `prep_evidence_contract.json` & Pydantic schema matching `data/prep_sample.csv` and cross-pod standards so Step 5 (Recovery Manager) can seamlessly join on `unit_id` to dispute Amazon defect fees.

---

## 21. Recommended Build Strategy

Do not build every module independently and integrate at the end.

Build one vertical slice first:

```text
One Product
   ↓
One Requirement
   ↓
One Image
   ↓
One Detection
   ↓
One Evidence
   ↓
One Rule
   ↓
One Verdict
   ↓
One UI Result
```

Then expand to:

```text
Multiple Requirements
        ↓
Multiple Images
        ↓
Multiple AI capabilities
        ↓
Complete Inspection
```

This reduces integration risk.

---

## 22. MVP Priority Matrix

### P0 — Must Work

- Product/SKU context
- Authoritative rules
- Image quality
- Core visual detection
- OCR/barcode where required
- Evidence
- PASS/FAIL/UNCERTAIN
- Multi-image support
- Basic operator workflow
- Fail-safe behavior
- Demo scenarios

### P1 — Strong Enhancement

- Image authenticity
- Multi-view consistency
- Human override
- Reinspection
- Rule versioning
- Model versioning
- Audit trail

### P2 — Future

- Analytics
- Operator performance
- Batch inspection
- Automated capture guidance
- Continuous model feedback
- Enterprise integrations

---

## 23. Hackathon Demo Strategy

The demo should focus on the product behavior rather than explaining every technical component.

### Demo 1 — PASS

Correctly prepared product.

```text
PASS
All applicable requirements satisfied.
```

Show evidence.

### Demo 2 — FAIL

Missing or incorrectly placed requirement.

```text
FAIL
FNSKU placement incorrect.
```

Highlight the exact image region.

### Demo 3 — UNCERTAIN

Use:

- blurry image
- occluded label
- conflicting images
- insufficient evidence

Expected:

```text
UNCERTAIN
Retake a close-up image.
```

### Demo 4 — Suspicious/Generated Image

Expected:

```text
Image authenticity could not be sufficiently verified.
Capture a new image using the inspection workflow.
```

Do not claim perfect AI-generated-image detection.

---

## 24. 30-Second Product Story

> **Prep Manager checks whether a product has been prepared correctly by combining authoritative preparation rules with computer vision. Instead of simply predicting PASS or FAIL, it shows the evidence behind every decision and returns UNCERTAIN when the available image cannot prove compliance.**

Then demonstrate:

```text
Correct → PASS
Incorrect → FAIL
Insufficient evidence → UNCERTAIN
```

---

## 25. Key Differentiator

Do not position Prep Manager as:

> "An AI model that recognizes packaging."

Position it as:

> **An evidence-backed compliance decision system.**

Its differentiation is:

```text
AUTHORITATIVE RULE
        ↓
VISUAL OBSERVATION
        ↓
EVIDENCE
        ↓
RULE EVALUATION
        ↓
EXPLAINABLE VERDICT
        ↓
OPERATOR ACTION
```

---

## 26. Production Evolution

### MVP

```text
React
 ↓
FastAPI
 ↓
AI Pipeline
 ↓
PostgreSQL
 ↓
Object Storage
```

### Production

```text
                    API / UI
                       │
                       ▼
                Inspection Service
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
 Product Service  Requirement      Image Service
                    Service             │
        │              │                ▼
        │              │          AI Orchestrator
        │              │                │
        │              │       ┌────────┼────────┐
        │              │       ▼        ▼        ▼
        │              │   Detector    OCR    Barcode
        │              │       │        │        │
        └──────────────┼───────┴────────┴────────┘
                       ▼
                 Evidence Store
                       │
                       ▼
                  Rule Engine
                       │
                       ▼
                 Decision Service
                       │
                       ▼
                  Review Service
                       │
                       ▼
                  Audit Service
```

---

---

## 27. Execution Backlog (Aligned to Round 2 Submission Faces)

### Milestone 1: Customer Context & Contracts (Faces 1, 2, 6)
- [ ] Write Customer Letter (`01-customer-letter.md`) focused on prep center fee disputes
- [ ] Draft PR/FAQ (`02-prfaq.md`) including tough operational questions
- [ ] Create One-Pager (`03-one-pager.md`) with performance metrics & hard **Kill Condition**
- [ ] Lock durable constraints & forbidden language in `CLAUDE.md`
- [ ] Define cross-pod schema (`contract/prep_evidence_contract.json`) joining on `unit_id`

### Milestone 2: Headless Agent & Engineering Rules (Face 3)
- [ ] Implement Tenancy RLS on `org_id` (`org_demo_alpha` vs `org_demo_bravo`) & isolation tests
- [ ] Implement Fail-Open decorator (`@handle_agent_errors`) returning `status=pending_review`
- [ ] Implement batched single-call multimodal VLM client with typed Pydantic output
- [ ] Code deterministic Amazon FBA prep rules engine (Polybag, Warning, FNSKU, Barcode, Expiry, Handling)
- [ ] Build headless test runner against fixture images

### Milestone 3: Rigorous Evaluation & Failures (Face 4)
- [ ] Assemble 50-unit held-out evaluation dataset (ground-truthed with two-labeller agreement)
- [ ] Run automated evaluation script computing per-check FP, FN, and UNCERTAIN counts
- [ ] Document named failure modes and produce `eval-report.md`

### Milestone 4: Evidence UI & Operator Workflow (Face 5)
- [ ] Build FastAPI evidence endpoints (`/inspections/{id}/evidence`, `/review`)
- [ ] Implement React/Vite operator inspection view with bounding-box highlights
- [ ] Implement operator override capturing original verdict, new verdict, and mandatory reason
- [ ] Verify complete end-to-end workflow without manual DB tampering

---

## 28. Definition of Done & 100-Point Scoring Gate

The submission is ready when it meets all criteria across the **100-point evaluation rubric**:

| Criterion | Points | Definition of Done |
|---|:---:|---|
| **Problem Understanding & Solution Relevance** | **15** | Customer letter, PR/FAQ, and one-pager accurately reflect warehouse economics ($0.40–$1.10 margin) and the 6-week Amazon dispute lifecycle. Kill condition is explicitly defined. |
| **Agent Functionality & Decision Quality** | **25** | Single-call batched VLM extracts all 6 checks. Authoritative rules decide compliance. Fail-open architecture ensures packing lines never block. |
| **Evaluation, Accuracy & Uncertainty Handling** | **25** | Held-out 50-unit dataset evaluated with two-labeller agreement. False positives, false negatives, and `UNCERTAIN` distribution reported honestly with named failure modes. |
| **Evidence, Traceability & Engineering Quality** | **20** | Postgres RLS enforces tenant isolation (`org_demo_alpha` cannot see `org_demo_bravo`). Bounding boxes ground every decision. Cross-pod contract valid for Recovery Manager. |
| **UX, Demo & Documentation** | **15** | Functional operator dashboard with bounding-box viewer, override capture with reasons, clean architecture docs, video demo, and LinkedIn post. |

---

## 29. Final Architecture Principle

The key separation is:

```text
              ┌─────────────────────┐
              │   AUTHORITATIVE     │
              │       RULES         │
              └──────────┬──────────┘
                         │
                         ▼
IMAGE → AI → OBSERVATIONS → EVIDENCE → RULE ENGINE → VERDICT
                         │                         │
                         │                         ▼
                         │                  PASS / FAIL /
                         │                  UNCERTAIN
                         │
                         ▼
                  HUMAN REVIEW
```

AI should answer:

> **What can I observe?**

The rule engine should answer:

> **What does the requirement say?**

The decision engine should answer:

> **Does the evidence satisfy the requirement?**

The operator workflow should answer:

> **What should happen next?**

---

## 30. Final Strategic Recommendation

Build Prep Manager as a **visual compliance decision system**, not merely an image classifier.

The minimum defensible product is:

```text
PRODUCT ID
    ↓
APPLICABLE REQUIREMENTS
    ↓
TRUSTED / SUFFICIENT IMAGES
    ↓
AI OBSERVATIONS
    ↓
TRACEABLE EVIDENCE
    ↓
DETERMINISTIC RULE EVALUATION
    ↓
PASS / FAIL / UNCERTAIN
    ↓
ACTION
    ↓
REINSPECTION / FINAL DECISION
```

The strongest product characteristics are:

1. **Authoritative rules instead of AI-generated rules**
2. **Evidence-backed decisions**
3. **Requirement-level uncertainty**
4. **Multi-image reasoning**
5. **Product/SKU verification**
6. **Safe handling of AI-generated/manipulated images**
7. **Human review and override**
8. **Versioned, auditable decisions**
9. **Fail-safe behavior when AI/services fail**
10. **Simple operator experience**

The critical development rule is:

> **Do not build the final UI before the `Image → Evidence → Rule → Verdict` pipeline works.**

For the production-ready version, expand that principle to:

> **Do not trust a verdict unless the system can identify the product, establish applicable requirements, verify sufficient evidence, evaluate the authoritative rule, and explain the decision.**
