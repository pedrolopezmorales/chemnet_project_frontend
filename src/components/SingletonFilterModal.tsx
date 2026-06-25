interface Props {
  visible: boolean;
  connectionCount: number;
  eligibleCount: number;
  onChoose: (threshold: 1 | 2 | 3) => void;
  onCancel: () => void;
}

export default function SingletonFilterModal({
  visible,
  connectionCount,
  eligibleCount,
  onChoose,
  onCancel,
}: Props) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-7">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Large Network Detected</h3>
        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
          This graph has <strong className="text-gray-900">{connectionCount}</strong> possible
          connections. You can remove connections that appear 1, 2, or 3 times or fewer to make
          the graph load faster and stay cleaner.
        </p>
        <div className="mb-4 text-xs text-gray-500">
          {eligibleCount} connections are eligible for filtering.
        </div>
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
          >
            Keep All
          </button>
          <button
            onClick={() => onChoose(1)}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 text-sm font-semibold"
          >
            Remove 1 or fewer
          </button>
          <button
            onClick={() => onChoose(2)}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 text-sm font-semibold"
          >
            Remove 2 or fewer
          </button>
          <button
            onClick={() => onChoose(3)}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 text-sm font-semibold"
          >
            Remove 3 or fewer
          </button>
        </div>
      </div>
    </div>
  );
}
