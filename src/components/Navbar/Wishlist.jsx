import { useLocation } from 'react-router-dom';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useState, useEffect } from 'react';
import { useAuth } from '../Authcontext';
import Navbar from './Navbar';
import Footer from '../Footer/Footer';
import { FaHeartBroken ,FaRegHeart,FaHeart} from 'react-icons/fa';  // Import the heart broken icon

const Wishlist = () => {
  const location = useLocation();
  const [wishlistItems, setWishlistItems] = useState(location.state?.items || []);
  const { currentUser } = useAuth();

  // Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      const wishlistRef = collection(db, 'users', currentUser.email, 'Wishlist');
      const querySnapshot = await getDocs(wishlistRef);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWishlistItems(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchWishlist();
    }
  }, [currentUser]);

  const handleRemoveFromWishlist = async (id) => {
    const stringId = String(id); // Convert id to string if it’s a number
    console.log('Attempting to delete item with id:', stringId); // Debugging
  
    const userWishlistRef = doc(db, 'users', currentUser.email, 'Wishlist', stringId);
  
    try {
      await deleteDoc(userWishlistRef);
      alert('Item removed from your wishlist!');
      fetchWishlist(); // Refresh the wishlist after deletion
    } catch (error) {
      console.error('Error removing item from Firestore:', error);
    }
  };
  
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
      <div className="ml-30 max-w-8xl mx-auto px-4">
  <h3 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
    {/* Star Icon with different animation */}
    <FaHeart className="mr-3 text-red-500 text-3xl animate-pulse" />
    {/* Text */}
    My Wishlist ({wishlistItems.length})
  </h3>
  {wishlistItems.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-7 ml-5">
   
  
      {wishlistItems.map((item) => (
        <div
          key={item.id}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-auto object-cover rounded-md mb-4" // This ensures the image scales appropriately
          />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {item.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
          <p className="text-gray-800 dark:text-gray-200 font-bold">
            ${item.price}
          </p>
          <button
            onClick={() => handleRemoveFromWishlist(item.id)}
            className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm px-3 py-2 text-center mt-4 dark:border-red-500 dark:hover:text-gray-200 dark:hover:bg-red-600 dark:focus:ring-red-900"
          >
            Remove ❤️
          </button>
        </div>
     

              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center flex-col text-center space-y-4">
            {/* Empty Wishlist Image or Icon with animation */}
            <FaHeartBroken className="text-6xl text-red-500 animate-pulse" />
            <p className="text-gray-700 dark:text-gray-300 text-xl">Your wishlist is empty.</p>
            {/* Add any additional animation or image */}
            <img
              src="wishlist.png" // Replace with your own empty state image or icon
              alt="Empty Wishlist"
              className="w-32 h-32 animate-bounce"
            />
          </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
