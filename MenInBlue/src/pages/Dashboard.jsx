
import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-green-800 mb-4">Dashboard</h1>
      <p className="text-lg text-gray-700 mb-8">Welcome to your green hydrogen dashboard. Track your credits, view analytics, and manage your account.</p>

      {/* Role-based Login Buttons */}
      <div className="mb-10 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">Login as:</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/login?role=producer" className="bg-green-600 text-white px-4 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition text-center">Producer</a>
          <a href="/login?role=buyer" className="bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition text-center">Buyer</a>
          <a href="/login?role=certifier" className="bg-yellow-500 text-white px-4 py-3 rounded-lg font-semibold shadow hover:bg-yellow-600 transition text-center">Certifier</a>
          <a href="/login?role=admin" className="bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold shadow hover:bg-gray-900 transition text-center">Admin</a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Production Stats</h2>
          <p className="text-gray-600">Monitor your hydrogen production and credit generation in real time.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Marketplace Overview</h2>
          <p className="text-gray-600">See current market trends and available credits for trading.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Account Summary</h2>
          <p className="text-gray-600">View your profile, recent activity, and account status.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
