
export default function LoadingScreen({ color = "emerald", text = "Loading..." }) {
  return (
    // <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${color}-400 mx-auto`}></div>
        <p className="mt-4 text-gray-300">{text}</p>
      </div>
    </div>
  );
}
