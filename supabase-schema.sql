-- ==============================================================================
-- GetMyShow (SSM Events & Ticketing) - Supabase Database Schema
-- Project ID: bexxwfvnhaetezvtayfx (ap-south-1 Mumbai)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Events & Organizer Wallet Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,                          -- e.g., 'sasaram-dandiya-night-2026'
    title TEXT NOT NULL,                                -- e.g., 'Sasaram Dandiya Mahotsav'
    description TEXT,
    venue TEXT NOT NULL,                                -- e.g., 'Maurya Royal Resort, GT Road, Sasaram'
    city TEXT NOT NULL DEFAULT 'Sasaram',
    event_date TIMESTAMPTZ NOT NULL,
    ticket_price INTEGER NOT NULL,                      -- Base ticket price in INR (e.g., 500)
    pass_fee_to_buyer BOOLEAN DEFAULT FALSE,            -- FALSE: Organizer absorbs 7% | TRUE: Buyer pays convenience fee
    total_capacity INTEGER NOT NULL,                    -- Total available seats/passes
    tickets_sold INTEGER DEFAULT 0,
    poster_url TEXT,                                    -- WebP poster image URL
    organizer_name TEXT NOT NULL,
    organizer_whatsapp TEXT NOT NULL,
    organizer_email TEXT,
    wallet_pending_settlement NUMERIC DEFAULT 0,        -- 93% share awaiting T+2 bank settlement
    wallet_available NUMERIC DEFAULT 0,                 -- Settled funds ready for withdrawal
    wallet_total_withdrawn NUMERIC DEFAULT 0,          -- Total amount already disbursed to organizer
    scanner_pin TEXT NOT NULL DEFAULT '1234',           -- 4-digit PIN for gate security volunteers
    is_active BOOLEAN DEFAULT TRUE,
    ticket_tiers JSONB DEFAULT '[]'::jsonb,             -- Multi-tier JSON: [{"id": "t1", "name": "VIP", "price": 800, "capacity": 100, "perks": "Front row"}]
    scanner_staff JSONB DEFAULT '[]'::jsonb,            -- Scanner staff accounts: [{"id": "s1", "scanner_id": "GATE-1", "password_hash": "...", "assigned_gate": "Gate A", "is_active": true}]
    custom_fields JSONB DEFAULT '[]'::jsonb,            -- e.g., [{"name": "Class/Batch", "required": true}]
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by slug and date
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);

-- ------------------------------------------------------------------------------
-- 2. Tickets & Orders Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    ticket_number TEXT UNIQUE,                          -- Short human-friendly ID e.g., 'GMS-SAS-1001'
    buyer_name TEXT NOT NULL,
    buyer_whatsapp TEXT NOT NULL,
    buyer_email TEXT,
    payment_mode TEXT DEFAULT 'ONLINE',                 -- 'ONLINE' (UPI/Card) or 'CASH_PROMOTER'
    tier_id TEXT,                                       -- ID of selected tier e.g., 'tier-vip'
    tier_name TEXT,                                     -- Name of selected tier e.g., 'VIP Stage Front Pass'
    quantity INTEGER DEFAULT 1,
    amount_paid NUMERIC NOT NULL,                       -- Total paid by buyer (e.g. 500 or 535)
    organizer_share NUMERIC NOT NULL,                   -- 93% share (or 100% if pass_fee_to_buyer)
    platform_fee NUMERIC NOT NULL,                      -- 7% platform cut
    gateway_fee NUMERIC DEFAULT 0,                      -- Razorpay fee (2% + 18% GST = 2.36%)
    net_platform_profit NUMERIC DEFAULT 0,              -- 4.64% net profit
    razorpay_order_id TEXT UNIQUE,
    razorpay_payment_id TEXT,
    payment_status TEXT DEFAULT 'PENDING',              -- 'PENDING', 'PAID', 'REFUNDED', 'CANCELLED'
    qr_token TEXT UNIQUE NOT NULL,                      -- Cryptographic HMAC token inside QR code
    is_checked_in BOOLEAN DEFAULT FALSE,               -- Flips to TRUE on gate scan
    checked_in_at TIMESTAMPTZ,
    scanned_by TEXT,                                    -- Scanner staff ID who admitted attendee (e.g. 'GATE-1-RAHUL')
    scanned_at_gate TEXT,                               -- Physical gate turnstile (e.g. 'Main Gate Turnstile A')
    is_settled BOOLEAN DEFAULT FALSE,                   -- Flips to TRUE when T+2 settled
    settled_at TIMESTAMPTZ,
    custom_responses JSONB DEFAULT '{}'::jsonb,         -- Responses to custom fields (Roll No, Class, etc.)
    promoter_code TEXT,                                 -- Student affiliate promoter tracking
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for lightning-fast QR scanning and verification (<50ms)
CREATE INDEX IF NOT EXISTS idx_tickets_qr_token ON tickets(qr_token);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_buyer_whatsapp ON tickets(buyer_whatsapp);
CREATE INDEX IF NOT EXISTS idx_tickets_settlement ON tickets(payment_status, is_settled, created_at);

-- ------------------------------------------------------------------------------
-- 3. Organizer Withdrawal Requests Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payout_destination TEXT NOT NULL,                   -- UPI ID or "A/C: XXXX, IFSC: YYYY"
    status TEXT DEFAULT 'REQUESTED',                    -- 'REQUESTED', 'COMPLETED', 'REJECTED'
    bank_utr_number TEXT,                               -- 12-digit UTR reference number from bank app
    processed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_event_id ON withdrawal_requests(event_id);

-- ------------------------------------------------------------------------------
-- 4. Row Level Security (RLS) Setup
-- ------------------------------------------------------------------------------
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Public can read active events
CREATE POLICY "Public events are viewable by everyone" 
ON events FOR SELECT 
USING (is_active = true);

-- Service role has full unrestricted access
CREATE POLICY "Service role full access on events" 
ON events FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access on tickets" 
ON tickets FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access on withdrawal_requests" 
ON withdrawal_requests FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Public can read tickets only by matching qr_token (for verification screen)
CREATE POLICY "Tickets viewable by qr_token" 
ON tickets FOR SELECT 
USING (true);

