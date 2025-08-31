import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import Input from '../common/Input';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    bio: ''
  });
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false
  });
  const [preferencesSettings, setPreferencesSettings] = useState({
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    theme: 'dark',
    dashboardLayout: 'grid',
    autoRefresh: true,
    soundEnabled: true,
    emailDigest: 'weekly'
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showTransactions: true,
    showStats: true,
    allowMessaging: true,
    dataSharing: false,
    analyticsOptOut: false,
    marketingEmails: true
  });

  useEffect(() => {
    if (user) {
      setPersonalInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecuritySettingsChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferencesChange = (field, value) => {
    setPreferencesSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrivacyChange = (field, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const savePersonalInfo = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      // await updateProfile(personalInfo);
      toast.success('Personal information updated successfully!');
    } catch (error) {
      toast.error('Failed to update personal information');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      toast.success('Password updated successfully!');
      setSecuritySettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      toast.success('Preferences saved successfully!');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      toast.success('Privacy settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock export process
      toast.success('Data export initiated. You will receive an email shortly.');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delete process
        toast.success('Account deletion initiated. Please check your email for confirmation.');
      } catch (error) {
        toast.error('Failed to delete account');
      } finally {
        setLoading(false);
      }
    }
  };

  const sections = [
    { id: 'personal', title: 'Personal Information', icon: '👤' },
    { id: 'security', title: 'Security & Authentication', icon: '🔐' },
    { id: 'preferences', title: 'Preferences', icon: '⚙️' },
    { id: 'privacy', title: 'Privacy & Data', icon: '🔒' },
    { id: 'danger', title: 'Account Management', icon: '⚠️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeSection === section.id
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              {/* Personal Information */}
              {activeSection === 'personal' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
                    <p className="text-gray-400">Update your personal details and contact information</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Input
                      label="Full Name"
                      value={personalInfo.name}
                      onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                    <Input
                      label="Phone Number"
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                    <Input
                      label="Company"
                      value={personalInfo.company}
                      onChange={(e) => handlePersonalInfoChange('company', e.target.value)}
                      placeholder="Enter your company name"
                    />
                    <Input
                      label="Location"
                      value={personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      placeholder="Enter your location"
                    />
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                    <textarea
                      value={personalInfo.bio}
                      onChange={(e) => handlePersonalInfoChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={savePersonalInfo}
                      disabled={loading}
                      className="min-w-32"
                    >
                      {loading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Security & Authentication</h2>
                    <p className="text-gray-400">Manage your password and security settings</p>
                  </div>

                  {/* Password Change */}
                  <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Input
                        label="Current Password"
                        type="password"
                        value={securitySettings.currentPassword}
                        onChange={(e) => handleSecuritySettingsChange('currentPassword', e.target.value)}
                        placeholder="Enter current password"
                      />
                      <Input
                        label="New Password"
                        type="password"
                        value={securitySettings.newPassword}
                        onChange={(e) => handleSecuritySettingsChange('newPassword', e.target.value)}
                        placeholder="Enter new password"
                      />
                      <Input
                        label="Confirm New Password"
                        type="password"
                        value={securitySettings.confirmPassword}
                        onChange={(e) => handleSecuritySettingsChange('confirmPassword', e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button onClick={updatePassword} disabled={loading} variant="secondary">
                      Update Password
                    </Button>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-white font-medium">Enable 2FA</p>
                        <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorEnabled}
                          onChange={(e) => handleSecuritySettingsChange('twoFactorEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Email Notifications</p>
                          <p className="text-gray-400 text-sm">Receive notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.emailNotifications}
                            onChange={(e) => handleSecuritySettingsChange('emailNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">SMS Notifications</p>
                          <p className="text-gray-400 text-sm">Receive notifications via SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.smsNotifications}
                            onChange={(e) => handleSecuritySettingsChange('smsNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Management - Danger Zone */}
              {activeSection === 'danger' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Account Management</h2>
                    <p className="text-gray-400">Manage your account data and deletion</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <h3 className="text-lg font-semibold text-yellow-300 mb-2">Export Your Data</h3>
                      <p className="text-gray-300 mb-4">Download a copy of all your data</p>
                      <Button onClick={exportData} disabled={loading} variant="secondary">
                        {loading ? <LoadingSpinner size="sm" /> : 'Export Data'}
                      </Button>
                    </div>

                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <h3 className="text-lg font-semibold text-red-300 mb-2">Delete Account</h3>
                      <p className="text-gray-300 mb-4">Permanently delete your account and all associated data</p>
                      <Button onClick={deleteAccount} disabled={loading} className="bg-red-600 hover:bg-red-700">
                        {loading ? <LoadingSpinner size="sm" /> : 'Delete Account'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
