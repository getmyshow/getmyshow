-- ==============================================================================
-- GetMyShow Platform - Master Production Database Setup & Seed
-- Run this in your Supabase SQL Editor (Project ID: bexxwfvnhaetezvtayfx)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Events & Organizer Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    venue TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Sasaram',
    event_date TIMESTAMPTZ NOT NULL,
    ticket_price INTEGER NOT NULL,
    pass_fee_to_buyer BOOLEAN DEFAULT FALSE,
    total_capacity INTEGER NOT NULL,
    tickets_sold INTEGER DEFAULT 0,
    poster_url TEXT,
    organizer_name TEXT NOT NULL,
    organizer_whatsapp TEXT NOT NULL,
    organizer_email TEXT,
    wallet_pending_settlement NUMERIC DEFAULT 0,
    wallet_available NUMERIC DEFAULT 0,
    wallet_total_withdrawn NUMERIC DEFAULT 0,
    scanner_pin TEXT NOT NULL DEFAULT '1234',
    is_active BOOLEAN DEFAULT TRUE,
    custom_fields JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_city ON public.events(city);

-- 3. Tickets & Orders Table
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    ticket_number TEXT UNIQUE,
    buyer_name TEXT NOT NULL,
    buyer_whatsapp TEXT NOT NULL,
    buyer_email TEXT,
    payment_mode TEXT DEFAULT 'ONLINE',
    quantity INTEGER DEFAULT 1,
    amount_paid NUMERIC NOT NULL,
    organizer_share NUMERIC NOT NULL,
    platform_fee NUMERIC NOT NULL,
    gateway_fee NUMERIC DEFAULT 0,
    net_platform_profit NUMERIC DEFAULT 0,
    razorpay_order_id TEXT UNIQUE,
    razorpay_payment_id TEXT,
    payment_status TEXT DEFAULT 'PENDING',
    qr_token TEXT UNIQUE NOT NULL,
    is_checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ,
    custom_responses JSONB DEFAULT '{}'::jsonb,
    promoter_code TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tickets_qr_token ON public.tickets(qr_token);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_whatsapp ON public.tickets(buyer_whatsapp);

-- 4. Organizer Withdrawal Requests Table
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payout_destination TEXT NOT NULL,
    status TEXT DEFAULT 'REQUESTED',
    bank_utr_number TEXT,
    processed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_event_id ON public.withdrawal_requests(event_id);

-- 5. Row Level Security Policies
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Allow public read of active events
DROP POLICY IF EXISTS "Public events are viewable by everyone" ON public.events;
CREATE POLICY "Public events are viewable by everyone" 
ON public.events FOR SELECT USING (is_active = true);

-- Allow public read of tickets by matching qr_token
DROP POLICY IF EXISTS "Tickets viewable by qr_token" ON public.tickets;
CREATE POLICY "Tickets viewable by qr_token" 
ON public.tickets FOR SELECT USING (true);

-- Allow full unrestricted access for backend service role
DROP POLICY IF EXISTS "Service role full access on events" ON public.events;
CREATE POLICY "Service role full access on events" 
ON public.events FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access on tickets" ON public.tickets;
CREATE POLICY "Service role full access on tickets" 
ON public.tickets FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access on withdrawal_requests" ON public.withdrawal_requests;
CREATE POLICY "Service role full access on withdrawal_requests" 
ON public.withdrawal_requests FOR ALL USING (true);

-- 6. Atomic Increment Function for Tickets Sold
CREATE OR REPLACE FUNCTION public.increment_tickets_sold(
    event_id_param UUID,
    qty_param INTEGER,
    organizer_share_param NUMERIC
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.events
    SET 
        tickets_sold = tickets_sold + qty_param,
        wallet_pending_settlement = wallet_pending_settlement + organizer_share_param,
        updated_at = now()
    WHERE id = event_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Seed Real High-Demand Events in Sasaram, Dehri, and Bihar
INSERT INTO public.events (
    id, slug, title, description, venue, city, event_date, 
    ticket_price, pass_fee_to_buyer, total_capacity, tickets_sold, 
    poster_url, organizer_name, organizer_whatsapp, scanner_pin,
    wallet_pending_settlement, wallet_available, wallet_total_withdrawn,
    custom_fields
) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'sasaram-jee-neet-scholarship-seminar-2026',
    'Super 50 Talent Scholarship Test & Career Seminar',
    'Annual career seminar and scholarship test for Class 10th, 11th & 12th aspirants in Sasaram & Rohtas. Top 50 rankers get 100% free coaching fee waiver.\n\nKey Highlights:\n• Interactive Q&A with ex-IITians & doctors\n• Personalized career counseling blueprint\n• Complimentary formula handbook & mock test papers\n\nEntry Guidelines:\n• Please carry a valid school ID card\n• Arrive 30 minutes prior to gate closing\n• Entry strictly by cryptographic QR ticket pass on your phone',
    'Sardar Patel Hall, Gaurakshani, Sasaram',
    'Sasaram',
    '2026-11-15 10:00:00+05:30',
    100,
    true,
    500,
    382,
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    'Apex Career Institute Sasaram',
    '919876543210',
    '4321',
    35526,
    0,
    0,
    '[{"id": "class", "label": "Class / Standard", "placeholder": "e.g. 10th / 11th / 12th", "required": true, "type": "text"}, {"id": "roll", "label": "School Roll Number", "placeholder": "e.g. 24", "required": false, "type": "text"}, {"id": "target", "label": "Target Exam", "placeholder": "e.g. JEE Main / NEET / NDA", "required": true, "type": "text"}]'::jsonb
),
(
    '22222222-2222-2222-2222-222222222222',
    'rohtas-dandiya-mahotsav-2026',
    'Sasaram Grand Dandiya & Cultural Night 2026',
    'The biggest Navratri Garba & Dandiya celebration in Rohtas. Featuring live regional vocalists, Bollywood DJ sound, authentic food stalls, and best dress cash prizes.\n\nStrict family & student admission only. Dandiya sticks available inside venue.',
    'Maurya Royal Resort, GT Road, Sasaram',
    'Sasaram',
    '2026-10-31 18:30:00+05:30',
    500,
    false,
    800,
    694,
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    'Rohtas Cultural Youth Club',
    '919876543211',
    '9988',
    322710,
    0,
    0,
    '[]'::jsonb
),
(
    '33333333-3333-3333-3333-333333333333',
    'sp-jain-college-annual-cultural-fest-2026',
    'SP Jain College Annual Tarang Youth Fest',
    'Inter-college youth festival featuring battle of bands, dance competitions, poetry slam, and food stalls. Open to all college students in Rohtas, Kaimur & Bhojpur districts.',
    'SP Jain College Auditorium, Sasaram',
    'Sasaram',
    '2026-12-05 11:00:00+05:30',
    250,
    true,
    1200,
    450,
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    'Student Welfare Committee',
    '919876543212',
    '1234',
    104625,
    0,
    0,
    '[]'::jsonb
),
(
    '44444444-4444-4444-4444-444444444444',
    'dehri-on-sone-marathon-2026',
    'Rohtas 10K Monsoon Run & Health Marathon',
    'Official 10km and 5km road race along the scenic Sone river bank. Finisher medal, dry-fit t-shirt, breakfast, and timing bib included.',
    'Sone Riverfront Promenade, Dehri-on-Sone',
    'Dehri-on-Sone',
    '2026-11-29 06:00:00+05:30',
    350,
    true,
    600,
    512,
    'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=800&auto=format&fit=crop',
    'Dehri Runners Association',
    '919876543213',
    '5678',
    165000,
    0,
    0,
    '[]'::jsonb
)
ON CONFLICT (slug) DO UPDATE 
SET 
    title = EXCLUDED.title,
    venue = EXCLUDED.venue,
    city = EXCLUDED.city,
    ticket_price = EXCLUDED.ticket_price,
    total_capacity = EXCLUDED.total_capacity,
    tickets_sold = EXCLUDED.tickets_sold,
    poster_url = EXCLUDED.poster_url;

