
-- Create enum for order type
CREATE TYPE public.order_type AS ENUM ('delivery', 'pickup');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');

-- Categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Menu items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  calories INTEGER,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Modifier groups table
CREATE TABLE public.modifier_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  is_required BOOLEAN DEFAULT false,
  min_selections INTEGER DEFAULT 0,
  max_selections INTEGER DEFAULT 1,
  is_multiple BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Modifiers table
CREATE TABLE public.modifiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.modifier_groups(id) ON DELETE CASCADE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Link menu items to modifier groups
CREATE TABLE public.menu_item_modifier_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  modifier_group_id UUID REFERENCES public.modifier_groups(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(menu_item_id, modifier_group_id)
);

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_type order_type NOT NULL,
  district TEXT,
  street TEXT,
  address_notes TEXT,
  google_maps_link TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  general_notes TEXT,
  status order_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES public.menu_items(id) NOT NULL,
  item_name_ar TEXT NOT NULL,
  item_name_en TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  base_price DECIMAL(10,2) NOT NULL,
  modifiers_price DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Order item modifiers table
CREATE TABLE public.order_item_modifiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE NOT NULL,
  modifier_id UUID REFERENCES public.modifiers(id) NOT NULL,
  modifier_name_ar TEXT NOT NULL,
  modifier_name_en TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Store settings table
CREATE TABLE public.store_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name_ar TEXT DEFAULT 'بيتزا الرومنسية',
  store_name_en TEXT DEFAULT 'Al-Romansia Pizza',
  whatsapp_number TEXT DEFAULT '966552065055',
  opening_time TIME DEFAULT '10:00',
  closing_time TIME DEFAULT '23:00',
  delivery_fee DECIMAL(10,2) DEFAULT 15,
  minimum_order DECIMAL(10,2) DEFAULT 50,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modifier_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_modifier_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_item_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for menu data
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Anyone can view modifier groups" ON public.modifier_groups FOR SELECT USING (true);
CREATE POLICY "Anyone can view modifiers" ON public.modifiers FOR SELECT USING (true);
CREATE POLICY "Anyone can view menu item modifier groups" ON public.menu_item_modifier_groups FOR SELECT USING (true);
CREATE POLICY "Anyone can view store settings" ON public.store_settings FOR SELECT USING (true);

-- Anyone can create orders (no auth required for ordering)
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view their orders by phone" ON public.orders FOR SELECT USING (true);

CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view order items" ON public.order_items FOR SELECT USING (true);

CREATE POLICY "Anyone can create order item modifiers" ON public.order_item_modifiers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view order item modifiers" ON public.order_item_modifiers FOR SELECT USING (true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_modifier_groups_updated_at BEFORE UPDATE ON public.modifier_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_modifiers_updated_at BEFORE UPDATE ON public.modifiers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON public.store_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'ROM-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- Insert default store settings
INSERT INTO public.store_settings (id) VALUES (gen_random_uuid());

-- Insert sample categories
INSERT INTO public.categories (name_ar, name_en, sort_order) VALUES
  ('بيتزا كلاسيكية', 'Classic Pizza', 1),
  ('بيتزا مميزة', 'Special Pizza', 2),
  ('بيتزا بالدجاج', 'Chicken Pizza', 3),
  ('بيتزا باللحم', 'Meat Pizza', 4),
  ('المقبلات', 'Appetizers', 5),
  ('المشروبات', 'Beverages', 6);

-- Insert sample modifier group
INSERT INTO public.modifier_groups (id, name_ar, name_en, is_required, min_selections, max_selections, is_multiple) VALUES
  ('11111111-1111-1111-1111-111111111111', 'إضافات البيتزا', 'Pizza Toppings', false, 0, 10, true),
  ('22222222-2222-2222-2222-222222222222', 'الصوصات', 'Sauces', false, 0, 5, true);

-- Insert sample modifiers
INSERT INTO public.modifiers (group_id, name_ar, name_en, price, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'زيادة جبن', 'Extra Cheese', 5, 1),
  ('11111111-1111-1111-1111-111111111111', 'جبن سائل', 'Liquid Cheese', 5, 2),
  ('11111111-1111-1111-1111-111111111111', 'زيتون', 'Olives', 3, 3),
  ('11111111-1111-1111-1111-111111111111', 'هالبينو', 'Jalapeño', 3, 4),
  ('11111111-1111-1111-1111-111111111111', 'فلفل أخضر', 'Green Pepper', 2, 5),
  ('22222222-2222-2222-2222-222222222222', 'صوص ثوم', 'Garlic Sauce', 2, 1),
  ('22222222-2222-2222-2222-222222222222', 'صوص حار', 'Hot Sauce', 2, 2),
  ('22222222-2222-2222-2222-222222222222', 'صوص رانش', 'Ranch Sauce', 2, 3);
