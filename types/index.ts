export interface CustomField {
  id: string;
  label: string;
  placeholder?: string;
  required: boolean;
  type: "text" | "number" | "select";
  options?: string[];
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
  poster_url?: string | null;
  organizer_name: string;
  organizer_whatsapp: string;
  organizer_email?: string | null;
  wallet_pending_settlement: number;
  wallet_available: number;
  wallet_total_withdrawn: number;
  scanner_pin: string;
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

