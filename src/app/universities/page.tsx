'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import NetworkViewer from '@/components/NetworkViewer';
import { universityApi, handleApiError, UniversitySearchResponse } from '@/services/api';
import { Search, GraduationCap, AlertCircle } from 'lucide-react';

export default function UniversitiesPage() {
  const [searchResults, setSearchResults] = useState<UniversitySearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [examples, setExamples] = useState<string[]>([]);
  
  // Form state
  const [university, setUniversity] = useState('');
  const [category, setCategory] = useState('Funding Sources');
  const [chemicalGroup, setChemicalGroup] = useState('All');

  const categoryOptions = ['Chemicals', 'Funding Sources'];
  const chemicalGroupOptions = ['All', 'Organic'];

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await universityApi.getUniversityData();
        if (data.example_universities) {
          setExamples(data.example_universities);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };

    loadInitialData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!university.trim()) return;

    setIsLoading(true);
    setError('');
    setSearchResults(null);

    try {
      const result = await universityApi.searchUniversity({
        university: university.trim(),
        category: category as any,
        chemical_group: chemicalGroup as any
      });
      
      setSearchResults(result);
      
      if (!result.success) {
        setError(result.message || 'University not found');
      }
    } catch (err) {
      const errorResult = handleApiError(err);
      setError(errorResult.message || 'Failed to search university');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (exampleUniversity: string) => {
    setUniversity(exampleUniversity);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">University Network Search</h1>
          <p className="text-lg text-gray-600">
            Find university research connections and funding sources
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* University Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University Name
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="Enter university name (e.g., Harvard University)..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-purple-600"
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
                  disabled={isLoading || !university.trim()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  <Search size={20} />
                  Search
                </button>
              </div>
            </div>

            {/* Filter Options */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-purple-600"
                >
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Chemical Group (only for Chemicals category) */}
              {category === 'Chemicals' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chemical Group
                  </label>
                  <select
                    value={chemicalGroup}
                    onChange={(e) => setChemicalGroup(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-purple-600"
                  >
                    {chemicalGroupOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}
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

        {/* Results Section */}
        {searchResults && searchResults.success && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <NetworkViewer
              iframeUrl={searchResults.iframe_url}
              connections={searchResults.connections}
              title={`University Network: ${searchResults.university} (${category})`}
            />
          </div>
        )}

        {/* Examples Section */}
        {examples.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Try these example universities:</h3>
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
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-medium text-purple-800 mb-3">How University Search Works:</h3>
          <ul className="text-purple-700 space-y-2">
            <li>• <strong>Funding Sources:</strong> Shows funding organizations and research grants</li>
            <li>• <strong>Chemicals:</strong> Displays chemicals researched by the university</li>
            <li>• Use chemical group filters to focus on specific chemical types</li>
            <li>• Click on network nodes to explore research connections</li>
            <li>• Discover collaboration patterns and research networks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}