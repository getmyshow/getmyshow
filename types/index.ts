export interface CustomField {
  id: string;
  label: string;
  placeholder?: string;
  required: boolean;
  type: "text" | "number" | "select";
  options?: string[];
}

export interface TicketTier {
  id: string;
  name: string; // e.g. "General Admission", "VIP Stage Front Pass", "Student Pass"
  price: number; // e.g. 300, 800
  capacity: number; // e.g. 400, 100
  tickets_sold: number;
  perks?: string; // e.g. "Front-row seats + backstage pass"
  badge_color?: "indigo" | "saffron" | "emerald";
}

export interface ScannerStaff {
  id: string;
  event_id: string;
  scanner_id: string; // e.g. "GATE-A-RAHUL" or "BOUNCER-01"
  password_hash: string;
  assigned_gate: string; // e.g. "Main Gate Turnstile A", "VIP Stage Gate"
  is_active: boolean;
  scanned_count: number;
  created_at: string;
  last_active_at?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  venue: string;
  city: string;
  event_date: string;
  ticket_price: number;
  pass_fee_to_buyer: boolean;
  total_capacity: number;
  tickets_sold: number;
  ticket_tiers?: TicketTier[];
  poster_url?: string | null;
  organizer_name: string;
  organizer_whatsapp: string;
  organizer_email?: string | null;
  wallet_pending_settlement: number;
  wallet_available: number;
  wallet_total_withdrawn: number;
  scanner_pin: string;
  scanner_staff?: ScannerStaff[];
  custom_fields?: CustomField[];
  is_active: boolean;
  created_at: string;
}

export interface TicketOrder {
  id: string;
  event_id: string;
  ticket_number?: string;
  buyer_name: string;
  buyer_whatsapp: string;
  buyer_email?: string | null;
  payment_mode: "ONLINE" | "CASH_PROMOTER";
  tier_id?: string;
  tier_name?: string;
  quantity: number;
  amount_paid: number;
  organizer_share: number;
  platform_fee: number;
  gateway_fee?: number;
  net_platform_profit?: number;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  payment_status: "PENDING" | "PAID" | "REFUNDED" | "CANCELLED";
  qr_token: string;
  is_checked_in: boolean;
  checked_in_at?: string | null;
  scanned_by?: string | null;
  scanned_at_gate?: string | null;
  is_settled?: boolean;
  settled_at?: string | null;
  custom_responses?: Record<string, string>;
  promoter_code?: string | null;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  event_id: string;
  amount: number;
  payout_destination: string;
  status: "REQUESTED" | "COMPLETED" | "REJECTED";
  bank_utr_number?: string | null;
  processed_at?: string | null;
  created_at: string;
}

export type ActionResult<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; code?: string };


