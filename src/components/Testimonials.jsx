import React from 'react';

const Testimonials = () => {
  const testimonials = [
    { quote: 'A magical stay in Sri Lanka’s heart!', author: 'Sophie, Australia' },
    { quote: 'Seamless booking and stunning hotels.', author: 'Arjun, Singapore' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#164e63] text-center mb-12">Guest Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-[#e6f0fa] p-6 rounded-lg shadow-md">
              <p className="text-lg text-gray-700 italic">"{testimonial.quote}"</p>
              <p className="mt-4 text-[#164e63] font-semibold">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;