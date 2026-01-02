'use client';

import Navigation from '@/components/Navigation';
import FundingTable from '../../components/FundingTable';

export default function FundingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Research Funding Sources</h1>
          <p className="text-xl text-gray-600">
            Explore top funding organizations and their research investments
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <FundingTable />
        </div>
        
        {/* Info Section */}
        <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="font-medium text-indigo-800 mb-3">About Funding Sources:</h3>
          <ul className="text-indigo-700 space-y-1">
            <li>• <strong>Government:</strong> Federal agencies and departments</li>
            <li>• <strong>University:</strong> Academic institutions and research centers</li>
            <li>• <strong>Foundation:</strong> Private foundations and non-profit organizations</li>
            <li>• <strong>Company:</strong> Corporate sponsors and industry partners</li>
            <li>• <strong>Click any source</strong> to see detailed chemicals and affiliations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}