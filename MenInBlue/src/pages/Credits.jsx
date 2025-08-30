
import React from 'react';

const Credits = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-green-800 mb-4">My Credits</h1>
      <p className="text-lg text-gray-700 mb-8">Track your owned, retired, and traded hydrogen credits.</p>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 w-full max-w-xl">
        <h2 className="text-xl font-semibold text-green-700 mb-2">Credit Summary</h2>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Active Credits: 120</li>
          <li>Retired Credits: 45</li>
          <li>Pending Credits: 10</li>
        </ul>
      </div>
    </div>
  );
};

export default Credits;
