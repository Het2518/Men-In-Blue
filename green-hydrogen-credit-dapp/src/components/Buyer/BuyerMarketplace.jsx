import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';

const BuyerMarketplace = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [availableCredits, setAvailableCredits] = useState([]);
  const [myPortfolio, setMyPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const [purchaseForm, setPurchaseForm] = useState({
    creditId: '',
    quantity: '',
    totalCost: 0,
    preferredPrice: '',
    paymentMethod: 'metamask',
    escrowEnabled: true,
    deliveryDate: '',
    useForOffset: false,
    retireImmediately: false,
    certificateDelivery: 'digital',
    projectType: '',
    vintageYear: '',
    additionalBenefits: []
  });

  const [filters, setFilters] = useState({
    energyType: 'all',
    priceRange: 'all',
    location: 'all',
    certificationStandard: 'all',
    vintageYear: 'all',
    availability: 'all',
    carbonIntensity: 'all',
    sortBy: 'price_low_high'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [marketAnalytics, setMarketAnalytics] = useState({
    averagePrice: 0,
    totalVolume: 0,
    priceChange24h: 0,
    topProducers: [],
    trendingCredits: []
  });

  const tabColors = {
    marketplace: 'text-blue-400 border-blue-400',
    portfolio: 'text-green-400 border-green-400',
    transactions: 'text-purple-400 border-purple-400',
    analytics: 'text-yellow-400 border-yellow-400'
  };

  const energyTypeColors = {
    hydrogen: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    solar: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    wind: 'bg-green-500/20 text-green-400 border-green-500/30',
    hydro: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  };

  const certificationColors = {
    'GOLD_STANDARD': 'bg-yellow-600/20 text-yellow-300',
    'ISO_14064': 'bg-blue-600/20 text-blue-300',
    'GREEN_H2': 'bg-green-600/20 text-green-300',
    'VCS': 'bg-purple-600/20 text-purple-300'
  };

  useEffect(() => {
    fetchMarketplaceData();
    fetchUserPortfolio();
    fetchTransactionHistory();
    fetchMarketAnalytics();
  }, []);

  const fetchMarketplaceData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockCredits = [
        {
          id: 'HY-001',
          facilityName: 'GreenTech Hydrogen Plant',
          producer: 'John Smith',
          producerCompany: 'EcoEnergy Solutions',
          energyType: 'hydrogen',
          availableCredits: 500,
          pricePerCredit: 25.50,
          carbonIntensity: '0.5 kg CO2/kg H2',
          location: 'California, USA',
          certificationStandard: 'GOLD_STANDARD',
          vintageYear: '2024',
          productionCapacity: '500 kg/day',
          certificationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          additionalBenefits: ['Job Creation', 'Local Economic Development', 'Water Conservation'],
          sustainabilityScore: 92,
          verified: true,
          trending: true,
          priceHistory: [24.20, 24.80, 25.10, 25.50],
          description: 'High-purity green hydrogen produced using renewable solar energy with advanced electrolysis technology.',
          technicalSpecs: {
            purity: '99.9%',
            pressure: '350 bar',
            temperature: '-253°C',
            storageMethod: 'Compressed gas'
          }
        },
        {
          id: 'HY-002',
          facilityName: 'Pacific Wind H2 Generator',
          producer: 'Maria Garcia',
          producerCompany: 'Pacific Green Energy',
          energyType: 'hydrogen',
          availableCredits: 1200,
          pricePerCredit: 22.75,
          carbonIntensity: '0.3 kg CO2/kg H2',
          location: 'Oregon, USA',
          certificationStandard: 'ISO_14064',
          vintageYear: '2024',
          productionCapacity: '1200 kg/day',
          certificationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000),
          additionalBenefits: ['Biodiversity Protection', 'Community Investment'],
          sustainabilityScore: 88,
          verified: true,
          trending: false,
          priceHistory: [23.50, 23.10, 22.90, 22.75],
          description: 'Wind-powered hydrogen production facility with state-of-the-art PEM electrolyzers.',
          technicalSpecs: {
            purity: '99.95%',
            pressure: '700 bar',
            temperature: '-253°C',
            storageMethod: 'Liquid hydrogen'
          }
        },
        {
          id: 'SO-003',
          facilityName: 'Desert Solar Array',
          producer: 'Ahmed Al-Mansouri',
          producerCompany: 'Solar Innovations LLC',
          energyType: 'solar',
          availableCredits: 800,
          pricePerCredit: 18.90,
          carbonIntensity: '0.02 kg CO2/kWh',
          location: 'Nevada, USA',
          certificationStandard: 'GREEN_H2',
          vintageYear: '2024',
          productionCapacity: '50 MW',
          certificationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000),
          additionalBenefits: ['Desert Land Use', 'Grid Stabilization'],
          sustainabilityScore: 95,
          verified: true,
          trending: true,
          priceHistory: [19.50, 19.20, 19.00, 18.90],
          description: 'Large-scale solar photovoltaic installation in optimal desert conditions.',
          technicalSpecs: {
            efficiency: '22.5%',
            moduleType: 'Monocrystalline',
            inverterEfficiency: '98.5%',
            degradation: '0.35% per year'
          }
        }
      ];

      setAvailableCredits(mockCredits);
    } catch (error) {
      toast.error('Failed to load marketplace data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPortfolio = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockPortfolio = [
        {
          id: 'PORT-001',
          creditId: 'HY-001',
          facilityName: 'GreenTech Hydrogen Plant',
          energyType: 'hydrogen',
          quantity: 100,
          purchasePrice: 24.20,
          currentPrice: 25.50,
          purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'active',
          totalValue: 2550,
          unrealizedGain: 130,
          carbonOffset: 50, // tons CO2 equivalent
          retired: false,
          dividendsEarned: 15.75
        },
        {
          id: 'PORT-002',
          creditId: 'SO-003',
          facilityName: 'Desert Solar Array',
          energyType: 'solar',
          quantity: 50,
          purchasePrice: 19.20,
          currentPrice: 18.90,
          purchaseDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          status: 'active',
          totalValue: 945,
          unrealizedGain: -15,
          carbonOffset: 25,
          retired: false,
          dividendsEarned: 8.50
        }
      ];

      setMyPortfolio(mockPortfolio);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockTransactions = [
        {
          id: 'TXN-001',
          type: 'purchase',
          creditId: 'HY-001',
          facilityName: 'GreenTech Hydrogen Plant',
          quantity: 100,
          pricePerCredit: 24.20,
          totalAmount: 2420,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'completed',
          transactionHash: '0xabcd...1234',
          gasUsed: '0.005 ETH'
        },
        {
          id: 'TXN-002',
          type: 'purchase',
          creditId: 'SO-003',
          facilityName: 'Desert Solar Array',
          quantity: 50,
          pricePerCredit: 19.20,
          totalAmount: 960,
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          status: 'completed',
          transactionHash: '0xefgh...5678',
          gasUsed: '0.003 ETH'
        }
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMarketAnalytics = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const mockAnalytics = {
        averagePrice: 22.38,
        totalVolume: 15420,
        priceChange24h: 2.3,
        topProducers: [
          { name: 'EcoEnergy Solutions', volume: 5200, avgPrice: 25.50 },
          { name: 'Pacific Green Energy', volume: 4800, avgPrice: 22.75 },
          { name: 'Solar Innovations LLC', volume: 3600, avgPrice: 18.90 }
        ],
        trendingCredits: ['HY-001', 'SO-003']
      };

      setMarketAnalytics(mockAnalytics);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePurchase = (credit) => {
    setSelectedCredit(credit);
    setPurchaseForm({
      ...purchaseForm,
      creditId: credit.id,
      totalCost: 0
    });
    setShowPurchaseModal(true);
  };

  const calculateTotalCost = () => {
    if (!selectedCredit || !purchaseForm.quantity) return 0;
    const quantity = parseInt(purchaseForm.quantity);
    const price = selectedCredit.pricePerCredit;
    const subtotal = quantity * price;
    const fees = subtotal * 0.025; // 2.5% platform fee
    return subtotal + fees;
  };

  const submitPurchase = async () => {
    if (!purchaseForm.quantity || parseInt(purchaseForm.quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (parseInt(purchaseForm.quantity) > selectedCredit.availableCredits) {
      toast.error('Quantity exceeds available credits');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newTransaction = {
        id: `TXN-${Date.now()}`,
        type: 'purchase',
        creditId: selectedCredit.id,
        facilityName: selectedCredit.facilityName,
        quantity: parseInt(purchaseForm.quantity),
        pricePerCredit: selectedCredit.pricePerCredit,
        totalAmount: calculateTotalCost(),
        date: new Date(),
        status: 'completed',
        transactionHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
        gasUsed: `${(Math.random() * 0.01).toFixed(3)} ETH`
      };

      const newPortfolioItem = {
        id: `PORT-${Date.now()}`,
        creditId: selectedCredit.id,
        facilityName: selectedCredit.facilityName,
        energyType: selectedCredit.energyType,
        quantity: parseInt(purchaseForm.quantity),
        purchasePrice: selectedCredit.pricePerCredit,
        currentPrice: selectedCredit.pricePerCredit,
        purchaseDate: new Date(),
        status: 'active',
        totalValue: calculateTotalCost(),
        unrealizedGain: 0,
        carbonOffset: parseInt(purchaseForm.quantity) * 0.5, // Estimated offset
        retired: purchaseForm.retireImmediately,
        dividendsEarned: 0
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setMyPortfolio(prev => [newPortfolioItem, ...prev]);

      // Update available credits
      setAvailableCredits(prev => prev.map(credit =>
        credit.id === selectedCredit.id
          ? { ...credit, availableCredits: credit.availableCredits - parseInt(purchaseForm.quantity) }
          : credit
      ));

      setShowPurchaseModal(false);
      setSelectedCredit(null);
      setPurchaseForm({
        creditId: '',
        quantity: '',
        totalCost: 0,
        preferredPrice: '',
        paymentMethod: 'metamask',
        escrowEnabled: true,
        deliveryDate: '',
        useForOffset: false,
        retireImmediately: false,
        certificateDelivery: 'digital',
        projectType: '',
        vintageYear: '',
        additionalBenefits: []
      });

      toast.success(`Successfully purchased ${purchaseForm.quantity} credits!`);
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const retireCredit = async (portfolioItem) => {
    if (window.confirm(`Are you sure you want to retire ${portfolioItem.quantity} credits? This action cannot be undone.`)) {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        setMyPortfolio(prev => prev.map(item =>
          item.id === portfolioItem.id
            ? { ...item, retired: true, status: 'retired' }
            : item
        ));

        toast.success('Credits retired successfully for carbon offset!');
      } catch (error) {
        toast.error('Failed to retire credits');
        console.error(error);
      }
    }
  };

  const filteredCredits = availableCredits.filter(credit => {
    if (filters.energyType !== 'all' && credit.energyType !== filters.energyType) return false;
    if (filters.certificationStandard !== 'all' && credit.certificationStandard !== filters.certificationStandard) return false;
    if (filters.vintageYear !== 'all' && credit.vintageYear !== filters.vintageYear) return false;
    if (searchQuery && !credit.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !credit.producer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !credit.producerCompany.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_low_high':
        return a.pricePerCredit - b.pricePerCredit;
      case 'price_high_low':
        return b.pricePerCredit - a.pricePerCredit;
      case 'sustainability_score':
        return b.sustainabilityScore - a.sustainabilityScore;
      case 'availability':
        return b.availableCredits - a.availableCredits;
      default:
        return 0;
    }
  });

  const calculatePortfolioStats = () => {
    const totalValue = myPortfolio.reduce((sum, item) => sum + item.totalValue, 0);
    const totalGain = myPortfolio.reduce((sum, item) => sum + item.unrealizedGain, 0);
    const totalOffset = myPortfolio.reduce((sum, item) => sum + item.carbonOffset, 0);
    const totalDividends = myPortfolio.reduce((sum, item) => sum + item.dividendsEarned, 0);

    return { totalValue, totalGain, totalOffset, totalDividends };
  };

  const portfolioStats = calculatePortfolioStats();

  if (loading && availableCredits.length === 0 && activeTab === 'marketplace') {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Green Energy Marketplace</h1>
          <p className="text-gray-400">Purchase and manage your green energy credits portfolio</p>
        </div>

        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <div className="text-right">
            <p className="text-white font-medium">${portfolioStats.totalValue.toFixed(2)} Portfolio Value</p>
            <p className={`text-sm font-medium ${portfolioStats.totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolioStats.totalGain >= 0 ? '+' : ''}${portfolioStats.totalGain.toFixed(2)} ({((portfolioStats.totalGain / (portfolioStats.totalValue - portfolioStats.totalGain)) * 100).toFixed(1)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Market Analytics */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Market Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">${marketAnalytics.averagePrice.toFixed(2)}</p>
            <p className="text-gray-400 text-sm">Average Price</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{marketAnalytics.totalVolume.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Total Volume</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${marketAnalytics.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketAnalytics.priceChange24h >= 0 ? '+' : ''}{marketAnalytics.priceChange24h.toFixed(1)}%
            </p>
            <p className="text-gray-400 text-sm">24h Change</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{portfolioStats.totalOffset.toFixed(1)} tons</p>
            <p className="text-gray-400 text-sm">CO2 Offset</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
          { id: 'portfolio', label: 'My Portfolio', icon: '📊' },
          { id: 'transactions', label: 'Transactions', icon: '📋' },
          { id: 'analytics', label: 'Analytics', icon: '📈' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 border-2 ${activeTab === tab.id
                ? `${tabColors[tab.id]} bg-white/10`
                : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
              }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'marketplace' && (
        <>
          {/* Filters and Search */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-4">
              <div className="lg:col-span-2">
                <Input
                  type="text"
                  placeholder="Search facilities, producers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <select
                value={filters.energyType}
                onChange={(e) => setFilters(prev => ({ ...prev, energyType: e.target.value }))}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all" className="bg-gray-800">All Energy Types</option>
                <option value="hydrogen" className="bg-gray-800">Hydrogen</option>
                <option value="solar" className="bg-gray-800">Solar</option>
                <option value="wind" className="bg-gray-800">Wind</option>
                <option value="hydro" className="bg-gray-800">Hydro</option>
              </select>

              <select
                value={filters.certificationStandard}
                onChange={(e) => setFilters(prev => ({ ...prev, certificationStandard: e.target.value }))}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all" className="bg-gray-800">All Standards</option>
                <option value="GOLD_STANDARD" className="bg-gray-800">Gold Standard</option>
                <option value="ISO_14064" className="bg-gray-800">ISO 14064</option>
                <option value="GREEN_H2" className="bg-gray-800">Green H2</option>
                <option value="VCS" className="bg-gray-800">VCS</option>
              </select>

              <select
                value={filters.vintageYear}
                onChange={(e) => setFilters(prev => ({ ...prev, vintageYear: e.target.value }))}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all" className="bg-gray-800">All Years</option>
                <option value="2024" className="bg-gray-800">2024</option>
                <option value="2023" className="bg-gray-800">2023</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="price_low_high" className="bg-gray-800">Price: Low to High</option>
                <option value="price_high_low" className="bg-gray-800">Price: High to Low</option>
                <option value="sustainability_score" className="bg-gray-800">Sustainability Score</option>
                <option value="availability" className="bg-gray-800">Availability</option>
              </select>
            </div>
          </div>

          {/* Credits Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCredits.map((credit) => (
              <div
                key={credit.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {credit.energyType === 'hydrogen' ? '⚡' :
                        credit.energyType === 'solar' ? '☀️' :
                          credit.energyType === 'wind' ? '💨' : '💧'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{credit.facilityName}</h3>
                      <p className="text-gray-400">
                        {credit.producer} • {credit.producerCompany}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${credit.pricePerCredit.toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">per credit</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${energyTypeColors[credit.energyType]}`}>
                    {credit.energyType.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${certificationColors[credit.certificationStandard]}`}>
                    {credit.certificationStandard.replace('_', ' ')}
                  </span>
                  {credit.trending && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      🔥 TRENDING
                    </span>
                  )}
                  {credit.verified && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                      ✓ VERIFIED
                    </span>
                  )}
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {credit.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Available Credits</p>
                    <p className="text-white font-medium">{credit.availableCredits.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Carbon Intensity</p>
                    <p className="text-white font-medium">{credit.carbonIntensity}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white font-medium">{credit.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Sustainability Score</p>
                    <p className="text-white font-medium">{credit.sustainabilityScore}/100</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-gray-400 text-sm">
                    <span>📍 {credit.location}</span>
                  </div>
                  <Button
                    onClick={() => handlePurchase(credit)}
                    variant="primary"
                  >
                    Purchase Credits
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'portfolio' && (
        <>
          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">${portfolioStats.totalValue.toFixed(2)}</p>
                <p className="text-gray-400 text-sm">Total Portfolio Value</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <p className={`text-2xl font-bold ${portfolioStats.totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolioStats.totalGain >= 0 ? '+' : ''}${portfolioStats.totalGain.toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm">Unrealized Gain/Loss</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{portfolioStats.totalOffset.toFixed(1)} tons</p>
                <p className="text-gray-400 text-sm">CO2 Offset Potential</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">${portfolioStats.totalDividends.toFixed(2)}</p>
                <p className="text-gray-400 text-sm">Dividends Earned</p>
              </div>
            </div>
          </div>

          {/* Portfolio Items */}
          <div className="space-y-4">
            {myPortfolio.map((item) => (
              <div
                key={item.id}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 ${item.retired ? 'opacity-75' : 'hover:border-white/30'
                  } transition-all duration-200`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">
                      {item.energyType === 'hydrogen' ? '⚡' :
                        item.energyType === 'solar' ? '☀️' :
                          item.energyType === 'wind' ? '💨' : '💧'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.facilityName}</h3>
                      <p className="text-gray-400">
                        {item.quantity} credits • Purchased: {item.purchaseDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-white">${item.totalValue.toFixed(2)}</p>
                    <p className={`text-sm font-medium ${item.unrealizedGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.unrealizedGain >= 0 ? '+' : ''}${item.unrealizedGain.toFixed(2)} ({((item.unrealizedGain / (item.totalValue - item.unrealizedGain)) * 100).toFixed(1)}%)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Purchase Price</p>
                    <p className="text-white font-medium">${item.purchasePrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Current Price</p>
                    <p className="text-white font-medium">${item.currentPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">CO2 Offset</p>
                    <p className="text-white font-medium">{item.carbonOffset.toFixed(1)} tons</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Dividends</p>
                    <p className="text-white font-medium">${item.dividendsEarned.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className={`font-medium ${item.retired ? 'text-orange-400' : 'text-green-400'}`}>
                      {item.retired ? 'RETIRED' : 'ACTIVE'}
                    </p>
                  </div>
                </div>

                {!item.retired && (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => retireCredit(item)}
                      variant="outline"
                      className="text-orange-400 border-orange-400 hover:bg-orange-400/10"
                    >
                      Retire for Offset
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {myPortfolio.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Holdings Yet</h3>
                <p className="text-gray-400 mb-4">Start building your green energy portfolio today!</p>
                <Button onClick={() => setActiveTab('marketplace')}>
                  Browse Marketplace
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {txn.type === 'purchase' ? '🛒' :
                      txn.type === 'sale' ? '💰' : '♻️'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white capitalize">{txn.type}</h3>
                    <p className="text-gray-400">{txn.facilityName}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-white">${txn.totalAmount.toFixed(2)}</p>
                  <p className="text-gray-400 text-sm">{txn.quantity} credits × ${txn.pricePerCredit.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Date</p>
                  <p className="text-white">{txn.date.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <p className="text-green-400 font-medium">{txn.status.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Transaction Hash</p>
                  <p className="text-blue-400 font-mono">{txn.transactionHash}</p>
                </div>
                <div>
                  <p className="text-gray-400">Gas Used</p>
                  <p className="text-white">{txn.gasUsed}</p>
                </div>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Transactions Yet</h3>
              <p className="text-gray-400">Your transaction history will appear here.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Trends */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Market Trends</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Average Credit Price</span>
                <span className="text-white font-medium">${marketAnalytics.averagePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">24h Price Change</span>
                <span className={`font-medium ${marketAnalytics.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {marketAnalytics.priceChange24h >= 0 ? '+' : ''}{marketAnalytics.priceChange24h.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Market Volume</span>
                <span className="text-white font-medium">{marketAnalytics.totalVolume.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Top Producers */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Top Producers</h3>
            <div className="space-y-3">
              {marketAnalytics.topProducers.map((producer, index) => (
                <div key={producer.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-white">{producer.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{producer.volume.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">${producer.avgPrice.toFixed(2)} avg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && selectedCredit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Purchase Credits</h2>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Selected Credit Info */}
            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">{selectedCredit.facilityName}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Price per Credit</p>
                  <p className="text-white font-medium">${selectedCredit.pricePerCredit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Available Credits</p>
                  <p className="text-white font-medium">{selectedCredit.availableCredits.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Purchase Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantity of Credits
                </label>
                <Input
                  type="number"
                  value={purchaseForm.quantity}
                  onChange={(e) => setPurchaseForm(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Enter quantity"
                  max={selectedCredit.availableCredits}
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  value={purchaseForm.paymentMethod}
                  onChange={(e) => setPurchaseForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="metamask" className="bg-gray-800">MetaMask</option>
                  <option value="wallet_connect" className="bg-gray-800">Wallet Connect</option>
                  <option value="coinbase" className="bg-gray-800">Coinbase Wallet</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="retireImmediately"
                  checked={purchaseForm.retireImmediately}
                  onChange={(e) => setPurchaseForm(prev => ({ ...prev, retireImmediately: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="retireImmediately" className="text-white">
                  Retire immediately for carbon offset
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="escrowEnabled"
                  checked={purchaseForm.escrowEnabled}
                  onChange={(e) => setPurchaseForm(prev => ({ ...prev, escrowEnabled: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="escrowEnabled" className="text-white">
                  Use escrow service for secure transaction
                </label>
              </div>

              {/* Cost Breakdown */}
              {purchaseForm.quantity && (
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Cost Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Credits ({purchaseForm.quantity} × ${selectedCredit.pricePerCredit.toFixed(2)})</span>
                      <span className="text-white">${(parseInt(purchaseForm.quantity) * selectedCredit.pricePerCredit).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Platform Fee (2.5%)</span>
                      <span className="text-white">${((parseInt(purchaseForm.quantity) * selectedCredit.pricePerCredit) * 0.025).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/20 pt-2 flex justify-between">
                      <span className="text-white font-medium">Total</span>
                      <span className="text-white font-bold">${calculateTotalCost().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitPurchase}
                  disabled={loading || !purchaseForm.quantity || parseInt(purchaseForm.quantity) <= 0}
                  className="flex-1"
                >
                  {loading ? <LoadingSpinner size="sm" /> : `Purchase for $${calculateTotalCost().toFixed(2)}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerMarketplace;
