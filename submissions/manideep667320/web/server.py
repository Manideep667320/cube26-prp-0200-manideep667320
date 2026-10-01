"""FastAPI Web Application Server for Prep Manager (Face 5: Evidence Record Page & Operator UI)."""

import sys
from pathlib import Path

# Bootstrap module path
_pkg_root = Path(__file__).resolve().parent.parent
if str(_pkg_root) not in sys.path:
    sys.path.insert(0, str(_pkg_root))

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from agent.config import settings
from agent.schemas import WorkOrder, OperatorOverride, PrepRecord
from agent.service import inspect_prepped_unit
from agent.repository import prep_repo
from agent.tenancy import set_current_org, get_current_org, verify_tenancy_isolation

app = FastAPI(title="Prep Manager Web Station", version="1.0.0")

# Mount static files directory
static_dir = Path(__file__).resolve().parent / "static"
static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


class InspectRequest(BaseModel):
    unit_id: str = "UNIT-0002"
    org_id: str = "org_demo_alpha"
    sku: str = "SKU-CANDLE-3"
    asin: str = "B0DUMMY964"
    fnsku: str = "X00DUMMY002"
    prep_price_usd: float = 0.40
    wo_polybag: bool = False
    wo_suffocation_warning: bool = False
    wo_expiry_date: bool = False
    wo_handling_marks: str = "fragile"
    photo_refs: list[str] = [
        "fixtures/prep/UNIT-0002_front.jpg",
        "fixtures/prep/UNIT-0002_back.jpg",
        "fixtures/prep/UNIT-0002_label.jpg"
    ]
    operator_id: str = "op_amira"


class OverridePayload(BaseModel):
    new_verdict: str
    operator_id: str
    reason: str


@app.middleware("http")
async def tenancy_middleware(request: Request, call_next):
    """Enforce Row-Level Security tenant context on every request (Rule 1)."""
    org_header = request.headers.get("x-org-id", "org_demo_alpha")
    if org_header in settings.allowed_orgs:
        set_current_org(org_header)
    response = await call_next(request)
    return response


@app.get("/api/records")
async def list_records():
    """List compliance records strictly within the active tenant boundary."""
    return [r.model_dump() for r in prep_repo.list_records()]


@app.get("/api/records/{record_id}")
async def get_record(record_id: str):
    """Get single evidence record with visual grounding coordinates."""
    rec = prep_repo.get(record_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found in active tenant organization")
    return rec.model_dump()


@app.post("/api/inspect")
async def inspect_unit(req: InspectRequest):
    """Execute batched inspection and persist compliance evidence record."""
    set_current_org(req.org_id)
    wo = WorkOrder(
        work_order_id="WO-3000",
        unit_id=req.unit_id,
        org_id=req.org_id,
        sku=req.sku,
        asin=req.asin,
        fnsku=req.fnsku,
        prep_price_usd=req.prep_price_usd,
        wo_polybag=req.wo_polybag,
        wo_suffocation_warning=req.wo_suffocation_warning,
        wo_expiry_date=req.wo_expiry_date,
        wo_handling_marks=req.wo_handling_marks
    )
    record = await inspect_prepped_unit(wo, req.photo_refs, operator_id=req.operator_id)
    return record.model_dump()


@app.post("/api/records/{record_id}/override")
async def apply_override(record_id: str, payload: OverridePayload):
    """Apply operator override with mandatory reason (Honesty Rule)."""
    rec = prep_repo.get(record_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found")

    override = OperatorOverride(
        original_verdict=rec.overall_verdict,
        new_verdict=payload.new_verdict,
        operator_id=payload.operator_id,
        reason=payload.reason
    )
    updated = prep_repo.record_override(record_id, override)
    return updated.model_dump()


@app.get("/api/tenancy-test")
async def run_tenancy_test():
    """Verify Engineering Rule 1: org_demo_alpha cannot see org_demo_bravo data."""
    return verify_tenancy_isolation(prep_repo)


@app.get("/", response_class=HTMLResponse)
async def serve_dashboard():
    """Serve the operator packing station UI."""
    index_file = static_dir / "index.html"
    if not index_file.exists():
        return HTMLResponse("<h1>Prep Manager Operator Dashboard Loading...</h1>")
    return HTMLResponse(index_file.read_text(encoding="utf-8"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
