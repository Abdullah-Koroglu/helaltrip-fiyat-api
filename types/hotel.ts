export interface HotelSearchRequest {
  hotelId: number;
  checkin: string; // YYYY-MM-DD
  checkout: string; // YYYY-MM-DD
  adults: number;
  children: number;
  childrenAges?: number[] | null[];
  discountPercentage?: number;
  currency?: string;
  customerCountryCode?: string;
}

export interface Room {
  id: number;
  name: string;
  photos: string[];
  long_description: string;
}

export interface RatePlan {
  id: number;
  meal_plan_name: string;
  cancellation_policy_label: string;
  cancellation_policy_html: string;
}

export interface RatePlanDetail {
  price: number;
  total_price: number;
  base_rate: number;
  tax_rate: number;
  fees: any[];
  quantity: number;
  affiliate_commission_percentage: string;
  rate_plan: RatePlan;
}

export interface Offer {
  price: number;
  total_price: number;
  base_rate: number;
  tax_rate: number;
  fees: any[];
  quantity: number;
  affiliate_commission_percentage: string;
  confirmation: string;
  room: Room;
  rate_plan: RatePlan;
  rate_plans: RatePlanDetail[];
}

export interface Group {
  group: string;
  offers: Offer[];
}

export interface Place {
  id: number;
  name: string;
  stars: number;
  overview: string;
  facts: string;
  facilities: string;
  board_basis: string;
  rate_plan: string;
  cancellation_policy: {
    id: number;
    html: string;
  };
  holiday_type: string;
  location: {
    country_code: string;
    name: string;
    locality: string;
    city: string;
    subregion: string;
    region: string;
    country: string;
  };
  photo: string;
  photos: string[];
  checkin_time: string;
  checkout_time: string;
}

export interface HalalBookingResponse {
  currency: string;
  url: string;
  locale: string;
  place: Place;
  groups: Group[];
}

export interface ProcessedOffer {
  roomName: string;
  roomId: number;
  mealPlan: string;
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  discountPercentage: number;
  baseRate: number;
  taxRate: number;
  currency: string;
  cancellationPolicy: string;
  image: string;
  quantity: number
}

export interface HotelPriceResponse {
  success: boolean;
  data?: {
    hotelId: number;
    hotelName: string;
    checkin: string;
    checkout: string;
    adults: number;
    children: number;
    childrenAges: number[];
    currency: string;
    offers: ProcessedOffer[];
  };
  error?: string;
}

