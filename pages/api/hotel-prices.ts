import type { NextApiRequest, NextApiResponse } from 'next';
import { HotelSearchRequest, HalalBookingResponse, HotelPriceResponse, ProcessedOffer } from '@/types/hotel';
import { getHotelNameById } from '@/config/hotels';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HotelPriceResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const {
      hotelId,
      checkin,
      checkout,
      adults,
      children,
      childrenAges = [],
      discountPercentage = 0,
      currency = 'TRY',
      customerCountryCode = 'TR'
    }: HotelSearchRequest = req.body;

    console.log(JSON.stringify({
      hotelId,
      checkin,
      checkout,
      adults,
      children,
      childrenAges,
      discountPercentage,
      currency,
    }, null, 2))

    // Validasyon
    if (!hotelId || !checkin || !checkout) {
      return res.status(400).json({
        success: false,
        error: 'Hotel ID, check-in ve check-out tarihleri gereklidir.'
      });
    }

    if (!adults || adults < 1) {
      return res.status(400).json({
        success: false,
        error: 'En az 1 yetişkin gereklidir.'
      });
    }

    if (children > 0 && childrenAges.length !== children) {
      return res.status(400).json({
        success: false,
        error: 'Çocuk sayısı ile çocuk yaşları eşleşmiyor.'
      });
    }

    // Group parametresini oluştur (yetişkin + çocuk sayısı)
    const totalGuests = [adults, ...childrenAges];
    
    // API URL'ini oluştur
    const apiUrl = buildApiUrl(hotelId, checkin, checkout, totalGuests.filter((age): age is number => age !== null && age !== undefined), currency, customerCountryCode);
    
    console.log('Fetching from:', apiUrl);

    const username = process.env.NEXT_PUBLIC_HALAL_BOOKING_PARTNER_CODE;
    const password = process.env.NEXT_PUBLIC_HALAL_BOOKING_SECRET_KEY;
    const credentials = btoa(`${username}:${password}`);

    // Halalbooking API'sine istek at
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const apiData: HalalBookingResponse = await response.json();

    // Fiyatları işle ve indirim uygula
    const processedOffers = processOffers(
      apiData.groups,
      discountPercentage,
      currency
    );

    const responseData: HotelPriceResponse = {
      success: true,
      data: {
        hotelId,
        hotelName: getHotelNameById(hotelId),
        checkin,
        checkout,
        adults,
        children: children || 0,
        childrenAges: childrenAges.filter((age): age is number => age !== null),
        currency,
        offers: processedOffers,
      }
    };

    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Error fetching hotel prices:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.'
    });
  }
}

function buildApiUrl(
  hotelId: number,
  checkin: string,
  checkout: string,
  totalGuests: number[],
  currency: string,
  customerCountryCode?: string
): string {
  const baseUrl = `https://tr.halalbooking.com/api/v2/tr/places/${hotelId}/`;
  const params = new URLSearchParams({
    'groups[]': totalGuests.join(','),
    'location': 'Turkey',
    'customer_country_code': customerCountryCode || 'TR' ,
    'page': '1',
    'currency': currency,
    'checkin': checkin,
    'checkout': checkout,
  });

  return `${baseUrl}?${params.toString()}`;
}

function processOffers(
  groups: any[],
  discountPercentage: number,
  currency: string
): ProcessedOffer[] {
  const processedOffers: ProcessedOffer[] = [];

  groups.forEach(group => {
    if (group.offers && Array.isArray(group.offers)) {
      group.offers.forEach((offer: any) => {
        const originalPrice = offer.total_price || offer.price || 0;
        const discountAmount = (originalPrice * discountPercentage) / 100;
        const discountedPrice = originalPrice - discountAmount;
        // console.log(JSON.stringify(offer.room?.photos, null, 2));

        processedOffers.push({
          roomName: offer.room?.name || 'Bilinmeyen Oda',
          roomId: offer.room?.id || 0,
          mealPlan: offer.rate_plan?.meal_plan_name || 'Bilinmiyor',
          originalPrice,
          discountedPrice,
          discountAmount,
          discountPercentage,
          baseRate: offer.base_rate || 0,
          taxRate: offer.tax_rate || 0,
          currency,
          cancellationPolicy: offer.rate_plan?.cancellation_policy_label || 'Bilinmiyor',
          image: offer.room?.photos[0] || offer.room?.photo || '',
        });
      });
    }
  });

  return processedOffers;
}

