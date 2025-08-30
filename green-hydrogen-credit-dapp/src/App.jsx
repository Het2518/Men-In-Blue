import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Web3Provider } from './contexts/Web3Context'
import WalletConnect from './components/WalletConnect'
import Home from './pages/Home'
import Producer from './pages/Producer'
import Buyer from './pages/Buyer'
import Certifier from './pages/Certifier'
import Admin from './pages/Admin'

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-hydrogen-teal via-cyan-900 to-green-900 text-white">
          <nav className="p-4 bg-black bg-opacity-30 backdrop-blur-lg">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold animate-glow">Green Hydrogen Credits</h1>
              <WalletConnect />
            </div>
          </nav>

          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/producer" element={<Producer />} />
              <Route path="/buyer" element={<Buyer />} />
              <Route path="/certifier" element={<Certifier />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Web3Provider>
  )
}

export default App
