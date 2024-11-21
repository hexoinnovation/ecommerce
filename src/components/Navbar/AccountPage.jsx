import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../Authcontext';
import Navbar from './Navbar';
import Footer from '../Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faBox } from '@fortawesome/free-solid-svg-icons';

const AccountPage = () => {
  const { currentUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddressAdding, setIsAddressAdding] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    gender: '',
    email: '',
    address: '',
    address2: '', // New field for second address
  });
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState(''); // New state for second address
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.email) {
        try {
          const userDocRef = doc(db, 'users', currentUser.email);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setFormData(userDoc.data());
            setAddress(userDoc.data().address || '');
            setAddress2(userDoc.data().address2 || ''); // Fetch address2 if exists
          } else {
            console.log("No user data found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (currentUser) {
      fetchUserData();
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        contact: '',
        gender: '',
        email: '',
        address: '',
        address2: '', // Clear address2 if no user
      });
      setAddress('');
      setAddress2('');
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!currentUser) {
      setErrorMessage('Please log in to save your details.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.email);
      await setDoc(userDocRef, { ...formData, address: address, address2: address2 }, { merge: true });

      setIsEditing(false);
      setIsAddressAdding(false);
      setErrorMessage('');
      setSuccessMessage('Your information has been saved successfully!'); // Success message after saving

    } catch (error) {
      console.error('Error saving document:', error);
      setErrorMessage('There was an error saving your data.');
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleAddress2Change = (e) => {
    setAddress2(e.target.value); // Handle second address change
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:flex-row justify-center p-6 space-y-6 lg:space-y-0 lg:space-x-6">
  {/* Sidebar Section */}
  <div className="lg:w-1/4 w-full bg-white text-black p-6 border rounded-lg shadow-md">
    <div className="text-center mb-6">
      <img
        src="src/assets/common/person.avif"
        alt="User"
        className="rounded-full w-24 h-24 mx-auto"
      />
      <h2 className="text-xl font-semibold mt-2">Hello, {currentUser?.displayName || 'User'}</h2>
    </div>
    <ul className="mt-4 space-y-4 flex flex-col items-center lg:items-start ml-10">
      <h2 className="text-xl font-semibold flex items-center space-x-2">
        <FontAwesomeIcon icon={faCogs} className="text-gray-600" />
        <b>Account Settings</b>
      </h2>
      <li>
        <button
          onClick={() => { setIsEditing(true); setIsAddressAdding(false); }}
          className="text-lg hover:text-gray-400 transition-colors"
        >
          Personal Information
        </button>
      </li>
      <li>
        <button
          onClick={() => { setIsAddressAdding(true); setIsEditing(false); }}
          className="text-lg hover:text-gray-400 transition-colors"
        >
          Manage Address
        </button>
      </li>
      <h2 className="text-xl font-semibold flex items-center space-x-2">
        <FontAwesomeIcon icon={faBox} className="text-gray-600" />
        <b>My Stuff</b>
      </h2>
      <li>
        <button className="text-lg hover:text-gray-400 transition-colors">
          My Wishlist
        </button>
      
      </li>
    </ul>
  </div>

  {/* Main Form Section */}
  <div className="w-full lg:w-3/4 bg-white p-6 border rounded-lg shadow-md">
    {isEditing ? (
      <div className="w-full max-w-xl mx-auto ml-20">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 ">Personal Information</h2>
        <form className="space-y-4">
          {['firstName', 'lastName', 'contact', 'email'].map((field, idx) => (
            <div key={idx} className="bg-gradient-to-r from-yellow-400 to-orange-500 p-[1px] rounded-lg mr-40 ">
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white dark:bg-white text-black dark:text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 "
                placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
              />
            </div>
          ))}

          <div className="mt-4">
            <label className="mr-4 text-gray-700 dark:text-black">Gender</label>
            <label className="mr-4 text-gray-700 dark:text-black">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleChange}
                className="mr-2"
              />
              Male
            </label>
            <label className="mr-4 text-gray-700 dark:text-black">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleChange}
                className="mr-2"
              />
              Female
            </label>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-1/3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-md hover:bg-yellow-400 transition-colors font-bold"
          >
            Save
          </button>
           {/* Success/Error Messages */}
    {successMessage && <p className="text-green-500">{successMessage}</p>}
    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </form>
      </div>
    ) : isAddressAdding ? (
      <div className="w-full max-w-xl mx-auto ml-20">
        <h2 className="text-2xl font-semibold mb-4">Manage Address</h2>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-[1px] rounded-lg mr-40">
            <textarea
              value={address}
              onChange={handleAddressChange}
              className="w-full p-2 rounded-lg bg-white dark:bg-white text-gray-700 dark:text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 "
              placeholder="Add a new address"
            />
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-[1px] rounded-lg mr-40">
            <textarea
              value={address2}
              onChange={handleAddress2Change}
              className="w-full p-2 rounded-lg bg-white dark:bg-white text-gray-700 dark:text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Add a second address"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="mt-4 py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-md hover:bg-yellow-400 transition-colors"
        >
          Save Address
        </button>
      </div>
    ) : (
      <div className="w-full max-w-xl mx-auto ml-12">
<h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 pb-2">
  Your Information
</h2>
        <div className="space-y-4">
          <div className="flex gap-x-4">
            <p className="text-gray-900 font-medium w-1/3">Name:</p>
            <p className="text-gray-900 w-2/3 mr-60">{formData.firstName} {formData.lastName}</p>
          </div>
          <div className="flex gap-x-4">
            <p className="text-gray-900 font-medium w-1/3">Email:</p>
            <p className="text-gray-900 w-2/3 mr-60">{formData.email}</p>
          </div>
          <div className="flex gap-x-4">
            <p className="text-gray-900 font-medium w-1/3">Contact:</p>
            <p className="text-gray-900 w-2/3 mr-60">{formData.contact}</p>
          </div>
          <div className="flex gap-x-4">
            <p className="text-gray-900 font-medium w-1/3">Address:</p>
            <p className="text-gray-900 w-2/3 mr-60">{address || 'No address added yet'}</p>
          </div>
          <div className="flex gap-x-4">
            <p className="text-gray-900 font-medium w-1/3">Address 2:</p>
            <p className="text-gray-900 w-2/3 mr-60">{address2 || 'No second address added yet'}</p>
          </div>
        </div>
      </div>
    )}

   
  </div>
</div>
<Footer />

    </div>
  );
};

export default AccountPage;
