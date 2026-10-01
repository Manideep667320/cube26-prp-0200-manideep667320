# manideep667320 · Prep Manager

**Cube Buildathon · Round 2 Individual Build · Commerce Context Stream**  
**Participant:** Manideep (`manideep667320`)  
**Position in Chain:** Step 2 of 5 (Inbound to Amazon)  
**Primary Downstream Consumer:** Recovery Manager (disputed Amazon prep fee chargebacks)

---

## Deliverables Index

```text
submissions/manideep667320/
├── README.md                  ← Index of deliverables, architecture summary, and progress tracker
├── 01-customer-letter.md      ← Direct letter to prep center owner operating at $0.40–$1.10/unit
├── 02-prfaq.md                ← Customer & operational PR/FAQ (including hard operational questions)
├── 03-one-pager.md            ← Performance metrics table + explicit Kill Condition
├── CLAUDE.md                  ← Durable engineering constraints, non-negotiable rules, forbidden language
├── build-brief.md             ← Problem statement, technical strategy, and architectural decisions
├── build-log.md               ← Chronological engineering build log and findings
├── eval-report.md             ← Held-out 50-unit eval results, 2-labeller agreement, FP/FN breakdown
├── contract/
│   └── prep_evidence_contract.json ← Cross-pod evidence contract for Recovery Manager
└── agent/                     ← Production headless agent core
    ├── config.py              ← Centralized environment configuration
    ├── tenancy.py             ← PostgreSQL Row-Level Security & tenant scoping
    ├── fail_open.py           ← Fail-open decorator (status=pending_review)
    ├── amazon_rules.py        ← Deterministic Amazon FBA prep rules engine
    ├── vlm_client.py          ← Batched single-call multimodal VLM client
    └── runner.py              ← CLI test runner executing over fixture captures
```

---

## Build Status Tracker

| Face | Deliverable | Status | Evidence Link |
|---|---|:---:|---|
| **1** | Customer Letter, PR/FAQ, One-Pager | ☑ Completed | [01-customer-letter.md](01-customer-letter.md), [02-prfaq.md](02-prfaq.md), [03-one-pager.md](03-one-pager.md) |
| **2** | CLAUDE.md (Durable Constraints) | ☑ Completed | [CLAUDE.md](CLAUDE.md) |
| **3** | Headless Agent on Fixtures | ☑ Completed | [agent/](agent/) (Passed 5/5 unit tests) |

| **4** | Eval Report (50 Held-Out Units) | ☑ Completed | [eval-report.md](eval-report.md) (0.0% False PASS) |

| **5** | Evidence Record Page & Operator UI | ☑ Completed | [web/](web/) (FastAPI + Packing Station UI) |

| **6** | Cross-Pod Contract (Recovery Manager) | ☑ Completed | [contract/prep_evidence_contract.json](contract/prep_evidence_contract.json) |

---

## Kill Condition

> **If the agent's False PASS rate exceeds 1.5% on authoritative FBA requirements, or if the batched inference cost exceeds $0.02 per unit inspected (eroding more than 5% of the minimum $0.40/unit prep fee), the system is killed.**
