'use client';

import { useState, useEffect } from 'react';
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
      const url = selectedCategory
        ? `/api/funding-hierarchy/?category=${selectedCategory.toLowerCase()}&top_n=20`
        : `/api/funding-hierarchy/`;

      const response = await fetch(url);
      const json = await response.json();

      if (json.success) {
        if (json.mode === 'categories') {
          setData(json.categoriesData);
          setTotalStudies(json.overallTotal);
          setCategoryTotal(0);
          setBreadcrumb(null);
        } else if (json.mode === 'drilldown') {
          setData(json.drilldownData);
          setTotalStudies(json.overallTotal);
          setCategoryTotal(json.categoryTotal);
          setBreadcrumb(json.categoryDisplay);
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

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      const total = selectedCategory ? categoryTotal : totalStudies;
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-bold">{data.displayName}</p>
          <p className="text-sm">Studies: {data.value}</p>
          <p className="text-xs text-gray-600">{percentage}% of {selectedCategory ? 'category' : 'total'}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Funding Source Analysis
          </h1>
          <p className="text-gray-600">
            {selectedCategory ? (
              <>
                <span className="font-semibold">{breadcrumb}</span> Studies:
                <span className="font-bold text-lg ml-2">{categoryTotal}</span>
              </>
            ) : (
              <>
                Total Studies: <span className="font-bold text-lg">{totalStudies}</span>
              </>
            )}
          </p>
        </div>

        {/* Breadcrumb Navigation */}
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

        {/* View Toggle */}
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

        {/* Chart Container */}
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          {data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No data available</p>
            </div>
          ) : viewMode === 'pie' ? (
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ displayName, value }) => `${displayName}: ${value}`}
                  outerRadius={120}
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
                <XAxis dataKey="displayName" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Stats Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  {selectedCategory ? 'Funding Source' : 'Category'}
                </th>
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
                    className={`border-b hover:bg-gray-50 transition ${
                      !selectedCategory && !row.category ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => handleSliceClick(row)}
                  >
                    <td className="px-6 py-3 flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: row.color }}></div>
                      <span className="font-medium">{row.displayName}</span>
                    </td>
                    <td className="px-6 py-3 text-right">{row.value.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right font-semibold">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Help Text */}
        {!selectedCategory && (
          <div className="mt-8 bg-blue-50 border border-blue-300 rounded-lg p-6">
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
