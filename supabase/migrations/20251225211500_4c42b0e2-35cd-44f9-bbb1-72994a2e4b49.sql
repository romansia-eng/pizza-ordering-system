-- Add driver_arrived status to the order_status enum
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'driver_arrived' AFTER 'ready';

-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;