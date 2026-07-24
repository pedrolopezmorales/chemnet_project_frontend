import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ChemNet Explorer
          </h1>
          <p className="text-xl text-gray-600">
            Discover connections in chemical research data
          </p>
        </div>

        {/* Search Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About ChemNet Explorer</h2>
            <p className="text-lg text-gray-700 mb-4">
              This is a website prototype for a Chemical Source Database Finder. 
              It aims to find the associations and connections between certain categories across studies. 
              The graphs show the item/person searched for, and for the category chosen, all the items/people in the category that appeared within a study with the item/person searched for.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              For example, a user could search for a specific chemical and find the sources that funded the studies that include the chemical searched.
              Or a user could search for a specific funding source, choose the chemicals category, and find all the chemicals that were involved in the studies funded by that specific source.
            </p>
          </div>
        </div>
      </section>

      {/* Data Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Data & Methodology</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Sources</h3>
                <p className="text-gray-700">
                  The research studies and data shown on this website was obtained from the American Chemical Society (ACS) Publications database. 
                  The studies used were from the Environmental Science and Technology journal within ACS Publications.
                </p>
                <p className="text-gray-700">
                  Currently, the studies included in this project are the studies from 2012 to 2024.
                  There are plans to expand the database to include studies from more years in the future, and to include studies from other journals.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Classification System</h3>
                <p className="text-gray-700">
                  Funding sources and researchers are automatically classified by type (Government, University, Foundation, Company) 
                  using parsing of text. The classification system is still being worked on so some current classifications may be inaccurate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <p className="text-lg text-gray-700 mb-8">
              Have questions about ChemNet Explorer? We'd love to hear from you. Send us a message and we'll 
              respond as soon as possible. <span className="font-bold text-black">(This is a placeholder contact form. Filling it out will not send an email to anyone.)</span>
            </p>
            <div className="bg-gray-50 rounded-lg p-8 shadow">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Your message here..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>ChemNet Explorer</p>
        </div>
      </footer>
    </div>
  );
}
