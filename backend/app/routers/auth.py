import os
import random
import time
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.config import UPLOAD_DIR
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.deps import get_current_user
from app.models.models import User, VerificationStatus, DocumentType
from app.schemas.schemas import SignupIn, LoginIn, TokenOut, UserOut, DocumentSubmitIn

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=TokenOut)
def signup(payload: SignupIn, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name,
        phone=payload.phone,
        operator=payload.operator,
        birth_date=payload.birth_date,
        university=payload.university,
        verification_status=VerificationStatus.UNSUBMITTED,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})
    return TokenOut(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    token = create_access_token({"sub": user.id})
    return TokenOut(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)


@router.post("/upload-file")
def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    fname = f"{uuid.uuid4()}{ext}"
    dest = UPLOAD_DIR / fname
    with open(dest, "wb") as f:
        f.write(file.file.read())
    return {"url": f"/uploads/{fname}"}


def _mock_verify_documents(user_id: str):
    """Simulates async OCR verification pipeline for the demo."""
    from app.core.database import SessionLocal

    time.sleep(4)
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user and user.verification_status == VerificationStatus.PENDING:
            user.verification_status = VerificationStatus.VERIFIED
            db.commit()
    finally:
        db.close()


@router.post("/verify-documents", response_model=UserOut)
def submit_documents(
    payload: DocumentSubmitIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        doc_type = DocumentType(payload.document_type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Type de document invalide")

    current_user.document_type = doc_type
    current_user.document_front_url = payload.document_front_url
    current_user.document_back_url = payload.document_back_url
    current_user.document_number = f"TG{random.randint(10000000, 99999999)}"
    current_user.verification_status = VerificationStatus.PENDING
    db.commit()
    db.refresh(current_user)

    background_tasks.add_task(_mock_verify_documents, current_user.id)

    return UserOut.model_validate(current_user)


@router.get("/verify-status")
def verify_status(current_user: User = Depends(get_current_user)):
    return {"status": current_user.verification_status, "document_number": current_user.document_number}
