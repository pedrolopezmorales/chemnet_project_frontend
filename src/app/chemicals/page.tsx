'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import SearchForm from '@/components/SearchForm';
import NetworkViewer from '@/components/NetworkViewer';
import { chemicalApi, handleApiError, ChemicalSearchResponse } from '@/services/api';

export default function ChemicalsPage() {
  const [searchResults, setSearchResults] = useState<ChemicalSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [examples, setExamples] = useState<string[]>([]);
  const [inchikey, setInchikey] = useState('');

  // Load initial data (examples and chemical names)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await chemicalApi.getChemicalData();
        if (data.example_chemicals) {
          setExamples(data.example_chemicals.map(chem => chem.name));
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };

    loadInitialData();
  }, []);

  const handleSearch = async (chemical: string) => {
    setIsLoading(true);
    setError('');
    setSearchResults(null);

    try {
      const result = await chemicalApi.searchChemical({
        chemical,
        inchikey: inchikey || undefined
      });
      
      setSearchResults(result);
      
      if (!result.success) {
        setError(result.message || 'Chemical not found');
      }
    } catch (err) {
      const errorResult = handleApiError(err);
      setError(errorResult.message || 'Failed to search chemical');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Chemical Network Search</h1>
          <p className="text-lg text-gray-600">
            Explore chemical networks and connections in research data
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              InChIKey (optional)
            </label>
            <input
              type="text"
              value={inchikey}
              onChange={(e) => setInchikey(e.target.value)}
              placeholder="Enter InChIKey for more precise search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-blue-600"
            />
          </div>

          <SearchForm
            onSearch={handleSearch}
            placeholder="Enter chemical name (e.g., Aspirin, Caffeine, Glucose)..."
            examples={examples}
            suggestions={searchResults && !searchResults.success ? searchResults.suggestions : []}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Results Section */}
        {searchResults && searchResults.success && (
          <>
            {/* Chemical Description */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-green-800 mb-3 text-lg">Chemical Information</h3>
              <div className="text-green-700">
                <p className="font-medium text-gray-800 mb-2">{searchResults.chemical}</p>
                {searchResults.description ? (
                  <p className="text-sm leading-relaxed">{searchResults.description}</p>
                ) : (
                  <p className="text-sm text-gray-600 italic">No additional description available from PubChem.</p>
                )}
                {searchResults.inchikey && searchResults.inchikey !== 'Error' && (
                  <p className="text-xs text-green-600 mt-2 font-mono">InChIKey: {searchResults.inchikey}</p>
                )}
              </div>
            </div>

            {/* Network Visualization */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <NetworkViewer
                iframeUrl={searchResults.iframe_url}
                connections={searchResults.connections}
                title={`Chemical Network: ${searchResults.chemical}`}
              />
            </div>
          </>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
          <h3 className="font-medium text-blue-800 mb-2">How it works:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Enter a chemical name to explore its network connections</li>
            <li>• Add an InChIKey for more precise identification</li>
            <li>• View interactive network visualizations showing chemical relationships</li>
            <li>• Click suggestions if your search term isn't found</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
