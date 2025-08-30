
import React from 'react';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-green-800 mb-4">Analytics</h1>
      <p className="text-lg text-gray-700 mb-8">View platform analytics, market trends, and performance metrics.</p>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-green-700 mb-2">Key Metrics</h2>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Total Credits Traded: 12,500</li>
          <li>Active Users: 1,200</li>
          <li>Verified Producers: 85</li>
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
