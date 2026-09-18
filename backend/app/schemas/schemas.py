from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict


# ---------- Auth ----------

class SignupIn(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str
    operator: str = ""
    birth_date: Optional[str] = None
    university: Optional[str] = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class DocumentSubmitIn(BaseModel):
    document_type: str
    document_front_url: str
    document_back_url: Optional[str] = None


# ---------- User ----------

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    full_name: str
    phone: str
    operator: str
    birth_date: Optional[str] = None
    profile_photo_url: Optional[str] = None
    university: Optional[str] = None
    bio: str = ""
    vehicle_type: str
    document_type: Optional[str] = None
    document_front_url: Optional[str] = None
    document_back_url: Optional[str] = None
    document_number: Optional[str] = None
    verification_status: str
    rating_avg: float
    rating_count: int
    two_fa_enabled: bool
    dark_mode: bool
    created_at: datetime


class UserPublicOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    profile_photo_url: Optional[str] = None
    university: Optional[str] = None
    bio: str = ""
    vehicle_type: str
    verification_status: str
    rating_avg: float
    rating_count: int


class UserUpdateIn(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    university: Optional[str] = None
    vehicle_type: Optional[str] = None
    profile_photo_url: Optional[str] = None
    dark_mode: Optional[bool] = None
    two_fa_enabled: Optional[bool] = None


# ---------- Requests ----------

class RequestCreateIn(BaseModel):
    departure: str
    destination: str
    date: str
    time: str
    seats_needed: int = 1
    description: str = ""


class RequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    requester_id: str
    departure: str
    destination: str
    date: str
    time: str
    seats_needed: int
    description: str
    status: str
    created_at: datetime
    requester: UserPublicOut
    response_count: int = 0


# ---------- Responses ----------

class ResponseCreateIn(BaseModel):
    message: str = ""


class ResponseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    request_id: str
    responder_id: str
    message: str
    status: str
    created_at: datetime
    responder: UserPublicOut


# ---------- Rides / Chat ----------

class RideOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    request_id: str
    requester_id: str
    responder_id: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    other_user: Optional[UserPublicOut] = None
    request: Optional[RequestOut] = None


class MessageCreateIn(BaseModel):
    content: str
    kind: str = "text"


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    ride_id: str
    sender_id: str
    content: str
    kind: str
    created_at: datetime


# ---------- Ratings ----------

class RatingCreateIn(BaseModel):
    stars: int
    comment: str = ""


class RatingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    ride_id: str
    rater_id: str
    ratee_id: str
    stars: int
    comment: str
    created_at: datetime


# ---------- Notifications ----------

class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    type: str
    title: str
    body: str
    related_id: Optional[str] = None
    is_read: bool
    created_at: datetime


TokenOut.model_rebuild()
