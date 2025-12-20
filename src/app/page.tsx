import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ChemNet Explorer
          </h1>
          <p className="text-xl text-gray-600">
            Discover connections in chemical research data
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/chemicals"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all"
          >
            <h2 className="text-2xl font-bold mb-2">Chemical Search</h2>
            <p className="text-blue-100">Explore chemical networks and molecular connections</p>
          </Link>

          <Link
            href="/companies"
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all"
          >
            <h2 className="text-2xl font-bold mb-2">Funding Source Search</h2>
            <p className="text-green-100">Explore connections in the studies that entities fund</p>
          </Link>

          <Link
            href="/universities"
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all"
          >
            <h2 className="text-2xl font-bold mb-2">University Search</h2>
            <p className="text-purple-100">Find university research connections and funding sources</p>
          </Link>

          <Link
            href="/researchers"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all"
          >
            <h2 className="text-2xl font-bold mb-2">Researcher Search</h2>
            <p className="text-orange-100">Explore researcher networks and collaborations</p>
          </Link>

          <Link
            href="/funding"
            className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all"
          >
            <h2 className="text-2xl font-bold mb-2">Funding Table</h2>
            <p className="text-indigo-100">Browse top funding sources and research investments</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
