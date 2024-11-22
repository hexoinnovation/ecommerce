import React from 'react';
import Navbar from './Navbar';
import Footer from '../Footer/Footer';
import cam1 from "../../assets/camera/cam1.jpg";
import e3 from "../../assets/common/e3.jpg";
import phn2 from "../../assets/phone/phn2.jpg";
import { FaShoppingCart } from 'react-icons/fa';  // Import the icon
const orders = [
  {
    id: 1,
    date: 'Cancelled on Oct 15, 2023',
    items: 'Siril Dyed, Embellished, Solid/Plain Bol...',
    color: 'Blue',
    size: 'Free',
    price: '₹244',
    status: 'Cancelled',
    image: cam1,
  },
  {
    id: 2,
    date: 'Delivered on Nov 18, 2023',
    items: 'Product C',
    color: 'Red',
    size: 'Medium',
    price: '₹120',
    status: 'Delivered',
    image: e3,
  },
  {
    id: 3,
    date: 'Shipped on Nov 20, 2023',
    items: 'Product D, Product E, Product F',
    color: 'Black',
    size: 'Large',
    price: '₹400',
    status: 'Shipped',
    image: phn2,
  },
];

const MyOrders = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold ml-40 p-4 text-center rounded-lg flex items-center space-x-4">
        <span>My Orders</span>
        <div className="relative">
          <FaShoppingCart className="text-3xl animate-dr" /> {/* Apply the move animation */}
        </div>
      </h1>
        <div className="grid gap-6 mt-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-100 w-full max-w-lg mx-auto p-4 rounded shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-4"
              style={{
                height: '180px', // Fixed height for all containers
                minWidth: '900px', // Minimum width for consistency
              }}
            >
              <img
                src={order.image}
                alt={`Order ${order.id}`}
                className="w-40 h-40 object-cover rounded"
              />
              <div className="flex-1 text-sm flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">{order.items}</span>
                  <span className="text-gray-600 text-base">
                    <strong>Color:</strong> {order.color}
                  </span>
                  <span className="text-gray-600">
                    <strong>Size:</strong> {order.size}
                  </span>
                </div>
                <div className="flex flex-col items-end">
  <div
    className="flex items-center justify-center"
    style={{
      height: '50px', // Set a specific height for the div
    }}
  >
    <span className="text-lg font-bold text-center">{order.price}</span>
  </div>
  <span
    className={`text-sm font-bold ${
      order.status === 'Cancelled'
        ? 'text-red-500'
        : order.status === 'Delivered'
        ? 'text-green-500'
        : 'text-yellow-500'
    }`}
  >
    {order.status}
  </span>
  <span className="text-gray-500">{order.date}</span>
</div>

              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;
