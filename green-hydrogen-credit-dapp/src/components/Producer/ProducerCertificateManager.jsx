import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';

const ProducerCertificateManager = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    facilityName: '',
    energyType: 'hydrogen',
    productionCapacity: '',
    productionDate: '',
    location: '',
    coordinates: '',
    certificationStandard: 'ISO_14064',
    carbonIntensity: '',
    productionMethod: 'electrolysis',
    feedstock: 'renewable_electricity',
    purityLevel: '',
    storageMethod: '',
    transportationMethod: '',
    environmentalImpact: '',
    regulatoryCompliance: '',
    thirdPartyVerification: '',
    documentation: null,
    technicalSpecs: '',
    qualityAssurance: '',
    safetyProtocols: '',
    maintenanceRecords: '',
    operationalData: '',
    energySource: 'solar',
    efficiencyRating: '',
    co2Captured: '',
    waterUsage: '',
    landUse: '',
    biodiversityImpact: '',
    socialImpact: '',
    economicBenefit: '',
    lifeycleAssessment: '',
    additionalCertifications: [],
    notes: ''
  });

  const [filters, setFilters] = useState({
    status: 'all',
    energyType: 'all',
    dateRange: 'all',
    standard: 'all'
  });

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    under_review: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    requires_changes: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  };

  const energyTypes = [
    { value: 'hydrogen', label: 'Green Hydrogen' },
    { value: 'renewable_electricity', label: 'Renewable Electricity' },
    { value: 'biofuel', label: 'Biofuel' },
    { value: 'solar', label: 'Solar Energy' },
    { value: 'wind', label: 'Wind Energy' },
    { value: 'hydro', label: 'Hydroelectric' },
    { value: 'geothermal', label: 'Geothermal' }
  ];

  const certificationStandards = [
    { value: 'ISO_14064', label: 'ISO 14064 (GHG Verification)' },
    { value: 'VCS', label: 'Verified Carbon Standard' },
    { value: 'GOLD_STANDARD', label: 'Gold Standard' },
    { value: 'CDM', label: 'Clean Development Mechanism' },
    { value: 'GREEN_H2', label: 'Green Hydrogen Certification' },
    { value: 'RENEWABLE_ENERGY', label: 'Renewable Energy Certificate' }
  ];

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockCertificates = [
        {
          id: 'CERT-001',
          facilityName: 'GreenTech Hydrogen Plant',
          energyType: 'hydrogen',
          productionCapacity: '500 kg/day',
          status: 'pending',
          submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          reviewDate: null,
          certifierName: null,
          certificationStandard: 'ISO_14064',
          carbonIntensity: '0.5 kg CO2/kg H2',
          location: 'California, USA',
          reviewComments: '',
          documentationStatus: 'complete'
        },
        {
          id: 'CERT-002',
          facilityName: 'Solar Hydrogen Facility',
          energyType: 'hydrogen',
          productionCapacity: '1000 kg/day',
          status: 'approved',
          submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          reviewDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          certifierName: 'Dr. Sarah Johnson',
          certificationStandard: 'GREEN_H2',
          carbonIntensity: '0.2 kg CO2/kg H2',
          location: 'Texas, USA',
          reviewComments: 'Excellent facility with top-tier environmental standards.',
          documentationStatus: 'complete'
        },
        {
          id: 'CERT-003',
          facilityName: 'WindPower H2 Plant',
          energyType: 'hydrogen',
          productionCapacity: '750 kg/day',
          status: 'requires_changes',
          submissionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          reviewDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          certifierName: 'Dr. Michael Chen',
          certificationStandard: 'VCS',
          carbonIntensity: '0.8 kg CO2/kg H2',
          location: 'New York, USA',
          reviewComments: 'Please provide additional documentation for water usage and update efficiency calculations.',
          documentationStatus: 'incomplete'
        }
      ];

      setCertificates(mockCertificates);
    } catch (error) {
      toast.error('Failed to load certificates');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (files) => {
    setFormData(prev => ({
      ...prev,
      documentation: files
    }));
  };

  const validateForm = () => {
    const required = [
      'facilityName', 'productionCapacity', 'productionDate', 'location',
      'carbonIntensity', 'purityLevel', 'technicalSpecs'
    ];

    for (const field of required) {
      if (!formData[field]) {
        toast.error(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
        return false;
      }
    }

    if (!formData.documentation) {
      toast.error('Please upload required documentation');
      return false;
    }

    return true;
  };

  const submitCertificate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newCertificate = {
        id: `CERT-${String(certificates.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'pending',
        submissionDate: new Date(),
        reviewDate: null,
        certifierName: null,
        reviewComments: '',
        documentationStatus: 'under_review'
      };

      setCertificates(prev => [newCertificate, ...prev]);
      setShowUploadForm(false);
      setFormData({
        facilityName: '',
        energyType: 'hydrogen',
        productionCapacity: '',
        productionDate: '',
        location: '',
        coordinates: '',
        certificationStandard: 'ISO_14064',
        carbonIntensity: '',
        productionMethod: 'electrolysis',
        feedstock: 'renewable_electricity',
        purityLevel: '',
        storageMethod: '',
        transportationMethod: '',
        environmentalImpact: '',
        regulatoryCompliance: '',
        thirdPartyVerification: '',
        documentation: null,
        technicalSpecs: '',
        qualityAssurance: '',
        safetyProtocols: '',
        maintenanceRecords: '',
        operationalData: '',
        energySource: 'solar',
        efficiencyRating: '',
        co2Captured: '',
        waterUsage: '',
        landUse: '',
        biodiversityImpact: '',
        socialImpact: '',
        economicBenefit: '',
        lifeycleAssessment: '',
        additionalCertifications: [],
        notes: ''
      });

      toast.success('Certificate submitted successfully! It will be reviewed by a certified verifier.');
    } catch (error) {
      toast.error('Failed to submit certificate');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    if (filters.status !== 'all' && cert.status !== filters.status) return false;
    if (filters.energyType !== 'all' && cert.energyType !== filters.energyType) return false;
    return true;
  });

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      approved: '✅',
      rejected: '❌',
      under_review: '🔍',
      requires_changes: '⚠️'
    };
    return icons[status] || '📄';
  };

  if (loading && certificates.length === 0) {
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
          <h1 className="text-3xl font-bold text-white mb-2">Certificate Management</h1>
          <p className="text-gray-400">Upload and track your green energy certificates</p>
        </div>

        <div className="flex gap-3 mt-4 lg:mt-0">
          <Button
            onClick={() => setShowUploadForm(!showUploadForm)}
            variant={showUploadForm ? "secondary" : "primary"}
          >
            {showUploadForm ? 'Cancel Upload' : '+ Upload Certificate'}
          </Button>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Upload New Certificate</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            </div>

            <Input
              label="Facility Name"
              value={formData.facilityName}
              onChange={(e) => handleInputChange('facilityName', e.target.value)}
              placeholder="Enter facility name"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Energy Type</label>
              <select
                value={formData.energyType}
                onChange={(e) => handleInputChange('energyType', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {energyTypes.map(type => (
                  <option key={type.value} value={type.value} className="bg-gray-800">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Production Capacity"
              value={formData.productionCapacity}
              onChange={(e) => handleInputChange('productionCapacity', e.target.value)}
              placeholder="e.g., 1000 kg/day"
              required
            />

            <Input
              label="Production Date"
              type="date"
              value={formData.productionDate}
              onChange={(e) => handleInputChange('productionDate', e.target.value)}
              required
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, State, Country"
              required
            />

            <Input
              label="GPS Coordinates"
              value={formData.coordinates}
              onChange={(e) => handleInputChange('coordinates', e.target.value)}
              placeholder="Latitude, Longitude"
            />

            {/* Certification Details */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-semibold text-white mb-4 mt-6">Certification Details</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Certification Standard</label>
              <select
                value={formData.certificationStandard}
                onChange={(e) => handleInputChange('certificationStandard', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {certificationStandards.map(standard => (
                  <option key={standard.value} value={standard.value} className="bg-gray-800">
                    {standard.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Carbon Intensity"
              value={formData.carbonIntensity}
              onChange={(e) => handleInputChange('carbonIntensity', e.target.value)}
              placeholder="kg CO2/kg H2"
              required
            />

            <Input
              label="Purity Level"
              value={formData.purityLevel}
              onChange={(e) => handleInputChange('purityLevel', e.target.value)}
              placeholder="e.g., 99.95%"
              required
            />

            {/* Environmental Impact */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-semibold text-white mb-4 mt-6">Environmental Impact</h3>
            </div>

            <Input
              label="Water Usage"
              value={formData.waterUsage}
              onChange={(e) => handleInputChange('waterUsage', e.target.value)}
              placeholder="L/kg H2"
            />

            <Input
              label="CO2 Captured"
              value={formData.co2Captured}
              onChange={(e) => handleInputChange('co2Captured', e.target.value)}
              placeholder="tons/year"
            />

            <Input
              label="Efficiency Rating"
              value={formData.efficiencyRating}
              onChange={(e) => handleInputChange('efficiencyRating', e.target.value)}
              placeholder="e.g., 85%"
            />

            {/* Documentation */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-semibold text-white mb-4 mt-6">Documentation</h3>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Technical Specifications</label>
              <textarea
                value={formData.technicalSpecs}
                onChange={(e) => handleInputChange('technicalSpecs', e.target.value)}
                placeholder="Detailed technical specifications..."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Documents</label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-white/40 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📎</div>
                  <p className="text-white font-medium">Click to upload files</p>
                  <p className="text-gray-400 text-sm">PDF, DOC, Images (Max 10MB each)</p>
                </label>
                {formData.documentation && (
                  <div className="mt-4">
                    <p className="text-green-400 text-sm">
                      {formData.documentation.length} file(s) selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional information or special considerations..."
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              variant="secondary"
              onClick={() => setShowUploadForm(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={submitCertificate}
              disabled={loading}
              className="min-w-32"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Submit Certificate'}
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status Filter</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all" className="bg-gray-800">All Statuses</option>
              <option value="pending" className="bg-gray-800">Pending</option>
              <option value="under_review" className="bg-gray-800">Under Review</option>
              <option value="approved" className="bg-gray-800">Approved</option>
              <option value="requires_changes" className="bg-gray-800">Requires Changes</option>
              <option value="rejected" className="bg-gray-800">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Energy Type</label>
            <select
              value={filters.energyType}
              onChange={(e) => setFilters(prev => ({ ...prev, energyType: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all" className="bg-gray-800">All Types</option>
              {energyTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-gray-800">
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={fetchCertificates}
              disabled={loading}
              className="w-full"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Refresh'}
            </Button>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
            >
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Certificates List */}
      <div className="space-y-6">
        {filteredCertificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-colors"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{getStatusIcon(cert.status)}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">{cert.facilityName}</h3>
                  <p className="text-gray-400">Certificate ID: {cert.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 lg:mt-0">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[cert.status]}`}>
                  {cert.status.replace('_', ' ').toUpperCase()}
                </span>
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-sm">Energy Type</p>
                <p className="text-white font-medium capitalize">{cert.energyType.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Production Capacity</p>
                <p className="text-white font-medium">{cert.productionCapacity}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Carbon Intensity</p>
                <p className="text-white font-medium">{cert.carbonIntensity}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Submission Date</p>
                <p className="text-white font-medium">{cert.submissionDate.toLocaleDateString()}</p>
              </div>
            </div>

            {cert.reviewDate && (
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">👨‍💼</div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">
                      Reviewed by: {cert.certifierName}
                    </p>
                    <p className="text-gray-400 text-sm mb-2">
                      Review Date: {cert.reviewDate.toLocaleDateString()}
                    </p>
                    {cert.reviewComments && (
                      <p className="text-gray-300 text-sm">
                        <strong>Comments:</strong> {cert.reviewComments}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-400">
                <span>📍 {cert.location}</span>
                <span>📋 {cert.certificationStandard.replace('_', ' ')}</span>
                <span>📄 {cert.documentationStatus}</span>
              </div>

              {cert.status === 'requires_changes' && (
                <Button variant="primary" size="sm">
                  Update Certificate
                </Button>
              )}
            </div>
          </div>
        ))}

        {filteredCertificates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Certificates Found</h3>
            <p className="text-gray-400 mb-4">
              {filters.status !== 'all' || filters.energyType !== 'all'
                ? 'No certificates match your current filters.'
                : 'Start by uploading your first certificate for verification.'}
            </p>
            <Button onClick={() => setShowUploadForm(true)}>
              Upload First Certificate
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProducerCertificateManager;
