from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session

from app.core.database import get_db, SessionLocal
from app.deps import get_current_user
from app.models.models import (
    User, RideRequest, Response as ResponseModel, RequestStatus,
    VerificationStatus, Notification,
)
from app.schemas.schemas import RequestCreateIn, RequestOut

router = APIRouter(prefix="/api/requests", tags=["requests"])


def _minutes(time_str: str) -> int:
    try:
        h, m = time_str.split(":")
        return int(h) * 60 + int(m)
    except Exception:
        return 0


def _to_out(req: RideRequest) -> RequestOut:
    out = RequestOut.model_validate(req)
    out.response_count = len(req.responses)
    return out


def _notify_matching_users(request_id: str):
    """Broadcast a notification to other verified users about a new request (mock matching)."""
    db = SessionLocal()
    try:
        req = db.query(RideRequest).filter(RideRequest.id == request_id).first()
        if not req:
            return
        candidates = db.query(User).filter(
            User.id != req.requester_id,
            User.verification_status == VerificationStatus.VERIFIED,
        ).all()
        for user in candidates:
            notif = Notification(
                user_id=user.id,
                type="new_request",
                title="Nouvelle demande de covoiturage",
                body=f"{req.requester.full_name} cherche un covoiturage vers {req.destination} à {req.time}",
                related_id=req.id,
            )
            db.add(notif)
        db.commit()
    finally:
        db.close()


@router.post("", response_model=RequestOut)
def create_request(
    payload: RequestCreateIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    req = RideRequest(
        requester_id=current_user.id,
        departure=payload.departure,
        destination=payload.destination,
        date=payload.date,
        time=payload.time,
        seats_needed=payload.seats_needed,
        description=payload.description,
        status=RequestStatus.ACTIVE,
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    background_tasks.add_task(_notify_matching_users, req.id)

    return _to_out(req)


@router.get("", response_model=list[RequestOut])
def list_requests(
    departure: Optional[str] = None,
    destination: Optional[str] = None,
    date: Optional[str] = None,
    time: Optional[str] = None,
    window_minutes: int = Query(30),
    mine: bool = False,
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(RideRequest)

    if mine:
        q = q.filter(RideRequest.requester_id == current_user.id)
    else:
        q = q.filter(RideRequest.requester_id != current_user.id)

    if status_filter:
        q = q.filter(RideRequest.status == status_filter)
    else:
        q = q.filter(RideRequest.status == RequestStatus.ACTIVE)

    if departure:
        q = q.filter(RideRequest.departure.ilike(f"%{departure}%"))
    if destination:
        q = q.filter(RideRequest.destination.ilike(f"%{destination}%"))
    if date:
        q = q.filter(RideRequest.date == date)

    results = q.order_by(RideRequest.created_at.desc()).all()

    if time:
        target = _minutes(time)
        results = [r for r in results if abs(_minutes(r.time) - target) <= window_minutes]

    return [_to_out(r) for r in results]


@router.get("/{request_id}", response_model=RequestOut)
def get_request(request_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    req = db.query(RideRequest).filter(RideRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requête introuvable")
    return _to_out(req)


@router.put("/{request_id}", response_model=RequestOut)
def update_request(
    request_id: str,
    payload: RequestCreateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    req = db.query(RideRequest).filter(RideRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requête introuvable")
    if req.requester_id != current_user.id:
        raise HTTPException(status_code=403, detail="Non autorisé")

    for field, value in payload.model_dump().items():
        setattr(req, field, value)
    db.commit()
    db.refresh(req)
    return _to_out(req)


@router.delete("/{request_id}")
def delete_request(request_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    req = db.query(RideRequest).filter(RideRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requête introuvable")
    if req.requester_id != current_user.id:
        raise HTTPException(status_code=403, detail="Non autorisé")

    req.status = RequestStatus.CANCELLED
    db.commit()
    return {"ok": True}
