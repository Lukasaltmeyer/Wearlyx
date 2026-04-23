export type ProductCondition = "new" | "like_new" | "good" | "fair";
export type ProductStatus = "active" | "sold" | "reserved" | "deleted";

// ── Supabase Database type (matches generated schema format) ─────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: DatabaseRelationship[];
      };
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: ProductUpdate;
        Relationships: DatabaseRelationship[];
      };
      likes: {
        Row: LikeRow;
        Insert: LikeInsert;
        Update: Partial<LikeRow>;
        Relationships: DatabaseRelationship[];
      };
      saved_items: {
        Row: SavedItemRow;
        Insert: SavedItemInsert;
        Update: Partial<SavedItemRow>;
        Relationships: DatabaseRelationship[];
      };
      conversations: {
        Row: ConversationRow;
        Insert: ConversationInsert;
        Update: ConversationUpdate;
        Relationships: DatabaseRelationship[];
      };
      messages: {
        Row: MessageRow;
        Insert: MessageInsert;
        Update: MessageUpdate;
        Relationships: DatabaseRelationship[];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      product_condition: ProductCondition;
      product_status: ProductStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
}

interface DatabaseRelationship {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}

// ── Row types ────────────────────────────────────────────────────────────────

export interface ProfileRow {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  rating: number;
  sales_count: number;
  created_at: string;
  updated_at: string;
}
export type ProfileInsert = Omit<ProfileRow, "created_at" | "updated_at">;
export type ProfileUpdate = Partial<Omit<ProfileRow, "id">>;

export interface ProductRow {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  images: string[];
  category: string;
  size: string | null;
  brand: string | null;
  condition: ProductCondition;
  status: ProductStatus;
  views: number;
  is_boosted?: boolean;
  created_at: string;
  updated_at: string;
}
export type ProductInsert = {
  seller_id: string;
  title: string;
  description?: string | null;
  price: number;
  images?: string[];
  category: string;
  size?: string | null;
  brand?: string | null;
  condition: ProductCondition;
  status?: ProductStatus;
};
export type ProductUpdate = Partial<Omit<ProductRow, "id" | "created_at">>;

export interface LikeRow {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}
export type LikeInsert = { user_id: string; product_id: string };

export interface SavedItemRow {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}
export type SavedItemInsert = { user_id: string; product_id: string };

export interface ConversationRow {
  id: string;
  product_id: string | null;
  buyer_id: string;
  seller_id: string;
  last_message: string | null;
  last_message_at: string;
  created_at: string;
}
export type ConversationInsert = {
  product_id?: string | null;
  buyer_id: string;
  seller_id: string;
};
export type ConversationUpdate = Partial<
  Pick<ConversationRow, "last_message" | "last_message_at">
>;

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}
export type MessageInsert = {
  conversation_id: string;
  sender_id: string;
  content: string;
};
export type MessageUpdate = { read?: boolean };

// ── App-level enriched types (with joins) ────────────────────────────────────

export type Profile = ProfileRow;

export interface Product extends ProductRow {
  seller?: Profile;
  likes_count?: number;
  is_liked?: boolean;
  is_saved?: boolean;
}

export type Like = LikeRow;
export type SavedItem = SavedItemRow;

export interface Conversation extends ConversationRow {
  product?: Pick<ProductRow, "id" | "title" | "images" | "price"> | null;
  buyer?: Profile | null;
  seller?: Profile | null;
}

export interface Message extends MessageRow {
  sender?: Profile | null;
}

// ── Marketplace features ─────────────────────────────────────────────────────

export type OfferStatus = 'pending' | 'accepted' | 'refused' | 'countered' | 'expired';
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'in_transit' | 'delivered' | 'dispute' | 'cancelled' | 'refunded';
export type ShipmentStatus = 'pending' | 'prepared' | 'dropped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed';
export type DisputeReason = 'not_received' | 'not_as_described' | 'wrong_item' | 'damaged' | 'seller_inactive' | 'delivery_issue' | 'other';
export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'refunded' | 'rejected';
export type NotificationType = 'offer_received' | 'offer_accepted' | 'offer_refused' | 'offer_countered' | 'order_confirmed' | 'order_shipped' | 'order_delivered' | 'dispute_opened' | 'dispute_resolved' | 'new_message';
export type ShippingMode = 'home' | 'relay' | 'locker';

export interface Offer {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  message: string | null;
  status: OfferStatus;
  counter_amount: number | null;
  counter_message: string | null;
  created_at: string;
  updated_at: string;
  product?: Pick<ProductRow, 'id' | 'title' | 'images' | 'price'>;
  buyer?: Profile;
  seller?: Profile;
}

export interface Order {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  offer_id: string | null;
  amount: number;
  protection_fee: number;
  shipping_fee: number;
  total: number;
  status: OrderStatus;
  shipping_mode: ShippingMode;
  shipping_address: Record<string, string> | null;
  created_at: string;
  updated_at: string;
  product?: Pick<ProductRow, 'id' | 'title' | 'images' | 'price'>;
  buyer?: Profile;
  seller?: Profile;
  shipment?: Shipment;
}

export interface Shipment {
  id: string;
  order_id: string;
  tracking_number: string | null;
  carrier: string | null;
  mode: ShippingMode;
  relay_name: string | null;
  relay_address: string | null;
  locker_id: string | null;
  status: ShipmentStatus;
  estimated_delivery: string | null;
  delivered_at: string | null;
  events: ShipmentEvent[];
  created_at: string;
  updated_at: string;
}

export interface ShipmentEvent {
  status: string;
  label: string;
  date: string;
  location?: string;
}

export interface Dispute {
  id: string;
  order_id: string;
  opened_by: string;
  reason: DisputeReason;
  description: string;
  photos: string[];
  status: DisputeStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  order?: Order;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, string>;
  read: boolean;
  created_at: string;
}

// ── UI constants ─────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { value: "streetwear", label: "Streetwear" },
  { value: "luxury",     label: "Luxe" },
  { value: "sport",      label: "Sport" },
  { value: "casual",     label: "Casual" },
  { value: "vintage",    label: "Vintage" },
  { value: "formal",     label: "Formel" },
  { value: "accessories", label: "Accessoires" },
  { value: "shoes",      label: "Chaussures" },
  { value: "bags",       label: "Sacs" },
  { value: "other",      label: "Autre" },
] as const;

export const CONDITIONS: { value: ProductCondition; label: string }[] = [
  { value: "new",      label: "Neuf avec étiquette" },
  { value: "like_new", label: "Comme neuf" },
  { value: "good",     label: "Bon état" },
  { value: "fair",     label: "État correct" },
];

export const SIZES = [
  "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "Unique",
];
