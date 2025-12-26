import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Categories
export const useAdminCategories = () => {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: { name_ar: string; name_en: string; image_url?: string; sort_order?: number }) => {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name_ar?: string; name_en?: string; image_url?: string; is_active?: boolean; sort_order?: number }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Menu Items
export const useAdminMenuItems = () => {
  return useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*, categories(name_ar, name_en)')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: {
      name_ar: string;
      name_en: string;
      description_ar?: string;
      description_en?: string;
      base_price: number;
      category_id: string;
      image_url?: string;
      calories?: number;
      is_available?: boolean;
      is_featured?: boolean;
      sort_order?: number;
    }) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      name_ar?: string;
      name_en?: string;
      description_ar?: string;
      description_en?: string;
      base_price?: number;
      category_id?: string;
      image_url?: string;
      calories?: number;
      is_available?: boolean;
      is_featured?: boolean;
      sort_order?: number;
    }) => {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
};

// Modifier Groups
export const useAdminModifierGroups = () => {
  return useQuery({
    queryKey: ['admin-modifier-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modifier_groups')
        .select('*, modifiers(*)')
        .order('name_ar', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateModifierGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (group: {
      name_ar: string;
      name_en: string;
      is_required?: boolean;
      is_multiple?: boolean;
      min_selections?: number;
      max_selections?: number;
    }) => {
      const { data, error } = await supabase
        .from('modifier_groups')
        .insert(group)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modifier-groups'] });
      queryClient.invalidateQueries({ queryKey: ['modifier-groups'] });
    },
  });
};

export const useUpdateModifierGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      name_ar?: string;
      name_en?: string;
      is_required?: boolean;
      is_multiple?: boolean;
      min_selections?: number;
      max_selections?: number;
    }) => {
      const { data, error } = await supabase
        .from('modifier_groups')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modifier-groups'] });
      queryClient.invalidateQueries({ queryKey: ['modifier-groups'] });
    },
  });
};

export const useDeleteModifierGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('modifier_groups').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modifier-groups'] });
      queryClient.invalidateQueries({ queryKey: ['modifier-groups'] });
    },
  });
};

// Modifiers
export const useCreateModifier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (modifier: {
      name_ar: string;
      name_en: string;
      price?: number;
      group_id: string;
      is_available?: boolean;
      sort_order?: number;
    }) => {
      const { data, error } = await supabase
        .from('modifiers')
        .insert(modifier)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modifier-groups'] });
      queryClient.invalidateQueries({ queryKey: ['modifier-groups'] });
    },
  });
};

export const useUpdateModifier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      name_ar?: string;
      name_en?: string;
      price?: number;
      is_available?: boolean;
      sort_order?: number;
    }) => {
      const { data, error } = await supabase
        .from('modifiers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modifier-groups'] });
      queryClient.invalidateQueries({ queryKey: ['modifier-groups'] });
    },
  });
};

export const useDeleteModifier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('modifiers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modifier-groups'] });
      queryClient.invalidateQueries({ queryKey: ['modifier-groups'] });
    },
  });
};

// Promotions
export const useAdminPromotions = () => {
  return useQuery({
    queryKey: ['admin-promotions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (promo: {
      title_ar: string;
      title_en: string;
      description_ar?: string;
      description_en?: string;
      image_url?: string;
      is_active?: boolean;
      sort_order?: number;
      start_date?: string;
      end_date?: string;
    }) => {
      const { data, error } = await supabase
        .from('promotions')
        .insert(promo)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      title_ar?: string;
      title_en?: string;
      description_ar?: string;
      description_en?: string;
      image_url?: string;
      is_active?: boolean;
      sort_order?: number;
      start_date?: string;
      end_date?: string;
    }) => {
      const { data, error } = await supabase
        .from('promotions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('promotions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
};

// Orders
export const useAdminOrders = () => {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, order_item_modifiers(*))')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled' }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
};

// Store Settings
export const useAdminStoreSettings = () => {
  return useQuery({
    queryKey: ['admin-store-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateStoreSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      store_name_ar?: string;
      store_name_en?: string;
      whatsapp_number?: string;
      opening_time?: string;
      closing_time?: string;
      delivery_fee?: number;
      minimum_order?: number;
      is_open?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('store_settings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-store-settings'] });
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
    },
  });
};

// Image Upload
export const uploadImage = async (file: File, folder: string = 'items'): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return publicUrl;
};

export const deleteImage = async (url: string): Promise<void> => {
  // Extract file path from URL
  const match = url.match(/images\/(.+)$/);
  if (!match) return;

  const filePath = match[1];
  const { error } = await supabase.storage.from('images').remove([filePath]);
  if (error) throw error;
};

// Menu Item Modifier Groups linking
export const useMenuItemModifierGroups = (menuItemId: string) => {
  return useQuery({
    queryKey: ['menu-item-modifier-groups', menuItemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_item_modifier_groups')
        .select('modifier_group_id')
        .eq('menu_item_id', menuItemId);
      if (error) throw error;
      return data.map(d => d.modifier_group_id);
    },
    enabled: !!menuItemId,
  });
};

export const useLinkModifierGroups = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ menuItemId, groupIds }: { menuItemId: string; groupIds: string[] }) => {
      // Delete existing links
      await supabase
        .from('menu_item_modifier_groups')
        .delete()
        .eq('menu_item_id', menuItemId);

      // Insert new links
      if (groupIds.length > 0) {
        const { error } = await supabase
          .from('menu_item_modifier_groups')
          .insert(groupIds.map(groupId => ({ menu_item_id: menuItemId, modifier_group_id: groupId })));
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-item-modifier-groups'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
};
