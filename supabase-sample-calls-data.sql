-- Sample Calls Data for Krishna Furniture
-- Insert this into your Supabase to populate the calls dashboard

-- First, ensure leads are created
INSERT INTO public.leads (phone, name, source, created_at, status, lead_score, furniture_interest, timeline, budget, lead_status, interested_in, style_preference)
VALUES
  ('+91 98100 00001', 'Rajesh Kumar', 'AI Call', now() - interval '2 days', 'new', 'hot', 'bedroom set', '2 weeks', 150000, 'hot', 'Bedroom Set', 'Modern'),
  ('+91 99200 00002', 'Priya Sharma', 'Website', now() - interval '1 day', 'contacted', 'hot', 'sofa set', '1 week', 200000, 'hot', 'Sofa Set', 'Contemporary'),
  ('+91 97300 00003', 'Vikram Singh', 'Referral', now() - interval '3 days', 'contacted', 'warm', 'dining table', '3 weeks', 80000, 'warm', 'Dining Set', 'Minimalist'),
  ('+91 96400 00004', 'Neha Patel', 'AI Call', now() - interval '5 days', 'contacted', 'warm', 'office furniture', '1 month', 120000, 'warm', 'Office Set', 'Professional'),
  ('+91 95300 00005', 'Arjun Mehra', 'Website', now() - interval '4 days', 'new', 'cold', 'wardrobe', '2 months', 60000, 'cold', 'Wardrobe', 'Luxury')
ON CONFLICT DO NOTHING;

-- Insert call logs
INSERT INTO public.call_logs (call_uuid, lead_id, from_number, to_number, direction, caller_name, status, duration_seconds, started_at, ended_at, tenant_id)
SELECT
  gen_random_uuid(),
  leads.id,
  '+91 XXXXXXXXXX',
  leads.phone,
  'inbound',
  leads.name,
  'answered',
  FLOOR(RANDOM() * 900 + 300)::integer,
  now() - interval '1 day' - (RANDOM() * interval '7 days'),
  now() - interval '1 day' - (RANDOM() * interval '7 days') + (FLOOR(RANDOM() * 900 + 300)::integer || ' seconds')::interval,
  'krishna_furniture'
FROM public.leads
WHERE phone IN ('+91 98100 00001', '+91 99200 00002', '+91 97300 00003', '+91 96400 00004', '+91 95300 00005')
LIMIT 5;

-- Insert call summaries
INSERT INTO public.call_summaries (call_uuid, lead_id, product_interest, budget_mentioned, urgency_mentioned, final_state, lead_score, lead_tier, summary_text, full_transcript, created_at, tenant_id)
SELECT
  call_logs.call_uuid,
  call_logs.lead_id,
  leads.furniture_interest,
  leads.budget::text,
  leads.timeline,
  'converted',
  CASE
    WHEN leads.lead_status = 'hot' THEN 92
    WHEN leads.lead_status = 'warm' THEN 71
    ELSE 45
  END,
  leads.lead_status::text,
  'Customer interested in ' || leads.furniture_interest || ' with budget of ₹' || leads.budget || '. Timeline is ' || leads.timeline || '. Marked as ' || leads.lead_status || ' lead.',
  '[
    {"role": "agent", "content": "Hi there! How can I help you with furniture today?"},
    {"role": "user", "content": "Hi! I''m looking for a ' || leads.furniture_interest || ' within ₹' || leads.budget || ' budget."},
    {"role": "agent", "content": "Great! We have several options. When are you looking to purchase?"},
    {"role": "user", "content": "Within ' || leads.timeline || ' would be ideal."},
    {"role": "agent", "content": "Perfect. Let me send you our best collections. You should receive them shortly."},
    {"role": "user", "content": "Sounds good! Thanks!"}
  ]'::jsonb,
  now() - interval '1 day' - (RANDOM() * interval '7 days'),
  'krishna_furniture'
FROM public.call_logs
LEFT JOIN public.leads ON call_logs.lead_id = leads.id
WHERE call_logs.tenant_id = 'krishna_furniture'
ON CONFLICT DO NOTHING;

-- Verify data was inserted
SELECT 'Leads inserted' as status, COUNT(*) as count FROM public.leads WHERE phone IN ('+91 98100 00001', '+91 99200 00002', '+91 97300 00003', '+91 96400 00004', '+91 95300 00005')
UNION ALL
SELECT 'Call logs inserted', COUNT(*) FROM public.call_logs WHERE tenant_id = 'krishna_furniture'
UNION ALL
SELECT 'Call summaries inserted', COUNT(*) FROM public.call_summaries WHERE tenant_id = 'krishna_furniture';
