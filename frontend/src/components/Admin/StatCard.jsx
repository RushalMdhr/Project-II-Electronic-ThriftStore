const StatCard = ({ title, value }) => (
  <div className="bg-gray-800 p-5 rounded-lg shadow border border-gray-700 hover:border-indigo-500 transition duration-300">
    <h4 className="text-sm text-gray-400 mb-1">{title}</h4>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default StatCard;
