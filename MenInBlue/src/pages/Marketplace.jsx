
import React from 'react';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-green-800 mb-4">Marketplace</h1>
      <p className="text-lg text-gray-700 mb-8">Browse, buy, and sell green hydrogen credits securely and transparently.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Available Credits</h2>
          <p className="text-gray-600">View all verified credits ready for purchase or trade.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Recent Transactions</h2>
          <p className="text-gray-600">See the latest marketplace activity and completed trades.</p>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
