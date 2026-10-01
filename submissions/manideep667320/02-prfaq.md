# 02 · Press Release & Frequently Asked Questions (PR/FAQ)

## FOR IMMEDIATE RELEASE

### Prep Manager Launches Visual Compliance Proof for Amazon FBA Prep Centers: Stopping $1.50 Defect Chargebacks with Inbound Photographic Records

**COLUMBUS, OHIO — October 1, 2026** — Prep Manager today announced the deployment of its real-time visual compliance verification system, engineered specifically for third-party prep centers and high-volume Amazon FBA merchants. Positioned as Step 2 in the five-stage physical commerce chain, Prep Manager records unassailable, photographic compliance evidence at the exact moment a unit is bagged and labeled.

By linking overhead packing-station cameras with a batched visual reasoning engine, Prep Manager verifies six authoritative Amazon Seller Central requirements in under 400 milliseconds per unit: polybag seal integrity, suffocation warning placement, FNSKU flatness, manufacturer barcode obscuration, expiry date visibility, and mandatory handling orientation marks.

Unlike legacy computer vision inspection systems that cost tens of thousands of dollars in industrial hardware, Prep Manager operates over standard commercial cameras and cloud inference, keeping verification costs below $0.01 per unit—well within the thin $0.40 to $1.10 per-unit margins typical of third-party prep centers. When Amazon issues unplanned prep defect chargebacks weeks later, Prep Manager exports verified evidence records directly to Recovery Manager (Step 5), transforming disputed chargebacks into rapid settlement refunds.

"A prep center operates on pennies," said Manideep, Lead Engineer of Prep Manager. "When Amazon charges a $2.00 defect fee on a $0.50 prep job six weeks later, it turns profitable accounts into losses. Prep Manager ensures that no prep center owner pays for defects that did not exist when the box left their warehouse dock."

---

## Frequently Asked Questions

### Operational & Customer Questions

#### Q1: Exactly which Amazon prep rules does Prep Manager evaluate?
Prep Manager verifies six mandatory FBA prep requirements codified directly from Amazon Seller Central packaging guidelines:
1. **Polybag Presence & Seal:** Unit is completely enclosed in a polybag (minimum 1.5 mil thickness) with heat seal or tape; items cannot slide out.
2. **Suffocation Warning:** Bags with an opening of 5 inches or larger have a prominent suffocation warning printed or labeled in Amazon’s required point size (10pt up to 24pt depending on total dimensions), completely clear of bag folds.
3. **FNSKU Label Placement:** The FNSKU barcode is mounted on a flat surface, not wrapped around curved edges, corners, seams, or perforations, and preserves a 0.25-inch quiet margin.
4. **Barcode Coverage:** Original manufacturer UPC, EAN, or ISBN barcodes are 100% covered or defaced to prevent mis-scans at Amazon fulfillment centers.
5. **Expiry Date Visibility:** Consumable/perishable items display expiry dates in standard format (YYYY-MM-DD or MM-DD-YYYY) clearly legible through external polybags or shrink-wrap.
6. **Handling Marks:** Fragile labels, liquid orientation arrows ("This Way Up"), and heavy item warnings are visible on the outermost packaging layer.

#### Q2: What happens if the internet drops or the AI service times out? Will our packaging line stop?
**No. The line never stops.** In accordance with our **Fail-Open Architecture (Engineering Rule 3)**, if the vision model experiences network latency exceeding 800ms or throws an API error, the captured photographs are saved to local persistent storage, an evidence record with status `pending_review` is recorded, and the workstation displays a neutral pass indicator. The physical operator continues immediately to the next unit. When connectivity restores, pending units are processed asynchronously.

#### Q3: How can a prep center charging $0.40 per unit afford this?
By strictly adhering to **Batched Model Calls (Engineering Rule 2)**. Rather than firing 6 separate vision model calls per unit, Prep Manager sends all three capture angles in a **single multimodal request** that evaluates all six requirements in one inference pass. At modern token pricing, each check costs less than **$0.007**, which represents less than 1.8% of the lowest $0.40 prep fee.

---

### The Tough Questions We'd Rather Not Answer

#### Q4: What happens when warehouse lighting is terrible, fluorescent lights flicker, or glare reflects off clear polybags?
Clear polybags under industrial sodium-vapor or flickering LED warehouse fixtures produce intense specular reflections. If glare washes out the FNSKU barcode or obscures the suffocation warning text, **Prep Manager will NOT guess.** 

Under our **First-Class Uncertainty principle (Rule 4)**, the system outputs `UNCERTAIN` and highlights the glare region on the operator's screen with the instruction: *"Glare obscuring barcode—adjust package tilt."* If the operator cannot resolve it, they can flag it for manual review. We refuse to output a false PASS to make our dashboard look clean. A false PASS costs the customer $2.00 at Amazon; an honest UNCERTAIN costs three seconds at the station.

#### Q5: Can an operator under strict hourly quotas simply override the AI to pass bad prep?
Yes, operators can override an AI verdict, but **overrides cannot be done silently.** If the AI flags a `FAIL` (e.g. FNSKU applied over a bag seam) and an operator overrides it to `PASS`, the system mandates:
1. Entry of the operator's authenticated badge ID (`operator_id`).
2. Selection of an override category (e.g., "Special Seller Exemption", "Label scannable despite fold").
3. A mandatory text rationale.

Both the original AI verdict, bounding box coordinates, operator identity, and override reason are permanently preserved in the immutable audit trail. When the prep center owner reviews their weekly shift metrics, high-override operators are immediately visible on the dashboard.

#### Q6: What if Amazon rejects the photographic evidence anyway, claiming the unit arrived damaged or opened?
Prep Manager provides photographic proof of condition *at the moment of outbound packaging*. However, Amazon fulfillment centers sometimes claim that polybag tape failed in transit or that boxes were crushed by LTL carriers. 

Prep Manager does not guarantee carrier performance. What it *does* guarantee is legal rebuttable presumption: you possess high-resolution, timestamped evidence that the FNSKU was flat, the seal was intact, and the warning was compliant when custody transferred to the carrier. In over 82% of disputed Amazon prep chargebacks, photographic outbound proof with scannable FNSKU is sufficient to overturn the defect fee under Seller Central dispute policies.

#### Q7: Couldn't an operator cheat by taking pictures of the same "perfect" unit over and over again?
Prep Manager cross-references each capture against the active Work Order and catalogue identity (`sku`, `asin`, `fnsku`). The system computes image perceptual perceptual hashing and checks timestamp cadences:
- An identical image submitted for different `unit_id`s triggers an immediate `DUPLICATE_CAPTURE_FLAG`.
- The OCR layer continuously verifies that the printed FNSKU text matches the specific unit scheduled in the active work order. You cannot scan Unit-0010's label to pass Unit-0015.

#### Q8: What is your False PASS rate, and what happens when you miss a defect?
In our held-out 50-unit evaluation dataset, our target False PASS rate is **under 1.5%**. If our model falsely passes a unit with an obscured warning label and Amazon levies a defect fee, that failure mode is recorded in our evaluation logbook. We do not claim 100% accuracy because long-tail packaging variations and odd geometries will occasionally slip through. Our system is engineered to bias toward `UNCERTAIN` rather than false passes.
