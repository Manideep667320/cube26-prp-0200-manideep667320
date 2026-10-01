# 01 · Customer Letter

**To:** Dave Miller, Owner & General Manager, Apex Prep & 3PL Services, Columbus, Ohio  
**From:** Manideep, Lead Systems Engineer, Prep Manager  
**Date:** October 1, 2026  
**Subject:** Protecting your $0.40 margin: Proof before the box leaves the dock

---

Dear Dave,

Every month, your prep center bags, labels, and boxes between 45,000 and 70,000 units for Amazon FBA sellers. You charge between $0.40 and $1.10 per unit. Out of that margin, you pay for polybags, thermal labels, warehouse rent, labor, and utilities. At the end of the day, your take-home margin on a unit is often less than fifteen cents.

And then the Amazon Inbound Performance Fee report hits.

Six weeks after an inbound LTL shipment leaves your dock for the Charlotte or Rialto fulfillment center, Amazon deducts $1,840 from your client’s settlement disbursement. Amazon claims that 920 units had "missing suffocation warnings" or "unscannable FNSKU barcodes," charging a $2.00 per-unit unplanned prep defect fee. 

Your client calls you furious. They want an immediate credit on their invoice. You pull Work Order `WO-3000`. You know your pack line did the job. Amira and Fatima have worked your stations for three years; they know that a polybag opening over five inches requires a printed warning or a label. 

**But all you have is your word and a piece of paper.** You have no photographs. You have no proof. And Amazon does not accept "we always bag those" as evidence in a Seller Central dispute case. You end up swallowing the fee or losing a $15,000/month client.

### What Prep Manager does at your packing station

Prep Manager turns your pack station into an evidence-generating machine without slowing your line down by a single second.

As Amira bags and labels a unit, the overhead high-resolution camera captures three quick angles—front, back seam, and label close-up. In under 400 milliseconds, our batched vision engine runs a single pass across Amazon’s published FBA packaging specifications:

1. **Polybag Presence & Seal:** Confirms the unit is fully enclosed and heat-sealed or taped securely.
2. **Suffocation Warning:** Verifies the warning is printed or labeled in the mandatory font size and not concealed in a fold.
3. **FNSKU Placement:** Confirms the barcode is flat on the widest face, not curved around an edge or split across a seam.
4. **Barcode Coverage:** Verifies that the manufacturer's original UPC/EAN is completely obscured to prevent receiving mis-scans.
5. **Expiry Date Visibility:** Confirms that perishable or consumable expiry dates remain clearly legible through the polybag.
6. **Handling Marks:** Verifies required "Fragile", "Liquid", or "This Way Up" orientation markings.

### The two rules we will never break in your warehouse

1. **The line never stops (Fail-Open):** If our vision service ever experiences a network hiccup or timeout, the photo capture is saved immediately, the record is flagged as `pending_review`, and the screen displays a green pass-through light. Your operators never stand idle waiting for a spinning wheel.
2. **We never guess:** If a photo is blurry or an angle is occluded, the system reports **`UNCERTAIN`**. It tells the operator specifically: *"Suffocation warning obscured by glare—tilt package 15 degrees."* It never falsely passes a bad unit, and it never falsely fails good work.

### The payoff: $0.007 per check to save thousands in chargebacks

A single automated check costs under **$0.007** in API compute—less than 1.5% of your lowest $0.40 prep fee. 

When Amazon files an unplanned prep defect six weeks from now, you won't argue. With one click, your client forwards our cryptographically timestamped evidence record (`PRP-XXXX`) to **Recovery Manager** (the dispute recovery agent), which submits the high-resolution photo with bounding-box proof directly to Amazon Seller Support. The dispute is settled in your favor within 48 hours.

You shouldn't have to pay for defects that did not exist when the shipment left your building. Let’s put the proof on your side.

Sincerely,

**Manideep**  
Lead Engineer, Prep Manager  
*Cube Buildathon · Commerce Context Stream*
