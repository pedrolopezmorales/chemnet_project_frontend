'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { buildApiUrl } from '@/services/api';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

interface FundingData {
  name: string;
  value: number;
  color: string;
  displayName: string;
  category?: string;
}

export default function FundingSourceDrilldown() {
  const [data, setData] = useState<FundingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'pie' | 'bar'>('pie');
  const [totalStudies, setTotalStudies] = useState(0);
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [breadcrumb, setBreadcrumb] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const primaryUrl = selectedCategory
        ? buildApiUrl(`/funding-hierarchy/?category=${selectedCategory.toLowerCase()}&top_n=20`)
        : buildApiUrl('/funding-stats/');

      const fallbackUrl = selectedCategory
        ? buildApiUrl(`/funding-hierarchy/?category=${selectedCategory.toLowerCase()}&top_n=20`)
        : buildApiUrl('/funding-hierarchy/');

      let response = await fetch(primaryUrl);
      let json: any = null;

      try {
        json = await response.json();
      } catch {
        json = null;
      }

      if (!response.ok && (!json || json?.error)) {
        response = await fetch(fallbackUrl);
        try {
          json = await response.json();
        } catch {
          json = null;
        }
      }

      if (json?.success) {
        if (json.mode === 'categories') {
          setData(json.categoriesData || json.data || []);
          setTotalStudies(json.overallTotal || json.total || 0);
          setCategoryTotal(0);
          setBreadcrumb(null);
        } else if (json.mode === 'drilldown') {
          setData(json.drilldownData || []);
          setTotalStudies(json.overallTotal || 0);
          setCategoryTotal(json.categoryTotal || 0);
          setBreadcrumb(json.categoryDisplay || null);
        }
      }
    } catch (error) {
      console.error('Error fetching funding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSliceClick = (entry: FundingData) => {
    if (entry.name && !selectedCategory) {
      setSelectedCategory(entry.name);
    }
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const payloadData = payload[0].payload;
      const total = selectedCategory ? categoryTotal : totalStudies;
      const percentage = total > 0 ? ((payloadData.value / total) * 100).toFixed(1) : '0';
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-bold text-gray-900">{payloadData.displayName}</p>
          <p className="text-sm text-gray-700">Studies: {payloadData.value}</p>
          <p className="text-xs text-gray-600">{percentage}% of {selectedCategory ? 'category' : 'total'}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Funding Source Analysis</h1>
          <p className="text-xl text-gray-600">
            {selectedCategory ? (
              <>
                <span className="font-semibold text-gray-800">{breadcrumb}</span> Studies:
                <span className="font-bold text-lg ml-2 text-gray-900">{categoryTotal}</span>
              </>
            ) : (
              <>
                Total Studies: <span className="font-bold text-lg text-gray-900">{totalStudies}</span>
              </>
            )}
          </p>
        </div>

        {selectedCategory && (
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ← Back to Categories
            </button>
            <span className="text-gray-700 font-semibold">Showing: {breadcrumb}</span>
          </div>
        )}

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setViewMode('pie')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              viewMode === 'pie'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Pie Chart
          </button>
          <button
            onClick={() => setViewMode('bar')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              viewMode === 'bar'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Bar Chart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading funding breakdown...</div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-lg">No data available</div>
          ) : viewMode === 'pie' ? (
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ displayName, value }) => `${displayName}: ${value}`}
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={(entry) => handleSliceClick(data[entry.index])}
                  style={{ cursor: selectedCategory ? 'default' : 'pointer' }}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={data}>
                <XAxis dataKey="displayName" angle={-35} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">{selectedCategory ? 'Funding Source' : 'Category'}</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Studies</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const total = selectedCategory ? categoryTotal : totalStudies;
                const percentage = total > 0 ? ((row.value / total) * 100).toFixed(1) : '0';
                return (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                    onClick={() => handleSliceClick(row)}
                    style={{ cursor: selectedCategory ? 'default' : 'pointer' }}
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: row.color }}></div>
                        <span className="font-medium text-gray-900">{row.displayName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right text-gray-700">{row.value.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right font-semibold text-gray-900">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!selectedCategory && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-900 font-semibold mb-2">💡 How to Use</p>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Click on any pie slice or table row to drill down into that category</li>
              <li>• See the top 20 funding sources within each category</li>
              <li>• Use the "Back to Categories" button to return to the overview</li>
              <li>• Switch between Pie and Bar chart views for different perspectives</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
