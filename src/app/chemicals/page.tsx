'use client';

import { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import SearchForm from '@/components/SearchForm';
import NetworkViewer from '@/components/NetworkViewer';
import { chemicalApi, handleApiError, ChemicalSearchResponse } from '@/services/api';
import SingletonFilterModal from '@/components/SingletonFilterModal';

const DESCRIPTION_SECTION_TITLES = [
  'Industry uses:',
  'Consumer uses:',
  'Common function categories:',
  'General use categories:',
  'Proxy names (PubChem):',
] as const;

type DescriptionSection = {
  title: string;
  body: string;
};

type ParsedDescription = {
  mainText: string;
  sections: DescriptionSection[];
};

function parseChemicalDescription(text?: string): ParsedDescription {
  const normalized = String(text || '').replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return { mainText: '', sections: [] };
  }

  const blocks = normalized
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);

  const sections: DescriptionSection[] = [];
  const mainBlocks: string[] = [];

  blocks.forEach((block) => {
    const lines = block.split('\n');
    const candidateTitle = lines[0]?.trim() || '';
    if (DESCRIPTION_SECTION_TITLES.includes(candidateTitle as (typeof DESCRIPTION_SECTION_TITLES)[number])) {
      sections.push({
        title: candidateTitle,
        body: lines.slice(1).join('\n').trim(),
      });
      return;
    }
    mainBlocks.push(block);
  });

  return {
    mainText: mainBlocks.join('\n\n').trim(),
    sections,
  };
}

function splitBullets(body: string): string[] {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.startsWith('-'))
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter((line) => line.length > 0);
}

export default function ChemicalsPage() {
  const DESCRIPTION_COLLAPSE_THRESHOLD = 1200;
  const DESCRIPTION_PREVIEW_LENGTH = 700;
  const [searchResults, setSearchResults] = useState<ChemicalSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGraphLoading, setIsGraphLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [examples, setExamples] = useState<string[]>([]);
  const [inchikey, setInchikey] = useState('');
  const [structureImageSrc, setStructureImageSrc] = useState<string | null>(null);
  const [hideStructureImage, setHideStructureImage] = useState(false);
  const [usedInchikeyFallback, setUsedInchikeyFallback] = useState(false);
  const [isMainDescriptionExpanded, setIsMainDescriptionExpanded] = useState(false);
  const activeSearchRef = useRef(0);
  const filterResolverRef = useRef<((v: 0 | 1 | 2 | 3) => void) | null>(null);
  const [filterPromptVisible, setFilterPromptVisible] = useState(false);
  const [filterInfo, setFilterInfo] = useState({ count: 0, eligibleCount: 0 });

  const askConnectionThreshold = (count: number, eligibleCount: number): Promise<0 | 1 | 2 | 3> => {
    setFilterInfo({ count, eligibleCount });
    setFilterPromptVisible(true);
    return new Promise<0 | 1 | 2 | 3>((resolve) => { filterResolverRef.current = resolve; });
  };
  const handleFilterChoose = (threshold: 1 | 2 | 3) => { setFilterPromptVisible(false); filterResolverRef.current?.(threshold); };
  const handleFilterCancel  = () => { setFilterPromptVisible(false); filterResolverRef.current?.(0); };

  const extractCount = (item: string): number | null => {
    const match = item.match(/\((\d+)\)\s*$/);
    return match ? parseInt(match[1], 10) : null;
  };

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

  useEffect(() => {
    if (!searchResults?.success || !searchResults.chemical) {
      setStructureImageSrc(null);
      setHideStructureImage(false);
      setUsedInchikeyFallback(false);
      return;
    }

    const primarySrc = searchResults.image_url || `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(searchResults.chemical)}/PNG?record_type=2d`;
    setStructureImageSrc(primarySrc);
    setHideStructureImage(false);
    setUsedInchikeyFallback(false);
  }, [searchResults?.success, searchResults?.chemical, searchResults?.image_url]);

  useEffect(() => {
    setIsMainDescriptionExpanded(false);
  }, [searchResults?.description]);

  const handleStructureImageError = () => {
    if (searchResults?.image_source === 'Wikipedia') {
      setHideStructureImage(true);
      return;
    }

    if (!searchResults?.inchikey || searchResults.inchikey === 'Error') {
      setHideStructureImage(true);
      return;
    }

    if (!usedInchikeyFallback) {
      setUsedInchikeyFallback(true);
      setStructureImageSrc(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/inchikey/${searchResults.inchikey}/PNG?record_type=2d`
      );
      return;
    }

    setHideStructureImage(true);
  };

  const structureTitle = searchResults?.image_source === 'Wikipedia'
    ? (searchResults?.image_description || searchResults?.image_title || searchResults?.image_page_title || 'Wikipedia reference image')
    : 'Chemical Structure';

  const parsedDescription = parseChemicalDescription(searchResults?.description);
  const shouldCollapseMainDescription =
    parsedDescription.mainText.length > DESCRIPTION_COLLAPSE_THRESHOLD;
  const mainDescriptionText =
    shouldCollapseMainDescription && !isMainDescriptionExpanded
      ? `${parsedDescription.mainText.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}...`
      : parsedDescription.mainText;

  const handleSearch = async (chemical: string) => {
    const searchId = Date.now();
    activeSearchRef.current = searchId;

    setIsLoading(true);
    setIsGraphLoading(false);
    setError('');
    setSearchResults(null);

    const payload = {
      chemical,
      inchikey: inchikey || undefined,
    };

    try {
      const connectionsResult = await chemicalApi.searchChemicalConnections(payload);
      if (activeSearchRef.current !== searchId) return;

      setSearchResults(connectionsResult);

      if (!connectionsResult.success) {
        setError(connectionsResult.message || 'Chemical not found');
        return;
      }

      setIsLoading(false);
      setIsGraphLoading(true);

      const fundingSources = Array.isArray(connectionsResult.connections?.['Funding Sources'])
        ? connectionsResult.connections?.['Funding Sources'] as string[]
        : [];
      const eligibleCount = fundingSources.filter((item) => {
        const count = extractCount(item);
        return count !== null && count <= 3;
      }).length;

      let connectionThreshold: 0 | 1 | 2 | 3 = 0;
      if (fundingSources.length > 100 && eligibleCount > 0) {
        connectionThreshold = await askConnectionThreshold(fundingSources.length, eligibleCount);
      }

      const graphResult = await chemicalApi.searchChemicalGraph(payload, {
        connectionThreshold: connectionThreshold || undefined,
      });
      if (activeSearchRef.current !== searchId) return;

      setSearchResults((previous) => ({ ...(previous || connectionsResult), ...graphResult }));
    } catch (err) {
      if (activeSearchRef.current !== searchId) return;
      const errorResult = handleApiError(err);
      setError(errorResult.message || 'Failed to search chemical');
    } finally {
      if (activeSearchRef.current === searchId) {
        setIsLoading(false);
        setIsGraphLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SingletonFilterModal
        visible={filterPromptVisible}
        connectionCount={filterInfo.count}
        eligibleCount={filterInfo.eligibleCount}
        onChoose={handleFilterChoose}
        onCancel={handleFilterCancel}
      />
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
        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
          <h3 className="font-medium text-blue-800 mb-2">How it works:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Enter a chemical name to explore its network connections</li>
            <li>• Add an InChIKey for more precise identification</li>
            <li>• View interactive network visualizations showing chemical relationships</li>
            <li>• Click on nodes to find exact studies</li>
            <li>• Click suggestions if your search term is not found</li>
          </ul>
        </div>
        {/* Results Section */}
        {searchResults && searchResults.success && (
          <>
            {/* Chemical Description */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-green-800 mb-3 text-lg">
                Chemical Information (Source: {searchResults.description_source || 'Not Available'})
              </h3>
              
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Text Information */}
                <div className="flex-1 text-green-700">
                  <p className="font-medium text-gray-800 mb-2">{searchResults.chemical}</p>
                  {searchResults.description ? (
                    <>
                      {parsedDescription.mainText ? (
                        <div className="space-y-3 text-sm leading-relaxed">
                          {mainDescriptionText
                            .split(/\n\s*\n/)
                            .filter((paragraph) => paragraph.trim().length > 0)
                            .map((paragraph, index) => (
                              <p key={`main-${index}`} className="whitespace-pre-line">
                                {paragraph}
                              </p>
                            ))}
                        </div>
                      ) : null}
                      {shouldCollapseMainDescription && (
                        <button
                          type="button"
                          onClick={() => setIsMainDescriptionExpanded((prev) => !prev)}
                          className="mt-2 text-sm font-semibold text-green-800 underline underline-offset-2 hover:text-green-900"
                        >
                          {isMainDescriptionExpanded ? 'Show less main description' : 'Show more main description'}
                        </button>
                      )}
                      {parsedDescription.sections.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {parsedDescription.sections.map((section, index) => {
                            const bulletItems = splitBullets(section.body);
                            return (
                              <details
                                key={`${section.title}-${index}`}
                                className="bg-white/60 border border-green-200 rounded-md px-3 py-2"
                              >
                                <summary className="cursor-pointer font-semibold text-green-900">
                                  {section.title}
                                </summary>
                                <div className="mt-2 text-sm text-green-800 leading-relaxed">
                                  {bulletItems.length > 0 ? (
                                    <ul className="list-disc pl-5 space-y-1">
                                      {bulletItems.map((item, itemIndex) => (
                                        <li key={`${section.title}-item-${itemIndex}`}>{item}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="whitespace-pre-line">{section.body || 'No details available.'}</p>
                                  )}
                                </div>
                              </details>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-600 italic">No additional description available from the current sources.</p>
                  )}
                  {searchResults.inchikey && searchResults.inchikey !== 'Error' && (
                    <p className="text-xs text-green-600 mt-2 font-mono">InChIKey: {searchResults.inchikey}</p>
                  )}
                </div>

                {/* Chemical Structure Image */}
                <div className="lg:w-80 flex flex-col items-center">
                  <p className="text-sm font-semibold text-gray-700 text-center mb-2">
                    {structureTitle}
                  </p>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-2">
                    {!hideStructureImage && structureImageSrc ? (
                      <img
                        src={structureImageSrc}
                        alt={`${searchResults.chemical || 'Chemical'} chemical structure`}
                        className="max-w-full h-auto max-h-64"
                        onError={handleStructureImageError}
                      />
                    ) : null}
                  </div>
                  <p className="text-xs text-gray-500 text-center italic">
                    Chemical Structure (Source: {searchResults.image_source || 'Not Available'})
                  </p>
                </div>
              </div>
            </div>

            {/* Network Visualization */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <NetworkViewer
                iframeUrl={searchResults.iframe_url}
                graphHtml={searchResults.graph_html}
                connections={searchResults.connections}
                isGraphLoading={isGraphLoading}
                title={`Chemical Network: ${searchResults.chemical}`}
              />
            </div>
          </>
        )}

        
      </div>
    </div>
  );
}
