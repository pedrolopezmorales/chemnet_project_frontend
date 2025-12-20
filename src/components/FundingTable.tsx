'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';
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
      const response = await fundingApi.getFundingTable();
      
      if (response.success) {
        setFundingData(response.periodic_data);
        setError(null);
      } else {
        setError(response.message || 'Failed to load funding data');
      }
    } catch (err) {
      setError('Error loading funding data: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
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

  const getClassificationColor = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'government': return 'bg-red-500 text-white';
      case 'university': return 'bg-green-400 text-black';
      case 'foundation': return 'bg-teal-500 text-white';
      case 'company': return 'bg-yellow-300 text-black';
      default: return 'bg-purple-200 text-black';
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

  const viewFullNetwork = () => {
    if (selectedCompany) {
      // Navigate to the company search page with the selected company
      window.location.href = `/companies?company=${encodeURIComponent(selectedCompany.company)}`;
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <h3 className="text-red-800 font-medium mb-2">Error Loading Funding Data</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadFundingData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Funding Sources</h1>
        <p className="text-gray-600">Top 50 funding sources by number of studies funded</p>
      </div>

      {/* Funding Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {fundingData.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg cursor-pointer transition-transform hover:scale-105 border-2 border-transparent hover:border-gray-300 ${getClassificationColor(item.classification)}`}
            onClick={() => handleCompanyClick(item)}
          >
            <div className="font-bold text-sm mb-1 leading-tight">
              {item.company.length > 25 ? `${item.company.substring(0, 25)}...` : item.company}
            </div>
            <div className="text-xs opacity-90">
              {item.count} studies
            </div>
          </div>
        ))}
      </div>

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
                  <strong>Classification:</strong>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${getClassificationBadgeColor(selectedCompany.classification)}`}>
                    {selectedCompany.classification}
                  </span>
                </div>
                
                <div className="border-b border-gray-100 pb-3">
                  <strong>Studies Funded:</strong>
                  <span className="ml-2">{selectedCompany.count}</span>
                </div>
                
                <div className="border-b border-gray-100 pb-3">
                  <strong>Top Chemicals:</strong>
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
                  <strong>Key Affiliations:</strong>
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