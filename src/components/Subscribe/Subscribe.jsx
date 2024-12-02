import React from "react";

const Subscribe = () => {
  return (
    <div className="relative bg-gradient-to-br from-black to-[#333333] text-white dark:from-[#1f1f1f] dark:to-[#121212]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40 dark:bg-black dark:opacity-60"></div>

      <div className="container mx-auto py-16 px-6 relative z-10">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white dark:text-white leading-tight tracking-tight">
            Stay Connected with the Latest Updates
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 dark:text-gray-200 max-w-2xl mx-auto">
            Join our mailing list to receive exclusive deals, updates on new
            arrivals, and special promotions. Don't miss out!
          </p>

          {/* Input and Button Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
            {/* Input Field */}
            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              className="w-full sm:w-96 p-4 rounded-lg text-lg text-gray-900 placeholder-gray-500 bg-white dark:bg-[#333333] dark:placeholder-gray-400 dark:text-gray-200 focus:ring-4 focus:ring-gray-500 dark:focus:ring-gray-600 shadow-md"
            />
            {/* Subscribe Button */}
            <button
              aria-label="Subscribe"
              className="w-full sm:w-auto px-8 py-4 bg-[#444444] text-white text-lg font-semibold rounded-lg hover:bg-[#555555] focus:ring-4 focus:ring-gray-500 transition-all duration-300 ease-in-out shadow-md dark:bg-[#555555] dark:hover:bg-[#444444] dark:focus:ring-gray-600"
            >
              Subscribe
            </button>
          </div>

          {/* Divider */}
          <div className="mt-10 border-t border-gray-700 dark:border-gray-600"></div>

          {/* Privacy Section */}
          <p className="mt-6 text-sm text-gray-400 dark:text-gray-300">
            By subscribing, you agree to receive promotional emails from us. You
            can unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
