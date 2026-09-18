import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Column, String, Boolean, DateTime, Float, Integer, ForeignKey, Enum, Text
)
from sqlalchemy.orm import relationship

from app.core.database import Base


def gen_id() -> str:
    return str(uuid.uuid4())


class VerificationStatus(str, enum.Enum):
    UNSUBMITTED = "unsubmitted"
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class DocumentType(str, enum.Enum):
    CARTE_NATIONALE = "carte_nationale"
    CARTE_ETUDIANT = "carte_etudiant"


class VehicleType(str, enum.Enum):
    MOTO = "moto"
    VOITURE = "voiture"
    AUCUN = "aucun"


class RequestStatus(str, enum.Enum):
    ACTIVE = "active"
    MATCHED = "matched"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ResponseStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"


class RideStatus(str, enum.Enum):
    UPCOMING = "upcoming"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_id)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    operator = Column(String, default="")  # OrangeCI, Moov
    birth_date = Column(String, nullable=True)
    profile_photo_url = Column(String, nullable=True)
    university = Column(String, nullable=True)
    bio = Column(String, default="")
    vehicle_type = Column(Enum(VehicleType), default=VehicleType.AUCUN)

    document_type = Column(Enum(DocumentType), nullable=True)
    document_front_url = Column(String, nullable=True)
    document_back_url = Column(String, nullable=True)
    document_number = Column(String, nullable=True)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.UNSUBMITTED)

    rating_avg = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)

    two_fa_enabled = Column(Boolean, default=False)
    dark_mode = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    requests = relationship("RideRequest", back_populates="requester", cascade="all, delete-orphan")
    responses = relationship("Response", back_populates="responder", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class RideRequest(Base):
    __tablename__ = "requests"

    id = Column(String, primary_key=True, default=gen_id)
    requester_id = Column(String, ForeignKey("users.id"), nullable=False)

    departure = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    date = Column(String, nullable=False)  # YYYY-MM-DD
    time = Column(String, nullable=False)  # HH:MM
    seats_needed = Column(Integer, default=1)
    description = Column(String, default="")
    status = Column(Enum(RequestStatus), default=RequestStatus.ACTIVE)

    created_at = Column(DateTime, default=datetime.utcnow)

    requester = relationship("User", back_populates="requests")
    responses = relationship("Response", back_populates="request", cascade="all, delete-orphan")


class Response(Base):
    __tablename__ = "responses"

    id = Column(String, primary_key=True, default=gen_id)
    request_id = Column(String, ForeignKey("requests.id"), nullable=False)
    responder_id = Column(String, ForeignKey("users.id"), nullable=False)
    message = Column(String, default="")
    status = Column(Enum(ResponseStatus), default=ResponseStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("RideRequest", back_populates="responses")
    responder = relationship("User", back_populates="responses")


class Ride(Base):
    __tablename__ = "rides"

    id = Column(String, primary_key=True, default=gen_id)
    request_id = Column(String, ForeignKey("requests.id"), nullable=False)
    response_id = Column(String, ForeignKey("responses.id"), nullable=False)
    requester_id = Column(String, ForeignKey("users.id"), nullable=False)
    responder_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(RideStatus), default=RideStatus.UPCOMING)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=gen_id)
    ride_id = Column(String, ForeignKey("rides.id"), nullable=False)
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    kind = Column(String, default="text")  # text, location, system
    created_at = Column(DateTime, default=datetime.utcnow)


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(String, primary_key=True, default=gen_id)
    ride_id = Column(String, ForeignKey("rides.id"), nullable=False)
    rater_id = Column(String, ForeignKey("users.id"), nullable=False)
    ratee_id = Column(String, ForeignKey("users.id"), nullable=False)
    stars = Column(Integer, nullable=False)
    comment = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=gen_id)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    body = Column(String, default="")
    related_id = Column(String, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")
