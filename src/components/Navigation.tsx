'use client';
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
            ChemNet Explorer
          </Link>
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/chemicals" className="text-gray-600 hover:text-gray-900">Chemicals</Link>
            <Link href="/companies" className="text-gray-600 hover:text-gray-900">Funding Sources</Link>
            <Link href="/universities" className="text-gray-600 hover:text-gray-900">Universities</Link>
            <Link href="/researchers" className="text-gray-600 hover:text-gray-900">Researchers</Link>
            <Link href="/funding" className="text-gray-600 hover:text-gray-900">Funding Table</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
