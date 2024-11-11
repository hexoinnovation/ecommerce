import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Your Firebase configuration
import { useAuth } from '../AuthContext'; // Custom Auth Context to manage currentUser

const AccountPage = () => {
  const { currentUser, logout } = useAuth(); // Get the current user and logout function from AuthContext

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    gender: '',
    email: '', // Ensure email is part of the form data
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch user data from Firestore on page load
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.email) {
        try {
          // Get user document from Firestore using current user's email as the document ID
          const userDocRef = doc(db, 'users', currentUser.email);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setFormData(userDoc.data()); // Populate formData with saved user data from Firestore
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
      // Clear form data when user logs out
      setFormData({
        firstName: '',
        lastName: '',
        contact: '',
        gender: '',
        email: '',
      });
    }
  }, [currentUser]); // Re-fetch user data whenever currentUser changes

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save user data to Firestore
  const handleSave = async () => {
    if (!currentUser) {
      setErrorMessage('Please log in to save your details.');
      return; // Stop further execution if user is not logged in
    }

    try {
      // Save the updated data to Firestore
      const userDocRef = doc(db, 'users', currentUser.email);
      await setDoc(userDocRef, formData, { merge: true }); // Save only the updated fields
      setIsEditing(false); // Turn off edit mode
      setErrorMessage(''); // Clear error message if save is successful
    } catch (error) {
      console.error('Error saving document:', error);
      setErrorMessage('There was an error saving your data.');
    }
  };

  // Display login message if no user is logged in
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to Your Account</h2>
          <p className="text-gray-600 mb-6">Please log in to view your account information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Account Settings</h2>
        <ul>
          <li>
            <button
              onClick={() => setIsEditing(false)}
              className="text-blue-500"
            >
              Personal Information
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-4">
        {/* Personal Information Form */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Personal Information</h1>
          <div className="space-y-4">
            {/* Render firstName, lastName, contact, and gender */}
            {['firstName', 'lastName', 'contact', 'gender', 'email'].map((field) => (
              <div key={field}>
                <label className="block font-medium capitalize">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded ${isEditing ? 'bg-white' : 'bg-gray-200'}`}
                />
              </div>
            ))}

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 mt-4">{errorMessage}</div>
            )}

            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
