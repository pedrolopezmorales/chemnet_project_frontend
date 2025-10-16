import React from 'react';
import { Network, List, ChevronRight } from 'lucide-react';

interface ConnectionsDetailsProps {
  connections: Record<string, any>;
  title?: string;
}

const ConnectionsDetails: React.FC<ConnectionsDetailsProps> = ({ connections, title = "Connections" }) => {
  if (!connections || Object.keys(connections).length === 0) {
    return null;
  }

  const renderConnectionValue = (key: string, value: any) => {
    // Handle special cases like in Django template
    if (key === "Inchikey" || key === "Affiliation(s)" || typeof value === 'string') {
      return <li className="text-gray-700">{value}</li>;
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <li key={index} className="text-gray-700">
          {typeof item === 'string' ? item : JSON.stringify(item)}
        </li>
      ));
    }
    
    // Handle objects
    if (typeof value === 'object') {
      return <li className="text-gray-700">{JSON.stringify(value)}</li>;
    }
    
    return <li className="text-gray-700">{String(value)}</li>;
  };

  return (
    <div className="mt-6 bg-blue-900 text-white rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Network size={24} className="text-blue-200" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {Object.entries(connections).map(([key, items]) => (
          <div key={key} className="border-l-4 border-blue-400 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <ChevronRight size={16} className="text-blue-300" />
              <h4 className="font-medium text-blue-100">{key}:</h4>
            </div>
            <ul className="space-y-1 ml-6">
              {renderConnectionValue(key, items)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionsDetails;