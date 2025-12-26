-- Add payment_method column to orders table
ALTER TABLE public.orders 
ADD COLUMN payment_method text NOT NULL DEFAULT 'cash' 
CHECK (payment_method IN ('cash', 'card'));