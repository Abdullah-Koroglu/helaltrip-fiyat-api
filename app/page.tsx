'use client';

import { useState } from 'react';
import { HotelSearchRequest, HotelPriceResponse } from '@/types/hotel';
import { HOTELS } from '@/config/hotels';

export default function Home() {
  const [formData, setFormData] = useState<HotelSearchRequest>({
    hotelId: 227,
    checkin: '',
    checkout: '',
    adults: 2,
    children: 0,
    childrenAges: [],
    discountPercentage: 0,
    currency: 'TRY',
    customerCountryCode: 'TR' as string,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HotelPriceResponse | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'children') {
      const childrenCount = parseInt(value) || 0;
      setFormData(prev => ({
        ...prev,
        children: childrenCount,
        childrenAges: Array(childrenCount).fill(0) as number[],
      }));
    } else if (name.startsWith('childAge-')) {
      const index = parseInt(name.split('-')[1]);
      const newAges = [...formData.childrenAges || []];
      newAges[index] = parseInt(value) || 0;
      setFormData(prev => ({
        ...prev,
        childrenAges: newAges as number[],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'hotelId' || name === 'adults' || name === 'discountPercentage' 
          ? parseInt(value) || 0 
          : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/hotel-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: HotelPriceResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        success: false,
        error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🏨 Otel Fiyat Sorgulama
          </h1>
          <p className="text-lg text-gray-600">
            Halal Booking otellerinin anlık fiyatlarını sorgulayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Arama Formu
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Otel Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otel
                </label>
                <select
                  name="hotelId"
                  value={formData.hotelId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                >
                  {HOTELS.map(hotel => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name} {hotel.location ? `- ${hotel.location}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tarih Seçimi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giriş Tarihi
                  </label>
                  <input
                    type="date"
                    name="checkin"
                    value={formData.checkin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Çıkış Tarihi
                  </label>
                  <input
                    type="date"
                    name="checkout"
                    value={formData.checkout}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Misafir Sayıları */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yetişkin Sayısı
                  </label>
                  <input
                    type="number"
                    name="adults"
                    min="1"
                    max="100"
                    value={formData.adults}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Çocuk Sayısı
                  </label>
                  <input
                    type="number"
                    name="children"
                    min="0"
                    max="5"
                    value={formData.children}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Çocuk Yaşları */}
              {formData.children > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Çocuk Yaşları
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: formData.children }).map((_, index) => (
                      <input
                        key={index}
                        type="number"
                        name={`childAge-${index}`}
                        min="0"
                        max="17"
                        value={formData.childrenAges?.[index] || 0}
                        onChange={handleInputChange}
                        placeholder={`Çocuk ${index + 1}`}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* İndirim ve Para Birimi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İndirim Oranı (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Para Birimi
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>)=> {
                      handleInputChange(e);
                      setFormData(prev => ({
                        ...prev,
                        customerCountryCode: e.target.value === 'TRY' ? 'TR' : 'DE',
                      }));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="TRY">TRY (₺)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pazar
                  </label>
                  <select
                    name="customerCountryCode"
                    value={formData.customerCountryCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="TR">Türkiye</option>
                    <option value="DE">Almanya</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Yükleniyor...
                  </span>
                ) : (
                  '🔍 Fiyatları Sorgula'
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Sonuçlar
            </h2>
            
            {!result && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏖️</div>
                <p className="text-gray-500">
                  Fiyatları görmek için formu doldurup sorgulayın
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Fiyatlar getiriliyor...</p>
              </div>
            )}

            {result && !result.success && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{result.error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && result.success && result.data && (
              <div className="space-y-6">
                {/* Otel Bilgileri */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {result.data.hotelName}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>📅 Giriş: {result.data.checkin}</div>
                    <div>📅 Çıkış: {result.data.checkout}</div>
                    <div>👥 Yetişkin: {result.data.adults}</div>
                    <div>👶 Çocuk: {result.data.children}</div>
                  </div>
                </div>

                {/* Oda Seçenekleri */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">
                    Mevcut Oda Seçenekleri ({result.data.offers.length})
                  </h4>
                  
                  {result.data.offers.map((offer, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className='flex gap-4'>
                          <img src={offer.image} alt={offer.roomName} className="w-1/2 h-auto rounded-xl" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 text-lg">
                            {offer.roomName}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">
                            🍽️ {offer.mealPlan}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            📋 {offer.cancellationPolicy}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-3 mt-3">
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            {offer.discountPercentage > 0 && (
                              <>
                                <div className="text-sm text-gray-500 line-through">
                                  {offer.originalPrice.toLocaleString('tr-TR')} {offer.currency}
                                </div>
                                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block">
                                  %{offer.discountPercentage} İndirim
                                </div>
                              </>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {offer.discountedPrice.toLocaleString('tr-TR')} {offer.currency}
                            </div>
                            {offer.discountPercentage > 0 && (
                              <div className="text-xs text-green-600">
                                {offer.discountAmount.toLocaleString('tr-TR')} {offer.currency} tasarruf
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500">
                          <div>Baz Fiyat: {offer.baseRate.toLocaleString('tr-TR')} {offer.currency}</div>
                          <div>Vergi: {offer.taxRate.toLocaleString('tr-TR')} {offer.currency}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {result.data.offers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Bu tarihler için uygun oda bulunamadı.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

