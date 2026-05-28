-- Supabase SQL to create the client credentials table and insert a sample client.
-- Run this in your Supabase SQL editor for the project with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.

CREATE TABLE public.client_credentials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_name text NOT NULL UNIQUE,
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  display_name text,
  custom_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

INSERT INTO public.client_credentials (client_name, username, password, display_name, custom_message)
VALUES
  ('krishna_furniture', 'krishna', 'Furniture@123', 'Krishna Furniture', 'Welcome to the Krishna Furniture client portal. Your assigned URL is https://thesocialhood.in/krishna_furniture.'),
  ('example_client', 'example', 'Example@123', 'Example Client', 'This is a custom client page for Example Client.');
