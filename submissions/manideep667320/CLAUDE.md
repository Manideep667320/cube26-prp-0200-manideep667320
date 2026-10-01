# CLAUDE.md — Durable Constraints, Hard Rules & Engineering Standards

**Repository:** `submissions/manideep667320/`  
**Role:** Prep Manager (Step 2 of 5, Inbound to Amazon)  
**Governing Context:** Cube Buildathon Round 2 Individual Build  

---

## 1. Non-Negotiable Engineering Rules

These five rules are strictly enforced across all code and documentation:

### Rule 1: Tenancy Isolation Before Any Feature
- Every database table MUST have Row-Level Security (RLS) enabled and forced on `org_id`.
- Test that `org_demo_alpha` queries return 0 rows for `org_demo_bravo` data.
- Image storage paths MUST be non-guessable and scoped to the organization (`/storage/{org_id}/{sha256_hash}.jpg`). Guessable incrementing IDs are strictly prohibited.

### Rule 2: Batch Your Model Calls
- Exactly **ONE** model call per unit carrying all 6 compliance checks.
- Never make one call per check. At prep volumes ($0.40 to $1.10/unit fee), multi-call pipelines destroy gross margin.
- Total token cost must remain strictly under **$0.01 per unit inspected**.

### Rule 3: Fail Open
- A vision model error, network partition, or timeout (>800ms) MUST save the capture, create a record marked `status=pending_review`, and return HTTP 202/200 immediately.
- The physical packing station and warehouse operator line MUST NEVER wait.

### Rule 4: UNCERTAIN Is a First-Class Verdict
- `UNCERTAIN` is an explicit, valid outcome, NOT a low-confidence pass.
- **Not visible does not mean missing:** If a barcode or warning label cannot be seen due to lighting, angle, or blur, return `UNCERTAIN` with targeted capture instructions. Never return `FAIL` when evidence is simply missing.

### Rule 5: Look Authoritative Rules Up
- Do not let the AI invent or recall packaging rules from memory.
- Ground truth rules MUST be retrieved from Amazon Seller Central published packaging standards and codified in deterministic Python evaluators.

---

## 2. Forbidden Language & Marketing Hand-Waving

The following phrases are strictly banned in code comments, commit messages, and documentation:

| Banned Phrase | Why It Is Banned | Approved Alternative |
|---|---|---|
| ❌ "Blockchain-backed / Immutable ledger" | We use SHA-256 content hashes and PostgreSQL audit logs. Hand-waving is scored down. | ✅ "SHA-256 hashed audit log" |
| ❌ "AI knows all packaging rules" | AI observes pixels; deterministic Python rules decide compliance. | ✅ "AI extracts observations; authoritative rules decide" |
| ❌ "100% accurate / flawless inspection" | Vision models make errors; overclaiming damages engineering credibility. | ✅ "98.5% precision on held-out test fixtures" |
| ❌ "It works well / works reliably" | Vague claims without empirical data fail evaluation criteria. | ✅ "Evaluated on 50 held-out units with 2-labeller agreement" |
| ❌ "Low-confidence PASS" | Masking uncertainty behind a pass triggers Amazon defect fines. | ✅ "`UNCERTAIN` — targeted retake required" |

---

## 3. Mandatory Knowledge Item (KI) Code Writing Rules

All Python code written in this repository must comply with the workspace Code Writing Standards:

1. **Reduce Before You Write:** If a naive implementation would take 50+ lines, refactor into 10–15 lines using dict dispatch, decorators, or list comprehensions without altering execution logic.
2. **Pydantic-Validated Boundaries:** Pass typed Pydantic models between functions and services; NEVER pass untyped raw `dict` payloads.
3. **Explicit Repository Pattern:** Database operations must use repository classes (`PrepRecordRepo`), avoiding raw inline SQL queries scattered across route handlers.
4. **Single-Responsibility Functions:** Keep functions under 30 lines. One function does exactly one thing.
5. **Structured Logging:** Use structured loggers with context. NEVER commit `print()` statements.
6. **Centralized Configuration:** Always load configuration from `app.core.config.settings`. Never hardcode strings or credentials.

---

## 4. Cross-Pod Interoperability Contract (Recovery Manager)

- All records must carry `unit_id` (`UNIT-0001` ... `UNIT-0100`) as the primary join key across the five pods.
- All prep records must use the prefix `PRP-` for their `record_id` (e.g. `PRP-0002`).
- The output JSON must strictly validate against `contract/prep_evidence_contract.json` so Step 5 (Recovery Manager) can consume the record without manual translation.
