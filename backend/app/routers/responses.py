from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_user
from app.models.models import (
    User, RideRequest, Response as ResponseModel, ResponseStatus,
    RequestStatus, Ride, RideStatus, Notification, VerificationStatus,
)
from app.schemas.schemas import ResponseCreateIn, ResponseOut, RideOut, RequestOut

router = APIRouter(prefix="/api", tags=["responses"])


@router.post("/requests/{request_id}/respond", response_model=ResponseOut)
def respond_to_request(
    request_id: str,
    payload: ResponseCreateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    req = db.query(RideRequest).filter(RideRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requête introuvable")
    if req.requester_id == current_user.id:
        raise HTTPException(status_code=400, detail="Vous ne pouvez pas répondre à votre propre requête")
    if req.status != RequestStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Cette requête n'est plus active")

    existing = db.query(ResponseModel).filter(
        ResponseModel.request_id == request_id,
        ResponseModel.responder_id == current_user.id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Vous avez déjà répondu à cette requête")

    resp = ResponseModel(request_id=request_id, responder_id=current_user.id, message=payload.message)
    db.add(resp)

    notif = Notification(
        user_id=req.requester_id,
        type="new_response",
        title=f"{current_user.full_name} a répondu à ta requête",
        body=f"Vers {req.destination}, {req.time}",
        related_id=req.id,
    )
    db.add(notif)

    db.commit()
    db.refresh(resp)
    return ResponseOut.model_validate(resp)


@router.get("/requests/{request_id}/responses", response_model=list[ResponseOut])
def list_responses(request_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    req = db.query(RideRequest).filter(RideRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requête introuvable")
    responses = db.query(ResponseModel).filter(ResponseModel.request_id == request_id).order_by(
        ResponseModel.created_at.desc()
    ).all()
    return [ResponseOut.model_validate(r) for r in responses]


@router.post("/responses/{response_id}/confirm", response_model=RideOut)
def confirm_response(response_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resp = db.query(ResponseModel).filter(ResponseModel.id == response_id).first()
    if not resp:
        raise HTTPException(status_code=404, detail="Réponse introuvable")
    req = db.query(RideRequest).filter(RideRequest.id == resp.request_id).first()
    if req.requester_id != current_user.id:
        raise HTTPException(status_code=403, detail="Non autorisé")

    resp.status = ResponseStatus.CONFIRMED
    req.status = RequestStatus.MATCHED

    ride = Ride(
        request_id=req.id,
        response_id=resp.id,
        requester_id=req.requester_id,
        responder_id=resp.responder_id,
    )
    db.add(ride)

    notif = Notification(
        user_id=resp.responder_id,
        type="ride_confirmed",
        title="Covoiturage confirmé !",
        body=f"{current_user.full_name} a confirmé ton offre pour {req.destination}",
        related_id=req.id,
    )
    db.add(notif)

    db.commit()
    db.refresh(ride)

    other_user = resp.responder if ride.requester_id == current_user.id else req.requester
    out = RideOut.model_validate(ride)
    out.other_user = other_user
    out.request = RequestOut.model_validate(req)
    out.request.response_count = len(req.responses)
    return out


@router.post("/responses/{response_id}/reject", response_model=ResponseOut)
def reject_response(response_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resp = db.query(ResponseModel).filter(ResponseModel.id == response_id).first()
    if not resp:
        raise HTTPException(status_code=404, detail="Réponse introuvable")
    req = db.query(RideRequest).filter(RideRequest.id == resp.request_id).first()
    if req.requester_id != current_user.id:
        raise HTTPException(status_code=403, detail="Non autorisé")

    resp.status = ResponseStatus.REJECTED
    db.commit()
    db.refresh(resp)
    return ResponseOut.model_validate(resp)
