from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.deps import get_current_user
from app.models.models import (
    User, Ride, RideRequest, Message, Rating, RideStatus, Notification,
)
from app.schemas.schemas import RideOut, MessageCreateIn, MessageOut, RatingCreateIn, RatingOut, RequestOut

router = APIRouter(prefix="/api/rides", tags=["rides"])


def _to_ride_out(ride: Ride, current_user_id: str, db: Session) -> RideOut:
    req = db.query(RideRequest).filter(RideRequest.id == ride.request_id).first()
    other_user = ride.responder_id if ride.requester_id == current_user_id else ride.requester_id
    other = db.query(User).filter(User.id == other_user).first()
    out = RideOut.model_validate(ride)
    out.other_user = other
    out.request = RequestOut.model_validate(req)
    out.request.response_count = len(req.responses)
    return out


@router.get("", response_model=list[RideOut])
def list_my_rides(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rides = db.query(Ride).filter(
        (Ride.requester_id == current_user.id) | (Ride.responder_id == current_user.id)
    ).order_by(Ride.created_at.desc()).all()
    return [_to_ride_out(r, current_user.id, db) for r in rides]


@router.get("/{ride_id}", response_model=RideOut)
def get_ride(ride_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Trajet introuvable")
    if current_user.id not in (ride.requester_id, ride.responder_id):
        raise HTTPException(status_code=403, detail="Non autorisé")
    return _to_ride_out(ride, current_user.id, db)


@router.get("/{ride_id}/messages", response_model=list[MessageOut])
def get_messages(ride_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Trajet introuvable")
    if current_user.id not in (ride.requester_id, ride.responder_id):
        raise HTTPException(status_code=403, detail="Non autorisé")
    messages = db.query(Message).filter(Message.ride_id == ride_id).order_by(Message.created_at.asc()).all()
    return [MessageOut.model_validate(m) for m in messages]


@router.post("/{ride_id}/messages", response_model=MessageOut)
def send_message(
    ride_id: str,
    payload: MessageCreateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Trajet introuvable")
    if current_user.id not in (ride.requester_id, ride.responder_id):
        raise HTTPException(status_code=403, detail="Non autorisé")

    msg = Message(ride_id=ride_id, sender_id=current_user.id, content=payload.content, kind=payload.kind)
    db.add(msg)

    other_id = ride.responder_id if current_user.id == ride.requester_id else ride.requester_id
    notif = Notification(
        user_id=other_id,
        type="new_message",
        title=f"Nouveau message de {current_user.full_name}",
        body=payload.content[:80],
        related_id=ride_id,
    )
    db.add(notif)

    db.commit()
    db.refresh(msg)
    return MessageOut.model_validate(msg)


@router.post("/{ride_id}/complete", response_model=RideOut)
def complete_ride(ride_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Trajet introuvable")
    if current_user.id not in (ride.requester_id, ride.responder_id):
        raise HTTPException(status_code=403, detail="Non autorisé")

    ride.status = RideStatus.COMPLETED
    ride.completed_at = datetime.utcnow()
    req = db.query(RideRequest).filter(RideRequest.id == ride.request_id).first()
    if req:
        from app.models.models import RequestStatus
        req.status = RequestStatus.COMPLETED
    db.commit()
    db.refresh(ride)
    return _to_ride_out(ride, current_user.id, db)


@router.post("/{ride_id}/rate", response_model=RatingOut)
def rate_ride(
    ride_id: str,
    payload: RatingCreateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Trajet introuvable")
    if current_user.id not in (ride.requester_id, ride.responder_id):
        raise HTTPException(status_code=403, detail="Non autorisé")
    if payload.stars < 1 or payload.stars > 5:
        raise HTTPException(status_code=400, detail="La note doit être entre 1 et 5")

    ratee_id = ride.responder_id if current_user.id == ride.requester_id else ride.requester_id

    existing = db.query(Rating).filter(Rating.ride_id == ride_id, Rating.rater_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Vous avez déjà noté ce trajet")

    rating = Rating(ride_id=ride_id, rater_id=current_user.id, ratee_id=ratee_id, stars=payload.stars, comment=payload.comment)
    db.add(rating)

    ratee = db.query(User).filter(User.id == ratee_id).first()
    total = ratee.rating_avg * ratee.rating_count + payload.stars
    ratee.rating_count += 1
    ratee.rating_avg = round(total / ratee.rating_count, 2)

    db.commit()
    db.refresh(rating)
    return RatingOut.model_validate(rating)
