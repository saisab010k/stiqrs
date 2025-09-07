export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      stickers: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          url: string;
          qr_code_data: string | null;
          sticker_image_url: string | null;
          theme: string;
          style_preferences: Record<string, unknown>;
          is_public: boolean;
          scan_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          url: string;
          qr_code_data?: string | null;
          sticker_image_url?: string | null;
          theme?: string;
          style_preferences?: Record<string, unknown>;
          is_public?: boolean;
          scan_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          url?: string;
          qr_code_data?: string | null;
          sticker_image_url?: string | null;
          theme?: string;
          style_preferences?: Record<string, unknown>;
          is_public?: boolean;
          scan_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      sticker_analytics: {
        Row: {
          id: string;
          sticker_id: string;
          scanned_at: string;
          user_agent: string | null;
          ip_address: string | null;
          referrer: string | null;
          location_data: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          sticker_id: string;
          scanned_at?: string;
          user_agent?: string | null;
          ip_address?: string | null;
          referrer?: string | null;
          location_data?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          sticker_id?: string;
          scanned_at?: string;
          user_agent?: string | null;
          ip_address?: string | null;
          referrer?: string | null;
          location_data?: Record<string, unknown> | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Sticker = Database["public"]["Tables"]["stickers"]["Row"];
export type StickerAnalytics =
  Database["public"]["Tables"]["sticker_analytics"]["Row"];

export type StickerInsert = Database["public"]["Tables"]["stickers"]["Insert"];
export type StickerUpdate = Database["public"]["Tables"]["stickers"]["Update"];
