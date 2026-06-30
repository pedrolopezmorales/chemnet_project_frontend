import React from 'react';
import { Network } from 'lucide-react';

interface ConnectionsDetailsProps {
  connections: Record<string, any>;
  title?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Government: '#FF6B6B',
  University: '#96CEB4',
  Foundation: '#4ECDC4',
  Company: '#EAB308',
  Unknown: '#8B5CF6',
};

const CONNECTION_DISPLAY_NAMES: Record<string, string> = {
  Inchikey: 'InChIKey',
  'Affiliation(s)': 'Affiliations',
  'Funding Sources': 'Funding Sources [Category]',
  Affiliations: 'Affiliations',
  Countries: 'Countries',
  Researchers: 'Researchers',
  Universities: 'Universities',
  Chemicals: 'Chemicals',
  Companies: 'Companies',
};

function renderCategoryText(text: string): React.ReactNode {
  const match = text.match(/^(.*?)(\[(Government|University|Foundation|Company|Unknown)\])(.*)$/);
  if (!match) {
    return text;
  }

  const prefix = match[1] || '';
  const fullTag = match[2] || '';
  const category = match[3] || 'Unknown';
  const suffix = match[4] || '';

  return (
    <>
      {prefix}
      <span style={{ color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Unknown, fontWeight: 700 }}>
        {fullTag}
      </span>
      {suffix}
    </>
  );
}

const ConnectionsDetails: React.FC<ConnectionsDetailsProps> = ({ connections, title = "Connections" }) => {
  if (!connections || Object.keys(connections).length === 0) {
    return null;
  }

  const renderConnectionValue = (key: string, value: any) => {
    // Handle special cases like in Django template
    if (key === "Inchikey" || key === "Affiliation(s)" || typeof value === 'string') {
      return (
        <li className="text-white-700">
          {typeof value === 'string' ? renderCategoryText(value) : value}
        </li>
      );
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <li key={index} className="text-white-700">
          {typeof item === 'string' ? renderCategoryText(item) : JSON.stringify(item)}
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
              {CONNECTION_DISPLAY_NAMES[key] ?? key}
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