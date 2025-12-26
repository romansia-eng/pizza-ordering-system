export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean | null
          name_ar: string
          name_en: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name_ar: string
          name_en: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      menu_item_modifier_groups: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          modifier_group_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          modifier_group_id: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          modifier_group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_modifier_groups_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_modifier_groups_modifier_group_id_fkey"
            columns: ["modifier_group_id"]
            isOneToOne: false
            referencedRelation: "modifier_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          base_price: number
          calories: number | null
          category_id: string
          created_at: string
          description_ar: string | null
          description_en: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_featured: boolean | null
          name_ar: string
          name_en: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          base_price: number
          calories?: number | null
          category_id: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name_ar: string
          name_en: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          base_price?: number
          calories?: number | null
          category_id?: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name_ar?: string
          name_en?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      modifier_groups: {
        Row: {
          created_at: string
          id: string
          is_multiple: boolean | null
          is_required: boolean | null
          max_selections: number | null
          min_selections: number | null
          name_ar: string
          name_en: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_multiple?: boolean | null
          is_required?: boolean | null
          max_selections?: number | null
          min_selections?: number | null
          name_ar: string
          name_en: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_multiple?: boolean | null
          is_required?: boolean | null
          max_selections?: number | null
          min_selections?: number | null
          name_ar?: string
          name_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      modifiers: {
        Row: {
          created_at: string
          group_id: string
          id: string
          is_available: boolean | null
          name_ar: string
          name_en: string
          price: number | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          is_available?: boolean | null
          name_ar: string
          name_en: string
          price?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          is_available?: boolean | null
          name_ar?: string
          name_en?: string
          price?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modifiers_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "modifier_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_modifiers: {
        Row: {
          created_at: string
          id: string
          modifier_id: string
          modifier_name_ar: string
          modifier_name_en: string
          order_item_id: string
          price: number
        }
        Insert: {
          created_at?: string
          id?: string
          modifier_id: string
          modifier_name_ar: string
          modifier_name_en: string
          order_item_id: string
          price: number
        }
        Update: {
          created_at?: string
          id?: string
          modifier_id?: string
          modifier_name_ar?: string
          modifier_name_en?: string
          order_item_id?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_modifiers_modifier_id_fkey"
            columns: ["modifier_id"]
            isOneToOne: false
            referencedRelation: "modifiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_modifiers_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          base_price: number
          created_at: string
          id: string
          item_name_ar: string
          item_name_en: string
          menu_item_id: string
          modifiers_price: number | null
          notes: string | null
          order_id: string
          quantity: number
          total_price: number
        }
        Insert: {
          base_price: number
          created_at?: string
          id?: string
          item_name_ar: string
          item_name_en: string
          menu_item_id: string
          modifiers_price?: number | null
          notes?: string | null
          order_id: string
          quantity?: number
          total_price: number
        }
        Update: {
          base_price?: number
          created_at?: string
          id?: string
          item_name_ar?: string
          item_name_en?: string
          menu_item_id?: string
          modifiers_price?: number | null
          notes?: string | null
          order_id?: string
          quantity?: number
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_notes: string | null
          created_at: string
          customer_name: string
          customer_phone: string
          delivery_fee: number | null
          district: string | null
          general_notes: string | null
          google_maps_link: string | null
          id: string
          order_number: string
          order_type: Database["public"]["Enums"]["order_type"]
          payment_method: string
          status: Database["public"]["Enums"]["order_status"] | null
          street: string | null
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          address_notes?: string | null
          created_at?: string
          customer_name: string
          customer_phone: string
          delivery_fee?: number | null
          district?: string | null
          general_notes?: string | null
          google_maps_link?: string | null
          id?: string
          order_number: string
          order_type: Database["public"]["Enums"]["order_type"]
          payment_method?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          street?: string | null
          subtotal: number
          total: number
          updated_at?: string
        }
        Update: {
          address_notes?: string | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          delivery_fee?: number | null
          district?: string | null
          general_notes?: string | null
          google_maps_link?: string | null
          id?: string
          order_number?: string
          order_type?: Database["public"]["Enums"]["order_type"]
          payment_method?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          street?: string | null
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          sort_order: number | null
          start_date: string | null
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          start_date?: string | null
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          start_date?: string | null
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          closing_time: string | null
          created_at: string
          delivery_fee: number | null
          id: string
          is_open: boolean | null
          minimum_order: number | null
          opening_time: string | null
          store_name_ar: string | null
          store_name_en: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          closing_time?: string | null
          created_at?: string
          delivery_fee?: number | null
          id?: string
          is_open?: boolean | null
          minimum_order?: number | null
          opening_time?: string | null
          store_name_ar?: string | null
          store_name_en?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          closing_time?: string | null
          created_at?: string
          delivery_fee?: number | null
          id?: string
          is_open?: boolean | null
          minimum_order?: number | null
          opening_time?: string | null
          store_name_ar?: string | null
          store_name_en?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "driver_arrived"
        | "delivered"
        | "cancelled"
      order_type: "delivery" | "pickup"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "driver_arrived",
        "delivered",
        "cancelled",
      ],
      order_type: ["delivery", "pickup"],
    },
  },
} as const
