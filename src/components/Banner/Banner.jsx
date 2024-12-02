import React from "react";
import { GiFoodTruck } from "react-icons/gi";
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { FaTags } from "react-icons/fa";
import BannerImg1 from "../../assets/women/women4.jpg"; // Replace with your image path
import BannerImg2 from "../../assets/women/women2.jpg"; // Replace with your image path

const Banner = () => {
  return (
    <div className="relative bg-gradient-to-br from-white via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
          {/* Text Section */}
          <div className="lg:col-span-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Winter Sale <span className="text-blue-500">up to 50% Off!</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Discover exclusive collections for the winter season with amazing
              discounts. Shop now to make the most of this limited-time offer!
            </p>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
              Shop Now
            </button>
          </div>

          {/* Image Section 1 */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="w-[300px] h-[250px] sm:w-[400px] sm:h-[300px] overflow-hidden rounded-lg shadow-lg">
              <img
                src={BannerImg1}
                alt="Winter Sale"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Image Section 2 */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="w-[300px] h-[250px] sm:w-[400px] sm:h-[300px] overflow-hidden rounded-lg shadow-lg">
              <img
                src={BannerImg2}
                alt="Exclusive Offer"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Feature 1 */}
          <div className="relative bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform">
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 w-16 h-16 rounded-full shadow-lg mb-4 mx-auto">
              <GrSecure className="text-3xl text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              Quality Products
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
              High standards for the best experience.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="relative bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform">
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 w-16 h-16 rounded-full shadow-lg mb-4 mx-auto">
              <IoFastFood className="text-3xl text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              Fast Delivery
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
              Get your orders quickly and on time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="relative bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform">
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 w-16 h-16 rounded-full shadow-lg mb-4 mx-auto">
              <GiFoodTruck className="text-3xl text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              Easy Payment
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
              Multiple payment options available.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="relative bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform">
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 w-16 h-16 rounded-full shadow-lg mb-4 mx-auto">
              <GiFoodTruck className="text-3xl text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              Exclusive Offers
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
              Special discounts just for you.
            </p>
          </div>

          {/* Feature 5 (New) */}
          <div className="relative bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform">
            <div className="flex items-center justify-center bg-white dark:bg-gray-700 w-16 h-16 rounded-full shadow-lg mb-4 mx-auto">
              <FaTags className="text-3xl text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              Special Discounts
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
              Avail amazing deals and offers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
