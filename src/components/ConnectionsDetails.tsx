import React from 'react';
import { Network } from 'lucide-react';

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
      return <li className="text-white-700">{value}</li>;
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <li key={index} className="text-white-700">
          {typeof item === 'string' ? item : JSON.stringify(item)}
        </li>
      ));
    }
    
    // Handle objects
    if (typeof value === 'object') {
      return <li className="text-white-700">{JSON.stringify(value)}</li>;
    }
    
    return <li className="text-white-700">{String(value)}</li>;
  };

  return (
    <div className="mt-6 bg-blue-900 text-white rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Network size={24} className="text-blue-200" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {Object.entries(connections).map(([key, items]) => (
          <details
            key={key}
            className="bg-white rounded-md px-4 py-2"
          >
            <summary className="cursor-pointer font-semibold text-blue-900 select-none">
              {key}
            </summary>
            <ul className="space-y-1 ml-5 mt-2 text-gray-800">
              {renderConnectionValue(key, items)}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
};

export default ConnectionsDetails;