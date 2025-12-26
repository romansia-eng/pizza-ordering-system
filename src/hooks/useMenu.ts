import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  image_url: string | null;
  base_price: number;
  calories: number | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
}

export interface ModifierGroup {
  id: string;
  name_ar: string;
  name_en: string;
  is_required: boolean;
  min_selections: number;
  max_selections: number;
  is_multiple: boolean;
  modifiers: Modifier[];
}

export interface Modifier {
  id: string;
  group_id: string;
  name_ar: string;
  name_en: string;
  price: number;
  is_available: boolean;
  sort_order: number;
}

export interface StoreSettings {
  id: string;
  store_name_ar: string;
  store_name_en: string;
  whatsapp_number: string;
  opening_time: string;
  closing_time: string;
  delivery_fee: number;
  minimum_order: number;
  is_open: boolean;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
  });
};

export const useMenuItems = (categoryId?: string) => {
  return useQuery({
    queryKey: ['menu_items', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('sort_order', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MenuItem[];
    },
  });
};

export const useFeaturedItems = () => {
  return useQuery({
    queryKey: ['featured_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as MenuItem[];
    },
  });
};

export const useMenuItem = (itemId: string) => {
  return useQuery({
    queryKey: ['menu_item', itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', itemId)
        .maybeSingle();

      if (error) throw error;
      return data as MenuItem | null;
    },
    enabled: !!itemId,
  });
};

export const useModifierGroups = (menuItemId: string) => {
  return useQuery({
    queryKey: ['modifier_groups', menuItemId],
    queryFn: async () => {
      // Get modifier group IDs linked to this menu item
      const { data: linkData, error: linkError } = await supabase
        .from('menu_item_modifier_groups')
        .select('modifier_group_id')
        .eq('menu_item_id', menuItemId);

      if (linkError) throw linkError;
      
      if (!linkData || linkData.length === 0) {
        return [];
      }

      const groupIds = linkData.map((l) => l.modifier_group_id);

      // Get modifier groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('modifier_groups')
        .select('*')
        .in('id', groupIds);

      if (groupsError) throw groupsError;

      // Get modifiers for these groups
      const { data: modifiersData, error: modifiersError } = await supabase
        .from('modifiers')
        .select('*')
        .in('group_id', groupIds)
        .eq('is_available', true)
        .order('sort_order', { ascending: true });

      if (modifiersError) throw modifiersError;

      // Combine groups with their modifiers
      const groups: ModifierGroup[] = (groupsData || []).map((group) => ({
        ...group,
        modifiers: (modifiersData || []).filter((m) => m.group_id === group.id),
      }));

      return groups;
    },
    enabled: !!menuItemId,
  });
};

export const useStoreSettings = () => {
  return useQuery({
    queryKey: ['store_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as StoreSettings | null;
    },
  });
};
