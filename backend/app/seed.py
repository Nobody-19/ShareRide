from datetime import datetime, timedelta

from app.core.database import SessionLocal, engine, Base
from app.core.security import hash_password
from app.models.models import (
    User, RideRequest, VerificationStatus, DocumentType, VehicleType, RequestStatus,
)


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            return

        tomorrow = (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%d")
        today = datetime.utcnow().strftime("%Y-%m-%d")

        users_data = [
            dict(
                email="ahmed@ipnet.tg", full_name="Ahmed Diallo", phone="+228 90 12 34 56",
                operator="Moov", university="IPNET", vehicle_type=VehicleType.MOTO,
                bio="Étudiant IPNET, sympa et ponctuel. Je fais le trajet tous les jours.",
                rating_avg=4.9, rating_count=27,
            ),
            dict(
                email="amara@ul.tg", full_name="Amara Kokou", phone="+228 91 23 45 67",
                operator="Togocom", university="Université de Lomé", vehicle_type=VehicleType.VOITURE,
                bio="Étudiante en droit à l'UL. Voiture climatisée, 3 places dispo.",
                rating_avg=4.7, rating_count=19,
            ),
            dict(
                email="kofi@polytech.tg", full_name="Kofi Mensah", phone="+228 92 34 56 78",
                operator="Moov", university="Polytechnique", vehicle_type=VehicleType.MOTO,
                bio="Étudiant en génie civil. Trajet Agoè - Polytech tous les matins.",
                rating_avg=4.6, rating_count=14,
            ),
            dict(
                email="ama@ul.tg", full_name="Ama Sefako", phone="+228 93 45 67 89",
                operator="Togocom", university="Université de Lomé", vehicle_type=VehicleType.VOITURE,
                bio="Étudiante en économie. J'aime la musique et la bonne compagnie en route.",
                rating_avg=4.8, rating_count=32,
            ),
        ]

        created_users = []
        for u in users_data:
            user = User(
                **u,
                password_hash=hash_password("password123"),
                document_type=DocumentType.CARTE_ETUDIANT,
                document_front_url="/uploads/mock-doc-front.jpg",
                document_back_url="/uploads/mock-doc-back.jpg",
                document_number=f"TG{hash(u['email']) % 90000000 + 10000000}",
                verification_status=VerificationStatus.VERIFIED,
            )
            db.add(user)
            created_users.append(user)
        db.commit()
        for u in created_users:
            db.refresh(u)

        ahmed, amara, kofi, ama = created_users

        requests_data = [
            dict(
                requester_id=ahmed.id, departure="Cité OUA", destination="Université de Lomé",
                date=today, time="07:00", seats_needed=2,
                description="Je pars du campus, je peux prendre 2 passagers en moto (chacun son tour).",
            ),
            dict(
                requester_id=kofi.id, departure="Agoè", destination="Gare routière",
                date=today, time="08:30", seats_needed=1,
                description="Besoin d'aller à la gare routière, urgent.",
            ),
            dict(
                requester_id=amara.id, departure="Cité OUA", destination="Université de Lomé",
                date=tomorrow, time="07:15", seats_needed=3,
                description="Flexible sur l'horaire, voiture climatisée.",
            ),
        ]
        for r in requests_data:
            db.add(RideRequest(**r, status=RequestStatus.ACTIVE))
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
