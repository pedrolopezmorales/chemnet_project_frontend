'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import ConnectionsDetails from './ConnectionsDetails';

interface NetworkViewerProps {
  iframeUrl?: string;
  connections?: Record<string, any>;
  title?: string;
}

export default function NetworkViewer({ iframeUrl, connections, title }: NetworkViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!iframeUrl) {
    return null;
  }

  // Use the same base URL as configured in the environment
  const baseUrl = 'https://pedrolopezmorales.pythonanywhere.com';
  const fullIframeUrl = `${baseUrl}${iframeUrl}`;

  return (
    <div className="w-full space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      )}
      
      {/* Network Visualization */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-300">
          <h3 className="font-medium text-gray-700">Network Visualization</h3>
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
        </div>
        
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
          {isFullscreen && (
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
          
          <iframe
            src={fullIframeUrl}
            className={`w-full border-0 ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-96'}`}
            title="Network Visualization"
            allow="fullscreen"
          />
        </div>
      </div>

      {/* Connections Details */}
      {connections && (
        <ConnectionsDetails connections={connections} />
      )}
    </div>
  );
}