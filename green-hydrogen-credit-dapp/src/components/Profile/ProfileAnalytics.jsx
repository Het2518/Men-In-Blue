import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { formatNumber } from '../../utils/format';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfileAnalytics = () => {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [chartData, setChartData] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({});

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock analytics data
        setAnalytics({
          totalTransactions: 156,
          totalVolume: 45678.90,
          averageTransactionSize: 293.07,
          successRate: 98.7,
          carbonOffset: 567.89,
          energyGenerated: 1234.56,
          certificatesIssued: 89,
          verificationScore: 9.4
        });

        // Mock chart data
        setChartData([
          { date: '2024-01-01', volume: 1200, transactions: 15 },
          { date: '2024-01-02', volume: 1800, transactions: 22 },
          { date: '2024-01-03', volume: 1500, transactions: 18 },
          { date: '2024-01-04', volume: 2200, transactions: 28 },
          { date: '2024-01-05', volume: 1900, transactions: 24 },
          { date: '2024-01-06', volume: 2400, transactions: 31 },
          { date: '2024-01-07', volume: 2100, transactions: 27 }
        ]);

        setPerformanceMetrics({
          efficiency: 94.5,
          reliability: 98.2,
          sustainability: 96.8,
          compliance: 99.1,
          innovation: 87.3
        });

      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const getMetricColor = (value) => {
    if (value >= 90) return 'text-green-400';
    if (value >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMetricBgColor = (value) => {
    if (value >= 90) return 'from-green-500/20 to-green-600/20';
    if (value >= 70) return 'from-yellow-500/20 to-yellow-600/20';
    return 'from-red-500/20 to-red-600/20';
  };

  const getRoleSpecificMetrics = () => {
    const roleMetrics = {
      producer: [
        { label: 'Energy Generated', value: analytics.energyGenerated, unit: 'MWh', icon: '⚡' },
        { label: 'Carbon Offset', value: analytics.carbonOffset, unit: 'tons CO2', icon: '🌱' },
        { label: 'Certificates Issued', value: analytics.certificatesIssued, unit: 'certificates', icon: '📜' },
        { label: 'Verification Score', value: analytics.verificationScore, unit: '/10', icon: '⭐' }
      ],
      buyer: [
        { label: 'Credits Purchased', value: Math.floor(analytics.totalTransactions * 0.6), unit: 'credits', icon: '💰' },
        { label: 'Total Spent', value: analytics.totalVolume * 0.8, unit: 'USD', icon: '💳' },
        { label: 'Portfolio Value', value: analytics.totalVolume * 1.2, unit: 'USD', icon: '📈' },
        { label: 'Avg. Purchase Size', value: analytics.averageTransactionSize, unit: 'credits', icon: '📊' }
      ],
      certifier: [
        { label: 'Verifications Completed', value: Math.floor(analytics.totalTransactions * 0.3), unit: 'verifications', icon: '✅' },
        { label: 'Accuracy Rate', value: analytics.successRate, unit: '%', icon: '🎯' },
        { label: 'Time to Verify', value: 2.4, unit: 'hours avg', icon: '⏱️' },
        { label: 'Compliance Score', value: performanceMetrics.compliance, unit: '%', icon: '📋' }
      ],
      admin: [
        { label: 'System Uptime', value: 99.8, unit: '%', icon: '🔧' },
        { label: 'User Activity', value: analytics.totalTransactions, unit: 'actions', icon: '👥' },
        { label: 'Platform Health', value: 96.5, unit: '%', icon: '💚' },
        { label: 'Security Score', value: 98.9, unit: '%', icon: '🛡️' }
      ]
    };

    return roleMetrics[user?.role] || roleMetrics.buyer;
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
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Track your performance and impact metrics</p>
          </div>

          <div className="flex gap-3 mt-4 lg:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
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

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getRoleSpecificMetrics().map((metric, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <span className="text-2xl">{metric.icon}</span>
                </div>
                <span className="text-green-400 text-sm font-medium">+12%</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {typeof metric.value === 'number' ? formatNumber(metric.value) : metric.value}
                <span className="text-sm text-gray-400 ml-1">{metric.unit}</span>
              </h3>
              <p className="text-gray-400 text-sm">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6">Performance Score</h3>
            <div className="space-y-4">
              {Object.entries(performanceMetrics).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{key}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getMetricBgColor(value)} transition-all duration-300`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className={`font-medium ${getMetricColor(value)}`}>
                      {value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6">Quick Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-green-400 text-xl">📈</span>
                  <h4 className="text-green-300 font-medium">Positive Trend</h4>
                </div>
                <p className="text-gray-300 text-sm">Your transaction volume increased by 23% this month</p>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-blue-400 text-xl">🎯</span>
                  <h4 className="text-blue-300 font-medium">Goal Achievement</h4>
                </div>
                <p className="text-gray-300 text-sm">You've reached 89% of your monthly target</p>
              </div>

              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-purple-400 text-xl">⭐</span>
                  <h4 className="text-purple-300 font-medium">Recognition</h4>
                </div>
                <p className="text-gray-300 text-sm">Top 10% performer in your category</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Activity Overview</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Volume</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Transactions</span>
            </div>
          </div>

          <div className="h-64 flex items-end gap-4 justify-between">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1">
                  <div
                    className="bg-gradient-to-t from-blue-500/60 to-blue-400/80 rounded-t-lg transition-all duration-300 hover:from-blue-400 hover:to-blue-300"
                    style={{ height: `${(data.volume / 2400) * 120}px` }}
                  />
                  <div
                    className="bg-gradient-to-t from-green-500/60 to-green-400/80 rounded-t-lg transition-all duration-300 hover:from-green-400 hover:to-green-300"
                    style={{ height: `${(data.transactions / 31) * 60}px` }}
                  />
                </div>
                <span className="text-gray-400 text-xs">
                  {new Date(data.date).getDate()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🏆</span>
                <div>
                  <h4 className="text-yellow-300 font-medium">Top Performer</h4>
                  <p className="text-gray-400 text-sm">Earned 2 days ago</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Completed 100+ successful transactions</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🌱</span>
                <div>
                  <h4 className="text-green-300 font-medium">Eco Champion</h4>
                  <p className="text-gray-400 text-sm">Earned 1 week ago</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Offset 500+ tons of CO2</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <h4 className="text-blue-300 font-medium">Verification Expert</h4>
                  <p className="text-gray-400 text-sm">Earned 3 days ago</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Maintained 98%+ accuracy rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAnalytics;
