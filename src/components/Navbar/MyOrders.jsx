import React from 'react';
import Navbar from './Navbar';
import Footer from '../Footer/Footer';

// Sample data for orders (you can replace this with dynamic data from an API or a database)
const orders = [
  { id: 1, date: '2024-11-10', total: 100.50, status: 'Shipped' },
  { id: 2, date: '2024-11-12', total: 59.75, status: 'Processing' },
  { id: 3, date: '2024-11-15', total: 200.00, status: 'Delivered' },
  { id: 4, date: '2024-11-18', total: 350.25, status: 'Shipped' },
];

const MyOrders = () => {
  return (
    <div>
   <Navbar/>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    onClick={() => alert(`Viewing details for Order ${order.id}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <Footer/>
    </div>

  );
};

export default MyOrders;
