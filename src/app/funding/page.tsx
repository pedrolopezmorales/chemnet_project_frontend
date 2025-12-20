import FundingTable from '../../components/FundingTable';

export default function FundingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <FundingTable />
      </div>
    </div>
  );
}