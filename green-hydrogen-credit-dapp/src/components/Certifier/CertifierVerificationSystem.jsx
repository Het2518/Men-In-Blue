import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';

const CertifierVerificationSystem = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [pendingCertificates, setPendingCertificates] = useState([]);
  const [reviewedCertificates, setReviewedCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [verificationForm, setVerificationForm] = useState({
    status: 'pending',
    reviewComments: '',
    verificationScore: '',
    complianceChecks: {
      documentationComplete: false,
      technicalSpecsValid: false,
      environmentalImpactAssessed: false,
      safetyProtocolsVerified: false,
      carbonIntensityVerified: false,
      productionCapacityValid: false,
      qualityStandardsMet: false,
      regulatoryComplianceMet: false,
      thirdPartyVerificationValid: false,
      operationalDataAccurate: false
    },
    technicalAssessment: {
      efficiencyRating: '',
      purityLevelConfirmed: '',
      productionMethodValidated: '',
      equipmentStatusVerified: '',
      maintenanceRecordsReviewed: '',
      safetyComplianceConfirmed: ''
    },
    environmentalAssessment: {
      carbonFootprintVerified: '',
      waterUsageAssessed: '',
      wasteManagementEvaluated: '',
      biodiversityImpactAssessed: '',
      lifeycleAnalysisCompleted: '',
      renewableEnergySourceConfirmed: ''
    },
    economicAssessment: {
      costEffectivenessEvaluated: '',
      economicBenefitAssessed: '',
      jobCreationImpactEvaluated: '',
      localEconomyImpactAssessed: '',
      longTermViabilityAssessed: ''
    },
    recommendations: '',
    requiredChanges: [],
    followUpRequired: false,
    certificationValidityPeriod: '12',
    additionalInspectionRequired: false,
    publicDisclosure: true
  });

  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    energyType: 'all',
    submissionDate: 'all'
  });

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    under_review: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    requires_changes: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  };

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-green-500/20 text-green-400'
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockPendingCertificates = [
        {
          id: 'CERT-001',
          facilityName: 'GreenTech Hydrogen Plant',
          producerName: 'John Smith',
          producerCompany: 'EcoEnergy Solutions',
          energyType: 'hydrogen',
          productionCapacity: '500 kg/day',
          submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          priority: 'high',
          certificationStandard: 'ISO_14064',
          carbonIntensity: '0.5 kg CO2/kg H2',
          location: 'California, USA',
          coordinates: '37.7749, -122.4194',
          documentationFiles: ['technical_specs.pdf', 'environmental_report.pdf', 'safety_protocols.pdf'],
          estimatedReviewTime: '3-5 days',
          complexity: 'medium',
          previousCertifications: [],
          specialRequirements: ['Water usage assessment', 'Noise impact evaluation']
        },
        {
          id: 'CERT-004',
          facilityName: 'Pacific Wind H2 Generator',
          producerName: 'Maria Garcia',
          producerCompany: 'Pacific Green Energy',
          energyType: 'hydrogen',
          productionCapacity: '1200 kg/day',
          submissionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          certificationStandard: 'GREEN_H2',
          carbonIntensity: '0.3 kg CO2/kg H2',
          location: 'Oregon, USA',
          coordinates: '45.5152, -122.6784',
          documentationFiles: ['facility_design.pdf', 'production_data.xlsx', 'compliance_report.pdf'],
          estimatedReviewTime: '2-4 days',
          complexity: 'high',
          previousCertifications: ['ISO_9001', 'ISO_14001'],
          specialRequirements: ['Wildlife impact assessment', 'Grid integration study']
        },
        {
          id: 'CERT-005',
          facilityName: 'Desert Solar Hydrogen Hub',
          producerName: 'Ahmed Al-Mansouri',
          producerCompany: 'Solar Innovations LLC',
          energyType: 'hydrogen',
          productionCapacity: '800 kg/day',
          submissionDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
          priority: 'high',
          certificationStandard: 'GOLD_STANDARD',
          carbonIntensity: '0.1 kg CO2/kg H2',
          location: 'Nevada, USA',
          coordinates: '36.1699, -115.1398',
          documentationFiles: ['solar_array_specs.pdf', 'water_recycling_system.pdf', 'desert_impact_study.pdf'],
          estimatedReviewTime: '4-6 days',
          complexity: 'high',
          previousCertifications: ['LEED_Gold'],
          specialRequirements: ['Desert ecosystem impact', 'Water source sustainability']
        }
      ];

      const mockReviewedCertificates = [
        {
          id: 'CERT-002',
          facilityName: 'Solar Hydrogen Facility',
          producerName: 'Sarah Johnson',
          status: 'approved',
          reviewDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          verificationScore: '95',
          reviewComments: 'Excellent facility with top-tier environmental standards and innovative technology.'
        },
        {
          id: 'CERT-003',
          facilityName: 'WindPower H2 Plant',
          producerName: 'Michael Chen',
          status: 'requires_changes',
          reviewDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          verificationScore: '72',
          reviewComments: 'Facility meets most requirements but needs improvements in water usage documentation.'
        }
      ];

      setPendingCertificates(mockPendingCertificates);
      setReviewedCertificates(mockReviewedCertificates);
    } catch (error) {
      toast.error('Failed to load certificates');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startReview = (certificate) => {
    setSelectedCertificate(certificate);
    setVerificationForm(prev => ({
      ...prev,
      status: 'under_review'
    }));
  };

  const handleComplianceCheck = (field, value) => {
    setVerificationForm(prev => ({
      ...prev,
      complianceChecks: {
        ...prev.complianceChecks,
        [field]: value
      }
    }));
  };

  const handleAssessmentChange = (category, field, value) => {
    setVerificationForm(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const calculateOverallScore = () => {
    const checks = Object.values(verificationForm.complianceChecks);
    const passedChecks = checks.filter(check => check === true).length;
    const totalChecks = checks.length;
    return Math.round((passedChecks / totalChecks) * 100);
  };

  const submitVerification = async (decision) => {
    if (decision === 'approved' && calculateOverallScore() < 70) {
      toast.error('Cannot approve certificate with score below 70%');
      return;
    }

    if (decision === 'requires_changes' && !verificationForm.requiredChanges.length) {
      toast.error('Please specify required changes');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedCertificate = {
        ...selectedCertificate,
        status: decision,
        reviewDate: new Date(),
        certifierName: user?.name || 'Current Certifier',
        verificationScore: calculateOverallScore().toString(),
        reviewComments: verificationForm.reviewComments
      };

      // Move from pending to reviewed
      setPendingCertificates(prev => prev.filter(cert => cert.id !== selectedCertificate.id));
      setReviewedCertificates(prev => [updatedCertificate, ...prev]);

      setSelectedCertificate(null);
      setVerificationForm({
        status: 'pending',
        reviewComments: '',
        verificationScore: '',
        complianceChecks: {
          documentationComplete: false,
          technicalSpecsValid: false,
          environmentalImpactAssessed: false,
          safetyProtocolsVerified: false,
          carbonIntensityVerified: false,
          productionCapacityValid: false,
          qualityStandardsMet: false,
          regulatoryComplianceMet: false,
          thirdPartyVerificationValid: false,
          operationalDataAccurate: false
        },
        technicalAssessment: {
          efficiencyRating: '',
          purityLevelConfirmed: '',
          productionMethodValidated: '',
          equipmentStatusVerified: '',
          maintenanceRecordsReviewed: '',
          safetyComplianceConfirmed: ''
        },
        environmentalAssessment: {
          carbonFootprintVerified: '',
          waterUsageAssessed: '',
          wasteManagementEvaluated: '',
          biodiversityImpactAssessed: '',
          lifeycleAnalysisCompleted: '',
          renewableEnergySourceConfirmed: ''
        },
        economicAssessment: {
          costEffectivenessEvaluated: '',
          economicBenefitAssessed: '',
          jobCreationImpactEvaluated: '',
          localEconomyImpactAssessed: '',
          longTermViabilityAssessed: ''
        },
        recommendations: '',
        requiredChanges: [],
        followUpRequired: false,
        certificationValidityPeriod: '12',
        additionalInspectionRequired: false,
        publicDisclosure: true
      });

      const messages = {
        approved: 'Certificate approved successfully!',
        rejected: 'Certificate rejected. Feedback sent to producer.',
        requires_changes: 'Certificate returned for required changes.'
      };

      toast.success(messages[decision]);
    } catch (error) {
      toast.error('Failed to submit verification');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPendingCertificates = pendingCertificates.filter(cert => {
    if (filters.priority !== 'all' && cert.priority !== filters.priority) return false;
    if (filters.energyType !== 'all' && cert.energyType !== filters.energyType) return false;
    return true;
  });

  if (loading && pendingCertificates.length === 0) {
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
          <h1 className="text-3xl font-bold text-white mb-2">Certificate Verification</h1>
          <p className="text-gray-400">Review and verify green energy certificates</p>
        </div>

        <div className="flex gap-3 mt-4 lg:mt-0">
          <div className="text-right">
            <p className="text-white font-medium">{filteredPendingCertificates.length} Pending Reviews</p>
            <p className="text-gray-400 text-sm">{reviewedCertificates.length} Completed</p>
          </div>
        </div>
      </div>

      {selectedCertificate ? (
        // Verification Form View
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Reviewing: {selectedCertificate.facilityName}
              </h2>
              <p className="text-gray-400">Certificate ID: {selectedCertificate.id}</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setSelectedCertificate(null)}
            >
              ← Back to List
            </Button>
          </div>

          {/* Certificate Details */}
          <div className="bg-white/5 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Certificate Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Producer</p>
                <p className="text-white font-medium">{selectedCertificate.producerName}</p>
                <p className="text-gray-300 text-sm">{selectedCertificate.producerCompany}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Energy Type</p>
                <p className="text-white font-medium capitalize">{selectedCertificate.energyType}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Production Capacity</p>
                <p className="text-white font-medium">{selectedCertificate.productionCapacity}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Carbon Intensity</p>
                <p className="text-white font-medium">{selectedCertificate.carbonIntensity}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Location</p>
                <p className="text-white font-medium">{selectedCertificate.location}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Standard</p>
                <p className="text-white font-medium">{selectedCertificate.certificationStandard.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Compliance Checklist */}
          <div className="bg-white/5 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Compliance Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(verificationForm.complianceChecks).map(([key, value]) => (
                <label key={key} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleComplianceCheck(key, e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-white capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-blue-300 font-medium">
                Compliance Score: {calculateOverallScore()}%
              </p>
              <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${calculateOverallScore()}%` }}
                />
              </div>
            </div>
          </div>

          {/* Technical Assessment */}
          <div className="bg-white/5 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Technical Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(verificationForm.technicalAssessment).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </label>
                  <select
                    value={value}
                    onChange={(e) => handleAssessmentChange('technicalAssessment', key, e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="" className="bg-gray-800">Select assessment</option>
                    <option value="excellent" className="bg-gray-800">Excellent</option>
                    <option value="good" className="bg-gray-800">Good</option>
                    <option value="satisfactory" className="bg-gray-800">Satisfactory</option>
                    <option value="needs_improvement" className="bg-gray-800">Needs Improvement</option>
                    <option value="inadequate" className="bg-gray-800">Inadequate</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Review Comments */}
          <div className="bg-white/5 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Review Comments</h3>
            <textarea
              value={verificationForm.reviewComments}
              onChange={(e) => setVerificationForm(prev => ({ ...prev, reviewComments: e.target.value }))}
              placeholder="Provide detailed feedback about the certificate..."
              rows={6}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Decision Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              onClick={() => submitVerification('rejected')}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 min-w-32"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Reject'}
            </Button>
            <Button
              onClick={() => submitVerification('requires_changes')}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 min-w-32"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Request Changes'}
            </Button>
            <Button
              onClick={() => submitVerification('approved')}
              disabled={loading || calculateOverallScore() < 70}
              className="bg-green-600 hover:bg-green-700 min-w-32"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Approve'}
            </Button>
          </div>
        </div>
      ) : (
        // Certificates List View
        <>
          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priority Filter</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all" className="bg-gray-800">All Priorities</option>
                  <option value="high" className="bg-gray-800">High Priority</option>
                  <option value="medium" className="bg-gray-800">Medium Priority</option>
                  <option value="low" className="bg-gray-800">Low Priority</option>
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
                  <option value="hydrogen" className="bg-gray-800">Hydrogen</option>
                  <option value="solar" className="bg-gray-800">Solar</option>
                  <option value="wind" className="bg-gray-800">Wind</option>
                  <option value="hydro" className="bg-gray-800">Hydro</option>
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
                  Export Reviews
                </Button>
              </div>
            </div>
          </div>

          {/* Pending Certificates */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Pending Certificates</h2>
            <div className="space-y-4">
              {filteredPendingCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">📋</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{cert.facilityName}</h3>
                        <p className="text-gray-400">
                          Producer: {cert.producerName} • Company: {cert.producerCompany}
                        </p>
                        <p className="text-gray-400 text-sm">Certificate ID: {cert.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 lg:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[cert.priority]}`}>
                        {cert.priority.toUpperCase()} PRIORITY
                      </span>
                      <Button
                        onClick={() => startReview(cert)}
                        variant="primary"
                      >
                        Start Review
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Energy Type</p>
                      <p className="text-white font-medium capitalize">{cert.energyType}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Production Capacity</p>
                      <p className="text-white font-medium">{cert.productionCapacity}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Submission Date</p>
                      <p className="text-white font-medium">{cert.submissionDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Est. Review Time</p>
                      <p className="text-white font-medium">{cert.estimatedReviewTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-400">
                      <span>📍 {cert.location}</span>
                      <span>📋 {cert.certificationStandard.replace('_', ' ')}</span>
                      <span>🔧 {cert.complexity} complexity</span>
                    </div>
                  </div>

                  {cert.specialRequirements.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <p className="text-yellow-300 font-medium text-sm mb-1">Special Requirements:</p>
                      <ul className="text-yellow-200 text-sm">
                        {cert.specialRequirements.map((req, idx) => (
                          <li key={idx}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              {filteredPendingCertificates.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Pending Reviews</h3>
                  <p className="text-gray-400">All certificates have been reviewed.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recently Reviewed */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recently Reviewed</h2>
            <div className="space-y-4">
              {reviewedCertificates.slice(0, 5).map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {cert.status === 'approved' ? '✅' :
                          cert.status === 'requires_changes' ? '⚠️' : '❌'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{cert.facilityName}</h3>
                        <p className="text-gray-400">
                          Producer: {cert.producerName} • Reviewed: {cert.reviewDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white font-medium">Score: {cert.verificationScore}%</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[cert.status]}`}>
                          {cert.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CertifierVerificationSystem;
