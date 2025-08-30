
import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white p-8">
      <h1 className="text-5xl font-bold text-green-800 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-8">Oops! The page you are looking for does not exist.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full max-w-lg">
        <a href="/login" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition text-center">Login</a>
        <a href="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition text-center">Register</a>
        <a href="/dashboard" className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-900 transition text-center">Dashboard</a>
        <a href="/marketplace" className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-yellow-600 transition text-center">Marketplace</a>
        <a href="/credits" className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-600 transition text-center">My Credits</a>
        <a href="/analytics" className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-cyan-700 transition text-center">Analytics</a>
        <a href="/profile" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-indigo-700 transition text-center">Profile</a>
      </div>
      <a href="/" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition">Go Home</a>
    </div>
  );
};

export default NotFound;
