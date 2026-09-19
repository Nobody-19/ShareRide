export type VerificationStatus = "unsubmitted" | "pending" | "verified" | "rejected";
export type DocumentType = "carte_nationale" | "carte_etudiant";
export type VehicleType = "moto" | "voiture" | "aucun";
export type RequestStatus = "active" | "matched" | "completed" | "cancelled";
export type ResponseStatus = "pending" | "confirmed" | "rejected";
export type RideStatus = "upcoming" | "completed" | "cancelled";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  operator: string;
  birth_date?: string | null;
  profile_photo_url?: string | null;
  university?: string | null;
  bio: string;
  vehicle_type: VehicleType;
  document_type?: DocumentType | null;
  document_front_url?: string | null;
  document_back_url?: string | null;
  document_number?: string | null;
  verification_status: VerificationStatus;
  rating_avg: number;
  rating_count: number;
  two_fa_enabled: boolean;
  dark_mode: boolean;
  created_at: string;
}

export interface UserPublic {
  id: string;
  full_name: string;
  profile_photo_url?: string | null;
  university?: string | null;
  bio: string;
  vehicle_type: VehicleType;
  verification_status: VerificationStatus;
  rating_avg: number;
  rating_count: number;
}

export interface RideRequest {
  id: string;
  requester_id: string;
  departure: string;
  destination: string;
  date: string;
  time: string;
  seats_needed: number;
  description: string;
  status: RequestStatus;
  created_at: string;
  requester: UserPublic;
  response_count: number;
  taxi_fare_estimate?: number | null;
  suggested_price?: number | null;
}

export interface RideResponse {
  id: string;
  request_id: string;
  responder_id: string;
  message: string;
  status: ResponseStatus;
  created_at: string;
  responder: UserPublic;
}

export interface Ride {
  id: string;
  request_id: string;
  requester_id: string;
  responder_id: string;
  status: RideStatus;
  created_at: string;
  completed_at?: string | null;
  other_user: UserPublic;
  request: RideRequest;
}

export interface Message {
  id: string;
  ride_id: string;
  sender_id: string;
  content: string;
  kind: "text" | "location" | "system";
  created_at: string;
}

export interface Rating {
  id: string;
  ride_id: string;
  rater_id: string;
  ratee_id: string;
  stars: number;
  comment: string;
  created_at: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  related_id?: string | null;
  is_read: boolean;
  created_at: string;
}
