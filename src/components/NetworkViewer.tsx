'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import ConnectionsDetails from './ConnectionsDetails';
import type { ConnectionsMap } from '@/services/api';

interface NetworkViewerProps {
  iframeUrl?: string;
  graphHtml?: string | null;
  connections?: ConnectionsMap;
  title?: string;
  isGraphLoading?: boolean;
}

export default function NetworkViewer({ iframeUrl, graphHtml, connections, title, isGraphLoading = false }: NetworkViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!iframeUrl && !graphHtml && !connections && !isGraphLoading) {
    return null;
  }

  const baseUrl = 'https://dabrahamsson.pythonanywhere.com';
  const fullIframeUrl = iframeUrl ? `${baseUrl}${iframeUrl}` : '';
  const iframeSrcProps = graphHtml ? { srcDoc: graphHtml } : iframeUrl ? { src: fullIframeUrl } : {};

  return (
    <div className="w-full space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      )}
      
      {/* Network Visualization */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-300">
          <h3 className="font-medium text-gray-700">Network Visualization (Scroll within Graph Window to See More)</h3>
          {iframeUrl && (
            <div className="flex gap-2">
              <button
                onClick={() => window.open(fullIframeUrl, '_blank')}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink size={16} />
                Open in new tab
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {isFullscreen ? '📱 Normal' : '🖥️ Fullscreen'}
              </button>
            </div>
          )}
        </div>
        
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
          {isFullscreen && (iframeUrl || graphHtml) && (
            <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-gray-50">
              <h3 className="font-medium text-gray-700">Network Visualization - Fullscreen</h3>
              <button
                onClick={() => setIsFullscreen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                ✕ Close
              </button>
            </div>
          )}
          
          {iframeUrl || graphHtml ? (
            <iframe
              {...iframeSrcProps}
              className={`w-full border-0 ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-200'}`}
              title="Network Visualization"
              allow="fullscreen"
            />
          ) : (
            <div className="flex h-96 items-center justify-center bg-gray-50 text-gray-600">
              {isGraphLoading ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  <span>Loading graph...</span>
                </div>
              ) : (
                <span>Graph not available.</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Connections Details */}
      {connections && (
        <ConnectionsDetails connections={connections} />
      )}
    </div>
  );
}