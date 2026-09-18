from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_user
from app.models.models import User, Rating, Ride, RideStatus
from app.schemas.schemas import UserOut, UserPublicOut, UserUpdateIn, RatingOut

router = APIRouter(prefix="/api/users", tags=["users"])


@router.put("/me", response_model=UserOut)
def update_me(payload: UserUpdateIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return UserOut.model_validate(current_user)


@router.get("/{user_id}", response_model=UserPublicOut)
def get_user(user_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return UserPublicOut.model_validate(user)


@router.get("/{user_id}/ratings", response_model=list[RatingOut])
def get_user_ratings(user_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ratings = db.query(Rating).filter(Rating.ratee_id == user_id).order_by(Rating.created_at.desc()).all()
    return [RatingOut.model_validate(r) for r in ratings]


@router.get("/{user_id}/rides", response_model=list[str])
def get_user_ride_ids(user_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rides = db.query(Ride).filter(
        ((Ride.requester_id == user_id) | (Ride.responder_id == user_id)),
        Ride.status == RideStatus.COMPLETED,
    ).all()
    return [r.id for r in rides]
