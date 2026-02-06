'use client';

import { useState, useEffect } from 'react';
import { Building2, AlertCircle, X, ExternalLink } from 'lucide-react';
import { fundingApi, FundingData, CompanyDetailsResponse } from '../services/api';

interface FundingTableProps {
  className?: string;
}

const FundingTable: React.FC<FundingTableProps> = ({ className = '' }) => {
  const [fundingData, setFundingData] = useState<FundingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<FundingData | null>(null);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetailsResponse | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    loadFundingData();
  }, []);

  const loadFundingData = async () => {
    try {
      setLoading(true);
      console.log('Loading funding data...');
      const response = await fundingApi.getFundingTable();
      console.log('Funding API response:', response);
      
      if (response.success && response.funding_data) {
        console.log('Setting funding data:', response.funding_data);
        setFundingData(response.funding_data);
        if (response.message) {
          setError(response.message); // This will show the fallback data message
        } else {
          setError(null);
        }
      } else {
        console.log('API returned unsuccessful response');
        setError(response.message || 'Failed to load funding data');
        setFundingData([]); // Don't show data if not successful
      }
    } catch (err) {
      console.error('Error in loadFundingData:', err);
      setError('Error loading funding data: ' + (err instanceof Error ? err.message : String(err)));
      setFundingData([]);
    } finally {
      setLoading(false);
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'government': return 'bg-red-500 text-white hover:bg-red-600';
      case 'university': return 'bg-green-400 text-black hover:bg-green-500';
      case 'foundation': return 'bg-teal-500 text-white hover:bg-teal-600';
      case 'company': return 'bg-yellow-300 text-black hover:bg-yellow-400';
      default: return 'bg-purple-200 text-black hover:bg-purple-300';
    }
  };

  const getClassificationBadgeColor = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'government': return 'bg-red-500 text-white';
      case 'university': return 'bg-green-400 text-black';
      case 'foundation': return 'bg-teal-500 text-white';
      case 'company': return 'bg-yellow-300 text-black';
      default: return 'bg-purple-200 text-black';
    }
  };

  const handleCompanyClick = async (company: FundingData) => {
    setSelectedCompany(company);
    setLoadingDetails(true);
    
    try {
      const details = await fundingApi.getCompanyDetails(company.company);
      setCompanyDetails(details);
    } catch (err) {
      console.error('Error loading company details:', err);
      setCompanyDetails({ success: false, error: 'Failed to load company details' });
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setCompanyDetails(null);
  };

  const viewFullNetwork = () => {
    if (selectedCompany) {
      window.location.href = `/companies?company=${encodeURIComponent(selectedCompany.company)}`;
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="text-blue-600 mr-2" size={20} />
            <p className="text-blue-800">{error}</p>
          </div>
        </div>
      )}

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Building2 className="mr-2" size={28} />
          Top Funding Sources
        </h2>
        <p className="text-gray-600">Click any funding source to see detailed information</p>
      </div>

      {/* Funding Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {fundingData.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 shadow-md hover:shadow-lg border-2 border-transparent hover:border-gray-300 ${getClassificationColor(item.classification)}`}
            onClick={() => handleCompanyClick(item)}
          >
            <div className="font-bold text-sm mb-2 leading-tight">
              {item.company.length > 25 ? `${item.company.substring(0, 25)}...` : item.company}
            </div>
            <div className="text-xs opacity-90 mb-1">
              {item.count} studies
            </div>
            <div className="text-xs opacity-75 font-medium">
              {item.classification}
            </div>
          </div>
        ))}
      </div>

      {fundingData.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-8">
          <Building2 size={48} className="mx-auto mb-4 opacity-50" />
          <p>No funding data available</p>
          <button 
            onClick={loadFundingData}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900 pr-4">
                {selectedCompany.company}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <strong className="text-black">Classification:</strong>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${getClassificationBadgeColor(selectedCompany.classification)}`}>
                    {selectedCompany.classification}
                  </span>
                </div>
                
                <div className="border-b border-gray-100 pb-3">
                  <strong className="text-black">Studies Funded:</strong>
                  <span className="ml-2 text-black">{selectedCompany.count}</span>
                </div>
                
                <div className="border-b border-gray-100 pb-3">
                  <strong className="text-black">Top Chemicals:</strong>
                  <div className="mt-2">
                    {loadingDetails ? (
                      <div className="text-gray-500 italic">Loading chemical data...</div>
                    ) : companyDetails?.success && companyDetails.top_chemicals ? (
                      <div className="space-y-2">
                        {companyDetails.top_chemicals.map(([name, count], idx) => (
                          <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-b-0">
                            <span className="font-medium text-gray-700 flex-1">{name}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {count} studies
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">No chemical data available</div>
                    )}
                  </div>
                </div>
                
                <div className="pb-3">
                  <strong className="text-black">Key Affiliations:</strong>
                  <div className="mt-2">
                    {loadingDetails ? (
                      <div className="text-gray-500 italic">Loading affiliation data...</div>
                    ) : companyDetails?.success && companyDetails.top_affiliations ? (
                      <div className="space-y-1">
                        {companyDetails.top_affiliations.map((affiliation, idx) => (
                          <div key={idx} className="py-1 text-gray-700">
                            {affiliation}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">No affiliation data available</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={viewFullNetwork}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={16} />
                  View Full Network
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingTable;