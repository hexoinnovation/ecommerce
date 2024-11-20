import { useLocation } from 'react-router-dom';

const Wishlist = () => {
  const location = useLocation();
  const wishlistItems = location.state?.items || [];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Wishlist</h1>
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {wishlistItems.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {item.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                <p className="text-gray-800 dark:text-gray-200 font-bold">
                  ${item.price}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
