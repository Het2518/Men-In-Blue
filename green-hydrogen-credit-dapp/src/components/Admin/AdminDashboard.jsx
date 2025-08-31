import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);

  const [userForm, setUserForm] = useState({
    id: '',
    name: '',
    email: '',
    role: 'producer',
    status: 'active',
    company: '',
    phone: '',
    address: '',
    kycStatus: 'pending',
    verificationDocuments: [],
    permissions: [],
    registrationDate: new Date(),
    lastLogin: null,
    creditBalance: 0,
    totalTransactions: 0,
    complianceScore: 0
  });

  const [metadataForm, setMetadataForm] = useState({
    platformFee: '2.5',
    minimumCreditAmount: '10',
    maximumCreditAmount: '10000',
    verificationPeriod: '30',
    escrowEnabled: true,
    autoRetirement: false,
    marketplaceEnabled: true,
    analyticsEnabled: true,
    notificationsEnabled: true,
    backupFrequency: 'daily',
    maintenanceMode: false,
    systemVersion: '1.0.0',
    lastUpdate: new Date().toISOString(),
    supportedStandards: ['GOLD_STANDARD', 'ISO_14064', 'GREEN_H2', 'VCS'],
    maxFileSize: '10',
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png']
  });

  const [filters, setFilters] = useState({
    userRole: 'all',
    userStatus: 'all',
    certificateStatus: 'all',
    transactionType: 'all',
    dateRange: 'all'
  });

  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalCertificates: 0,
    totalTransactions: 0,
    totalVolume: 0,
    averageTransactionSize: 0,
    systemUptime: '99.9%',
    activeUsers24h: 0,
    pendingVerifications: 0
  });

  const tabColors = {
    overview: 'text-blue-400 border-blue-400',
    users: 'text-green-400 border-green-400',
    certificates: 'text-purple-400 border-purple-400',
    transactions: 'text-yellow-400 border-yellow-400',
    analytics: 'text-red-400 border-red-400',
    settings: 'text-gray-400 border-gray-400'
  };

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  };

  const roleColors = {
    admin: 'bg-purple-500/20 text-purple-400',
    producer: 'bg-blue-500/20 text-blue-400',
    certifier: 'bg-green-500/20 text-green-400',
    buyer: 'bg-orange-500/20 text-orange-400'
  };

  const fetchUsers = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUsers = [
      {
        id: 'USER-001',
        name: 'John Smith',
        email: 'john.smith@ecoenergy.com',
        role: 'producer',
        status: 'active',
        company: 'EcoEnergy Solutions',
        phone: '+1-555-0123',
        address: '123 Green St, San Francisco, CA',
        kycStatus: 'verified',
        registrationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
        creditBalance: 2450,
        totalTransactions: 15,
        complianceScore: 95
      },
      {
        id: 'USER-002',
        name: 'Maria Garcia',
        email: 'maria.garcia@pacificgreen.com',
        role: 'producer',
        status: 'active',
        company: 'Pacific Green Energy',
        phone: '+1-555-0124',
        address: '456 Wind Ave, Portland, OR',
        kycStatus: 'verified',
        registrationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        creditBalance: 1800,
        totalTransactions: 8,
        complianceScore: 88
      },
      {
        id: 'USER-003',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@greenverify.org',
        role: 'certifier',
        status: 'active',
        company: 'Green Verification Corp',
        phone: '+1-555-0125',
        address: '789 Cert Plaza, Austin, TX',
        kycStatus: 'verified',
        registrationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        lastLogin: new Date(Date.now() - 30 * 60 * 1000),
        creditBalance: 0,
        totalTransactions: 45,
        complianceScore: 98
      },
      {
        id: 'USER-004',
        name: 'Michael Chen',
        email: 'michael.chen@climateinvest.com',
        role: 'buyer',
        status: 'active',
        company: 'Climate Investments LLC',
        phone: '+1-555-0126',
        address: '321 Carbon St, New York, NY',
        kycStatus: 'pending',
        registrationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
        creditBalance: 500,
        totalTransactions: 3,
        complianceScore: 75
      }
    ];

    setUsers(mockUsers);
  }, []);

  const fetchCertificates = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockCertificates = [
      {
        id: 'CERT-001',
        facilityName: 'GreenTech Hydrogen Plant',
        producer: 'John Smith',
        status: 'approved',
        energyType: 'hydrogen',
        submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        approvalDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        certifier: 'Dr. Sarah Johnson',
        verificationScore: 95,
        carbonIntensity: '0.5 kg CO2/kg H2'
      },
      {
        id: 'CERT-002',
        facilityName: 'Pacific Wind H2 Generator',
        producer: 'Maria Garcia',
        status: 'pending',
        energyType: 'hydrogen',
        submissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        approvalDate: null,
        certifier: null,
        verificationScore: null,
        carbonIntensity: '0.3 kg CO2/kg H2'
      }
    ];

    setCertificates(mockCertificates);
  }, []);

  const fetchTransactions = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockTransactions = [
      {
        id: 'TXN-001',
        type: 'purchase',
        buyer: 'Michael Chen',
        seller: 'John Smith',
        creditId: 'CERT-001',
        quantity: 100,
        amount: 2420,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'completed',
        fees: 60.50
      },
      {
        id: 'TXN-002',
        type: 'retirement',
        buyer: 'Michael Chen',
        seller: null,
        creditId: 'CERT-001',
        quantity: 50,
        amount: 1210,
        date: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'completed',
        fees: 0
      }
    ];

    setTransactions(mockTransactions);
  }, []);

  const fetchSystemMetrics = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockMetrics = {
      cpu: 45,
      memory: 68,
      storage: 32,
      network: 12,
      responseTime: 125,
      errorRate: 0.02,
      throughput: 850
    };

    setSystemMetrics(mockMetrics);
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockLogs = [
      {
        id: 'LOG-001',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        userId: 'USER-001',
        action: 'certificate_submitted',
        resource: 'CERT-001',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        result: 'success'
      },
      {
        id: 'LOG-002',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        userId: 'USER-003',
        action: 'certificate_approved',
        resource: 'CERT-001',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0...',
        result: 'success'
      }
    ];

    setAuditLogs(mockLogs);
  }, []);

  const fetchSystemStats = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockStats = {
      totalUsers: 156,
      totalCertificates: 89,
      totalTransactions: 342,
      totalVolume: 125678,
      averageTransactionSize: 367.25,
      systemUptime: '99.97%',
      activeUsers24h: 47,
      pendingVerifications: 8
    };

    setSystemStats(mockStats);
  }, []);

  const fetchSystemData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchCertificates(),
        fetchTransactions(),
        fetchSystemMetrics(),
        fetchAuditLogs(),
        fetchSystemStats()
      ]);
    } catch (error) {
      toast.error('Failed to load system data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, fetchCertificates, fetchTransactions, fetchSystemMetrics, fetchAuditLogs, fetchSystemStats]);

  useEffect(() => {
    fetchSystemData();
  }, [fetchSystemData]);

  const handleUserAction = async (userId, action) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          switch (action) {
            case 'suspend':
              return { ...user, status: 'suspended' };
            case 'activate':
              return { ...user, status: 'active' };
            case 'deactivate':
              return { ...user, status: 'inactive' };
            default:
              return user;
          }
        }
        return user;
      }));

      toast.success(`User ${action}d successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} user`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const editUser = (user) => {
    setSelectedUser(user);
    setUserForm({ ...user });
    setShowUserModal(true);
  };

  const saveUser = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (selectedUser) {
        setUsers(prev => prev.map(user => user.id === selectedUser.id ? { ...userForm } : user));
        toast.success('User updated successfully');
      } else {
        const newUser = {
          ...userForm,
          id: `USER-${Date.now()}`,
          registrationDate: new Date()
        };
        setUsers(prev => [newUser, ...prev]);
        toast.success('User created successfully');
      }

      setShowUserModal(false);
      setSelectedUser(null);
      setUserForm({
        id: '',
        name: '',
        email: '',
        role: 'producer',
        status: 'active',
        company: '',
        phone: '',
        address: '',
        kycStatus: 'pending',
        verificationDocuments: [],
        permissions: [],
        registrationDate: new Date(),
        lastLogin: null,
        creditBalance: 0,
        totalTransactions: 0,
        complianceScore: 0
      });
    } catch (error) {
      toast.error('Failed to save user');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateSystemMetadata = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update system metadata
      setMetadataForm(prev => ({
        ...prev,
        lastUpdate: new Date().toISOString()
      }));

      toast.success('System metadata updated successfully');
      setShowMetadataModal(false);
    } catch (error) {
      toast.error('Failed to update system metadata');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (dataType) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const data = {
        users: dataType === 'users' || dataType === 'all' ? users : null,
        certificates: dataType === 'certificates' || dataType === 'all' ? certificates : null,
        transactions: dataType === 'transactions' || dataType === 'all' ? transactions : null,
        auditLogs: dataType === 'audit' || dataType === 'all' ? auditLogs : null
      };

      const filename = `${dataType}_export_${new Date().toISOString().split('T')[0]}.json`;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`${dataType} data exported successfully`);
    } catch (error) {
      toast.error('Export failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && Object.keys(systemStats).length === 0) {
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
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">System management and administration</p>
        </div>

        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <div className="text-right">
            <p className="text-white font-medium">System Status: <span className="text-green-400">Online</span></p>
            <p className="text-gray-400 text-sm">Uptime: {systemStats.systemUptime}</p>
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">👥</div>
            <span className="text-blue-400 text-sm font-medium">+12 today</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{systemStats.totalUsers.toLocaleString()}</h3>
          <p className="text-gray-400 text-sm">Total Users</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">📋</div>
            <span className="text-green-400 text-sm font-medium">+5 pending</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{systemStats.totalCertificates.toLocaleString()}</h3>
          <p className="text-gray-400 text-sm">Certificates</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">💰</div>
            <span className="text-yellow-400 text-sm font-medium">+23 today</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{systemStats.totalTransactions.toLocaleString()}</h3>
          <p className="text-gray-400 text-sm">Transactions</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">📊</div>
            <span className="text-purple-400 text-sm font-medium">${systemStats.averageTransactionSize.toFixed(2)} avg</span>
          </div>
          <h3 className="text-2xl font-bold text-white">${systemStats.totalVolume.toLocaleString()}</h3>
          <p className="text-gray-400 text-sm">Total Volume</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: '🏠' },
          { id: 'users', label: 'Users', icon: '👥' },
          { id: 'certificates', label: 'Certificates', icon: '📋' },
          { id: 'transactions', label: 'Transactions', icon: '💰' },
          { id: 'analytics', label: 'Analytics', icon: '📈' },
          { id: 'settings', label: 'Settings', icon: '⚙️' }
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
      {activeTab === 'overview' && (
        <>
          {/* System Metrics */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">System Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
              {Object.entries(systemMetrics).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <div className="absolute inset-0 bg-gray-700 rounded-full"></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
                      style={{
                        clipPath: `polygon(0 ${100 - (typeof value === 'number' ? Math.min(value, 100) : 0)}%, 100% ${100 - (typeof value === 'number' ? Math.min(value, 100) : 0)}%, 100% 100%, 0% 100%)`
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
                      {typeof value === 'number' ? `${value}${key === 'responseTime' ? 'ms' : key === 'throughput' ? '' : '%'}` : value}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {log.action.includes('certificate') ? '📋' :
                        log.action.includes('user') ? '👤' :
                          log.action.includes('transaction') ? '💰' : '📊'}
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">
                        {log.action.replace(/_/g, ' ')}
                      </p>
                      <p className="text-gray-400 text-sm">
                        User: {log.userId} • Resource: {log.resource}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">{log.timestamp.toLocaleTimeString()}</p>
                    <p className={`text-xs font-medium ${log.result === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {log.result.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <>
          {/* Users Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <div className="flex gap-3 mt-4 lg:mt-0">
              <Button
                onClick={() => setShowUserModal(true)}
                variant="primary"
              >
                Add New User
              </Button>
              <Button
                onClick={() => exportData('users')}
                variant="outline"
              >
                Export Users
              </Button>
            </div>
          </div>

          {/* Users Filter */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.userRole}
                onChange={(e) => setFilters(prev => ({ ...prev, userRole: e.target.value }))}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all" className="bg-gray-800">All Roles</option>
                <option value="producer" className="bg-gray-800">Producer</option>
                <option value="certifier" className="bg-gray-800">Certifier</option>
                <option value="buyer" className="bg-gray-800">Buyer</option>
                <option value="admin" className="bg-gray-800">Admin</option>
              </select>

              <select
                value={filters.userStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, userStatus: e.target.value }))}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all" className="bg-gray-800">All Status</option>
                <option value="active" className="bg-gray-800">Active</option>
                <option value="inactive" className="bg-gray-800">Inactive</option>
                <option value="suspended" className="bg-gray-800">Suspended</option>
                <option value="pending" className="bg-gray-800">Pending</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 text-gray-400 font-medium">User</th>
                    <th className="text-left py-3 text-gray-400 font-medium">Role</th>
                    <th className="text-left py-3 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 text-gray-400 font-medium">KYC</th>
                    <th className="text-left py-3 text-gray-400 font-medium">Last Login</th>
                    <th className="text-left py-3 text-gray-400 font-medium">Credits</th>
                    <th className="text-left py-3 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user => {
                    if (filters.userRole !== 'all' && user.role !== filters.userRole) return false;
                    if (filters.userStatus !== 'all' && user.status !== filters.userStatus) return false;
                    return true;
                  }).map((userItem) => (
                    <tr key={userItem.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-4">
                        <div>
                          <p className="text-white font-medium">{userItem.name}</p>
                          <p className="text-gray-400 text-sm">{userItem.email}</p>
                          <p className="text-gray-500 text-xs">{userItem.company}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleColors[userItem.role]}`}>
                          {userItem.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[userItem.status]}`}>
                          {userItem.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${userItem.kycStatus === 'verified' ? 'text-green-400' :
                            userItem.kycStatus === 'pending' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                          {userItem.kycStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 text-white text-sm">
                        {userItem.lastLogin ? userItem.lastLogin.toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-4 text-white font-medium">
                        {userItem.creditBalance.toLocaleString()}
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => editUser(userItem)}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>
                          {userItem.status === 'active' ? (
                            <Button
                              onClick={() => handleUserAction(userItem.id, 'suspend')}
                              variant="outline"
                              size="sm"
                              className="text-red-400 border-red-400 hover:bg-red-400/10"
                            >
                              Suspend
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleUserAction(userItem.id, 'activate')}
                              variant="outline"
                              size="sm"
                              className="text-green-400 border-green-400 hover:bg-green-400/10"
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'certificates' && (
        <>
          {/* Certificates Management */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Certificate Management</h2>
            <Button
              onClick={() => exportData('certificates')}
              variant="outline"
            >
              Export Certificates
            </Button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{cert.facilityName}</h3>
                      <p className="text-gray-400">Producer: {cert.producer} • ID: {cert.id}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[cert.status]}`}>
                      {cert.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Energy Type</p>
                      <p className="text-white font-medium capitalize">{cert.energyType}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Submission Date</p>
                      <p className="text-white font-medium">{cert.submissionDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Certifier</p>
                      <p className="text-white font-medium">{cert.certifier || 'Pending Assignment'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Score</p>
                      <p className="text-white font-medium">{cert.verificationScore || 'Pending'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'transactions' && (
        <>
          {/* Transactions Management */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Transaction Management</h2>
            <Button
              onClick={() => exportData('transactions')}
              variant="outline"
            >
              Export Transactions
            </Button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="space-y-4">
              {transactions.map((txn) => (
                <div key={txn.id} className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {txn.type === 'purchase' ? '🛒' :
                          txn.type === 'sale' ? '💰' : '♻️'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white capitalize">{txn.type}</h3>
                        <p className="text-gray-400">ID: {txn.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">${txn.amount.toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">Fee: ${txn.fees.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Buyer</p>
                      <p className="text-white font-medium">{txn.buyer}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Seller</p>
                      <p className="text-white font-medium">{txn.seller || 'System'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Quantity</p>
                      <p className="text-white font-medium">{txn.quantity} credits</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="text-white font-medium">{txn.date.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Health */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6">System Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Server Response Time</span>
                <span className="text-white font-medium">{systemMetrics.responseTime}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Error Rate</span>
                <span className="text-white font-medium">{(systemMetrics.errorRate * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Throughput</span>
                <span className="text-white font-medium">{systemMetrics.throughput} req/min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Users (24h)</span>
                <span className="text-white font-medium">{systemStats.activeUsers24h}</span>
              </div>
            </div>
          </div>

          {/* Pending Items */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6">Pending Items</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pending Verifications</span>
                <span className="text-yellow-400 font-medium">{systemStats.pendingVerifications}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pending KYC Reviews</span>
                <span className="text-yellow-400 font-medium">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pending Certificates</span>
                <span className="text-yellow-400 font-medium">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pending Transactions</span>
                <span className="text-yellow-400 font-medium">2</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <>
          {/* System Settings */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">System Settings</h2>
            <Button
              onClick={() => setShowMetadataModal(true)}
              variant="primary"
            >
              Update Metadata
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Platform Configuration */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Platform Configuration</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Platform Fee</span>
                  <span className="text-white font-medium">{metadataForm.platformFee}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Min Credit Amount</span>
                  <span className="text-white font-medium">{metadataForm.minimumCreditAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Max Credit Amount</span>
                  <span className="text-white font-medium">{metadataForm.maximumCreditAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Verification Period</span>
                  <span className="text-white font-medium">{metadataForm.verificationPeriod} days</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">System Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Marketplace</span>
                  <span className={`font-medium ${metadataForm.marketplaceEnabled ? 'text-green-400' : 'text-red-400'}`}>
                    {metadataForm.marketplaceEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Escrow Service</span>
                  <span className={`font-medium ${metadataForm.escrowEnabled ? 'text-green-400' : 'text-red-400'}`}>
                    {metadataForm.escrowEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Analytics</span>
                  <span className={`font-medium ${metadataForm.analyticsEnabled ? 'text-green-400' : 'text-red-400'}`}>
                    {metadataForm.analyticsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Maintenance Mode</span>
                  <span className={`font-medium ${metadataForm.maintenanceMode ? 'text-red-400' : 'text-green-400'}`}>
                    {metadataForm.maintenanceMode ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Export & Backup */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mt-8">
            <h3 className="text-xl font-bold text-white mb-6">Export & Backup</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                onClick={() => exportData('all')}
                variant="outline"
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Export All Data'}
              </Button>
              <Button
                onClick={() => exportData('users')}
                variant="outline"
              >
                Export Users
              </Button>
              <Button
                onClick={() => exportData('certificates')}
                variant="outline"
              >
                Export Certificates
              </Button>
              <Button
                onClick={() => exportData('audit')}
                variant="outline"
              >
                Export Audit Logs
              </Button>
            </div>
          </div>
        </>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <Input
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <Input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="producer" className="bg-gray-800">Producer</option>
                    <option value="certifier" className="bg-gray-800">Certifier</option>
                    <option value="buyer" className="bg-gray-800">Buyer</option>
                    <option value="admin" className="bg-gray-800">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active" className="bg-gray-800">Active</option>
                    <option value="inactive" className="bg-gray-800">Inactive</option>
                    <option value="suspended" className="bg-gray-800">Suspended</option>
                    <option value="pending" className="bg-gray-800">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                <Input
                  value={userForm.company}
                  onChange={(e) => setUserForm(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <Input
                    value={userForm.phone}
                    onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">KYC Status</label>
                  <select
                    value={userForm.kycStatus}
                    onChange={(e) => setUserForm(prev => ({ ...prev, kycStatus: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending" className="bg-gray-800">Pending</option>
                    <option value="verified" className="bg-gray-800">Verified</option>
                    <option value="rejected" className="bg-gray-800">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveUser}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? <LoadingSpinner size="sm" /> : (selectedUser ? 'Update User' : 'Create User')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metadata Modal */}
      {showMetadataModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">System Metadata</h2>
              <button
                onClick={() => setShowMetadataModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Platform Fee (%)</label>
                  <Input
                    type="number"
                    value={metadataForm.platformFee}
                    onChange={(e) => setMetadataForm(prev => ({ ...prev, platformFee: e.target.value }))}
                    placeholder="2.5"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Verification Period (days)</label>
                  <Input
                    type="number"
                    value={metadataForm.verificationPeriod}
                    onChange={(e) => setMetadataForm(prev => ({ ...prev, verificationPeriod: e.target.value }))}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Min Credit Amount</label>
                  <Input
                    type="number"
                    value={metadataForm.minimumCreditAmount}
                    onChange={(e) => setMetadataForm(prev => ({ ...prev, minimumCreditAmount: e.target.value }))}
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Credit Amount</label>
                  <Input
                    type="number"
                    value={metadataForm.maximumCreditAmount}
                    onChange={(e) => setMetadataForm(prev => ({ ...prev, maximumCreditAmount: e.target.value }))}
                    placeholder="10000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max File Size (MB)</label>
                  <Input
                    type="number"
                    value={metadataForm.maxFileSize}
                    onChange={(e) => setMetadataForm(prev => ({ ...prev, maxFileSize: e.target.value }))}
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Backup Frequency</label>
                  <select
                    value={metadataForm.backupFrequency}
                    onChange={(e) => setMetadataForm(prev => ({ ...prev, backupFrequency: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="hourly" className="bg-gray-800">Hourly</option>
                    <option value="daily" className="bg-gray-800">Daily</option>
                    <option value="weekly" className="bg-gray-800">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={metadataForm.escrowEnabled}
                      onChange={(e) => setMetadataForm(prev => ({ ...prev, escrowEnabled: e.target.checked }))}
                      className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Enable Escrow Service</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={metadataForm.marketplaceEnabled}
                      onChange={(e) => setMetadataForm(prev => ({ ...prev, marketplaceEnabled: e.target.checked }))}
                      className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Enable Marketplace</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={metadataForm.analyticsEnabled}
                      onChange={(e) => setMetadataForm(prev => ({ ...prev, analyticsEnabled: e.target.checked }))}
                      className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Enable Analytics</span>
                  </label>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={metadataForm.autoRetirement}
                      onChange={(e) => setMetadataForm(prev => ({ ...prev, autoRetirement: e.target.checked }))}
                      className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Enable Auto Retirement</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={metadataForm.notificationsEnabled}
                      onChange={(e) => setMetadataForm(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
                      className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Enable Notifications</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={metadataForm.maintenanceMode}
                      onChange={(e) => setMetadataForm(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                      className="w-5 h-5 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                    />
                    <span className="text-white">Maintenance Mode</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowMetadataModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={updateSystemMetadata}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Update Metadata'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
