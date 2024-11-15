import React from "react";
import cracker3 from '../../assets/crackers/cracker3.jpg';
import cracker2 from '../../assets/crackers/cracker2.jpg';

const TestimonialData = [
  {
    id: 1,
    img: cracker3,  // First image
    discount: "20% Off",
    description: "Limited time offer! Get 20% off on your first purchase of this amazing product. Don't miss out!",
  },
  {
    id: 2,
    img: cracker2,  // Second image
    discount: "50% Off",
    description: "Huge sale! Save 50% on this best-selling item. Perfect for gifting or personal use!",
  },
];

const Testimonials = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">
            Exclusive Discounts Just for You!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-3xl mx-auto">
            Shop our best-selling products with amazing discounts. Hurry, limited time offers!
          </p>
        </div>

        {/* Testimonial Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {TestimonialData.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-md z-10">
                {testimonial.discount}
              </div>

              {/* Product Description */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-lg">
                {testimonial.description}
              </div>

              {/* Image (Full width) */}
              <img
                src={testimonial.img}
                alt="Testimonial"
                className="w-full h-96 object-cover rounded-xl" // Full-width image
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
