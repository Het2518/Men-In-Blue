import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWeb3 } from '../contexts/Web3Context'; // Assuming a hook for Web3 context
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Notification from '../components/common/Notification';
import logo from '../assets/images/green-hydrogen.svg';

const Signup = () => {
  const [formData, setFormData] = useState({
    role: 'producer',
    companyName: '',
    contactEmail: '',
    walletAddress: '',
    industrySector: '', // For Buyer
    accreditationId: '', // For Certifier
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '' });

  const { signup, loading } = useAuth();
  const { account, connectWallet } = useWeb3();
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      setFormData((prev) => ({ ...prev, walletAddress: account }));
      if (errors.walletAddress) {
        setErrors((prev) => ({ ...prev, walletAddress: '' }));
      }
    }
  }, [account, errors.walletAddress]);


  const roleOptions = [
    { value: 'producer', label: 'Producer', description: 'Issue green hydrogen credits' },
    { value: 'buyer', label: 'Buyer', description: 'Purchase and retire credits' },
    { value: 'certifier', label: 'Certifier', description: 'Verify and audit credits' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleWalletConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setNotification({ message: 'Failed to connect wallet.', type: 'error' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { role, contactEmail, walletAddress, companyName, accreditationId } = formData;

    if (!contactEmail) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactEmail)) {
      newErrors.contactEmail = 'Email is invalid';
    }

    if (!walletAddress) {
      newErrors.walletAddress = 'Wallet address is required. Please connect your wallet.';
    }

    if (role === 'producer' || role === 'buyer') {
      if (!companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }
    }

    if (role === 'certifier') {
      if (!companyName.trim()) { // Using companyName for organizationName
        newErrors.companyName = 'Organization name is required';
      }
      if (!accreditationId.trim()) {
        newErrors.accreditationId = 'Accreditation ID is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setNotification({ message: '', type: '' });

    // Prepare data based on role
    const { role, ...data } = formData;
    let payload;
    switch (role) {
      case 'producer':
        payload = {
          companyName: data.companyName,
          contactEmail: data.contactEmail,
          walletAddress: data.walletAddress,
        };
        break;
      case 'buyer':
        payload = {
          companyName: data.companyName,
          contactEmail: data.contactEmail,
          walletAddress: data.walletAddress,
          industrySector: data.industrySector,
        };
        break;
      case 'certifier':
        payload = {
          organizationName: data.companyName, // Map companyName to organizationName
          contactEmail: data.contactEmail,
          walletAddress: data.walletAddress,
          accreditationId: data.accreditationId,
        };
        break;
      default:
        setNotification({ message: 'Invalid role selected.', type: 'error' });
        return;
    }

    const result = await signup(role, payload);

    if (result.success) {
      setNotification({ message: 'Signup successful! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
    } else {
      setNotification({ message: result.error || 'Signup failed. Please try again.', type: 'error' });
    }
  };

  const getRoleSpecificFields = () => {
    switch (formData.role) {
      case 'producer':
        return (
          <Input
            label="Company Name"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            error={errors.companyName}
            required
          />
        );
      case 'buyer':
        return (
          <>
            <Input
              label="Company Name"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              error={errors.companyName}
              required
            />
            <Input
              label="Industry Sector (Optional)"
              id="industrySector"
              name="industrySector"
              value={formData.industrySector}
              onChange={handleChange}
              error={errors.industrySector}
            />
          </>
        );
      case 'certifier':
        return (
          <>
            <Input
              label="Organization Name"
              id="companyName" // Reusing the state field
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              error={errors.companyName}
              required
            />
            <Input
              label="Accreditation ID"
              id="accreditationId"
              name="accreditationId"
              value={formData.accreditationId}
              onChange={handleChange}
              error={errors.accreditationId}
              required
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      {notification.message && <Notification message={notification.message} type={notification.type} onClear={() => setNotification({ message: '', type: '' })} />}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-12 w-auto" src={logo} alt="HydraChain Logo" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select your role</label>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {roleOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleChange({ target: { name: 'role', value: option.value } })}
                    className={`relative flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.role === option.value ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="mt-2 font-semibold text-gray-800">{option.label}</span>
                    <p className="text-xs text-center text-gray-500">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Contact Email"
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                error={errors.contactEmail}
                required
              />
              {getRoleSpecificFields()}
            </div>

            <div>
              <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700">
                Wallet Address
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  id="walletAddress"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  error={errors.walletAddress}
                  required
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md"
                  disabled
                  placeholder="Connect your wallet to populate"
                />
                <Button
                  type="button"
                  onClick={handleWalletConnect}
                  className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                >
                  {account ? 'Connected' : 'Connect Wallet'}
                </Button>
              </div>
              {errors.walletAddress && <p className="mt-2 text-sm text-red-600">{errors.walletAddress}</p>}
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <LoadingSpinner /> : 'Sign Up'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
