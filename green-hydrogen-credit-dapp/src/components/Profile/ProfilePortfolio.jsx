import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { formatNumber } from '../../utils/format';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfilePortfolio = () => {
  const { user } = useUser();
  const [portfolio, setPortfolio] = useState({});
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  const [diversification, setDiversification] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Mock portfolio data
        const mockHoldings = [
          {
            id: 'solar_ca_2024',
            type: 'Solar Energy Credit',
            location: 'California, USA',
            issuer: 'SolarTech Inc.',
            quantity: 250,
            avgPurchasePrice: 45.50,
            currentPrice: 52.30,
            totalValue: 250 * 52.30,
            totalCost: 250 * 45.50,
            profitLoss: (52.30 - 45.50) * 250,
            profitLossPercent: ((52.30 - 45.50) / 45.50) * 100,
            certificates: [
              { id: 'CERT_001', mwh: 100, issueDate: '2024-01-15', status: 'active' },
              { id: 'CERT_002', mwh: 150, issueDate: '2024-02-10', status: 'active' }
            ],
            metadata: {
              vintage: '2024',
              energySource: 'Solar PV',
              carbonOffset: 125.5,
              verificationStandard: 'VCS',
              projectType: 'Renewable Energy'
            }
          },
          {
            id: 'wind_tx_2024',
            type: 'Wind Energy Credit',
            location: 'Texas, USA',
            issuer: 'WindForce Ltd.',
            quantity: 180,
            avgPurchasePrice: 38.75,
            currentPrice: 41.20,
            totalValue: 180 * 41.20,
            totalCost: 180 * 38.75,
            profitLoss: (41.20 - 38.75) * 180,
            profitLossPercent: ((41.20 - 38.75) / 38.75) * 100,
            certificates: [
              { id: 'CERT_003', mwh: 120, issueDate: '2024-01-20', status: 'active' },
              { id: 'CERT_004', mwh: 60, issueDate: '2024-03-05', status: 'active' }
            ],
            metadata: {
              vintage: '2024',
              energySource: 'Wind',
              carbonOffset: 90.0,
              verificationStandard: 'Gold Standard',
              projectType: 'Renewable Energy'
            }
          },
          {
            id: 'hydro_ny_2023',
            type: 'Hydro Energy Credit',
            location: 'New York, USA',
            issuer: 'HydroPower Co.',
            quantity: 120,
            avgPurchasePrice: 42.00,
            currentPrice: 39.80,
            totalValue: 120 * 39.80,
            totalCost: 120 * 42.00,
            profitLoss: (39.80 - 42.00) * 120,
            profitLossPercent: ((39.80 - 42.00) / 42.00) * 100,
            certificates: [
              { id: 'CERT_005', mwh: 120, issueDate: '2023-12-10', status: 'active' }
            ],
            metadata: {
              vintage: '2023',
              energySource: 'Hydroelectric',
              carbonOffset: 75.6,
              verificationStandard: 'VCS',
              projectType: 'Renewable Energy'
            }
          },
          {
            id: 'geothermal_ca_2024',
            type: 'Geothermal Energy Credit',
            location: 'California, USA',
            issuer: 'GeoEnergy Inc.',
            quantity: 85,
            avgPurchasePrice: 48.90,
            currentPrice: 53.10,
            totalValue: 85 * 53.10,
            totalCost: 85 * 48.90,
            profitLoss: (53.10 - 48.90) * 85,
            profitLossPercent: ((53.10 - 48.90) / 48.90) * 100,
            certificates: [
              { id: 'CERT_006', mwh: 85, issueDate: '2024-02-28', status: 'active' }
            ],
            metadata: {
              vintage: '2024',
              energySource: 'Geothermal',
              carbonOffset: 51.0,
              verificationStandard: 'Gold Standard',
              projectType: 'Renewable Energy'
            }
          }
        ];

        setHoldings(mockHoldings);

        // Calculate portfolio metrics
        const totalValue = mockHoldings.reduce((sum, holding) => sum + holding.totalValue, 0);
        const totalCost = mockHoldings.reduce((sum, holding) => sum + holding.totalCost, 0);
        const totalProfitLoss = totalValue - totalCost;

        setPortfolioValue(totalValue);
        setTotalInvestment(totalCost);
        setProfitLoss(totalProfitLoss);

        // Calculate diversification
        const energySources = {};
        mockHoldings.forEach(holding => {
          const source = holding.metadata.energySource;
          if (energySources[source]) {
            energySources[source] += holding.totalValue;
          } else {
            energySources[source] = holding.totalValue;
          }
        });

        const diversificationData = Object.entries(energySources).map(([source, value]) => ({
          source,
          value,
          percentage: (value / totalValue) * 100
        }));

        setDiversification(diversificationData);

        // Mock recent activity
        setRecentActivity([
          {
            id: 1,
            action: 'Purchase',
            asset: 'Solar Energy Credit',
            quantity: 50,
            price: 52.30,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'completed'
          },
          {
            id: 2,
            action: 'Retirement',
            asset: 'Wind Energy Credit',
            quantity: 25,
            price: 41.20,
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            status: 'completed'
          },
          {
            id: 3,
            action: 'Transfer',
            asset: 'Hydro Energy Credit',
            quantity: 30,
            price: 39.80,
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            status: 'completed'
          }
        ]);

        setPortfolio({
          totalHoldings: mockHoldings.length,
          totalCredits: mockHoldings.reduce((sum, h) => sum + h.quantity, 0),
          totalCarbonOffset: mockHoldings.reduce((sum, h) => sum + h.metadata.carbonOffset, 0),
          averageReturn: (totalProfitLoss / totalCost) * 100
        });

      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [selectedTimeframe]);

  const getSourceColor = (source) => {
    const colors = {
      'Solar PV': 'from-yellow-500 to-orange-500',
      'Wind': 'from-blue-500 to-cyan-500',
      'Hydroelectric': 'from-blue-600 to-blue-800',
      'Geothermal': 'from-red-500 to-orange-600'
    };
    return colors[source] || 'from-gray-500 to-gray-700';
  };

  const getSourceIcon = (source) => {
    const icons = {
      'Solar PV': '☀️',
      'Wind': '💨',
      'Hydroelectric': '💧',
      'Geothermal': '🌋'
    };
    return icons[source] || '⚡';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Portfolio Overview</h1>
            <p className="text-gray-400">Track your green energy credit investments</p>
          </div>

          <div className="flex gap-3 mt-4 lg:mt-0">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="secondary" size="sm">
              Export Report
            </Button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <span className="text-2xl">💰</span>
              </div>
              <span className={`text-sm font-medium ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {profitLoss >= 0 ? '+' : ''}{((profitLoss / totalInvestment) * 100).toFixed(1)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              ${formatNumber(portfolioValue, 2)}
            </h3>
            <p className="text-gray-400 text-sm">Portfolio Value</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <span className="text-2xl">⚡</span>
              </div>
              <span className="text-green-400 text-sm font-medium">+5%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatNumber(portfolio.totalCredits)}
            </h3>
            <p className="text-gray-400 text-sm">Total Credits</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <span className="text-2xl">🌱</span>
              </div>
              <span className="text-green-400 text-sm font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatNumber(portfolio.totalCarbonOffset, 1)}t
            </h3>
            <p className="text-gray-400 text-sm">CO2 Offset</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <span className="text-2xl">📈</span>
              </div>
              <span className={`text-sm font-medium ${portfolio.averageReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolio.averageReturn >= 0 ? '+' : ''}{formatNumber(portfolio.averageReturn, 1)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatNumber(portfolio.averageReturn, 1)}%
            </h3>
            <p className="text-gray-400 text-sm">Avg Return</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Diversification Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6">Portfolio Diversification</h3>
            <div className="space-y-4">
              {diversification.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getSourceIcon(item.source)}</span>
                    <span className="text-white font-medium">{item.source}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getSourceColor(item.source)} transition-all duration-300`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className={`p-2 rounded-lg ${activity.action === 'Purchase' ? 'bg-green-500/20 text-green-400' :
                    activity.action === 'Retirement' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                    <span className="text-sm">
                      {activity.action === 'Purchase' ? '💰' :
                        activity.action === 'Retirement' ? '♻️' : '📤'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{activity.action}</h4>
                    <p className="text-gray-400 text-sm">
                      {activity.quantity} x {activity.asset}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">
                      ${formatNumber(activity.quantity * activity.price, 2)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {activity.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-xl font-bold text-white">Current Holdings</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Asset</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Avg Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Current Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Total Value</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">P&L</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {holdings.map((holding) => (
                  <tr key={holding.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getSourceColor(holding.metadata.energySource)}`}>
                          <span className="text-white text-sm">
                            {getSourceIcon(holding.metadata.energySource)}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{holding.type}</div>
                          <div className="text-gray-400 text-sm">{holding.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{formatNumber(holding.quantity)}</div>
                      <div className="text-gray-400 text-sm">{holding.certificates.length} certificates</div>
                    </td>
                    <td className="px-6 py-4 text-white">
                      ${holding.avgPurchasePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-white">
                      ${holding.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      ${formatNumber(holding.totalValue, 2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium ${holding.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.profitLoss >= 0 ? '+' : ''}${formatNumber(Math.abs(holding.profitLoss), 2)}
                      </div>
                      <div className={`text-sm ${holding.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.profitLoss >= 0 ? '+' : ''}{holding.profitLossPercent.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary">View</Button>
                        <Button size="sm" variant="primary">Trade</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePortfolio;
