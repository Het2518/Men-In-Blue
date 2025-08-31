import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatNumber, truncateAddress } from '../../utils/format';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfileTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const transactionTypes = {
    issue: { label: 'Issue Credit', icon: '✨', color: 'text-green-400' },
    transfer: { label: 'Transfer', icon: '📤', color: 'text-blue-400' },
    retire: { label: 'Retire Credit', icon: '♻️', color: 'text-purple-400' },
    purchase: { label: 'Purchase', icon: '💰', color: 'text-yellow-400' },
    verify: { label: 'Verification', icon: '🔍', color: 'text-cyan-400' },
    mint: { label: 'Mint NFT', icon: '🎨', color: 'text-pink-400' }
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-green-500/20 text-green-400',
    failed: 'bg-red-500/20 text-red-400',
    processing: 'bg-blue-500/20 text-blue-400'
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock transaction data
        const mockTransactions = Array.from({ length: 50 }, (_, i) => {
          const types = Object.keys(transactionTypes);
          const statuses = Object.keys(statusColors);
          const type = types[Math.floor(Math.random() * types.length)];

          return {
            id: `tx_${i + 1}`,
            hash: `0x${Math.random().toString(16).substr(2, 40)}`,
            type,
            amount: Math.floor(Math.random() * 1000) + 10,
            from: user?.walletAddress || `0x${Math.random().toString(16).substr(2, 40)}`,
            to: `0x${Math.random().toString(16).substr(2, 40)}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            gasUsed: Math.floor(Math.random() * 100000) + 21000,
            gasFee: (Math.random() * 0.01 + 0.001).toFixed(6),
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
            confirmations: Math.floor(Math.random() * 100) + 1,
            metadata: {
              certificateId: `CERT_${Math.floor(Math.random() * 10000)}`,
              energySource: ['Solar', 'Wind', 'Hydro', 'Geothermal'][Math.floor(Math.random() * 4)],
              location: ['California', 'Texas', 'New York', 'Florida'][Math.floor(Math.random() * 4)]
            }
          };
        });

        setTransactions(mockTransactions);
        setTotalPages(Math.ceil(mockTransactions.length / 10));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const filteredAndSortedTransactions = transactions
    .filter(tx => {
      const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
      const matchesType = filterType === 'all' || tx.type === filterType;
      const matchesSearch = searchTerm === '' ||
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.metadata.certificateId.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesType && matchesSearch;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = a.timestamp.getTime();
          bValue = b.timestamp.getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'gasFee':
          aValue = parseFloat(a.gasFee);
          bValue = parseFloat(b.gasFee);
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const getTransactionDetails = (tx) => {
    const details = transactionTypes[tx.type];
    return {
      ...details,
      color: details?.color || 'text-gray-400'
    };
  };

  const exportTransactions = () => {
    const csvContent = [
      'Transaction ID,Hash,Type,Amount,Status,Gas Fee,Date,Block Number',
      ...filteredAndSortedTransactions.map(tx => [
        tx.id,
        tx.hash,
        tx.type,
        tx.amount,
        tx.status,
        tx.gasFee,
        tx.timestamp.toISOString(),
        tx.blockNumber
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
            <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
            <p className="text-gray-400">View and manage all your blockchain transactions</p>
          </div>

          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button onClick={exportTransactions} variant="secondary" size="sm">
              Export CSV
            </Button>
            <Button variant="primary" size="sm">
              New Transaction
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by hash, ID, or certificate..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {Object.entries(transactionTypes).map(([key, type]) => (
                  <option key={key} value={key}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="gasFee">Gas Fee</option>
                  <option value="status">Status</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Showing {paginatedTransactions.length} of {filteredAndSortedTransactions.length} transactions</span>
            <span>•</span>
            <span>Total: {formatNumber(transactions.length)} transactions</span>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Transaction</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Gas Fee</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {paginatedTransactions.map((tx) => {
                  const details = getTransactionDetails(tx);
                  return (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{tx.id}</div>
                          <div className="text-gray-400 text-sm font-mono">
                            {truncateAddress(tx.hash)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{details.icon}</span>
                          <span className={`${details.color} font-medium`}>
                            {details.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">
                          {formatNumber(tx.amount)}
                        </div>
                        <div className="text-gray-400 text-sm">credits</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[tx.status]}`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{tx.gasFee} ETH</div>
                        <div className="text-gray-400 text-sm">
                          {formatNumber(tx.gasUsed)} gas
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">
                          {tx.timestamp.toLocaleDateString()}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {tx.timestamp.toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-white/5 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Page {currentPage} of {Math.ceil(filteredAndSortedTransactions.length / 10)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(Math.ceil(filteredAndSortedTransactions.length / 10), currentPage + 1))}
                  disabled={currentPage === Math.ceil(filteredAndSortedTransactions.length / 10)}
                  className="px-3 py-1 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTransactions;
