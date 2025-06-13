import React from 'react';

const FeaturedHotels = () => {
  const hotels = [
    { name: 'Ocean Breeze Resort', location: 'Bentota', price: 130 },
    { name: 'Emerald Valley Lodge', location: 'Ella', price: 160 },
    { name: 'Coral Sands Villa', location: 'Hikkaduwa', price: 110 },
  ];

  return (
    <section className="bg-[#e6f0fa] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#164e63] text-center mb-12">Featured Hotels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200"></div> {/* Placeholder for hotel image */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#164e63]">{hotel.name}</h3>
                <p className="text-gray-600">{hotel.location}</p>
                <p className="text-lg font-bold text-[#34c759] mt-2">${hotel.price}/night</p>
                <a
                  href="/booking"
                  className="mt-4 inline-block px-6 py-2 bg-[#1a759f] text-white rounded-full hover:bg-[#34c759] transition-colors"
                >
                  Book Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedHotels;