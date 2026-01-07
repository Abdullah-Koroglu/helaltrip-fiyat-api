import type { NextApiRequest, NextApiResponse } from 'next';
import { HotelSearchRequest, HalalBookingResponse, HotelPriceResponse, ProcessedOffer } from '@/types/hotel';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HotelPriceResponse>
) {
  try {
    const { hotelId } = req.body;
    // const hotelInfo = await getHotelById(hotelId);
    const apiUrl = `https://tr.halalbooking.com/api/v2/tr/content?place_ids[]=${hotelId}`;
    
    const username = process.env.NEXT_PUBLIC_HALAL_BOOKING_PARTNER_CODE;
    const password = process.env.NEXT_PUBLIC_HALAL_BOOKING_SECRET_KEY;
    const credentials = btoa(`${username}:${password}`);

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
    const apiData: any = await response.json();
    console.log(JSON.stringify(apiData, null, 2));
    return res.status(200).json({
      success: true,
      data: apiData
    });
  } catch (error) {
    console.error('Error fetching hotel info:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.'
      });
    }
  }


  // Get places info
// GET /content
// Returns places info without prices

// Request parameters:

// place_ids[] (array of integers, optional)
// Response parameters:

// page
// The page which you’ve requested.
// total_pages
// The total number of pages which you can request.
// results_per_page
// The maximum number of results you will receive per page (always 20).
// total_results
// The total number of results across all pages.
// links / self
// Canonical URL for your request.
// links / first
// First page.
// links / last
// Last page.
// links / next
// Next page - omitted when requesting last page.
// links / prev
// Previous page - omitted when requesting first page.
// data[]
// An array of places content data within requested page.
// data[] / id
// This number is unique for each place
// data[] / name
// Short place name. For example, "Bera Beach Resort".
// data[] / stars
// The number of stars in standard hotel rating system.
// data[] / holiday_type
// one of "resort", "hotel", "thermal", "villa"
// data[] / location
// data[] / location / address
// Place address
// data[] / location / latitude
// Place latitude
// data[] / location / longitude
// Place longitude
// data[] / location / city
// City/Town/Metropolitan area. Examples: Dubai, Alanya, Istanbul, London, New York
// data[] / location / subregion
// Province/ State/ Emirate/ Governate/ County/ Krai/ Republic/ Region to which the city formally belongs. Examples: New York State, Antalya Province, Abu Dhabi Emirate.
// data[] / location / region
// A larger Region concept beyond subregion, if it exists. Examples: Istanbul, Yalova, etc are in "Marmara Region", Alanya, Kemer, Kas, Marmaris are all in "Mediterranean Region"
// data[] / location / country
// Country name. Examples: Turkey, Spain.
// data[] / facilities
// Plaintext list and description of place facilities by Halalbooking
// data[] / photos[]
// An array of URLs. You can download them for your own use.
// data[] / checkin_time
// Guest can check-in no earlier than this time of day. String in 24-hour "HH:MM" format. For example, "13:30".
// data[] / checkout_time
// Guest can check-out no later than this time of day. Same format as checkin_time.
// Example:

// curl -g -H "Accept: application/json" \
// -u "partner_code:secret_key" \
// "https://en.halalbooking.com/api/v2\
// /content?page=1"
// Response:

// {
//   "page": 1,
//   "total_pages": 923,
//   "results_per_page": 50,
//   "total_results": 46123,
//   "links": {
//     "self": "http://en.web.localhost:3333/api/v2/content?page=1",
//     "first": "http://en.web.localhost:3333/api/v2/content?page=1",
//     "last": "http://en.web.localhost:3333/api/v2/content?page=923",
//     "next": "http://en.web.localhost:3333/api/v2/content?page=2"
//   },
//   "data": [
//     {
//       "id": 324479,
//       "name": "Fiyavalhu Resort Maldives",
//       "stars": 4,
//       "facilities": "GENERAL FACILITIES: Seafront, Beachfront, Garden, Terrace, Sun terrace, Air conditioning, Shared lounge/TV area, Designated smoking area, ...",
//       "holiday_type": "resort",
//       "location": {
//         "address": "Island, Mandhoo, Alifu Dhaalu Atoll, 00050, Maldives",
//         "latitude": "3.696211",
//         "longitude": "72.712565",
//         "country_code": "",
//         "name": "Mandhoo",
//         "city": "Mandhoo",
//         "subregion": "Alifu Dhaalu Atoll",
//         "region": "All of Maldives",
//         "country": "Maldives"
//       },
//       "photo": "https://cdn.halalstatic.com/2021%2F06%2F28%2F16%2F33%2F16%2F88e78cee-c6ab-4a0f-93b3-4ed6458d2053%2F66815_K_XW1_ffKwY-b-zCyRD04g.jpg?fit=bounds&format=jpg&width=1600",
//       "photos": [
//         "https://cdn.halalstatic.com/2021%2F06%2F28%2F16%2F33%2F16%2F88e78cee-c6ab-4a0f-93b3-4ed6458d2053%2F66815_K_XW1_ffKwY-b-zCyRD04g.jpg?fit=bounds&format=jpg&width=1600",
//         "https://cdn.halalstatic.com/2021%2F06%2F28%2F16%2F33%2F16%2Ffff1f26d-e7ba-4c22-9969-71445751d674%2F97935_d9oQ9N1vsijIILzZtvt6RA.jpg?fit=bounds&format=jpg&width=1600",
//         "https://cdn.halalstatic.com/2022%2F01%2F08%2F15%2F06%2F22%2F14208ec4-5acb-44d6-9cdd-4d8eab6a6cc2%2F55804_9UewNy8lwLk7K_TusUNcxA.jpg?fit=bounds&format=jpg&width=1600"
//       ],
//       "checkin_time": "14:00",
//       "checkout_time": "12:00"
//     }
//   ]
// }