import React from "react";
import womenwear1 from "../../assets/women/women2.jpg";
import womenwear2 from "../../assets/women/women3.jpg";
import womenwear3 from "../../assets/women/women4.jpg";

const TestimonialData = [
  {
    id: 1,
    img: womenwear1,
    discount: "20% Off",
    description:
      "Limited time offer! Get 20% off on your first purchase of this amazing product. Don't miss out!",
  },
  {
    id: 2,
    img: womenwear2,
    discount: "50% Off",
    description:
      "Huge sale! Save 50% on this best-selling item. Perfect for gifting or personal use!",
  },
  {
    id: 3,
    img: womenwear3,
    discount: "50% Off",
    description:
      "Huge sale! Save 50% on this best-selling item. Perfect for gifting or personal use!",
  },
];

const Testimonials = () => {
  return (
    <div className="relative bg-gradient-to-br from-white via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Exclusive Discounts Just for You!
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-4 max-w-3xl mx-auto">
            Shop our best-selling products with amazing discounts. Hurry,
            limited-time offers!
          </p>
        </div>

        {/* Testimonial Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TestimonialData.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group"
            >
              {/* Image Section */}
              <div className="relative h-56 sm:h-64">
                <img
                  src={testimonial.img}
                  alt="Discount Offer"
                  className="w-full h-full object-cover rounded-t-lg group-hover:opacity-90 transition-opacity duration-300"
                />
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm sm:text-lg font-semibold px-4 py-2 rounded-full shadow-md z-10">
                  {testimonial.discount}
                </div>
              </div>

              {/* Description Section */}
              <div className="p-6 text-center">
                <p className="text-gray-900 dark:text-gray-200 text-sm sm:text-base">
                  {testimonial.description}
                </p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
