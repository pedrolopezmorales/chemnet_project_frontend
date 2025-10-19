'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import NetworkViewer from '@/components/NetworkViewer';
import { researcherApi, handleApiError, ResearcherSearchResponse } from '@/services/api';
import { Search, User, AlertCircle, Users, UserCheck } from 'lucide-react';

export default function ResearchersPage() {
  const [searchResults, setSearchResults] = useState<ResearcherSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [examples, setExamples] = useState<string[]>([]);
  
  // Form state
  const [researcher, setResearcher] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [combine, setCombine] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await researcherApi.getResearcherData();
        if (data.example_researchers) {
          setExamples(data.example_researchers);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };

    loadInitialData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researcher.trim()) return;

    setIsLoading(true);
    setError('');
    setSearchResults(null);
    setSelectedIndex(undefined);
    setCombine(false);

    try {
      const result = await researcherApi.searchResearcher({
        researcher: researcher.trim(),
        selected_index: selectedIndex,
        combine: combine
      });
      
      setSearchResults(result);
      
      if (!result.success) {
        setError(result.message || 'Researcher not found');
      }
    } catch (err) {
      const errorResult = handleApiError(err);
      setError(errorResult.message || 'Failed to search researcher');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (exampleResearcher: string) => {
    setResearcher(exampleResearcher);
    setSelectedIndex(undefined);
    setCombine(false);
    setSearchResults(null);
  };

  const handleResearcherSelection = async (index: number) => {
    if (!researcher.trim()) return;

    setIsLoading(true);
    setError('');
    setSelectedIndex(index);

    try {
      const result = await researcherApi.searchResearcher({
        researcher: researcher.trim(),
        selected_index: index,
        combine: false
      });
      
      setSearchResults(result);
      
      if (!result.success) {
        setError(result.message || 'Failed to generate network');
      }
    } catch (err) {
      const errorResult = handleApiError(err);
      setError(errorResult.message || 'Failed to search researcher');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCombineAll = async () => {
    if (!researcher.trim()) return;

    setIsLoading(true);
    setError('');
    setCombine(true);
    setSelectedIndex(undefined);

    try {
      const result = await researcherApi.searchResearcher({
        researcher: researcher.trim(),
        selected_index: undefined,
        combine: true
      });
      
      setSearchResults(result);
      
      if (!result.success) {
        setError(result.message || 'Failed to generate combined network');
      }
    } catch (err) {
      const errorResult = handleApiError(err);
      setError(errorResult.message || 'Failed to search researcher');
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Researcher Network Search</h1>
          <p className="text-lg text-gray-600">
            Explore researcher networks and collaborations
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Researcher Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Researcher Name
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={researcher}
                    onChange={(e) => setResearcher(e.target.value)}
                    placeholder="Enter researcher name (e.g., Yang, Xin)..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-orange-600"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !researcher.trim()}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  <Search size={20} />
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Suggestions */}
          {searchResults && !searchResults.success && searchResults.suggestions && searchResults.suggestions.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Did you mean:</h3>
              <div className="flex flex-wrap gap-2">
                {searchResults.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(suggestion)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm hover:bg-yellow-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Multiple Matches Selection */}
        {searchResults && searchResults.needs_selection && searchResults.matches && searchResults.matches.length > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-orange-600" size={24} />
              <h3 className="text-lg font-medium text-gray-900">
                Multiple researchers found with the name "{researcher}"
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Please select a specific researcher or combine all results:
            </p>

            <div className="space-y-3 mb-6">
              {searchResults.matches.map((match, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedIndex === index 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleResearcherSelection(index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{match.Researcher}</div>
                      <div className="text-sm text-gray-600">
                        {match.Affiliation} • {match.Country}
                      </div>
                      {match.Department && (
                        <div className="text-sm text-gray-500">{match.Department}</div>
                      )}
                    </div>
                    {selectedIndex === index && (
                      <UserCheck className="text-orange-600" size={20} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleCombineAll}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-orange-100 text-orange-800 border border-orange-200 rounded-lg hover:bg-orange-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              <Users size={20} />
              Combine All Researchers
            </button>
          </div>
        )}

        {/* Results Section */}
        {searchResults && searchResults.success && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <NetworkViewer
              iframeUrl={searchResults.iframe_url}
              connections={searchResults.connections}
              title={`Researcher Network: ${searchResults.researcher}${combine ? ' (Combined)' : ''}`}
            />
          </div>
        )}

        {/* Examples Section */}
        {examples.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Try these example researchers:</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="p-3 text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-900">{example}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="font-medium text-orange-800 mb-3">How Researcher Search Works:</h3>
          <ul className="text-orange-700 space-y-2">
            <li>• <strong>Multiple Affiliations:</strong> Some researchers appear in multiple institutions</li>
            <li>• <strong>Select Specific:</strong> Choose a specific researcher profile to focus on one affiliation</li>
            <li>• <strong>Combine All:</strong> Merge all affiliations of a researcher into one network</li>
            <li>• <strong>Collaboration Networks:</strong> Explore research partnerships and co-authorships</li>
            <li>• Click on network nodes to discover research connections</li>
          </ul>
        </div>
      </div>
    </div>
  );
}