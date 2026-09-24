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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addons: {
        Row: {
          available: boolean
          created_at: string
          description: string
          id: string
          image_url: string | null
          name: string
          price: number
        }
        Insert: {
          available?: boolean
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name: string
          price?: number
        }
        Update: {
          available?: boolean
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      colors: {
        Row: {
          created_at: string
          hex: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          hex?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          hex?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      fabric_colors: {
        Row: {
          color_id: string
          fabric_id: string
          id: string
        }
        Insert: {
          color_id: string
          fabric_id: string
          id?: string
        }
        Update: {
          color_id?: string
          fabric_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fabric_colors_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fabric_colors_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabrics"
            referencedColumns: ["id"]
          },
        ]
      }
      fabrics: {
        Row: {
          available: boolean
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          name: string
          price: number
          season: string
        }
        Insert: {
          available?: boolean
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name: string
          price?: number
          season?: string
        }
        Update: {
          available?: boolean
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          season?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          id: string
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          booking_fee: number
          buyer_name: string
          buyer_phone: string
          buyer_role: string
          created_at: string
          customization: Json
          delivery_note: string
          id: string
          measurements: Json
          order_kind: string
          order_no: string
          payment_ref: string
          payment_status: string
          price_breakdown: Json
          product_id: string | null
          product_name: string
          remaining: number
          status: string
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string
          booking_fee?: number
          buyer_name?: string
          buyer_phone?: string
          buyer_role?: string
          created_at?: string
          customization?: Json
          delivery_note?: string
          id?: string
          measurements?: Json
          order_kind?: string
          order_no: string
          payment_ref?: string
          payment_status?: string
          price_breakdown?: Json
          product_id?: string | null
          product_name?: string
          remaining?: number
          status?: string
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          booking_fee?: number
          buyer_name?: string
          buyer_phone?: string
          buyer_role?: string
          created_at?: string
          customization?: Json
          delivery_note?: string
          id?: string
          measurements?: Json
          order_kind?: string
          order_no?: string
          payment_ref?: string
          payment_status?: string
          price_breakdown?: Json
          product_id?: string | null
          product_name?: string
          remaining?: number
          status?: string
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      patterns: {
        Row: {
          created_at: string
          id: string
          name: string
          price: number
          style_key: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price?: number
          style_key?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price?: number
          style_key?: string
        }
        Relationships: []
      }
      product_addons: {
        Row: {
          addon_id: string
          id: string
          product_id: string
        }
        Insert: {
          addon_id: string
          id?: string
          product_id: string
        }
        Update: {
          addon_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_addons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_fabrics: {
        Row: {
          fabric_id: string
          id: string
          product_id: string
        }
        Insert: {
          fabric_id: string
          id?: string
          product_id: string
        }
        Update: {
          fabric_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_fabrics_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fabrics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          audience: string
          available: boolean
          category: string
          code: string
          created_at: string
          description: string
          dress_type: string
          featured: boolean
          id: string
          image_url: string | null
          in_stock: boolean
          kind: string
          name: string
          popular: boolean
          price: number
          season: string
          silhouette: string
        }
        Insert: {
          audience?: string
          available?: boolean
          category?: string
          code?: string
          created_at?: string
          description?: string
          dress_type?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          in_stock?: boolean
          kind?: string
          name: string
          popular?: boolean
          price?: number
          season?: string
          silhouette?: string
        }
        Update: {
          audience?: string
          available?: boolean
          category?: string
          code?: string
          created_at?: string
          description?: string
          dress_type?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          in_stock?: boolean
          kind?: string
          name?: string
          popular?: boolean
          price?: number
          season?: string
          silhouette?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string
          avatar_url: string | null
          bio: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          preferences: string
        }
        Insert: {
          address?: string
          avatar_url?: string | null
          bio?: string
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string
          preferences?: string
        }
        Update: {
          address?: string
          avatar_url?: string | null
          bio?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          preferences?: string
        }
        Relationships: []
      }
      seasons: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      sizes: {
        Row: {
          created_at: string
          id: string
          name: string
          scale: number
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          scale?: number
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          scale?: number
          sort_order?: number
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
          role: Database["public"]["Enums"]["app_role"]
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
      app_role: "owner" | "designer" | "customer"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["owner", "designer", "customer"],
    },
  },
} as const
