
import React from 'react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-green-800 mb-4">Profile</h1>
      <p className="text-lg text-gray-700 mb-8">Manage your account details, security, and preferences.</p>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-green-700 mb-2">Account Information</h2>
        <ul className="list-none text-gray-600">
          <li><strong>Name:</strong> John Doe</li>
          <li><strong>Email:</strong> john@company.com</li>
          <li><strong>Role:</strong> Producer</li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
